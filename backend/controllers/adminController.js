import User from '../models/User.js';
import Hostelite from '../models/Hostelite.js';
import HostelManager from '../models/HostelManager.js';
import CleaningStaff from '../models/CleaningStaff.js';
import Hostel from '../models/Hostel.js';
import Complaint from '../models/Complaint.js';
import Request from '../models/Request.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get global system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getGlobalStats = asyncHandler(async (req, res) => {
    const totalHostelites = await Hostelite.countDocuments();
    const totalManagers = await HostelManager.countDocuments();
    const totalStaff = await CleaningStaff.countDocuments();
    const totalHostels = await Hostel.countDocuments();

    const complaintsStats = {
        total: await Complaint.countDocuments(),
        pending: await Complaint.countDocuments({ status: 'PENDING' }),
        inProgress: await Complaint.countDocuments({ status: 'IN_PROGRESS' }),
        resolved: await Complaint.countDocuments({ status: 'RESOLVED' }),
    };

    const requestsStats = {
        total: await Request.countDocuments(),
        pending: await Request.countDocuments({ status: 'PENDING' }),
        approved: await Request.countDocuments({ status: 'APPROVED' }),
        rejected: await Request.countDocuments({ status: 'REJECTED' }),
    };

    res.json({
        success: true,
        data: {
            users: {
                hostelites: totalHostelites,
                managers: totalManagers,
                staff: totalStaff,
                total: totalHostelites + totalManagers + totalStaff
            },
            hostels: totalHostels,
            complaints: complaintsStats,
            requests: requestsStats
        }
    });
});

// @desc    Get all complaints across all hostels
// @route   GET /api/admin/complaints
// @access  Private (Admin)
export const getAllComplaintsGlobal = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, category, hostel } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (hostel) filter.hostel = hostel;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(filter)
        .populate('hostelite', 'firstName lastName roomNumber email')
        .populate('hostel', 'name hostelCode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
        success: true,
        data: complaints,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    });
});

// @desc    Get all requests across all hostels
// @route   GET /api/admin/requests
// @access  Private (Admin)
export const getAllRequestsGlobal = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, requestType, hostel } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (requestType) filter.requestType = requestType;

    // We need to populate hostelite to filter by hostel if needed, 
    // or use aggregation if hostel info is strictly needed for filtering
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Request.find(filter)
        .populate({
            path: 'hostelite',
            select: 'firstName lastName roomNumber hostel',
            populate: { path: 'hostel', select: 'name' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Request.countDocuments(filter);

    res.json({
        success: true,
        data: requests,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    });
});

// @desc    Get all hostels
// @route   GET /api/admin/hostels
// @access  Private (Admin)
export const getAllHostels = asyncHandler(async (req, res) => {
    const hostels = await Hostel.find().populate('manager', 'firstName lastName email');
    res.json({
        success: true,
        data: hostels
    });
});

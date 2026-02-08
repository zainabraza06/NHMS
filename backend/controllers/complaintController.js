import Complaint from '../models/Complaint.js';
import Hostelite from '../models/Hostelite.js';
import HostelManager from '../models/HostelManager.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Hostelite)
export const submitComplaint = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    const hosteliteId = req.user.userId;

    const hostelite = await Hostelite.findById(hosteliteId);
    if (!hostelite) {
        return res.status(404).json({ success: false, message: 'Hostelite not found' });
    }

    const complaint = await Complaint.create({
        hostelite: hosteliteId,
        hostel: hostelite.hostel,
        title,
        description,
        category
    });

    res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully',
        data: complaint
    });
});

// @desc    Get own complaints
// @route   GET /api/complaints/my
// @access  Private (Hostelite)
export const getMyComplaints = asyncHandler(async (req, res) => {
    const hosteliteId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const complaints = await Complaint.find({ hostelite: hosteliteId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const total = await Complaint.countDocuments({ hostelite: hosteliteId });

    res.json({
        success: true,
        data: complaints,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            pages: Math.ceil(total / limitNumber)
        }
    });
});

// @desc    Get all complaints for a hostel
// @route   GET /api/complaints/all
// @access  Private (Manager)
export const getManagerComplaints = asyncHandler(async (req, res) => {
    const managerId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const manager = await HostelManager.findById(managerId);

    if (!manager || !manager.hostel) {
        return res.status(400).json({ success: false, message: 'Manager hostel not associated' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find({ hostel: manager.hostel })
        .populate('hostelite', 'firstName lastName email roomNumber')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments({ hostel: manager.hostel });

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

// @desc    Update complaint status and comments
// @route   PATCH /api/complaints/:id/resolve
// @access  Private (Manager)
export const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, managerComments } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const managerId = req.user.userId;
    const manager = await HostelManager.findById(managerId);

    if (!manager || !manager.hostel) {
        return res.status(400).json({ success: false, message: 'Manager hostel not associated' });
    }

    // Ensure manager belongs to the same hostel
    if (complaint.hostel.toString() !== manager.hostel.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this complaint' });
    }

    complaint.status = status || complaint.status;
    complaint.managerComments = managerComments || complaint.managerComments;

    if (status === 'RESOLVED') {
        complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.json({
        success: true,
        message: 'Complaint updated successfully',
        data: complaint
    });
});

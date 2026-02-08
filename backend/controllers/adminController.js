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
    const hostelCounts = await Hostelite.aggregate([
        { $group: { _id: '$hostel', count: { $sum: 1 } } }
    ]);
    const countMap = new Map(hostelCounts.map((entry) => [String(entry._id), entry.count]));

    const hostelsWithOccupancy = hostels.map((hostel) => {
        const occupiedRooms = countMap.get(String(hostel._id)) || 0;
        return { ...hostel.toObject(), occupiedRooms };
    });
    res.json({
        success: true,
        data: hostelsWithOccupancy
    });
});

// @desc    Get available rooms for a hostel (single-bed assumption)
// @route   GET /api/admin/hostels/:id/available-rooms
// @access  Private (Admin)
export const getAvailableRooms = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const hostel = await Hostel.findById(id);
    if (!hostel) {
        return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const hostelites = await Hostelite.find({ hostel: id }).select('roomNumber');
    const occupied = new Set(hostelites.map((item) => String(item.roomNumber)));

    const availableRooms = [];
    for (let i = 1; i <= hostel.totalRooms; i += 1) {
        const room = String(i);
        if (!occupied.has(room)) {
            availableRooms.push(room);
        }
    }

    res.json({
        success: true,
        data: availableRooms
    });
});

// @desc    Create a hostel
// @route   POST /api/admin/hostels
// @access  Private (Admin)
export const createHostel = asyncHandler(async (req, res) => {
    const {
        name,
        hostelCode,
        location,
        totalRooms,
        totalFloors,
        messStatus,
        messCharges,
        description,
        facilities
    } = req.body;

    if (!name || !hostelCode || !location || !totalRooms || !totalFloors) {
        return res.status(400).json({ success: false, message: 'Please provide all required hostel fields' });
    }

    const existing = await Hostel.findOne({ hostelCode });
    if (existing) {
        return res.status(400).json({ success: false, message: 'Hostel code already exists' });
    }

    let facilitiesList = facilities;
    if (typeof facilities === 'string') {
        facilitiesList = facilities
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    const hostel = await Hostel.create({
        name,
        hostelCode,
        location,
        totalRooms,
        totalFloors,
        occupiedRooms: 0,
        messStatus,
        messCharges,
        description,
        facilities: facilitiesList || []
    });

    res.status(201).json({
        success: true,
        message: 'Hostel created successfully',
        data: hostel
    });
});
// @desc    Get all hostelites (Global)
// @route   GET /api/admin/hostelites
// @access  Private (Admin)
export const getAllHostelitesGlobal = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, hostel, search } = req.query;
    const filter = {};
    if (hostel && hostel !== 'undefined') filter.hostel = hostel;
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { universityId: searchRegex }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const hostelites = await Hostelite.find(filter)
        .populate('hostel', 'name')
        .sort({ firstName: 1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Hostelite.countDocuments(filter);

    res.json({
        success: true,
        data: hostelites,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    });
});

// @desc    Create a hostel manager and assign to an unassigned hostel
// @route   POST /api/admin/managers
// @access  Private (Admin)
export const createHostelManager = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber, hostel } = req.body;

    if (!email || !password || !firstName || !lastName || !phoneNumber || !hostel) {
        return res.status(400).json({ success: false, message: 'Please provide all required manager fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hostelDoc = await Hostel.findById(hostel);
    if (!hostelDoc) {
        return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    if (hostelDoc.manager) {
        return res.status(400).json({ success: false, message: 'Hostel already has a manager assigned' });
    }

    const manager = await HostelManager.create({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role: 'HOSTEL_MANAGER',
        managerId: `MGR-${Date.now()}`,
        hostel,
        joinDate: new Date(),
        isEmailVerified: true
    });

    hostelDoc.manager = manager._id;
    await hostelDoc.save();

    res.status(201).json({
        success: true,
        message: 'Manager created and assigned successfully',
        data: manager
    });
});

// @desc    Delete a hostel manager and unassign hostel
// @route   DELETE /api/admin/managers/:id
// @access  Private (Admin)
export const deleteHostelManager = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const manager = await HostelManager.findById(id);
    if (!manager) {
        return res.status(404).json({ success: false, message: 'Manager not found' });
    }

    if (manager.hostel) {
        await Hostel.findByIdAndUpdate(manager.hostel, { $unset: { manager: '' } });
    }

    await HostelManager.findByIdAndDelete(id);

    res.json({
        success: true,
        message: 'Manager removed successfully'
    });
});

// @desc    Create a hostelite
// @route   POST /api/admin/hostelites
// @access  Private (Admin)
export const createHostelite = asyncHandler(async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        universityId,
        department,
        academicYear,
        roomNumber,
        hostel,
        admissionDate,
        validUpto
    } = req.body;

    if (!email || !password || !firstName || !lastName || !phoneNumber || !universityId || !department || !academicYear || !roomNumber || !hostel) {
        return res.status(400).json({ success: false, message: 'Please provide all required hostelite fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hostelDoc = await Hostel.findById(hostel);
    if (!hostelDoc) {
        return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const occupiedCount = await Hostelite.countDocuments({ hostel });
    if (occupiedCount >= hostelDoc.totalRooms) {
        return res.status(400).json({ success: false, message: 'Hostel is at full capacity' });
    }

    const existingRoom = await Hostelite.findOne({ hostel, roomNumber });
    if (existingRoom) {
        return res.status(400).json({ success: false, message: 'Room is already assigned' });
    }

    const hostelite = await Hostelite.create({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role: 'HOSTELITE',
        universityId,
        department,
        academicYear,
        roomNumber,
        hostel,
        admissionDate: admissionDate ? new Date(admissionDate) : new Date(),
        validUpto: validUpto ? new Date(validUpto) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isEmailVerified: true
    });

    res.status(201).json({
        success: true,
        message: 'Hostelite created successfully',
        data: hostelite
    });
});

// @desc    Delete a hostelite
// @route   DELETE /api/admin/hostelites/:id
// @access  Private (Admin)
export const deleteHostelite = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const hostelite = await Hostelite.findByIdAndDelete(id);
    if (!hostelite) {
        return res.status(404).json({ success: false, message: 'Hostelite not found' });
    }

    res.json({
        success: true,
        message: 'Hostelite removed successfully'
    });
});

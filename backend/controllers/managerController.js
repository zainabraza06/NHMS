import HostelManager from '../models/HostelManager.js';
import Hostel from '../models/Hostel.js';
import Hostelite from '../models/Hostelite.js';
import CleaningStaff from '../models/CleaningStaff.js';
import Request from '../models/Request.js';
import LeaveRequest from '../models/LeaveRequest.js';
import CleaningRequest from '../models/CleaningRequest.js';
import MessOffRequest from '../models/MessOffRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getManagerDashboard = asyncHandler(async (req, res) => {
  const managerId = req.user.userId;

  const manager = await HostelManager.findById(managerId).populate('hostel');

  if (!manager) {
    return res.status(404).json({ success: false, message: 'Manager not found' });
  }

  const hostel = manager.hostel;

  const hosteliteCount = await Hostelite.countDocuments({ hostel: hostel._id });
  const staffCount = await CleaningStaff.countDocuments({ assignedHostels: hostel._id });
  const pendingRequests = await Request.countDocuments({
    hostelite: { $in: await Hostelite.find({ hostel: hostel._id }).select('_id') },
    status: 'PENDING'
  });

  res.json({
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: {
      manager: {
        _id: manager._id,
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        managerId: manager.managerId,
        hostel: manager.hostel
      },
      stats: {
        totalHostelites: hosteliteCount,
        totalStaff: staffCount,
        pendingRequests,
        occupiedRooms: hostel.occupiedRooms,
        totalRooms: hostel.totalRooms,
        occupancyRate: ((hostel.occupiedRooms / hostel.totalRooms) * 100).toFixed(2) + '%'
      }
    }
  });
});

export const getManagerRequests = asyncHandler(async (req, res) => {
  const managerId = req.user.userId;
  const { requestType, status, page = 1, limit = 10 } = req.query;

  const manager = await HostelManager.findById(managerId);
  if (!manager) {
    return res.status(404).json({ success: false, message: 'Manager not found' });
  }

  const hostelites = await Hostelite.find({ hostel: manager.hostel }).select('_id');
  const hosteliteIds = hostelites.map(h => h._id);

  const filter = { hostelite: { $in: hosteliteIds } };
  if (requestType) filter.requestType = requestType;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  let requests = await Request.find(filter)
    .populate('hostelite')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Request.countDocuments(filter);

  res.json({
    success: true,
    message: 'Manager requests retrieved successfully',
    data: requests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
});

export const approveRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await Request.findByIdAndUpdate(
    requestId,
    { status: 'APPROVED', updatedAt: new Date() },
    { new: true }
  ).populate('hostelite');

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  res.json({ 
    success: true,
    message: 'Request approved successfully', 
    data: request 
  });
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { reason } = req.body;

  const request = await Request.findByIdAndUpdate(
    requestId,
    { status: 'REJECTED', updatedAt: new Date() },
    { new: true }
  ).populate('hostelite');

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  res.json({ 
    success: true,
    message: 'Request rejected successfully', 
    data: request 
  });
});

export const getManagerHostelites = asyncHandler(async (req, res) => {
  const managerId = req.user.userId;
  const { academicYear, department, page = 1, limit = 10 } = req.query;

  const manager = await HostelManager.findById(managerId);
  if (!manager) {
    return res.status(404).json({ success: false, message: 'Manager not found' });
  }

  const filter = { hostel: manager.hostel };
  if (academicYear) filter.academicYear = parseInt(academicYear);
  if (department) filter.department = new RegExp(department, 'i');

  const skip = (page - 1) * limit;

  const hostelites = await Hostelite.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ admissionDate: -1 });

  const total = await Hostelite.countDocuments(filter);

  res.json({
    success: true,
    message: 'Manager hostelites retrieved successfully',
    data: hostelites,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
});

export const getManagerStaff = asyncHandler(async (req, res) => {
  const managerId = req.user.userId;
  const { page = 1, limit = 10 } = req.query;

  const manager = await HostelManager.findById(managerId);
  if (!manager) {
    return res.status(404).json({ success: false, message: 'Manager not found' });
  }

  const skip = (page - 1) * limit;

  const staff = await CleaningStaff.find({ assignedHostels: manager.hostel })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ joinDate: -1 });

  const total = await CleaningStaff.countDocuments({ assignedHostels: manager.hostel });

  res.json({
    success: true,
    message: 'Manager staff retrieved successfully',
    data: staff,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
});

export const getManagerProfile = asyncHandler(async (req, res) => {
  const managerId = req.user.userId;

  const manager = await HostelManager.findById(managerId).populate('hostel');

  if (!manager) {
    return res.status(404).json({ success: false, message: 'Manager not found' });
  }

  res.json({ 
    success: true,
    message: 'Profile retrieved successfully',
    data: manager 
  });
});

export const updateManagerProfile = asyncHandler(async (req, res) => {
  const managerId = req.user.userId;
  const { firstName, lastName, phoneNumber } = req.body;

  const manager = await HostelManager.findByIdAndUpdate(
    managerId,
    {
      firstName,
      lastName,
      phoneNumber
    },
    { new: true, runValidators: true }
  );

  if (!manager) {
    return res.status(404).json({ success: false, message: 'Manager not found' });
  }

  res.json({ 
    success: true,
    message: 'Profile updated successfully', 
    data: manager 
  });
});

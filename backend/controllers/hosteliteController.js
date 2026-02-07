import Hostelite from '../models/Hostelite.js';
import Hostel from '../models/Hostel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getHosteliteDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const hostelite = await Hostelite.findById(userId)
    .populate('hostel')
    .populate('requests');

  if (!hostelite) {
    return res.status(404).json({ success: false, message: 'Hostelite not found' });
  }

  res.json({
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: {
      _id: hostelite._id,
      firstName: hostelite.firstName,
      lastName: hostelite.lastName,
      email: hostelite.email,
      universityId: hostelite.universityId,
      department: hostelite.department,
      academicYear: hostelite.academicYear,
      roomNumber: hostelite.roomNumber,
      hostel: hostelite.hostel,
      requestCount: hostelite.requests?.length || 0
    }
  });
});

export const getHosteliteRequests = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const hostelite = await Hostelite.findById(userId)
    .populate({
      path: 'requests',
      options: { sort: { createdAt: -1 } }
    });

  if (!hostelite) {
    return res.status(404).json({ success: false, message: 'Hostelite not found' });
  }

  res.json({ 
    success: true,
    message: 'Requests retrieved successfully',
    data: hostelite.requests || [] 
  });
});

export const getHosteliteProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const hostelite = await Hostelite.findById(userId).populate('hostel');

  if (!hostelite) {
    return res.status(404).json({ success: false, message: 'Hostelite not found' });
  }

  res.json({ 
    success: true,
    message: 'Profile retrieved successfully',
    data: hostelite 
  });
});

export const updateHosteliteProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { firstName, lastName, phoneNumber } = req.body;

  const hostelite = await Hostelite.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      phoneNumber
    },
    { new: true, runValidators: true }
  );

  if (!hostelite) {
    return res.status(404).json({ success: false, message: 'Hostelite not found' });
  }

  res.json({ 
    success: true,
    message: 'Profile updated successfully', 
    data: hostelite 
  });
});

export const getAllHostelites = asyncHandler(async (req, res) => {
  const { hostel, academicYear, department, page = 1, limit = 10 } = req.query;

  const filter = { role: 'HOSTELITE' };
  if (hostel) filter.hostel = hostel;
  if (academicYear) filter.academicYear = parseInt(academicYear);
  if (department) filter.department = new RegExp(department, 'i');

  const skip = (page - 1) * limit;

  const hostelites = await Hostelite.find(filter)
    .populate('hostel')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Hostelite.countDocuments(filter);

  res.json({
    success: true,
    message: 'Hostelites retrieved successfully',
    data: hostelites,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
});

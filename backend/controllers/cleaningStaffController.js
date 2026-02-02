import CleaningStaff from '../models/CleaningStaff.js';
import CleaningRequest from '../models/CleaningRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getCleaningStaffDashboard = asyncHandler(async (req, res) => {
  const staffId = req.user.userId;

  const staff = await CleaningStaff.findById(staffId)
    .populate('assignedHostels')
    .populate('cleaningRequests');

  if (!staff) {
    return res.status(404).json({ message: 'Staff not found' });
  }

  const pendingRequests = await CleaningRequest.find({
    assignedStaff: staffId,
    status: 'PENDING'
  });

  const completedRequests = await CleaningRequest.find({
    assignedStaff: staffId,
    status: 'APPROVED'
  });

  res.json({
    staff: {
      _id: staff._id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      staffId: staff.staffId,
      shiftTiming: staff.shiftTiming,
      assignedHostels: staff.assignedHostels,
      pendingRequestCount: pendingRequests.length,
      completedRequestCount: completedRequests.length
    }
  });
});

export const getAssignedRequests = asyncHandler(async (req, res) => {
  const staffId = req.user.userId;
  const { status, page = 1, limit = 10 } = req.query;

  const filter = { assignedStaff: staffId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const requests = await CleaningRequest.find(filter)
    .populate('hostelite')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await CleaningRequest.countDocuments(filter);

  res.json({
    requests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status, completionDate, notes } = req.body;

  const request = await CleaningRequest.findByIdAndUpdate(
    requestId,
    {
      status,
      completionDate,
      notes
    },
    { new: true, runValidators: true }
  ).populate('hostelite');

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  res.json({ message: 'Request updated successfully', request });
});

export const getCleaningStaffProfile = asyncHandler(async (req, res) => {
  const staffId = req.user.userId;

  const staff = await CleaningStaff.findById(staffId)
    .populate('assignedHostels');

  if (!staff) {
    return res.status(404).json({ message: 'Staff not found' });
  }

  res.json({ staff });
});

export const updateCleaningStaffProfile = asyncHandler(async (req, res) => {
  const staffId = req.user.userId;
  const { firstName, lastName, phoneNumber, shiftTiming } = req.body;

  const staff = await CleaningStaff.findByIdAndUpdate(
    staffId,
    {
      firstName,
      lastName,
      phoneNumber,
      shiftTiming
    },
    { new: true, runValidators: true }
  );

  if (!staff) {
    return res.status(404).json({ message: 'Staff not found' });
  }

  res.json({ message: 'Profile updated successfully', staff });
});

import CleaningStaff from '../models/CleaningStaff.js';
import CleaningRequest from '../models/CleaningRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getCleaningStaffDashboard = asyncHandler(async (req, res) => {
  const staffId = req.user.userId;

  const staff = await CleaningStaff.findById(staffId)
    .populate('assignedHostels')
    .populate('cleaningRequests');

  if (!staff) {
    return res.status(404).json({ success: false, message: 'Staff not found' });
  }

  const pendingCount = await CleaningRequest.countDocuments({
    assignedStaff: staffId,
    status: 'APPROVED'
  });

  const completedCount = await CleaningRequest.countDocuments({
    assignedStaff: staffId,
    status: 'COMPLETED'
  });

  const totalAssigned = pendingCount + completedCount;

  res.json({
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: {
      _id: staff._id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      staffId: staff.staffId,
      shiftTiming: staff.shiftTiming,
      assignedHostels: staff.assignedHostels,
      totalAssignedTasks: totalAssigned,
      completedTasks: completedCount,
      pendingTasks: pendingCount
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
    success: true,
    message: 'Assigned requests retrieved successfully',
    data: requests,
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

  const request = await CleaningRequest.findById(requestId).populate('hostelite');

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  // Prevent completion before the preferred date
  if (status === 'COMPLETED') {
    const now = new Date();
    const preferredDate = new Date(request.preferredDate);

    // Set both to start of day for accurate comparison
    now.setHours(0, 0, 0, 0);
    preferredDate.setHours(0, 0, 0, 0);

    if (now < preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Requests cannot be marked as completed before the scheduled date'
      });
    }
  }

  request.status = status;
  if (completionDate) request.completionDate = completionDate;
  if (notes) request.notes = notes;
  request.updatedAt = new Date();

  await request.save();

  res.json({
    success: true,
    message: 'Request updated successfully',
    data: request
  });
});

export const getCleaningStaffProfile = asyncHandler(async (req, res) => {
  const staffId = req.user.userId;

  const staff = await CleaningStaff.findById(staffId)
    .populate('assignedHostels');

  if (!staff) {
    return res.status(404).json({ success: false, message: 'Staff not found' });
  }

  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: staff
  });
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
    return res.status(404).json({ success: false, message: 'Staff not found' });
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: staff
  });
});

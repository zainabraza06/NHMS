import Request from '../models/Request.js';
import LeaveRequest from '../models/LeaveRequest.js';
import CleaningRequest from '../models/CleaningRequest.js';
import MessOffRequest from '../models/MessOffRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { calculateLeaveDuration } from '../utils/validators.js';

export const submitLeaveRequest = asyncHandler(async (req, res) => {
  const hosteliteId = req.user.userId;
  const { startDate, endDate, reason, parentContact } = req.body;

  if (!startDate || !endDate || !reason) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ success: false, message: 'Invalid date format' });
  }

  const now = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(now.getDate() + 2);
  twoDaysFromNow.setHours(0, 0, 0, 0);

  if (start < twoDaysFromNow) {
    return res.status(400).json({
      success: false,
      message: 'Leave requests must be applied at least 2 days in advance'
    });
  }

  if (end < start) {
    return res.status(400).json({
      success: false,
      message: 'Leave end date must be on or after the start date'
    });
  }

  const duration = calculateLeaveDuration(startDate, endDate);

  const leaveRequest = new LeaveRequest({
    requestType: 'LEAVE_REQUEST',
    hostelite: hosteliteId,
    status: 'PENDING',
    startDate,
    endDate,
    reason,
    parentContact,
    duration
  });

  await leaveRequest.save();

  res.status(201).json({
    success: true,
    message: 'Leave request submitted successfully',
    data: leaveRequest
  });
});

export const submitCleaningRequest = asyncHandler(async (req, res) => {
  const hosteliteId = req.user.userId;
  const { roomNumber, floor, cleaningType, priority, notes, preferredDate } = req.body;

  if (!roomNumber || !floor || !preferredDate) {
    return res.status(400).json({ success: false, message: 'Please provide room number, floor, and preferred date' });
  }

  const preferred = new Date(preferredDate);
  if (Number.isNaN(preferred.getTime())) {
    return res.status(400).json({ success: false, message: 'Invalid preferred date format' });
  }

  const now = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(now.getDate() + 2);
  twoDaysFromNow.setHours(0, 0, 0, 0);

  if (preferred < twoDaysFromNow) {
    return res.status(400).json({
      success: false,
      message: 'Cleaning requests must be scheduled at least 2 days in advance'
    });
  }

  const cleaningRequest = new CleaningRequest({
    requestType: 'CLEANING_REQUEST',
    hostelite: hosteliteId,
    status: 'PENDING',
    roomNumber,
    floor,
    cleaningType: cleaningType || 'ROUTINE',
    priority: priority || 'MEDIUM',
    preferredDate,
    notes
  });

  await cleaningRequest.save();

  res.status(201).json({
    success: true,
    message: 'Cleaning request submitted successfully',
    data: cleaningRequest
  });
});

export const submitMessOffRequest = asyncHandler(async (req, res) => {
  const hosteliteId = req.user.userId;
  const { startDate, endDate, reason, mealCount } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Please provide start and end dates' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // 1. Lead time validation: 2 days earlier
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(now.getDate() + 2);
  twoDaysFromNow.setHours(0, 0, 0, 0);

  if (start < twoDaysFromNow) {
    return res.status(400).json({
      success: false,
      message: 'Mess off requests must be applied at least 2 days in advance'
    });
  }

  // 2. Duration validation: > 1 day
  const diffTime = end - start;
  const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDaysTotal <= 1) {
    return res.status(400).json({
      success: false,
      message: 'Mess off request duration must be greater than 1 day'
    });
  }

  // 3. Monthly cap logic (12 days max)
  // Split dates by month
  const daysByMonth = {};
  let temp = new Date(start);
  while (temp <= end) {
    const monthKey = `${(temp.getMonth() + 1).toString().padStart(2, '0')}-${temp.getFullYear()}`;
    daysByMonth[monthKey] = (daysByMonth[monthKey] || 0) + 1;
    temp.setDate(temp.getDate() + 1);
  }

  // Check current availed days for each month
  const approvedDaysPerMonth = {};
  const errorMessages = [];

  for (const monthKey of Object.keys(daysByMonth)) {
    // Fetch all approved mess off requests for this month
    const existingRequests = await MessOffRequest.find({
      hostelite: hosteliteId,
      status: 'APPROVED',
      [`approvedDaysPerMonth.${monthKey}`]: { $exists: true }
    });

    let availedThisMonth = 0;
    existingRequests.forEach(req => {
      availedThisMonth += req.approvedDaysPerMonth.get(monthKey) || 0;
    });

    const remaining = 12 - availedThisMonth;
    const requestedThisMonth = daysByMonth[monthKey];

    if (remaining <= 0) {
      errorMessages.push(`Limit (12 days) already reached for ${monthKey}.`);
      approvedDaysPerMonth[monthKey] = 0;
    } else if (requestedThisMonth > remaining) {
      // Truncate to remaining
      approvedDaysPerMonth[monthKey] = remaining;
      errorMessages.push(`Only ${remaining} days were available for ${monthKey}. Capping to limit.`);
    } else {
      approvedDaysPerMonth[monthKey] = requestedThisMonth;
    }
  }

  // If no days could be approved at all
  const totalApproved = Object.values(approvedDaysPerMonth).reduce((a, b) => a + b, 0);
  if (totalApproved === 0) {
    return res.status(400).json({
      success: false,
      message: errorMessages.join(' ') || 'Monthly mess-off limit (12 days) reached.'
    });
  }

  const messOffRequest = new MessOffRequest({
    requestType: 'MESS_OFF_REQUEST',
    hostelite: hosteliteId,
    status: 'PENDING',
    startDate,
    endDate,
    reason,
    mealCount,
    approvedDaysPerMonth
  });

  await messOffRequest.save();

  res.status(201).json({
    success: true,
    message: errorMessages.length > 0
      ? `Mess-off request submitted with adjustments: ${errorMessages.join(' ')}`
      : 'Mess-off request submitted successfully',
    data: messOffRequest
  });
});

export const getMyRequests = asyncHandler(async (req, res) => {
  const hosteliteId = req.user.userId;
  const { requestType, status, page = 1, limit = 10 } = req.query;

  const filter = { hostelite: hosteliteId };
  if (requestType) filter.requestType = requestType;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const requests = await Request.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Request.countDocuments(filter);

  res.json({
    success: true,
    message: 'My requests retrieved successfully',
    data: requests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
});

export const cancelRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const hosteliteId = req.user.userId;

  const request = await Request.findOne({
    _id: requestId,
    hostelite: hosteliteId,
    status: { $in: ['PENDING', 'APPROVED'] }
  });

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found or cannot be cancelled' });
  }

  request.status = 'CANCELLED';
  request.updatedAt = new Date();
  await request.save();

  res.json({
    success: true,
    message: 'Request cancelled successfully',
    data: request
  });
});

export const getRequestStats = asyncHandler(async (req, res) => {
  const hosteliteId = req.user.userId;

  const stats = {
    total: await Request.countDocuments({ hostelite: hosteliteId }),
    pending: await Request.countDocuments({ hostelite: hosteliteId, status: 'PENDING' }),
    approved: await Request.countDocuments({ hostelite: hosteliteId, status: 'APPROVED' }),
    rejected: await Request.countDocuments({ hostelite: hosteliteId, status: 'REJECTED' }),
    cancelled: await Request.countDocuments({ hostelite: hosteliteId, status: 'CANCELLED' })
  };

  res.json({
    success: true,
    message: 'Request stats retrieved successfully',
    data: stats
  });
});

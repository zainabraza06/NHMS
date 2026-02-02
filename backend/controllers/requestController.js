import Request from '../models/Request.js';
import LeaveRequest from '../models/LeaveRequest.js';
import CleaningRequest from '../models/CleaningRequest.js';
import MessOffRequest from '../models/MessOffRequest.js';
import Hostelite from '../models/Hostelite.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { calculateLeaveDuration } from '../utils/validators.js';
import { sendLeaveRequestNotification } from '../utils/emailService.js';

export const submitLeaveRequest = asyncHandler(async (req, res) => {
  const hosteliteId = req.user.userId;
  const { startDate, endDate, reason, parentContact } = req.body;

  if (!startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'Please provide all required fields' });
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

  const hostelite = await Hostelite.findById(hosteliteId);
  await sendLeaveRequestNotification(
    hostelite.email,
    `${hostelite.firstName} ${hostelite.lastName}`,
    startDate,
    endDate
  );

  res.status(201).json({
    message: 'Leave request submitted successfully',
    request: leaveRequest
  });
});

export const submitCleaningRequest = asyncHandler(async (req, res) => {
  const hosteliteId = req.user.userId;
  const { roomNumber, floor, cleaningType, priority, notes } = req.body;

  if (!roomNumber || !floor) {
    return res.status(400).json({ message: 'Please provide room number and floor' });
  }

  const cleaningRequest = new CleaningRequest({
    requestType: 'CLEANING_REQUEST',
    hostelite: hosteliteId,
    status: 'PENDING',
    roomNumber,
    floor,
    cleaningType: cleaningType || 'ROUTINE',
    priority: priority || 'MEDIUM',
    notes
  });

  await cleaningRequest.save();

  res.status(201).json({
    message: 'Cleaning request submitted successfully',
    request: cleaningRequest
  });
});

export const submitMessOffRequest = asyncHandler(async (req, res) => {
  const hosteliteId = req.user.userId;
  const { startDate, endDate, reason, mealCount } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Please provide start and end dates' });
  }

  const messOffRequest = new MessOffRequest({
    requestType: 'MESS_OFF_REQUEST',
    hostelite: hosteliteId,
    status: 'PENDING',
    startDate,
    endDate,
    reason,
    mealCount
  });

  await messOffRequest.save();

  res.status(201).json({
    message: 'Mess off request submitted successfully',
    request: messOffRequest
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
    requests,
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
    return res.status(404).json({ message: 'Request not found or cannot be cancelled' });
  }

  request.status = 'CANCELLED';
  request.updatedAt = new Date();
  await request.save();

  res.json({ message: 'Request cancelled successfully', request });
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

  res.json({ stats });
});

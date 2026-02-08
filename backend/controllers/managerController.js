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

  const hostelites = await Hostelite.find({ hostel: hostel._id }).select('_id');
  const hosteliteIds = hostelites.map((h) => h._id);

  const totalRequests = await Request.countDocuments({ hostelite: { $in: hosteliteIds } });
  const approvedRequests = await Request.countDocuments({ hostelite: { $in: hosteliteIds }, status: 'APPROVED' });
  const pendingRequests = await Request.countDocuments({ hostelite: { $in: hosteliteIds }, status: 'PENDING' });
  const rejectedRequests = await Request.countDocuments({ hostelite: { $in: hosteliteIds }, status: 'REJECTED' });

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
        totalRequests,
        approvedRequests,
        totalHostelites: hosteliteCount,
        totalStaff: staffCount,
        pendingRequests,
        rejectedRequests,
        occupiedRooms: hosteliteCount,
        totalRooms: hostel.totalRooms,
        occupancyRate: hostel.totalRooms
          ? ((hosteliteCount / hostel.totalRooms) * 100).toFixed(2) + '%'
          : '0.00%'
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

  const baseRequest = await Request.findById(requestId).populate('hostelite');

  if (!baseRequest) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  if (baseRequest.requestType === 'CLEANING_REQUEST') {
    const hostelId = baseRequest.hostelite?.hostel;
    if (!hostelId) {
      return res.status(400).json({ success: false, message: 'Hostelite hostel not found for assignment' });
    }

    const staffMembers = await CleaningStaff.find({ assignedHostels: hostelId })
      .select('_id lastAssignedAt')
      .lean();

    if (!staffMembers.length) {
      return res.status(400).json({ success: false, message: 'No cleaning staff available for this hostel' });
    }

    const staffIds = staffMembers.map((staff) => staff._id);
    const requestCounts = await CleaningRequest.aggregate([
      { $match: { assignedStaff: { $in: staffIds }, status: 'APPROVED' } },
      { $group: { _id: '$assignedStaff', count: { $sum: 1 } } }
    ]);

    const countMap = new Map(requestCounts.map((entry) => [String(entry._id), entry.count]));

    const staffMember = staffMembers.reduce((selected, current) => {
      if (!selected) {
        return current;
      }

      const selectedCount = countMap.get(String(selected._id)) || 0;
      const currentCount = countMap.get(String(current._id)) || 0;

      if (currentCount < selectedCount) {
        return current;
      }

      if (currentCount === selectedCount) {
        const selectedLast = selected.lastAssignedAt ? new Date(selected.lastAssignedAt).getTime() : 0;
        const currentLast = current.lastAssignedAt ? new Date(current.lastAssignedAt).getTime() : 0;
        if (currentLast < selectedLast) {
          return current;
        }
      }

      return selected;
    }, null);

    const updatedRequest = await CleaningRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'APPROVED',
        assignedStaff: staffMember._id,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('hostelite');

    await CleaningStaff.findByIdAndUpdate(
      staffMember._id,
      {
        lastAssignedAt: new Date(),
        $addToSet: { cleaningRequests: requestId }
      }
    );

    return res.json({
      success: true,
      message: 'Request approved and assigned successfully',
      data: updatedRequest
    });
  }

  const request = await Request.findByIdAndUpdate(
    requestId,
    { status: 'APPROVED', updatedAt: new Date() },
    { new: true }
  ).populate('hostelite');

  res.json({
    success: true,
    message: 'Request approved successfully',
    data: request
  });
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { reason } = req.body;

  if (!reason || !String(reason).trim()) {
    return res.status(400).json({ success: false, message: 'Rejection reason is required' });
  }

  const request = await Request.findByIdAndUpdate(
    requestId,
    { status: 'REJECTED', rejectionReason: String(reason).trim(), updatedAt: new Date() },
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
    .populate('assignedHostels')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ joinDate: -1 });

  const staffIds = staff.map((member) => member._id);
  const activeCounts = await CleaningRequest.aggregate([
    { $match: { assignedStaff: { $in: staffIds }, status: 'APPROVED' } },
    { $group: { _id: '$assignedStaff', count: { $sum: 1 } } }
  ]);
  const countMap = new Map(activeCounts.map((entry) => [String(entry._id), entry.count]));

  const staffWithCounts = staff.map((member) => {
    const data = member.toObject();
    return {
      ...data,
      activeCleaningRequests: countMap.get(String(member._id)) || 0
    };
  });

  const total = await CleaningStaff.countDocuments({ assignedHostels: manager.hostel });

  res.json({
    success: true,
    message: 'Manager staff retrieved successfully',
    data: staffWithCounts,
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

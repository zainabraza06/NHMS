import User from '../models/User.js';
import Hostelite from '../models/Hostelite.js';
import CleaningStaff from '../models/CleaningStaff.js';
import HostelManager from '../models/HostelManager.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateToken } from '../utils/tokenUtils.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, role, universityId, department, academicYear, roomNumber, hostel } = req.body;

  // Validation
  if (!email || !password || !firstName || !lastName || !phoneNumber || !role) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  let newUser;
  if (role === 'HOSTELITE') {
    if (!universityId || !department || !academicYear || !roomNumber || !hostel) {
      return res.status(400).json({ message: 'Please provide all hostelite required fields' });
    }

    newUser = new Hostelite({
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
      admissionDate: new Date(),
      validUpto: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isEmailVerified: true
    });
  } else if (role === 'HOSTEL_MANAGER') {
    newUser = new HostelManager({
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
  } else if (role === 'CLEANING_STAFF') {
    newUser = new CleaningStaff({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role: 'CLEANING_STAFF',
      staffId: `STAFF-${Date.now()}`,
      joinDate: new Date(),
      shiftTiming: 'MORNING',
      isEmailVerified: true
    });
  }

  await newUser.save();

  res.status(201).json({
    message: 'User registered successfully.',
    userId: newUser._id
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  res.status(400).json({ message: 'Email verification is disabled.' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.active) {
    return res.status(401).json({ message: 'Your account has been deactivated' });
  }

  const token = generateToken(user._id, user.role);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
  });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  res.status(400).json({ message: 'Password reset via email is disabled.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  res.status(400).json({ message: 'Password reset via email is disabled.' });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  if (!validatePassword(newPassword)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = await User.findById(userId).select('+password');

  if (!user || !(await user.matchPassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiry = undefined;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});

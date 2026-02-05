import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'nhms_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashedToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'nhms_super_secret_jwt_key_2026');
  } catch (error) {
    return null;
  }
};

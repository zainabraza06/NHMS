import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_management_system',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  
  // Email Configuration
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    email: process.env.SMTP_EMAIL || '',
    password: process.env.SMTP_PASSWORD || ''
  },
  
  // Token Expiry
  verificationTokenExpiry: process.env.VERIFICATION_TOKEN_EXPIRY || '24h'
};

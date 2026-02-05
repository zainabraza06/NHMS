import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_EMAIL || 'your-email@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'your-app-password'
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_EMAIL || 'your-email@gmail.com',
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${config.baseUrl}/api/auth/verify-email?token=${token}`;
  const html = `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>Link expires in 24 hours.</p>
  `;
  return sendEmail(email, 'Email Verification', html);
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${config.baseUrl}/reset-password?token=${token}`;
  const html = `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>Link expires in 1 hour. If you didn't request this, please ignore.</p>
  `;
  return sendEmail(email, 'Password Reset Request', html);
};

export const sendAccountApprovedEmail = async (email, name) => {
  const html = `
    <h2>Account Approved</h2>
    <p>Dear ${name},</p>
    <p>Your account has been approved successfully!</p>
    <p>You can now log in to the hostel management system.</p>
  `;
  return sendEmail(email, 'Account Approved', html);
};

export const sendAccountRejectedEmail = async (email, name, reason = '') => {
  const html = `
    <h2>Account Rejected</h2>
    <p>Dear ${name},</p>
    <p>Unfortunately, your account has been rejected.</p>
    ${reason ? `<p>Reason: ${reason}</p>` : ''}
    <p>Please contact the administration for more information.</p>
  `;
  return sendEmail(email, 'Account Rejected', html);
};

export const sendLeaveRequestNotification = async (email, hosteliteName, startDate, endDate) => {
  const html = `
    <h2>Leave Request Submitted</h2>
    <p>Dear ${hosteliteName},</p>
    <p>Your leave request has been submitted successfully.</p>
    <p><strong>Details:</strong></p>
    <ul>
      <li>Start Date: ${startDate}</li>
      <li>End Date: ${endDate}</li>
    </ul>
    <p>You will be notified once it's approved or rejected.</p>
  `;
  return sendEmail(email, 'Leave Request Submitted', html);
};

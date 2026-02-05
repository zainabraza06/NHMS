# NUST Hostel Management System - Complete Setup Guide

## Overview
A modern MERN stack application for managing hostel operations, built with:
- **Backend:** Node.js + Express.js + MongoDB
- **Frontend:** Next.js + React + TypeScript + Tailwind CSS

## Project Structure
```
Nust_Hostel_Management_System/
├── backend/
│   ├── config/
│   │   ├── env.js (Configuration)
│   │   └── database.js (MongoDB Connection)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js (Entry point)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/ (Next.js pages)
│   │   ├── components/
│   │   ├── services/ (API calls)
│   │   ├── types/ (TypeScript)
│   │   ├── utils/
│   │   └── hooks/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── Documentation files
```

## Prerequisites
- Node.js 16+ (https://nodejs.org/)
- npm or yarn
- MongoDB (local OR MongoDB Atlas account)
- Git (optional)

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy example to .env
cp .env.example .env
```

Edit `backend/.env` and set:

**Option A: Local MongoDB**
```
MONGODB_URI=mongodb://localhost:27017/nhms
```

**Option B: MongoDB Atlas (Recommended)**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nhms?retryWrites=true&w=majority
```

See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) for detailed Atlas setup instructions.

**Email Configuration (Gmail):**
```
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

To get Gmail app password:
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification first
3. Create an app password for "Mail"
4. Copy the 16-character password

### 3. Start the Backend
```bash
npm start
```

Expected output:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

### 4. Verify Backend
```bash
curl http://localhost:5000/health
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy example to .env.local
cp .env.example .env.local
```

Default configuration:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### 3. Start the Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Running the Full Application

### Terminal 1: Backend
```bash
cd backend
npm start
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

Then open your browser: `http://localhost:3000`

## Default Credentials

The system has three roles with test accounts:

### Hostelite (Student)
- Email: `hostelite@example.com`
- Password: Set during registration

### Cleaning Staff
- Email: `staff@example.com`
- Password: Set during registration

### Hostel Manager
- Email: `manager@example.com`
- Password: Set during registration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email` - Verify email address
- `POST /api/auth/password-reset-request` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Hostelite Endpoints
- `GET /api/hostelites/profile` - Get profile
- `PUT /api/hostelites/profile` - Update profile
- `GET /api/hostelites/dashboard` - Get dashboard
- `GET /api/hostelites/requests` - Get all requests
- `POST /api/hostelites/requests` - Create new request
- `PUT /api/hostelites/requests/:id` - Update request
- `DELETE /api/hostelites/requests/:id` - Cancel request

### Staff Endpoints
- `GET /api/staff/profile` - Get profile
- `PUT /api/staff/profile` - Update profile
- `GET /api/staff/dashboard` - Get dashboard
- `GET /api/staff/requests` - Get assigned requests
- `PUT /api/staff/requests/:id` - Update request

### Manager Endpoints
- `GET /api/managers/profile` - Get profile
- `PUT /api/managers/profile` - Update profile
- `GET /api/managers/dashboard` - Get dashboard
- `GET /api/managers/requests` - All requests
- `GET /api/managers/hostelites` - All hostelites
- `GET /api/managers/staff` - All staff

## Features

### Hostelite (Student)
- View and update profile
- Submit facility/maintenance requests
- Track request status
- View request history
- Dashboard with recent requests

### Cleaning Staff
- View and update profile
- View assigned tasks/requests
- Update task status
- Track assigned hostels/floors

### Hostel Manager
- Manage all hostelites
- Manage cleaning staff
- View and manage all requests
- Dashboard with statistics
- Assign staff to requests

### Security Features
- JWT authentication
- Password hashing with bcryptjs
- Email verification
- Password reset functionality
- Role-based access control
- CORS protection
- Input validation

## Troubleshooting

### Backend Won't Connect to Database
1. Check MongoDB is running: `mongod` (local) or verify Atlas cluster is active
2. Verify connection string in `.env`
3. Check network/firewall settings (Atlas: IP whitelist)

### Frontend Can't Connect to Backend
1. Ensure backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for errors (F12)

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### TypeScript Errors
```bash
cd frontend
npm run build  # Check for all TS errors
```

### Clear npm Cache
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## Development Tips

### Hot Reload
- **Backend:** Restart manually after code changes
- **Frontend:** Auto-reloads on file changes

### Debugging
- **Backend:** Add console.logs or use debugger
- **Frontend:** Use React DevTools (Chrome extension)

### Database Inspection
- **MongoDB Atlas:** Use MongoDB Compass or Atlas UI
- **Local MongoDB:** Use MongoDB Compass

## Deployment

### Backend Deployment (Heroku)
See backend documentation for platform-specific deployment.

### Frontend Deployment (Vercel)
```bash
npm install -g vercel
vercel
```

### Docker Deployment
The application is containerized for cloud deployment.

## Environment Variables Reference

### Backend `.env`
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nhms
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
VERIFICATION_TOKEN_EXPIRY=24h
PASSWORD_RESET_EXPIRY=1h
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

## Support & Documentation

- **MongoDB Atlas Setup:** See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)
- **Backend Code:** See backend directory
- **Frontend Code:** See frontend directory

## License

This project is part of NUST Hostel Management System.

---

**Last Updated:** 2024
**Version:** 1.0.0

# NUST Hostel Management System (NHMS)

<div align="center">
  <h3>🏠 A modern, role-based hostel management system for academic institutions</h3>
  <p>Built with MERN Stack (MongoDB, Express.js, React, Node.js)</p>
</div>

---

## 📖 Table of Contents

- [📝 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🏗️ Project Architecture](#-project-architecture)
- [🚀 Quick Start](#-quick-start)
- [📋 Detailed Setup](#-detailed-setup)
- [🔌 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#-database-schema)
- [👥 User Roles & Permissions](#-user-roles--permissions)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [🐛 Troubleshooting](#-troubleshooting)
- [📄 License](#-license)

---

## 📝 Overview

**NHMS** is a comprehensive digital solution for hostel management in academic institutions, specifically designed to address the inefficiencies of manual processes at NUST (National University of Science and Technology).

### 🎯 Problem Statement

At NUST, complaints and requests are often registered manually, leading to:
- 📍 Long queues and crowded service centers
- ⏱️ Extended wait times, especially during holidays
- 📝 Paper-based processes prone to errors
- 🔄 Slow routing and response times
- 👁️ Lack of transparency in request status

### 💡 Solution

NHMS streamlines hostel management through:
- 🖥️ **Self-service digital platform** for request submissions
- ⚡ **Faster routing** with automated workflows
- 📱 **Real-time tracking** of complaints and requests
- 👨‍💼 **Role-based dashboards** for different user types
- 🏠 **Integrated room management** with availability tracking

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure password hashing
- **Role-based access control** (Admin, Hostel Manager, Cleaning Staff, Hostelite)
- **Protected routes** with middleware validation
- **Session management** with token refresh

### 👨‍💼 Admin Features
- 🏢 **Hostel Management**: Create, view, and manage hostels
- 👥 **User Management**: Add hostelites with room assignment
- 🏃‍♂️ **Manager Assignment**: Assign/remove hostel managers
- 📊 **Dashboard**: Real-time statistics and occupancy rates
- 🗑️ **User Removal**: Remove hostelites and managers

### 🏨 Hostel Manager Features
- 📋 **Request Management**: Review and approve/reject requests
- 📞 **Complaint Handling**: Respond to hostelite complaints
- 👥 **Hostelite Oversight**: View assigned hostelite information
- 📊 **Analytics**: Monitor hostel performance metrics
- 🧹 **Staff Coordination**: Manage cleaning staff assignments

### 🏠 Hostelite Features
- 📝 **Request Submission**: Leave requests, mess-off requests
- 🧹 **Cleaning Requests**: Schedule cleaning services
- 📞 **Complaint Filing**: Submit complaints with tracking
- 💰 **Billing**: View monthly challans and payment status
- 📊 **Dashboard**: Personal overview of requests and bills

### 🧹 Cleaning Staff Features
- 📋 **Task Management**: View assigned cleaning tasks
- ✅ **Status Updates**: Mark tasks as completed
- 📅 **Schedule View**: Daily and weekly task schedules
- 📊 **Performance Tracking**: Task completion metrics

### 💰 Billing & Payments
- 📅 **Automated Challan Generation**: Monthly billing cycles
- 💳 **Payment Integration**: Stripe-powered payment processing
- 📊 **Payment Tracking**: Real-time payment status
- 📧 **Notifications**: Email reminders and receipts

---

## 🛠️ Tech Stack

### Backend Technologies
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js with async error handling
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **Security**: Helmet, CORS, Input validation
- **Email**: Nodemailer integration
- **Payments**: Stripe SDK
- **Scheduling**: Node-cron for automated tasks
- **Development**: Nodemon for hot reloading

### Frontend Technologies
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript for type safety
- **UI Library**: React 18 with React Hooks
- **Styling**: Tailwind CSS + Heroicons
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **State Management**: Zustand + React Context
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Payments**: Stripe React components

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript compiler
- **Environment**: dotenv for configuration
- **API Testing**: Built-in test scripts
- **Development**: Hot reloading for both frontend and backend

---

## 🏗️ Project Architecture

```
Nust_Hostel_Management_System/
├── 📁 backend/
│   ├── 📁 config/
│   │   └── database.js              # MongoDB connection setup
│   ├── 📁 controllers/
│   │   ├── adminController.js       # Admin-specific operations
│   │   ├── authController.js        # Authentication logic
│   │   ├── billingController.js     # Payment and challan management
│   │   ├── complaintController.js   # Complaint handling
│   │   ├── hosteliteController.js   # Hostelite operations
│   │   ├── managerController.js     # Manager-specific functions
│   │   └── requestController.js     # Request processing
│   ├── 📁 middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── errorHandler.js          # Global error handling
│   ├── 📁 models/
│   │   ├── User.js                  # Base user model
│   │   ├── Hostelite.js             # Hostelite discriminator
│   │   ├── HostelManager.js         # Manager discriminator
│   │   ├── CleaningStaff.js         # Staff discriminator
│   │   ├── Hostel.js                # Hostel information
│   │   ├── Request.js               # Base request model
│   │   ├── LeaveRequest.js          # Leave request type
│   │   ├── MessOffRequest.js        # Mess-off request type
│   │   ├── CleaningRequest.js       # Cleaning request type
│   │   ├── Complaint.js             # Complaint model
│   │   └── Challan.js               # Billing model
│   ├── 📁 routes/
│   │   ├── authRoutes.js            # Authentication endpoints
│   │   ├── adminRoutes.js           # Admin API routes
│   │   ├── managerRoutes.js         # Manager API routes
│   │   ├── hosteliteRoutes.js       # Hostelite API routes
│   │   ├── staffRoutes.js           # Cleaning staff routes
│   │   ├── complaintRoutes.js       # Complaint management
│   │   ├── requestRoutes.js         # Request handling
│   │   └── billingRoutes.js         # Billing and payments
│   ├── 📁 scripts/
│   │   ├── seedUsers.js             # Database seeding
│   │   ├── seedChallans.js          # Sample billing data
│   │   └── verifyRefinedLogic.js    # Logic verification
│   ├── 📁 services/
│   │   └── cronService.js           # Scheduled tasks
│   ├── 📁 utils/
│   │   ├── tokenUtils.js            # JWT utilities
│   │   └── validators.js            # Input validation
│   ├── 📁 tests/
│   │   ├── billing.test.js          # Billing logic tests
│   │   └── messOff.test.js          # Mess-off logic tests
│   └── server.js                    # Application entry point
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── globals.css          # Global styles
│   │   │   ├── 📁 (auth)/          # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── 📁 (dashboard)/     # Role-based dashboards
│   │   │       ├── admin/
│   │   │       ├── manager/
│   │   │       ├── hostelite/
│   │   │       └── staff/
│   │   ├── 📁 components/
│   │   │   ├── Navbar.tsx           # Navigation component
│   │   │   ├── ProtectedRoute.tsx   # Route protection
│   │   │   └── billing/            # Billing components
│   │   ├── 📁 context/
│   │   │   └── AuthContext.tsx      # Global auth state
│   │   ├── 📁 hooks/
│   │   │   └── useAuth.ts           # Authentication hook
│   │   ├── 📁 services/
│   │   │   ├── api.ts               # Base API configuration
│   │   │   ├── authService.ts       # Auth API calls
│   │   │   ├── billingService.ts    # Billing API calls
│   │   │   └── userService.ts       # User management APIs
│   │   ├── 📁 types/
│   │   │   └── index.ts             # TypeScript definitions
│   │   └── 📁 utils/
│   │       ├── api-client.ts        # HTTP client setup
│   │       └── constants.ts         # App constants
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── tsconfig.json                # TypeScript config
│   └── package.json                 # Dependencies
│
├── README.md                        # This file
└── package.json                     # Root package configuration
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **Git** for version control - [Download](https://git-scm.com/)

### 🏃‍♂️ One-Command Setup

```bash
# Clone the repository
git clone <repository-url>
cd Nust_Hostel_Management_System

# Install dependencies for both frontend and backend
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables (see detailed setup below)
# ... configure .env files ...

# Start both services
cd backend && npm run dev &
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Detailed Setup

### 1. 🗄️ Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Windows: Download from MongoDB website
# macOS: brew install mongodb-community
# Ubuntu: apt-get install mongodb

# Start MongoDB service
mongod --dbpath /your/data/path
```

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/nhms`

### 2. ⚙️ Backend Configuration

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nhms
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nhms

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm run test:logic
```

### 3. 🎨 Frontend Configuration

```bash
cd frontend
npm install
```

Create `.env.local` file in the frontend directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Configuration (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App Configuration
NEXT_PUBLIC_APP_NAME="NUST Hostel Management System"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Start Frontend Application

```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### 4. 🌱 Database Seeding (Optional)

```bash
cd backend

# Seed initial users (admin, managers, hostelites)
npm run seed:users

# Seed sample billing data
node scripts/seedChallans.js
```

### 5. 🔑 Default Credentials

After seeding, you can use these credentials:

```
Admin:
Email: admin@nust.edu.pk
Password: admin123

Manager:
Email: manager@nust.edu.pk  
Password: manager123

Hostelite:
Email: hostelite@nust.edu.pk
Password: hostelite123
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### 🔐 Authentication Endpoints

#### POST `/auth/register`
Register a new user
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@nust.edu.pk",
  "password": "securePassword",
  "phoneNumber": "+92-300-1234567",
  "role": "HOSTELITE"
}
```

#### POST `/auth/login`
User login
```json
{
  "email": "john.doe@nust.edu.pk",
  "password": "securePassword"
}
```

### 👨‍💼 Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/hostels` | Get all hostels |
| POST | `/admin/hostels` | Create new hostel |
| GET | `/admin/users` | Get all users |
| POST | `/admin/hostelites` | Create hostelite |
| POST | `/admin/managers` | Create/assign manager |
| DELETE | `/admin/hostelites/:id` | Remove hostelite |
| DELETE | `/admin/managers/:id` | Remove manager |
| GET | `/admin/available-rooms/:hostelId` | Get available rooms |

### 🏨 Manager Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/manager/requests` | Get hostelite requests |
| PUT | `/manager/requests/:id` | Update request status |
| GET | `/manager/complaints` | Get complaints |
| PUT | `/manager/complaints/:id` | Respond to complaint |
| GET | `/manager/hostelites` | Get assigned hostelites |

### 🏠 Hostelite Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hostelite/profile` | Get profile |
| PUT | `/hostelite/profile` | Update profile |
| GET | `/hostelite/requests` | Get my requests |
| POST | `/hostelite/requests/leave` | Submit leave request |
| POST | `/hostelite/requests/mess-off` | Submit mess-off request |
| POST | `/hostelite/requests/cleaning` | Submit cleaning request |
| GET | `/hostelite/complaints` | Get my complaints |
| POST | `/hostelite/complaints` | Submit complaint |
| GET | `/hostelite/bills` | Get billing history |

### 🧹 Staff Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/staff/tasks` | Get assigned tasks |
| PUT | `/staff/tasks/:id` | Update task status |
| GET | `/staff/profile` | Get profile |

### 💰 Billing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/billing/challans/:hosteliteId` | Get user challans |
| POST | `/billing/payment-intent` | Create payment intent |
| POST | `/billing/webhook` | Stripe webhook handler |

---

## 🗄️ Database Schema

### 👤 User Model (Base Model with Discriminators)
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  role: Enum ['ADMIN', 'HOSTEL_MANAGER', 'CLEANING_STAFF', 'HOSTELITE'],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 🏠 Hostelite Model (Discriminator)
```javascript
{
  // Inherits from User
  rollNumber: String (unique),
  roomNumber: String,
  hostel: ObjectId (ref: Hostel),
  emergencyContact: Object,
  guardianInfo: Object,
  messOptOut: Boolean,
  messOptOutDates: [Date]
}
```

### 🏨 Hostel Manager Model (Discriminator)
```javascript
{
  // Inherits from User  
  employeeId: String (unique),
  assignedHostel: ObjectId (ref: Hostel)
}
```

### 🧹 Cleaning Staff Model (Discriminator)
```javascript
{
  // Inherits from User
  employeeId: String (unique),
  assignedHostels: [ObjectId] (ref: Hostel),
  shiftTiming: String
}
```

### 🏢 Hostel Model
```javascript
{
  name: String,
  location: String,
  totalRooms: Number,
  facilities: [String],
  manager: ObjectId (ref: HostelManager),
  isActive: Boolean,
  createdAt: Date
}
```

### 📝 Request Model (Base Model)
```javascript
{
  hostelite: ObjectId (ref: Hostelite),
  type: Enum ['LEAVE', 'CLEANING', 'MESS_OFF'],
  status: Enum ['PENDING', 'APPROVED', 'REJECTED'],
  submissionDate: Date,
  reviewedBy: ObjectId (ref: User),
  reviewDate: Date,
  comments: String
}
```

### 💰 Challan Model
```javascript
{
  hostelite: ObjectId (ref: Hostelite),
  month: Number,
  year: Number,
  amount: Number,
  dueDate: Date,
  paidDate: Date,
  status: Enum ['PENDING', 'PAID', 'OVERDUE'],
  paymentMethod: String,
  stripePaymentIntentId: String
}
```

---

## 👥 User Roles & Permissions

### 🔑 Admin (System Administrator)
**Full system access and management capabilities**

**Permissions:**
- ✅ Create/manage hostels and room allocations
- ✅ Add/remove hostelites with room assignments
- ✅ Assign/remove hostel managers
- ✅ View system-wide statistics and reports
- ✅ Access all user data and activity logs
- ✅ Manage system configurations

**Dashboard Features:**
- 📊 Real-time occupancy rates across all hostels
- 👥 User management with role assignments
- 🏢 Hostel management with capacity tracking
- 📈 System analytics and performance metrics

### 🏨 Hostel Manager
**Manages assigned hostel operations**

**Permissions:**
- ✅ Review and approve/reject hostelite requests
- ✅ Respond to complaints from assigned hostelites
- ✅ View hostelite information for assigned hostel
- ✅ Coordinate with cleaning staff
- ✅ Generate hostel-specific reports

**Dashboard Features:**
- 📋 Pending requests requiring review
- 📞 Unresolved complaints
- 👥 Hostelite directory for assigned hostel
- 📊 Hostel performance metrics

### 🏠 Hostelite (Student Resident)
**Self-service portal for hostel residents**

**Permissions:**
- ✅ Submit leave requests with date ranges
- ✅ Request cleaning services for room
- ✅ Submit mess-off requests
- ✅ File complaints with tracking
- ✅ View personal billing and payment history
- ✅ Update personal profile information

**Dashboard Features:**
- 📝 Request submission forms
- 📋 Request status tracking
- 💰 Current and past bills
- 📞 Complaint history
- 👤 Profile management

### 🧹 Cleaning Staff
**Task management for cleaning personnel**

**Permissions:**
- ✅ View assigned cleaning tasks
- ✅ Update task completion status
- ✅ View daily/weekly schedules
- ✅ Access contact information for emergencies

**Dashboard Features:**
- 📅 Daily task list with priorities
- ✅ Task completion tracking
- 📊 Performance metrics
- 📞 Emergency contact information



### 🗂️ Test Data

The system includes seeding scripts for development and testing:

```bash
# Seed test users
node scripts/seedUsers.js

# Seed billing data  
node scripts/seedChallans.js

# Verify business logic
node scripts/verifyRefinedLogic.js
```

---

## 🚀 Deployment

### 🌐 Environment Preparation

#### Production Environment Variables

**Backend (.env.production):**
```env
MONGODB_URI=mongodb+srv://production-user:password@cluster.mongodb.net/nhms-prod
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-domain.com
```

**Frontend (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
```

---

## 🤝 Contributing

We welcome contributions to improve NHMS! Please follow these guidelines:

### 🔧 Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/nhms.git
   cd nhms
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. **Make your changes**
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Update documentation if needed

5. **Test your changes**
   ```bash
   # Backend tests
   cd backend && npm run test:logic
   
   # Frontend checks
   cd frontend && npm run type-check && npm run lint
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Describe your changes clearly
   - Link any related issues
   - Add screenshots for UI changes

### 📝 Code Style Guidelines

#### Backend (JavaScript/Node.js)
```javascript
// Use camelCase for variables and functions
const getUserById = async (userId) => {
  try {
    // Always handle errors appropriately
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Use meaningful names and JSDoc comments
/**
 * Creates a new hostel with room allocation
 * @param {Object} hostelData - Hostel information
 * @param {string} hostelData.name - Hostel name
 * @param {number} hostelData.totalRooms - Total number of rooms
 * @returns {Promise<Object>} Created hostel object
 */
```


### 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment details**
   - OS and version
   - Node.js version  
   - Browser (for frontend issues)

2. **Steps to reproduce**
   - Detailed step-by-step instructions
   - Expected vs actual behavior

3. **Error messages**
   - Full error stack traces
   - Console logs
   - Screenshots if applicable

4. **Context**
   - User role when error occurred
   - Relevant data or configurations

📧 Contact

- **Project Maintainer**: Zainab Raza Malik
- **Institution**: National University of Science and Technology (NUST)
- **Email**: [zainabraza1960@gmail.com]
- **GitHub**: [zainabraza06]

---

<div align="center">
  <p>Made with ❤️ for NUST Community</p>
  <p>
    <a href="#-table-of-contents">Back to Top</a> •
    <a href="https://github.com/your-repo/issues">Report Bug</a> •
    <a href="https://github.com/your-repo/issues">Request Feature</a>
  </p>
</div>


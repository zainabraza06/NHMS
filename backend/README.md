# NUST Hostel Management System - MERN Backend

A Node.js/Express backend for the NUST Hostel Management System using MongoDB, built with a RESTful API architecture.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Support for three roles - Hostelites, Cleaning Staff, and Hostel Managers
- **Request Management**: Leave requests, Cleaning requests, and Mess-off requests
- **Email Notifications**: Automated email notifications for various events
- **Dashboard Analytics**: Role-specific dashboards with key metrics
- **MongoDB Integration**: Mongoose ODM with discriminator patterns for inheritance
- **Error Handling**: Centralized error handling middleware
- **Validation**: Input validation for all API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet, CORS

## Project Structure

```
backend/
├── config/
│   ├── env.js              # Environment configuration
│   └── database.js         # MongoDB connection
├── models/
│   ├── User.js             # Base User model
│   ├── Hostelite.js        # Hostelite (extends User)
│   ├── CleaningStaff.js    # Staff (extends User)
│   ├── HostelManager.js    # Manager (extends User)
│   ├── Hostel.js           # Hostel model
│   ├── Request.js          # Base Request model
│   ├── LeaveRequest.js     # Leave Request (extends Request)
│   ├── CleaningRequest.js  # Cleaning Request (extends Request)
│   └── MessOffRequest.js   # Mess Off Request (extends Request)
├── controllers/
│   ├── authController.js              # Auth logic
│   ├── hosteliteController.js         # Hostelite endpoints
│   ├── cleaningStaffController.js     # Staff endpoints
│   ├── managerController.js           # Manager endpoints
│   └── requestController.js           # Request management
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── hosteliteRoutes.js  # Hostelite endpoints
│   ├── staffRoutes.js      # Staff endpoints
│   ├── managerRoutes.js    # Manager endpoints
│   └── requestRoutes.js    # Request endpoints
├── middleware/
│   ├── auth.js             # Authentication & Authorization
│   └── errorHandler.js     # Error handling
├── utils/
│   ├── emailService.js     # Email sending utilities
│   ├── tokenUtils.js       # JWT & Token utilities
│   └── validators.js       # Input validation utilities
└── server.js               # Main application file
```

## Installation

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Steps

1. **Clone the repository** (if applicable)
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
Copy `.env.example` to `.env` and configure:
```env
MONGODB_URI=mongodb://localhost:27017/hostel_management_system
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
BASE_URL=http://localhost:5000
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify-email?token=...` - Verify email
- `POST /api/auth/login` - Login user
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Hostelites
- `GET /api/hostelites/dashboard` - Hostelite dashboard
- `GET /api/hostelites/profile` - Get profile
- `PUT /api/hostelites/profile` - Update profile
- `GET /api/hostelites/requests` - Get hostelite's requests
- `GET /api/hostelites/all` - Get all hostelites (Manager only)

### Requests
- `POST /api/requests/leave` - Submit leave request
- `POST /api/requests/cleaning` - Submit cleaning request
- `POST /api/requests/mess-off` - Submit mess-off request
- `GET /api/requests/my-requests` - Get my requests
- `GET /api/requests/stats` - Get request statistics
- `PUT /api/requests/:requestId/cancel` - Cancel request

### Cleaning Staff
- `GET /api/staff/dashboard` - Staff dashboard
- `GET /api/staff/profile` - Get profile
- `PUT /api/staff/profile` - Update profile
- `GET /api/staff/requests` - Get assigned requests
- `PUT /api/staff/requests/:requestId` - Update request status

### Managers
- `GET /api/manager/dashboard` - Manager dashboard
- `GET /api/manager/profile` - Get profile
- `PUT /api/manager/profile` - Update profile
- `GET /api/manager/requests` - Get all requests
- `PUT /api/manager/requests/:requestId/approve` - Approve request
- `PUT /api/manager/requests/:requestId/reject` - Reject request
- `GET /api/manager/hostelites` - Get hostelites
- `GET /api/manager/staff` - Get staff

## Database Models

### User Model
Base model with discriminators for different user types:
- `firstName`, `lastName`, `email`, `phoneNumber`
- `role` (enum: HOSTEL_MANAGER, CLEANING_STAFF, HOSTELITE)
- `active`, `isEmailVerified`
- Password and token management fields

### Hostelite Model
Extends User with:
- `universityId`, `department`, `academicYear`
- `roomNumber`, `admissionDate`, `validUpto`
- `hostel` (reference to Hostel)
- `requests` (array of Request references)

### CleaningStaff Model
Extends User with:
- `staffId`, `joinDate`, `shiftTiming`
- `assignedHostels`, `assignedFloors`
- `cleaningRequests`

### HostelManager Model
Extends User with:
- `managerId`, `hostel`, `joinDate`

### Request Model
Base model with discriminators:
- `requestType` (enum: LEAVE_REQUEST, CLEANING_REQUEST, MESS_OFF_REQUEST)
- `hostelite` (reference)
- `status` (enum: PENDING, APPROVED, REJECTED, CANCELLED)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/hostel_db` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `SMTP_HOST` | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | Email SMTP port | `587` |
| `SMTP_EMAIL` | Email sender | `your_email@gmail.com` |
| `SMTP_PASSWORD` | Email password | `app_password` |
| `BASE_URL` | Application base URL | `http://localhost:5000` |
| `VERIFICATION_TOKEN_EXPIRY` | Email verification token life | `24h` |

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Role-Based Access Control

- **HOSTELITE**: Can submit requests, view profile, dashboard
- **CLEANING_STAFF**: Can view assigned tasks, update status
- **HOSTEL_MANAGER**: Can approve/reject requests, manage hostel

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "Error description",
  "error": {}
}
```

Status codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Email Configuration (Gmail)

1. Enable 2-factor authentication on Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password as `SMTP_PASSWORD` in `.env`

## Running Tests

```bash
npm test
```

## Development

### Watch mode
```bash
npm run dev
```

### Production build
```bash
npm start
```

## Migration from Spring Boot

The backend has been completely converted from Spring Boot (Java) to Node.js/Express (JavaScript) with MongoDB. Key differences:

| Spring Boot | Node.js/Express |
|-------------|-----------------|
| JPA Entities | Mongoose Schemas |
| MySQL | MongoDB |
| Spring Security | JWT with custom middleware |
| Spring Mail | Nodemailer |
| @Autowired | require/import |
| Annotations | Plain objects |

## Future Enhancements

- [ ] WebSocket support for real-time notifications
- [ ] File upload for documents
- [ ] Advanced reporting and analytics
- [ ] Hostel fee management
- [ ] Attendance tracking
- [ ] Integration with external systems

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### Email Not Sending
- Verify SMTP credentials
- Check Gmail App Password
- Ensure "Less secure app access" is enabled (if not using App Password)

### JWT Token Errors
- Ensure `JWT_SECRET` is set
- Check token expiration in Authorization header

## License

ISC

## Support

For issues and questions, contact the development team.

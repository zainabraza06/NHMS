# 🏛️ NUST Hostel Management System (NHMS) - MERN Stack

A comprehensive hostel management application built with **MERN** (MongoDB, Express.js, React, Node.js) featuring role-based access control and modern web technologies.

## 📋 Project Overview

NHMS is designed to streamline hostel operations with three key user roles:

- **👨‍🎓 Hostelites (Students)**: Manage profiles, submit requests (leave, cleaning, mess-off)
- **🧹 Cleaning Staff**: Manage assigned tasks and hostel floors
- **👔 Hostel Managers**: Oversee all hostelites, staff, and requests

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js 16+
- **Server**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcryptjs
- **Email**: Nodemailer with SMTP
- **Validation**: Custom validators

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.3.6
- **State**: React Context API
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom components

## 📂 Project Structure

```
Nust_Hostel_Management_System/
│
├── backend/
│   ├── config/
│   │   ├── env.js                 # Configuration management
│   │   └── database.js            # MongoDB connection
│   ├── controllers/               # Request handlers
│   ├── models/                    # Mongoose schemas
│   ├── routes/                    # API routes
│   ├── middleware/                # Auth & error handling
│   ├── utils/                     # Email, tokens, validators
│   ├── server.js                  # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                   # Next.js pages & routes
│   │   ├── components/            # Reusable components
│   │   ├── services/              # API calls
│   │   ├── context/               # State management
│   │   ├── hooks/                 # Custom hooks
│   │   ├── types/                 # TypeScript definitions
│   │   └── utils/                 # Helpers & constants
│   ├── package.json
│   └── tsconfig.json
│
└── 📚 DOCUMENTATION
    ├── README.md (this file)
    ├── SETUP_GUIDE.md
    ├── QUICK_REFERENCE.md
    ├── TYPE_FIXES_SUMMARY.md
    └── MONGODB_ATLAS_SETUP.md
```

## 🎯 Features

### For Hostelites
✅ User Registration & Email Verification
✅ Profile Management (Personal & Academic Info)
✅ Submit Requests (Leave, Cleaning, Mess-Off)
✅ Track Request Status in Real-time
✅ View Request History
✅ Responsive Dashboard
✅ Password Reset & Change

### For Cleaning Staff
✅ View Assigned Tasks
✅ Update Task Status
✅ Track Assigned Hostels/Floors
✅ Profile Management

### For Hostel Managers
✅ Dashboard with Statistics
✅ Manage All Hostelites
✅ Manage Cleaning Staff
✅ Review & Manage All Requests
✅ Assign Staff to Tasks

### Security Features
🔒 JWT Authentication
🔒 Password Hashing (bcryptjs)
🔒 Email Verification
🔒 Password Reset Token
🔒 Role-Based Access Control
🔒 Input Validation
🔒 CORS Protection

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ & npm
- MongoDB (local or Atlas account)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI and Gmail credentials
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

## 🔐 MongoDB Configuration

### Option A: MongoDB Atlas (Cloud)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster and user
3. Update `.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nhms?retryWrites=true&w=majority
```

### Option B: Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/nhms
```

See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) for detailed instructions.

## 📧 Email Configuration

Set up Gmail SMTP:
1. Enable 2-Step Verification: https://support.google.com/accounts/answer/185833
2. Create App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
```
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=16-character-app-password
```

## 📡 Key API Endpoints

### Authentication
```
POST   /api/auth/register              - Register user
POST   /api/auth/login                 - Login user
GET    /api/auth/verify-email          - Verify email
POST   /api/auth/password-reset-request
POST   /api/auth/reset-password        - Reset password
```

### Hostelite
```
GET    /api/hostelites/profile         - Get profile
PUT    /api/hostelites/profile         - Update profile
GET    /api/hostelites/dashboard       - Get dashboard
POST   /api/hostelites/requests        - Create request
GET    /api/hostelites/requests        - Get requests
```

### Staff
```
GET    /api/staff/profile              - Get profile
GET    /api/staff/dashboard            - Get dashboard
GET    /api/staff/requests             - Get tasks
```

### Manager
```
GET    /api/managers/profile           - Get profile
GET    /api/managers/dashboard         - Get statistics
GET    /api/managers/requests          - All requests
GET    /api/managers/hostelites        - All students
GET    /api/managers/staff             - All staff
```

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup & deployment
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Developer quick reference
- **[MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)** - Database setup
- **[TYPE_FIXES_SUMMARY.md](./TYPE_FIXES_SUMMARY.md)** - TypeScript types

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| DB connection fails | Check MongoDB running, verify URI |
| CORS errors | Check FRONTEND_URL in `.env` |
| Port in use | `npx kill-port 5000` or `npx kill-port 3000` |
| TypeScript errors | Run `npm run build` in frontend |
| Email not working | Verify Gmail app password |

## 🛠️ Development

### Terminal 1 - Backend
```bash
cd backend && npm start
```

### Terminal 2 - Frontend
```bash
cd frontend && npm run dev
```

## ✅ Status

- [x] Backend API (36 endpoints)
- [x] Frontend UI (14 pages)
- [x] Authentication system
- [x] Type safety (TypeScript strict)
- [x] MongoDB Atlas support
- [x] Email functionality
- [x] Full documentation

**Status**: ✅ Production Ready

---

**Version**: 1.0.0 | **Last Updated**: 2024

| Layer       | Technology              |
|-------------|--------------------------|
| Backend     | Java, Spring Boot, Spring Security |
| Database    | MySQL, Hibernate, JPA    |
| Frontend    | HTML, CSS, JavaScript    |
| Tools       | Maven, Git, Postman      |

---

## 📂 Project Structure

```

HMS/
├── src/
│   ├── main/
│   │   ├── java/com/hostelmanagement/
│   │   │   ├── controller/       # Request handling (Hostelite, Manager, Staff)
│   │   │   ├── service/          # Business logic (mess off validation, assignment)
│   │   │   ├── repository/       # JPA interfaces
│   │   │   ├── model/ (entity/)  # JPA entities (User, Request, Staff)
│   │   │   └── security/         # Spring Security config
│   │   └── resources/
│   │       ├── templates/        # HTML pages
│   │       ├── static/           # CSS, JS
│   │       └── application.properties # DB config
├── pom.xml                        # Project dependencies

````

---

## 🧪 Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/zainabraza06/Nust_Hostel_Management_System.git
   cd hostel-management-system
````

2. **Configure MySQL Database**

   * Create a database named `hms_db`
   * Update `src/main/resources/application.properties` with your DB credentials

3. **Run the Project**

   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access the App**

   * Visit `http://localhost:8080`
   * Use seeded users 

---

## 📚 Learning Outcomes

* Role-based access with Spring Security
* Enforcing real-world business logic in service layer
* Clean MVC architecture in Spring Boot
* Seamless front-back integration
* Team collaboration using Git and GitHub

---

## ⚠️ Known Issues / Future Improvements

* Add notifications for request status changes
* Auto-bill generation
* Adding other types of requests
* Implement analytics dashboard for manager


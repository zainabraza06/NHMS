# Quick Reference Card

## 🚀 Getting Started (5 minutes)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Gmail credentials
npm start
# Should see: ✅ Database connected successfully
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

## 🔐 MongoDB Atlas Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/nhms?retryWrites=true&w=majority
```

Replace:
- `username` → your Atlas database user
- `password` → your database user password
- `cluster` → your cluster name (e.g., cluster0)

## 📧 Gmail App Password Setup
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification first
3. Create password for "Mail"
4. Copy 16-character password to `.env`

## 🔗 Port Configuration
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api

## 👥 User Roles & Permissions

| Role | Features | Routes |
|------|----------|--------|
| **Hostelite** | View profile, Submit requests, Track status | `/hostelite/*` |
| **Staff** | View tasks, Update status, Manage assignments | `/staff/*` |
| **Manager** | Manage all users, View statistics, Assign staff | `/manager/*` |

## 📝 API Endpoints Overview

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
PUT    /api/hostelites/requests/:id    - Update request
DELETE /api/hostelites/requests/:id    - Cancel request
```

### Staff
```
GET    /api/staff/profile              - Get profile
GET    /api/staff/dashboard            - Get dashboard
GET    /api/staff/requests             - Get assigned tasks
```

### Manager
```
GET    /api/managers/profile           - Get profile
GET    /api/managers/dashboard         - Get statistics
GET    /api/managers/requests          - All requests
GET    /api/managers/hostelites        - All students
GET    /api/managers/staff             - All staff
```

## 🛠️ Development Commands

### Backend
```bash
npm start              # Start server
npm run dev           # Start with nodemon (auto-reload)
npm test              # Run tests
```

### Frontend
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm start             # Start production build
npm run lint          # Check code quality
```

## 🐛 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Port 5000 in use | `npx kill-port 5000` |
| Port 3000 in use | `npx kill-port 3000` |
| DB connection fails | Check MongoDB is running, verify connection string |
| TypeScript errors | Run `npm run build` in frontend to see all errors |
| CORS errors | Check `FRONTEND_URL` in backend `.env` |
| Email not sending | Verify Gmail app password (16 chars), check SMTP settings |
| API returns 401 | Token expired or invalid, user needs to re-login |

## 📂 Key Files & Directories

```
Backend
├── server.js                    → Entry point
├── config/
│   ├── env.js                  → Configuration
│   └── database.js             → MongoDB connection
├── controllers/                → Request handlers
├── models/                     → Database schemas
├── routes/                     → API routes
├── middleware/                 → Auth, errors
└── utils/                      → Helpers

Frontend
├── src/
│   ├── app/                    → Pages & routes
│   ├── components/             → Reusable components
│   ├── services/               → API calls
│   ├── types/                  → TypeScript definitions
│   ├── hooks/                  → Custom React hooks
│   └── utils/                  → Helpers
├── public/                     → Static files
└── tsconfig.json              → TypeScript config
```

## 🔑 Environment Variables

### Backend `.env`
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nhms
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=app-password
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

## 📚 Important Type Patterns

```typescript
// API Response (all services return this)
interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// User Types (flexible ID support)
interface User {
  _id?: string;      // MongoDB ID
  id?: string;       // REST API ID
  email: string;
  role: 'HOSTELITE' | 'CLEANING_STAFF' | 'HOSTEL_MANAGER';
}

// Flexible Field Types
hostel?: string | Hostel    // Can be ID or full object
academicYear?: string        // Always string
```

## ✨ Code Examples

### Fetch User Profile (Service)
```typescript
async getHosteliteProfile(): Promise<ApiResponse<Hostelite>> {
  const response = await apiClient.get(API_ENDPOINTS.HOSTELITES_PROFILE);
  return response.data;
}
```

### Use Profile in Component
```typescript
const response = await userService.getHosteliteProfile();
if (response.success && response.data) {
  const profile: UserProfile = {
    id: response.data._id || response.data.id || '',
    academicYear: String(response.data.academicYear),
    // ... other fields
  };
  setProfile(profile);
}
```

### Login Request
```typescript
const response = await authService.login({
  email: 'user@example.com',
  password: 'password'
});
if (response.token) {
  localStorage.setItem('token', response.token);
}
```

## 🎯 Daily Development Workflow

1. **Start Backend**
   ```bash
   cd backend && npm start
   ```

2. **Start Frontend**
   ```bash
   cd frontend && npm run dev
   ```

3. **Open Browser**
   ```
   http://localhost:3000
   ```

4. **Make Changes**
   - Backend: Changes require server restart
   - Frontend: Auto-reloads on save

5. **Check Types**
   ```bash
   cd frontend && npm run build
   ```

## 🚀 Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Change `NODE_ENV` to `production`
- [ ] Set strong `JWT_SECRET`
- [ ] Configure MongoDB Atlas cluster
- [ ] Add server IP to Atlas IP whitelist
- [ ] Test database connection
- [ ] Verify all email settings
- [ ] Run TypeScript check: `npm run build`
- [ ] Build frontend: `npm run build`
- [ ] Test production build: `npm start`

## 📞 Getting Help

- **Setup Issues:** See `SETUP_GUIDE.md`
- **Database Issues:** See `MONGODB_ATLAS_SETUP.md`
- **Type Issues:** Check `frontend/src/types/index.ts`
- **API Issues:** Check backend routes and controllers
- **Frontend Issues:** Check browser console (F12)

---

**Version:** 1.0.0 | **Last Updated:** 2024

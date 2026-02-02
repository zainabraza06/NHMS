# NUST Hostel Management System - Next.js Frontend

Modern React-based frontend for the Hostel Management System using Next.js 14 with TypeScript.

## Features

- **Authentication** - Login/Register with email verification
- **Role-Based UI** - Different interfaces for Hostelites, Staff, and Managers
- **Request Management** - Submit and track Leave, Cleaning, and Mess-off requests
- **Dashboards** - Role-specific analytics and statistics
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Type Safety** - Full TypeScript support
- **API Integration** - Connected to Node.js/Express backend

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Authentication**: Custom JWT + Context API

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── hostelite/
│   │   │   ├── staff/
│   │   │   └── manager/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── common/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── requestService.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── api-client.ts
│       └── constants.ts
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Create environment file**
```bash
cp .env.example .env.local
```

3. **Configure backend URL**
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |

## API Integration

The frontend connects to the Node.js/Express backend via REST API.

### Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all API requests via Authorization header
5. Protected routes check authentication

### API Client Setup

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Pages & Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes

#### Hostelite Routes
- `/hostelite/dashboard` - Student dashboard
- `/hostelite/profile` - Student profile
- `/hostelite/requests` - My requests
- `/hostelite/requests/leave` - Submit leave request
- `/hostelite/requests/cleaning` - Submit cleaning request
- `/hostelite/requests/mess-off` - Submit mess-off request

#### Staff Routes
- `/staff/dashboard` - Staff dashboard
- `/staff/profile` - Staff profile
- `/staff/tasks` - Assigned tasks
- `/staff/tasks/:id` - Task details

#### Manager Routes
- `/manager/dashboard` - Manager dashboard
- `/manager/profile` - Manager profile
- `/manager/requests` - All requests
- `/manager/hostelites` - Hostelites list
- `/manager/staff` - Staff list

## Components

### Auth Components
- `LoginForm` - Login page form
- `RegisterForm` - Registration page form
- `ProtectedRoute` - Route protection wrapper

### Dashboard Components
- `DashboardHeader` - Dashboard top bar
- `Sidebar` - Navigation sidebar
- `StatsCard` - Statistics card
- `RequestCard` - Request display card
- `StatusBadge` - Status indicator

### Form Components
- `LeaveRequestForm` - Leave request submission
- `CleaningRequestForm` - Cleaning request submission
- `MessOffRequestForm` - Mess-off request submission
- `ProfileForm` - Profile update form

### Common Components
- `Button` - Reusable button
- `Input` - Reusable input field
- `Modal` - Modal dialog
- `Loading` - Loading spinner
- `Toast` - Toast notifications

## Hooks

### useAuth
```typescript
const { user, token, login, logout, isLoading } = useAuth()
```

Provides authentication state and methods.

## Types

All TypeScript types defined in `src/types/index.ts`:

```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'HOSTELITE' | 'CLEANING_STAFF' | 'HOSTEL_MANAGER'
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

interface LeaveRequest {
  id: string
  startDate: string
  endDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdAt: string
}
```

## Form Validation

Forms use React Hook Form with Zod validation:

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof schema>

const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

## State Management

Uses Zustand for global state:

```typescript
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

## Error Handling

Centralized error handling:

```typescript
try {
  await api.post('/auth/login', credentials)
} catch (error) {
  if (error.response?.status === 401) {
    // Show unauthorized error
  }
}
```

## Styling

Tailwind CSS for all styling. Custom colors configured in `tailwind.config.js`.

## Building for Production

```bash
npm run build
npm start
```

## Testing

```bash
npm test
```

## Troubleshooting

### API Connection Error
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Authentication Issues
- Clear browser localStorage and cookies
- Check JWT token expiration
- Verify backend is running

### Build Errors
- Run `npm run type-check` to check TypeScript
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment-Specific Configuration

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Performance

- Image optimization with Next.js Image
- Automatic code splitting
- API route caching
- Middleware for route protection

## Security

- JWT tokens in localStorage
- CORS configuration on backend
- Environment variables for sensitive data
- Password validation on frontend

## Future Enhancements

- [ ] Dark mode theme
- [ ] Real-time notifications (WebSocket)
- [ ] File uploads for documents
- [ ] Advanced filtering and search
- [ ] Export reports to PDF
- [ ] Mobile app version
- [ ] Email integration tests
- [ ] Performance monitoring

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Axios Documentation](https://axios-http.com)

## Support

For issues, check the backend README or contact the development team.

## License

ISC

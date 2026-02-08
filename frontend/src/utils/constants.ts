export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_VERIFY_EMAIL: '/auth/verify-email',
  AUTH_REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  AUTH_CHANGE_PASSWORD: '/auth/change-password',

  // Hostelites
  HOSTELITES_DASHBOARD: '/hostelites/dashboard',
  HOSTELITES_PROFILE: '/hostelites/profile',
  HOSTELITES_ALL: '/hostelites/all',

  // Billing
  BILLING_MY: '/billing/my-challans',
  BILLING_PAY: '/billing/pay',
  BILLING_CONFIRM: '/billing/confirm',
  BILLING_GENERATE: '/billing/generate-monthly',
  BILLING_ALL: '/billing/all',
  BILLING_HOSTEL: '/billing/hostel',

  // Requests
  REQUESTS_LEAVE: '/requests/leave',
  REQUESTS_CLEANING: '/requests/cleaning',
  REQUESTS_MESS_OFF: '/requests/mess-off',
  REQUESTS_MY_REQUESTS: '/requests/my-requests',
  REQUESTS_STATS: '/requests/stats',

  // Staff
  STAFF_DASHBOARD: '/staff/dashboard',
  STAFF_PROFILE: '/staff/profile',
  STAFF_REQUESTS: '/staff/requests',

  // Manager
  MANAGER_DASHBOARD: '/manager/dashboard',
  MANAGER_PROFILE: '/manager/profile',
  MANAGER_REQUESTS: '/manager/requests',
  MANAGER_HOSTELITES: '/manager/hostelites',
  MANAGER_STAFF: '/manager/staff',

  // Complaints
  COMPLAINTS_BASE: '/complaints',
  COMPLAINTS_MY: '/complaints/my',
  COMPLAINTS_ALL: '/complaints/all',
  COMPLAINTS_RESOLVE: (id: string) => `/complaints/${id}/resolve`,

  // Admin
  ADMIN_STATS: '/admin/stats',
  ADMIN_COMPLAINTS: '/admin/complaints',
  ADMIN_REQUESTS: '/admin/requests',
  ADMIN_HOSTELS: '/admin/hostels',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  HOSTELITE: 'HOSTELITE',
  CLEANING_STAFF: 'CLEANING_STAFF',
  HOSTEL_MANAGER: 'HOSTEL_MANAGER',
};

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
};

export const CLEANING_TYPES = {
  ROUTINE: 'ROUTINE',
  DEEP_CLEANING: 'DEEP_CLEANING',
  EMERGENCY: 'EMERGENCY',
};

export const PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const SHIFT_TIMINGS = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  NIGHT: 'NIGHT',
};

export type UserRole = 'HOSTELITE' | 'CLEANING_STAFF' | 'HOSTEL_MANAGER';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type RequestType = 'LEAVE_REQUEST' | 'CLEANING_REQUEST' | 'MESS_OFF_REQUEST';
export type CleaningType = 'ROUTINE' | 'DEEP_CLEANING' | 'EMERGENCY';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// User Types
export interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  active?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hostelite extends User {
  universityId: string;
  department: string;
  academicYear: string;
  roomNumber: string;
  admissionDate?: string;
  validUpto?: string;
  hostel?: string | Hostel;
  _id?: string;
}

export interface CleaningStaff extends User {
  staffId?: string;
  assignedHostels?: (string | Hostel)[];
  assignedFloors?: string[];
  salary?: number;
  joinDate?: string;
  shiftTiming?: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}

export interface HostelManager extends User {
  managerId?: string;
  hostel?: string | Hostel;
  joinDate?: string;
}

// Hostel Type
export interface Hostel {
  id: string;
  name: string;
  hostelCode: string;
  location: string;
  totalRooms: number;
  totalFloors: number;
  occupiedRooms: number;
  manager: HostelManager;
  messStatus: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  messCharges: number;
  description?: string;
  facilities: string[];
}

// Request Types
export interface BaseRequest {
  id: string;
  requestType: RequestType;
  hostelite: Hostelite;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest extends BaseRequest {
  requestType: 'LEAVE_REQUEST';
  startDate: string;
  endDate: string;
  reason: string;
  duration: number;
  parentContact?: string;
}

export interface CleaningRequest extends BaseRequest {
  requestType: 'CLEANING_REQUEST';
  roomNumber: string;
  floor: string;
  cleaningType: CleaningType;
  priority: Priority;
  preferredDate?: string;
  assignedStaff?: CleaningStaff;
  completionDate?: string;
  notes?: string;
}

export interface MessOffRequest extends BaseRequest {
  requestType: 'MESS_OFF_REQUEST';
  startDate: string;
  endDate: string;
  reason?: string;
  refundAmount?: number;
  mealCount?: number;
}

export type Request = LeaveRequest | CleaningRequest | MessOffRequest;

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  // Hostelite specific
  universityId?: string;
  department?: string;
  academicYear?: string;
  roomNumber?: string;
  hostel?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean;
  message: string;
  data?: T;
  error?: string;
  token?: string;
  user?: User;
  userId?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AuthResponse extends ApiResponse<User> {
  token?: string;
}

export interface AuthActionResult {
  success: boolean;
  error?: string;
  data?: any;
  user?: User;
}

// Request Form Types
export interface LeaveRequestForm {
  startDate: string;
  endDate: string;
  reason: string;
  parentContact?: string;
}

export interface CleaningRequestForm {
  preferredDate: string;
  roomNumber: string;
  floor: string;
  cleaningType: CleaningType;
  priority: Priority;
  notes?: string;
}

export interface MessOffRequestForm {
  startDate: string;
  endDate: string;
  reason?: string;
  mealCount?: number;
}

// Dashboard Stats
export interface DashboardStats {
  total?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
  cancelled?: number;
  totalHostelites?: number;
  totalStaff?: number;
  occupancyRate?: string;
  pendingRequests?: number;
}

// Auth Context
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthActionResult>;
  register: (data: RegisterData) => Promise<AuthActionResult>;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  clearError: () => void;
}

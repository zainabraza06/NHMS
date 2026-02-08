import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  LeaveRequestForm,
  CleaningRequestForm,
  MessOffRequestForm,
  Request,
  ApiResponse,
  DashboardStats,
  Complaint,
  ComplaintForm,
} from '@/types';

export const requestService = {
  async submitLeaveRequest(data: LeaveRequestForm): Promise<ApiResponse<Request>> {
    const response = await apiClient.post<ApiResponse<Request>>(
      API_ENDPOINTS.REQUESTS_LEAVE,
      data
    );
    return response.data;
  },

  async submitCleaningRequest(data: CleaningRequestForm): Promise<ApiResponse<Request>> {
    const response = await apiClient.post<ApiResponse<Request>>(
      API_ENDPOINTS.REQUESTS_CLEANING,
      data
    );
    return response.data;
  },

  async submitMessOffRequest(data: MessOffRequestForm): Promise<ApiResponse<Request>> {
    const response = await apiClient.post<ApiResponse<Request>>(
      API_ENDPOINTS.REQUESTS_MESS_OFF,
      data
    );
    return response.data;
  },

  async getMyRequests(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<ApiResponse<Request[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await apiClient.get<ApiResponse<Request[]>>(
      `${API_ENDPOINTS.REQUESTS_MY_REQUESTS}?${params}`
    );
    return response.data;
  },

  async getRequestStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS.REQUESTS_STATS
    );
    return response.data;
  },

  async cancelRequest(requestId: string): Promise<ApiResponse<Request>> {
    const response = await apiClient.put<ApiResponse<Request>>(
      `/requests/${requestId}/cancel`
    );
    return response.data;
  },

  async approveRequest(requestId: string): Promise<ApiResponse<Request>> {
    const response = await apiClient.put<ApiResponse<Request>>(
      `/manager/requests/${requestId}/approve`
    );
    return response.data;
  },

  async rejectRequest(
    requestId: string,
    reason?: string
  ): Promise<ApiResponse<Request>> {
    const response = await apiClient.put<ApiResponse<Request>>(
      `/manager/requests/${requestId}/reject`,
      { reason }
    );
    return response.data;
  },

  async getManagerRequests(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<ApiResponse<Request[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await apiClient.get<ApiResponse<Request[]>>(
      `${API_ENDPOINTS.MANAGER_REQUESTS}?${params}`
    );
    return response.data;
  },

  async updateCleaningRequestStatus(
    requestId: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<Request>> {
    const response = await apiClient.put<ApiResponse<Request>>(
      `/staff/requests/${requestId}`,
      { status, notes }
    );
    return response.data;
  },
};

export const complaintService = {
  async submitComplaint(data: ComplaintForm): Promise<ApiResponse<Complaint>> {
    const response = await apiClient.post<ApiResponse<Complaint>>(
      API_ENDPOINTS.COMPLAINTS_BASE,
      data
    );
    return response.data;
  },

  async getMyComplaints(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Complaint[]>> {
    const response = await apiClient.get<ApiResponse<Complaint[]>>(
      `${API_ENDPOINTS.COMPLAINTS_MY}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async getAllComplaints(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Complaint[]>> {
    const response = await apiClient.get<ApiResponse<Complaint[]>>(
      `${API_ENDPOINTS.COMPLAINTS_ALL}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async resolveComplaint(
    complaintId: string,
    data: { status: string; managerComments: string }
  ): Promise<ApiResponse<Complaint>> {
    const response = await apiClient.patch<ApiResponse<Complaint>>(
      API_ENDPOINTS.COMPLAINTS_RESOLVE(complaintId),
      data
    );
    return response.data;
  },
};

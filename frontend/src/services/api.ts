import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  LeaveRequestForm,
  CleaningRequestForm,
  MessOffRequestForm,
  Request,
  ApiResponse,
  DashboardStats,
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

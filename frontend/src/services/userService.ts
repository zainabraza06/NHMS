import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  Hostelite,
  CleaningStaff,
  HostelManager,
  ApiResponse,
  DashboardStats,
} from '@/types';

export const userService = {
  async getHosteliteDashboard(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.HOSTELITES_DASHBOARD
    );
    return response.data;
  },

  async getHosteliteProfile(): Promise<ApiResponse<Hostelite>> {
    const response = await apiClient.get<ApiResponse<Hostelite>>(
      API_ENDPOINTS.HOSTELITES_PROFILE
    );
    return response.data;
  },

  async updateHosteliteProfile(data: Partial<Hostelite>): Promise<ApiResponse<Hostelite>> {
    const response = await apiClient.put<ApiResponse<Hostelite>>(
      API_ENDPOINTS.HOSTELITES_PROFILE,
      data
    );
    return response.data;
  },

  async getStaffDashboard(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.STAFF_DASHBOARD
    );
    return response.data;
  },

  async getStaffProfile(): Promise<ApiResponse<CleaningStaff>> {
    const response = await apiClient.get<ApiResponse<CleaningStaff>>(
      API_ENDPOINTS.STAFF_PROFILE
    );
    return response.data;
  },

  async updateStaffProfile(data: Partial<CleaningStaff>): Promise<ApiResponse<CleaningStaff>> {
    const response = await apiClient.put<ApiResponse<CleaningStaff>>(
      API_ENDPOINTS.STAFF_PROFILE,
      data
    );
    return response.data;
  },

  async getStaffAssignedRequests(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    const response = await apiClient.get<ApiResponse<any[]>>(
      `${API_ENDPOINTS.STAFF_REQUESTS}?${params}`
    );
    return response.data;
  },

  async getManagerDashboard(): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.MANAGER_DASHBOARD
    );
    return response.data;
  },

  async getManagerProfile(): Promise<ApiResponse<HostelManager>> {
    const response = await apiClient.get<ApiResponse<HostelManager>>(
      API_ENDPOINTS.MANAGER_PROFILE
    );
    return response.data;
  },

  async updateManagerProfile(data: Partial<HostelManager>): Promise<ApiResponse<HostelManager>> {
    const response = await apiClient.put<ApiResponse<HostelManager>>(
      API_ENDPOINTS.MANAGER_PROFILE,
      data
    );
    return response.data;
  },

  async getAllHostelites(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<ApiResponse<Hostelite[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await apiClient.get<ApiResponse<Hostelite[]>>(
      `${API_ENDPOINTS.MANAGER_HOSTELITES}?${params}`
    );
    return response.data;
  },

  async getAllStaff(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<CleaningStaff[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await apiClient.get<ApiResponse<CleaningStaff[]>>(
      `${API_ENDPOINTS.MANAGER_STAFF}?${params}`
    );
    return response.data;
  },
};

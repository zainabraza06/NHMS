import { apiClient } from '@/utils/api-client';
import { Challan, ApiResponse } from '@/types';

export const billingService = {
    async getMyChallans(page: number = 1, limit: number = 10, filters: any = {}): Promise<ApiResponse<Challan[]>> {
        const cleanFilters: any = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== '') {
                cleanFilters[key] = filters[key];
            }
        });
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...cleanFilters });
        const response = await apiClient.get<ApiResponse<Challan[]>>(`/billing/my-challans?${params.toString()}`);
        return response.data;
    },

    async createPaymentIntent(challanId: string): Promise<ApiResponse<any>> {
        const response = await apiClient.post<ApiResponse<any>>('/billing/pay', { challanId });
        return response.data;
    },

    async confirmPayment(challanId: string, paymentIntentId: string): Promise<ApiResponse<Challan>> {
        const response = await apiClient.post<ApiResponse<Challan>>('/billing/confirm', {
            challanId,
            paymentIntentId,
        });
        return response.data;
    },
};

import { apiClient } from './client';
import type { ServiceRequest, ServiceRequestCreateInput } from '../types';

export const serviceApi = {
  async submitServiceRequest(data: ServiceRequestCreateInput): Promise<ServiceRequest> {
    const response = await apiClient.post<ServiceRequest>('/services/request', data);
    return response.data;
  },

  async listServiceRequests(status?: string, skip: number = 0, limit: number = 50): Promise<ServiceRequest[]> {
    const response = await apiClient.get<ServiceRequest[]>('/services/requests', {
      params: { status, skip, limit },
    });
    return response.data;
  },

  async updateServiceRequestStatus(reqId: number, status: string): Promise<ServiceRequest> {
    const response = await apiClient.patch<ServiceRequest>(`/services/requests/${reqId}`, {
      status,
    });
    return response.data;
  },
};

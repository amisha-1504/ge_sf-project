import { apiClient } from './client';
import type { ExchangeRequest, ExchangeRequestCreateInput } from '../types';

export interface ExchangeUpdateStatusInput {
  status: string;
  estimated_value?: number | null;
}

export const exchangeApi = {
  async submitExchangeRequest(data: ExchangeRequestCreateInput): Promise<ExchangeRequest> {
    const response = await apiClient.post<ExchangeRequest>('/exchanges/request', data);
    return response.data;
  },

  async listExchangeRequests(status?: string, skip: number = 0, limit: number = 50): Promise<ExchangeRequest[]> {
    const response = await apiClient.get<ExchangeRequest[]>('/exchanges/requests', {
      params: { status, skip, limit },
    });
    return response.data;
  },

  async updateExchangeRequestStatus(reqId: number, data: ExchangeUpdateStatusInput): Promise<ExchangeRequest> {
    const response = await apiClient.patch<ExchangeRequest>(`/exchanges/requests/${reqId}`, data);
    return response.data;
  },
};

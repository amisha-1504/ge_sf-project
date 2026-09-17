import { apiClient, setStoredToken, removeStoredToken } from './client';
import type { AuthToken, User } from '../types';

export const authApi = {
  async login(username: string, password: string): Promise<AuthToken> {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await apiClient.post<AuthToken>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.access_token) {
      setStoredToken(response.data.access_token);
    }
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout(): void {
    removeStoredToken();
  },
};

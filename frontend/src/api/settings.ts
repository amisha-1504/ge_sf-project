import { apiClient } from './client';

export interface ThemeModeColors {
  primary: string;
  primaryGradientEnd: string;
  accentSecondary: string;
  bgPrimary: string;
  bgCard: string;
  textPrimary: string;
}

export interface ThemeSettingsConfig {
  dark: ThemeModeColors;
  light: ThemeModeColors;
}

export interface ThemeSettingsResponse {
  key: string;
  config: ThemeSettingsConfig;
  updated_at?: string | null;
}

export const settingsApi = {
  getThemeSettings: async (): Promise<ThemeSettingsResponse> => {
    const res = await apiClient.get<ThemeSettingsResponse>('/settings/theme');
    return res.data;
  },

  updateThemeSettings: async (config: ThemeSettingsConfig): Promise<ThemeSettingsResponse> => {
    const res = await apiClient.put<ThemeSettingsResponse>('/settings/theme', config);
    return res.data;
  },

  resetThemeSettings: async (): Promise<ThemeSettingsResponse> => {
    const res = await apiClient.post<ThemeSettingsResponse>('/settings/theme/reset');
    return res.data;
  },
};

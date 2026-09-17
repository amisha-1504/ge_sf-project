import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { settingsApi, type ThemeModeColors, type ThemeSettingsConfig } from '../api/settings';

export type ThemeMode = 'dark' | 'light';

export const DEFAULT_THEME_COLORS: ThemeSettingsConfig = {
  dark: {
    primary: '#f59e0b',
    primaryGradientEnd: '#ea580c',
    accentSecondary: '#38bdf8',
    bgPrimary: '#0b0f19',
    bgCard: '#111827',
    textPrimary: '#f9fafb',
  },
  light: {
    primary: '#f59e0b',
    primaryGradientEnd: '#ea580c',
    accentSecondary: '#0284c7',
    bgPrimary: '#f8fafc',
    bgCard: '#ffffff',
    textPrimary: '#0f172a',
  },
};

export function hexToRgba(hex: string, alpha: number): string {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applyCssTheme(mode: ThemeMode, colors: ThemeModeColors) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--primary-hover', colors.primaryGradientEnd);
  root.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryGradientEnd} 100%)`);
  root.style.setProperty('--primary-glow', `0 0 25px ${hexToRgba(colors.primary, 0.25)}`);
  root.style.setProperty('--border-focus', colors.primary);
  root.style.setProperty('--border-highlight', hexToRgba(colors.primary, 0.35));

  root.style.setProperty('--accent-steel', colors.accentSecondary);
  root.style.setProperty('--accent-steel-glow', `0 0 20px ${hexToRgba(colors.accentSecondary, 0.2)}`);
  root.style.setProperty('--steel-gradient', `linear-gradient(135deg, ${colors.accentSecondary} 0%, ${colors.primary} 100%)`);

  root.style.setProperty('--bg-primary', colors.bgPrimary);
  root.style.setProperty('--bg-secondary', colors.bgCard);
  root.style.setProperty('--bg-card', mode === 'dark' ? hexToRgba(colors.bgCard, 0.8) : colors.bgCard);
  root.style.setProperty('--bg-card-hover', mode === 'dark' ? hexToRgba(colors.bgCard, 0.95) : '#f1f5f9');
  root.style.setProperty('--bg-elevated', colors.bgCard);
  root.style.setProperty('--bg-glass', mode === 'dark' ? hexToRgba(colors.bgCard, 0.65) : hexToRgba(colors.bgCard, 0.92));

  root.style.setProperty('--text-primary', colors.textPrimary);
}

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  themeColors: ThemeSettingsConfig;
  updateThemeColor: (mode: ThemeMode, key: keyof ThemeModeColors, value: string) => void;
  applyPreset: (mode: ThemeMode, preset: ThemeModeColors) => void;
  saveThemeConfig: (customConfig?: ThemeSettingsConfig) => Promise<boolean>;
  resetThemeConfig: () => Promise<void>;
  isSaving: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ge_sf_theme';
const THEME_COLORS_STORAGE_KEY = 'ge_sf_theme_colors';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'dark'; // default theme
  });

  const [themeColors, setThemeColors] = useState<ThemeSettingsConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(THEME_COLORS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.dark && parsed.light) {
            return parsed;
          }
        }
      } catch {
        // ignore parse error
      }
    }
    return DEFAULT_THEME_COLORS;
  });

  const [isSaving, setIsSaving] = useState(false);

  // Apply CSS custom properties whenever active theme or active theme colors change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
    applyCssTheme(theme, themeColors[theme]);
  }, [theme, themeColors]);

  // Fetch backend persisted theme settings on initial mount
  useEffect(() => {
    let isMounted = true;
    settingsApi.getThemeSettings()
      .then((res) => {
        if (isMounted && res.config && res.config.dark && res.config.light) {
          setThemeColors(res.config);
          try {
            localStorage.setItem(THEME_COLORS_STORAGE_KEY, JSON.stringify(res.config));
          } catch {
            // ignore storage errors
          }
        }
      })
      .catch(() => {
        // Use local cache or defaults if backend is unreachable
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  // Update a single color live on the fly
  const updateThemeColor = useCallback(
    (mode: ThemeMode, key: keyof ThemeModeColors, value: string) => {
      setThemeColors((prev) => {
        const updated = {
          ...prev,
          [mode]: {
            ...prev[mode],
            [key]: value,
          },
        };
        applyCssTheme(mode, updated[mode]);
        return updated;
      });
      setThemeState(mode);
    },
    []
  );

  // Apply an entire preset
  const applyPreset = useCallback(
    (mode: ThemeMode, preset: ThemeModeColors) => {
      setThemeColors((prev) => {
        const updated = {
          ...prev,
          [mode]: { ...preset },
        };
        applyCssTheme(mode, updated[mode]);
        return updated;
      });
      setThemeState(mode);
    },
    []
  );

  // Save current or provided config to both localStorage and backend
  const saveThemeConfig = useCallback(
    async (customConfig?: ThemeSettingsConfig): Promise<boolean> => {
      const configToSave = customConfig || themeColors;
      setIsSaving(true);
      try {
        // Persist locally
        localStorage.setItem(THEME_COLORS_STORAGE_KEY, JSON.stringify(configToSave));
        // Persist to backend API
        await settingsApi.updateThemeSettings(configToSave);
        return true;
      } catch (err) {
        console.error('Failed to persist theme settings to backend', err);
        // Even if backend fails (e.g. offline/network), local persistence worked
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [themeColors]
  );

  // Reset to default store styling
  const resetThemeConfig = useCallback(async () => {
    setIsSaving(true);
    try {
      setThemeColors(DEFAULT_THEME_COLORS);
      localStorage.setItem(THEME_COLORS_STORAGE_KEY, JSON.stringify(DEFAULT_THEME_COLORS));
      applyCssTheme(theme, DEFAULT_THEME_COLORS[theme]);
      await settingsApi.resetThemeSettings();
    } catch (err) {
      console.error('Failed to reset theme settings on backend', err);
    } finally {
      setIsSaving(false);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        themeColors,
        updateThemeColor,
        applyPreset,
        saveThemeConfig,
        resetThemeConfig,
        isSaving,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
      themeColors: DEFAULT_THEME_COLORS,
      updateThemeColor: () => {},
      applyPreset: () => {},
      saveThemeConfig: async () => false,
      resetThemeConfig: async () => {},
      isSaving: false,
    };
  }
  return context;
};

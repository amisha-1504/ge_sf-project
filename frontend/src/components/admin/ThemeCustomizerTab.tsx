import React, { useState, useEffect } from 'react';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import type { ThemeModeColors } from '../../api/settings';
import {
  Palette,
  Sun,
  Moon,
  RotateCcw,
  Save,
  Check,
  Eye,
  Sparkles,
  Sliders,
} from 'lucide-react';

interface PresetDefinition {
  name: string;
  dark: ThemeModeColors;
  light: ThemeModeColors;
  swatches: string[];
}

const PRESETS: PresetDefinition[] = [
  {
    name: 'Gold & Steel (Default)',
    swatches: ['#f59e0b', '#ea580c', '#38bdf8'],
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
  },
  {
    name: 'Emerald Oasis',
    swatches: ['#10b981', '#059669', '#34d399'],
    dark: {
      primary: '#10b981',
      primaryGradientEnd: '#059669',
      accentSecondary: '#34d399',
      bgPrimary: '#041d14',
      bgCard: '#062d20',
      textPrimary: '#f0fdf4',
    },
    light: {
      primary: '#059669',
      primaryGradientEnd: '#047857',
      accentSecondary: '#10b981',
      bgPrimary: '#f0fdf4',
      bgCard: '#ffffff',
      textPrimary: '#064e3b',
    },
  },
  {
    name: 'Royal Violet',
    swatches: ['#8b5cf6', '#6d28d9', '#ec4899'],
    dark: {
      primary: '#8b5cf6',
      primaryGradientEnd: '#6d28d9',
      accentSecondary: '#ec4899',
      bgPrimary: '#0e0b1f',
      bgCard: '#1a1438',
      textPrimary: '#faf5ff',
    },
    light: {
      primary: '#7c3aed',
      primaryGradientEnd: '#6d28d9',
      accentSecondary: '#db2777',
      bgPrimary: '#faf5ff',
      bgCard: '#ffffff',
      textPrimary: '#3b0764',
    },
  },
  {
    name: 'Ocean Breeze',
    swatches: ['#0284c7', '#0369a1', '#38bdf8'],
    dark: {
      primary: '#0284c7',
      primaryGradientEnd: '#0369a1',
      accentSecondary: '#38bdf8',
      bgPrimary: '#081325',
      bgCard: '#0f223f',
      textPrimary: '#f0f9ff',
    },
    light: {
      primary: '#0284c7',
      primaryGradientEnd: '#0369a1',
      accentSecondary: '#0ea5e9',
      bgPrimary: '#f0f9ff',
      bgCard: '#ffffff',
      textPrimary: '#0c4a6e',
    },
  },
  {
    name: 'Crimson Flame',
    swatches: ['#f43f5e', '#e11d48', '#fb923c'],
    dark: {
      primary: '#f43f5e',
      primaryGradientEnd: '#e11d48',
      accentSecondary: '#fb923c',
      bgPrimary: '#1a080d',
      bgCard: '#2b0e16',
      textPrimary: '#fff1f2',
    },
    light: {
      primary: '#e11d48',
      primaryGradientEnd: '#be123c',
      accentSecondary: '#ea580c',
      bgPrimary: '#fff1f2',
      bgCard: '#ffffff',
      textPrimary: '#881337',
    },
  },
  {
    name: 'Cyberpunk Neon',
    swatches: ['#06b6d4', '#6366f1', '#f43f5e'],
    dark: {
      primary: '#06b6d4',
      primaryGradientEnd: '#6366f1',
      accentSecondary: '#f43f5e',
      bgPrimary: '#050714',
      bgCard: '#0d132b',
      textPrimary: '#ecfeff',
    },
    light: {
      primary: '#0891b2',
      primaryGradientEnd: '#4f46e5',
      accentSecondary: '#e11d48',
      bgPrimary: '#f0fdfa',
      bgCard: '#ffffff',
      textPrimary: '#164e63',
    },
  },
];

interface ColorFieldMeta {
  key: keyof ThemeModeColors;
  label: string;
  description: string;
}

const COLOR_FIELDS: ColorFieldMeta[] = [
  {
    key: 'primary',
    label: 'Primary Brand Color',
    description: 'Main buttons, active badges, highlights, links & brand identity',
  },
  {
    key: 'primaryGradientEnd',
    label: 'Primary Gradient Finish',
    description: 'Accent blend end-color for primary buttons and hero elements',
  },
  {
    key: 'accentSecondary',
    label: 'Secondary Accent',
    description: 'Secondary callouts, toolbars, icon badges & technical tags',
  },
  {
    key: 'bgPrimary',
    label: 'Page Background Canvas',
    description: 'Base background color for the whole website body',
  },
  {
    key: 'bgCard',
    label: 'Card & Surface Surface',
    description: 'Glassmorphic product cards, admin modals & dropdown panels',
  },
  {
    key: 'textPrimary',
    label: 'Main Heading & Text',
    description: 'High-contrast typography for headings, titles and labels',
  },
];

export const ThemeCustomizerTab: React.FC = () => {
  const {
    theme,
    toggleTheme,
    setTheme,
    themeColors,
    updateThemeColor,
    applyPreset,
    saveThemeConfig,
    resetThemeConfig,
    isSaving,
  } = useTheme();

  // The mode currently selected for color editing
  const [editingMode, setEditingMode] = useState<ThemeMode>(theme);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Sync editing mode if theme is changed via navbar
  useEffect(() => {
    setEditingMode(theme);
  }, [theme]);

  const activePalette = themeColors[editingMode];

  const handleColorChange = (key: keyof ThemeModeColors, value: string) => {
    updateThemeColor(editingMode, key, value);
    setSaveSuccess(false);
  };

  const handleApplyPreset = (preset: PresetDefinition) => {
    const targetColors = preset[editingMode];
    applyPreset(editingMode, targetColors);
    setTheme(editingMode);
    setFeedbackMsg(`Applied "${preset.name}" for ${editingMode === 'dark' ? 'Dark' : 'Light'} Mode`);
    setTimeout(() => setFeedbackMsg(null), 3500);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    const ok = await saveThemeConfig();
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all theme colors back to factory defaults for both Dark and Light modes?')) {
      await resetThemeConfig();
      setSaveSuccess(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '1.75rem 2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Palette size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Dynamic Theme & Brand Color Studio</h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Pick custom brand palettes for both <strong>Dark Mode</strong> and <strong>Light Mode</strong>. Changes reflect <strong>on the fly</strong> and persist across runs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            title="Reset to factory default colors"
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', minWidth: '150px' }}
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : saveSuccess ? (
              <>
                <Check size={16} /> Saved & Published!
              </>
            ) : (
              <>
                <Save size={15} /> Save & Publish Theme
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Controls Bar */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '1.25rem 1.75rem',
        }}
      >
        {/* Editing Mode Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Editing Palette:
          </span>
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-pill)',
              padding: '3px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setEditingMode('dark');
                setTheme('dark');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: editingMode === 'dark' ? 'var(--primary)' : 'transparent',
                color: editingMode === 'dark' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Moon size={14} /> Dark Mode
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingMode('light');
                setTheme('light');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: editingMode === 'light' ? 'var(--primary)' : 'transparent',
                color: editingMode === 'light' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Sun size={14} /> Light Mode
            </button>
          </div>
        </div>

        {/* Live Site View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Eye size={14} /> Currently Viewing Site in:
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
          >
            {theme === 'dark' ? (
              <>
                <Moon size={14} color="var(--primary)" /> Dark Mode Active (Click to flip)
              </>
            ) : (
              <>
                <Sun size={14} color="var(--primary)" /> Light Mode Active (Click to flip)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Curated Presets Bar */}
      <div className="glass-card" style={{ padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '1rem', margin: 0 }}>
              1-Click Harmonious Presets for {editingMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </h4>
          </div>
          {feedbackMsg && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--primary)',
                background: 'var(--bg-primary)',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-highlight)',
              }}
            >
              <Check size={14} /> {feedbackMsg}
            </span>
          )}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
          }}
        >
          {PRESETS.map((preset) => {
            const pColors = preset[editingMode];
            const isSelected =
              activePalette.primary.toLowerCase() === pColors.primary.toLowerCase() &&
              activePalette.bgPrimary.toLowerCase() === pColors.bgPrimary.toLowerCase();
            const swatches = [
              pColors.primary,
              pColors.primaryGradientEnd,
              pColors.accentSecondary,
              pColors.bgPrimary,
            ];

            return (
              <button
                key={preset.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleApplyPreset(preset);
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  padding: '0.9rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected
                    ? (editingMode === 'dark' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.08)')
                    : 'var(--bg-primary)',
                  border: isSelected
                    ? '2px solid var(--primary)'
                    : '1px solid var(--border-subtle)',
                  boxShadow: isSelected
                    ? '0 0 16px var(--primary-glow)'
                    : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  zIndex: 1,
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {preset.name}
                  </span>
                  {isSelected && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        background: 'var(--primary)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-pill)',
                      }}
                    >
                      <Check size={11} strokeWidth={3} /> Active
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', pointerEvents: 'none' }}>
                  {swatches.map((color, i) => (
                    <span
                      key={i}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: color,
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Color Pickers Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sliders size={18} color="var(--primary)" />
          <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
            Configure {editingMode === 'dark' ? 'Dark' : 'Light'} Palette Colors
          </h4>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {COLOR_FIELDS.map((field) => {
            const currentColor = activePalette[field.key];
            return (
              <div
                key={field.key}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {field.label}
                    </strong>
                    <code
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.2rem 0.4rem',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--primary)',
                      }}
                    >
                      {currentColor}
                    </code>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    {field.description}
                  </p>
                </div>

                {/* Color Input Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Native Color Picker Swatch */}
                  <div
                    style={{
                      position: 'relative',
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '2px solid var(--border-highlight)',
                      flexShrink: 0,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        width: '64px',
                        height: '64px',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title={`Pick ${field.label}`}
                    />
                  </div>

                  {/* Direct Hex Text Input */}
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => handleColorChange(field.key, e.target.value)}
                    className="form-input"
                    placeholder="#000000"
                    maxLength={7}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Component Preview Sandbox */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Eye size={18} color="var(--primary)" />
          <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
            Live Real-Time Component Preview ({theme === 'dark' ? 'Dark Mode' : 'Light Mode'})
          </h4>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            padding: '1.5rem',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Action Buttons Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Buttons & Actions
            </span>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }}>
              Primary Brand Button
            </button>
            <button type="button" className="btn btn-secondary" style={{ width: '100%' }}>
              Secondary Steel Button
            </button>
            <button type="button" className="btn btn-outline" style={{ width: '100%' }}>
              Outline Neutral Button
            </button>
          </div>

          {/* Sample Product Card Preview */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                STEEL ALMIRAH
              </span>
              <span className="badge badge-emerald">In Stock</span>
            </div>
            <h5 style={{ fontSize: '1.05rem', margin: '0 0 0.4rem 0' }}>
              7-Lever Master Wardrobe
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
              Heavy gauge CRS steel with internal brass locking.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.1rem' }}>₹14,500</strong>
              <button type="button" className="btn btn-primary btn-sm">
                View Item
              </button>
            </div>
          </div>

          {/* Form Input & Focus Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Form Controls & Input Focus
            </span>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Customer Name</label>
              <input
                type="text"
                className="form-input"
                defaultValue="Anand Furniture Customer"
                readOnly
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Category Tag</label>
              <select className="form-select" defaultValue="steel" disabled>
                <option value="steel">Heavy Steel & Trunks</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

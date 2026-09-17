import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: showLabel ? '0.5rem' : '0',
        padding: '2px',
        width: showLabel ? 'auto' : '50px',
        height: '28px',
        borderRadius: 'var(--radius-pill)',
        background: isLight ? 'rgba(226, 232, 240, 0.9)' : 'rgba(31, 41, 55, 0.85)',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'all var(--transition-normal)',
        boxShadow: isLight ? 'inset 0 1px 2px rgba(0, 0, 0, 0.08)' : 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '0 4px',
          pointerEvents: 'none',
        }}
      >
        <Moon
          size={12}
          color={isLight ? 'var(--text-muted)' : '#38bdf8'}
          style={{
            transition: 'color var(--transition-fast)',
            opacity: isLight ? 0.35 : 1,
          }}
        />
        <Sun
          size={12}
          color={isLight ? '#f59e0b' : 'var(--text-muted)'}
          style={{
            transition: 'color var(--transition-fast)',
            opacity: isLight ? 1 : 0.35,
          }}
        />
      </div>

      {/* Sliding indicator knob */}
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: isLight ? '24px' : '2px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: isLight
            ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
            : 'linear-gradient(135deg, #1e293b, #0f172a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isLight
            ? '0 1px 4px rgba(245, 158, 11, 0.4)'
            : '0 1px 4px rgba(0, 0, 0, 0.5)',
          border: isLight ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
          transition: 'left 180ms cubic-bezier(0.4, 0, 0.2, 1), background 180ms ease',
          pointerEvents: 'none',
        }}
      >
        {isLight ? (
          <Sun size={11} color="#ffffff" />
        ) : (
          <Moon size={11} color="#38bdf8" />
        )}
      </span>

      {showLabel && (
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            paddingRight: '0.5rem',
          }}
        >
          {isLight ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

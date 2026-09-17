import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeToggle } from '../components/common/ThemeToggle';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to dark mode and allows toggling to light mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole('button', { name: /Switch to light mode/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Toggle to Light Mode
    fireEvent.click(toggleBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('ge_sf_theme')).toBe('light');

    // Toggle back to Dark Mode
    fireEvent.click(toggleBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('ge_sf_theme')).toBe('dark');
  });

  it('restores light theme from localStorage on initial render', () => {
    localStorage.setItem('ge_sf_theme', 'light');

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(screen.getByRole('button', { name: /Switch to dark mode/i })).toBeInTheDocument();
  });
});

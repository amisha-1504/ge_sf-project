import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeCustomizerTab } from '../components/admin/ThemeCustomizerTab';

describe('ThemeCustomizerTab Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  it('renders color pickers and preset options', () => {
    render(
      <ThemeProvider>
        <ThemeCustomizerTab />
      </ThemeProvider>
    );

    expect(screen.getByText('Dynamic Theme & Brand Color Studio')).toBeInTheDocument();
    expect(screen.getByText('Primary Brand Color')).toBeInTheDocument();
    expect(screen.getByText('Page Background Canvas')).toBeInTheDocument();
    expect(screen.getByText('Emerald Oasis')).toBeInTheDocument();
    expect(screen.getByText('Royal Violet')).toBeInTheDocument();
  });

  it('allows switching between Dark Mode and Light Mode editing tabs', () => {
    render(
      <ThemeProvider>
        <ThemeCustomizerTab />
      </ThemeProvider>
    );

    const lightTabBtn = screen.getByRole('button', { name: /Light Mode/i });
    fireEvent.click(lightTabBtn);

    expect(screen.getByText(/Configure Light Palette Colors/i)).toBeInTheDocument();
  });

  it('applies a preset on click', () => {
    render(
      <ThemeProvider>
        <ThemeCustomizerTab />
      </ThemeProvider>
    );

    const emeraldBtn = screen.getByText('Emerald Oasis');
    fireEvent.click(emeraldBtn);

    // Primary color code should now reflect emerald #10b981
    expect(screen.getByText(/#10b981/i)).toBeInTheDocument();
  });

  it('applies a preset on click in Light Mode', () => {
    render(
      <ThemeProvider>
        <ThemeCustomizerTab />
      </ThemeProvider>
    );

    // Switch to Light Mode tab
    const lightTabBtn = screen.getByRole('button', { name: /Light Mode/i });
    fireEvent.click(lightTabBtn);

    // Click Emerald Oasis under Light Mode presets
    const emeraldBtn = screen.getByText('Emerald Oasis');
    fireEvent.click(emeraldBtn);

    // Light primary emerald color should reflect #059669
    expect(screen.getByText(/#059669/i)).toBeInTheDocument();
    // Feedback message should display
    expect(screen.getByText(/Applied "Emerald Oasis"/i)).toBeInTheDocument();
    // Active badge should appear
    expect(screen.getAllByText(/Active/i).some(el => el.textContent?.includes('Active'))).toBe(true);
  });
});

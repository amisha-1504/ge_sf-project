import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { authApi } from '../api/auth';

vi.mock('../api/auth', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

describe('AdminLoginPage Component', () => {
  it('renders login fields and default credentials hint', () => {
    render(
      <BrowserRouter>
        <AdminLoginPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Admin Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@gesf.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Dashboard/i })).toBeInTheDocument();
  });

  it('triggers login on submit', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      access_token: 'fake-jwt-token',
      token_type: 'bearer',
    });

    render(
      <BrowserRouter>
        <AdminLoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Sign In to Dashboard/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('admin@gesf.com', 'admin123');
    });
  });
});

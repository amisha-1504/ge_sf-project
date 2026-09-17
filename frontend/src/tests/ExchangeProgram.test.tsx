import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ExchangeProgramPage } from '../pages/ExchangeProgramPage';
import { exchangeApi } from '../api/exchanges';

vi.mock('../api/exchanges', () => ({
  exchangeApi: {
    submitExchangeRequest: vi.fn(),
  },
}));

describe('ExchangeProgramPage Component', () => {
  it('renders exchange inputs and guideline calculation', () => {
    render(
      <BrowserRouter>
        <ExchangeProgramPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Your Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Number \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Item for Exchange \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Credit Value:/i)).toBeInTheDocument();
  });

  it('submits exchange request successfully', async () => {
    const mockCreated = {
      id: 55,
      customer_name: 'Pooja Sharma',
      phone_number: '9876501234',
      item_type: 'Plastic Chairs',
      quantity: 4,
      condition_details: 'Cracked plastic legs on two chairs',
      status: 'submitted',
      created_at: new Date().toISOString(),
    };

    vi.mocked(exchangeApi.submitExchangeRequest).mockResolvedValueOnce(mockCreated);

    render(
      <BrowserRouter>
        <ExchangeProgramPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Your Name \*/i), { target: { value: 'Pooja Sharma' } });
    fireEvent.change(screen.getByLabelText(/Contact Number \*/i), { target: { value: '9876501234' } });
    fireEvent.change(screen.getByLabelText(/Quantity \*/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Condition Details \*/i), {
      target: { value: 'Cracked plastic legs on two chairs' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit for Valuation/i }));

    await waitFor(() => {
      expect(exchangeApi.submitExchangeRequest).toHaveBeenCalledWith({
        customer_name: 'Pooja Sharma',
        phone_number: '9876501234',
        item_type: 'Plastic Chairs',
        quantity: 4,
        condition_details: 'Cracked plastic legs on two chairs',
        image_path: '',
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Exchange Evaluation Submitted!/i)).toBeInTheDocument();
      expect(screen.getByText(/#GESF-EX-55/i)).toBeInTheDocument();
    });
  });
});

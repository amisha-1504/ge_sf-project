import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ServiceRequestPage } from '../pages/ServiceRequestPage';
import { serviceApi } from '../api/services';

vi.mock('../api/services', () => ({
  serviceApi: {
    submitServiceRequest: vi.fn(),
  },
}));

describe('ServiceRequestPage Component', () => {
  it('renders booking form fields', () => {
    render(
      <BrowserRouter>
        <ServiceRequestPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Full Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Phone Number \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Service Type \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Service Address \/ Landmark \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Describe the Issue \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm Service Booking/i })).toBeInTheDocument();
  });

  it('submits form data to API and displays confirmation ticket', async () => {
    const mockCreated = {
      id: 101,
      customer_name: 'Anil Gupta',
      phone_number: '9876543210',
      address: 'Shop 4, Market Complex',
      service_type: 'Almirah Lock & Handle Repair',
      issue_description: 'Key stuck in locker door',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    vi.mocked(serviceApi.submitServiceRequest).mockResolvedValueOnce(mockCreated);

    render(
      <BrowserRouter>
        <ServiceRequestPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Full Name \*/i), { target: { value: 'Anil Gupta' } });
    fireEvent.change(screen.getByLabelText(/Contact Phone Number \*/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/Service Address \/ Landmark \*/i), { target: { value: 'Shop 4, Market Complex' } });
    fireEvent.change(screen.getByLabelText(/Describe the Issue \*/i), { target: { value: 'Key stuck in locker door' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Service Booking/i }));

    await waitFor(() => {
      expect(serviceApi.submitServiceRequest).toHaveBeenCalledWith({
        customer_name: 'Anil Gupta',
        phone_number: '9876543210',
        address: 'Shop 4, Market Complex',
        service_type: 'Almirah Lock & Handle Repair',
        issue_description: 'Key stuck in locker door',
        attached_image: '',
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Service Request Booked!/i)).toBeInTheDocument();
      expect(screen.getByText(/#GESF-SR-101/i)).toBeInTheDocument();
    });
  });
});

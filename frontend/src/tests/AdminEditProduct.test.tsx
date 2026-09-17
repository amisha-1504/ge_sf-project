import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { productApi } from '../api/products';
import { authApi } from '../api/auth';
import { categoryApi } from '../api/categories';
import { serviceApi } from '../api/services';
import { exchangeApi } from '../api/exchanges';
import * as clientModule from '../api/client';

vi.mock('../api/client', async () => {
  const actual = await vi.importActual('../api/client');
  return {
    ...actual,
    getStoredToken: vi.fn(),
  };
});

vi.mock('../api/auth', () => ({
  authApi: {
    getMe: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('../api/products', () => ({
  productApi: {
    getProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    uploadProductImage: vi.fn(),
  },
}));

vi.mock('../api/categories', () => ({
  categoryApi: {
    getCategories: vi.fn(),
  },
}));

vi.mock('../api/services', () => ({
  serviceApi: {
    listServiceRequests: vi.fn(),
  },
}));

vi.mock('../api/exchanges', () => ({
  exchangeApi: {
    listExchangeRequests: vi.fn(),
  },
}));

describe('Admin Product Edit Feature', () => {
  const mockProduct = {
    id: 101,
    title: 'Heavy Steel Wardrobe Test',
    slug: 'heavy-steel-wardrobe-test',
    subcategory_id: 1,
    description: 'Heavy duty testing almirah',
    price: 18500,
    dimensions: '78x36x20 inches',
    material: 'CRC Steel',
    in_stock: true,
    is_featured: false,
    created_at: '2026-01-01T00:00:00Z',
    subcategory: { id: 1, name: 'Steel Almirah', slug: 'steel-almirah', category_id: 1 },
    images: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(clientModule.getStoredToken).mockReturnValue('fake-token');
    vi.mocked(authApi.getMe).mockResolvedValue({
      id: 1,
      email: 'admin@gesf.com',
      full_name: 'Admin',
      role: 'admin',
      is_active: true,
      created_at: '2026-01-01',
    });
    vi.mocked(productApi.getProducts).mockResolvedValue([mockProduct]);
    vi.mocked(categoryApi.getCategories).mockResolvedValue([
      {
        id: 1,
        name: 'Steel Furniture',
        slug: 'steel-furniture',
        description: 'Steel items',
        subcategories: [{ id: 1, name: 'Steel Almirah', slug: 'steel-almirah', category_id: 1 }],
      },
    ]);
    vi.mocked(serviceApi.listServiceRequests).mockResolvedValue([]);
    vi.mocked(exchangeApi.listExchangeRequests).mockResolvedValue([]);
  });

  it('renders Edit button on product card and opens edit modal pre-filled', async () => {
    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Heavy Steel Wardrobe Test' })).toBeInTheDocument();
    });

    // Find and click Edit button
    const editBtn = screen.getByRole('button', { name: /Edit/i });
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);

    // Modal title should indicate editing
    expect(screen.getByText('Edit Product Details')).toBeInTheDocument();

    // Fields should be pre-filled
    const titleInput = screen.getByDisplayValue('Heavy Steel Wardrobe Test');
    expect(titleInput).toBeInTheDocument();

    const priceInput = screen.getByDisplayValue('18500');
    expect(priceInput).toBeInTheDocument();

    // Change title and submit
    fireEvent.change(titleInput, { target: { value: 'Updated Steel Wardrobe Title' } });

    vi.mocked(productApi.updateProduct).mockResolvedValue({
      ...mockProduct,
      title: 'Updated Steel Wardrobe Title',
    });

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(productApi.updateProduct).toHaveBeenCalledWith(
        101,
        expect.objectContaining({
          title: 'Updated Steel Wardrobe Title',
        })
      );
    });
  });
});

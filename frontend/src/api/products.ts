import { apiClient } from './client';
import type { Product, ProductCreateInput, ProductImage, ProductUpdateInput } from '../types';

export interface ProductFilterParams {
  category_id?: number;
  subcategory_id?: number;
  q?: string;
  featured?: boolean;
  skip?: number;
  limit?: number;
}

export const productApi = {
  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
  },

  async getProduct(identifier: string | number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${identifier}`);
    return response.data;
  },

  async createProduct(data: ProductCreateInput): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  async updateProduct(id: number, data: ProductUpdateInput): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  async uploadProductImage(productId: number, file: File, isPrimary: boolean = false): Promise<ProductImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_primary', String(isPrimary));

    const response = await apiClient.post<ProductImage>(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

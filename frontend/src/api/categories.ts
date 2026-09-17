import { apiClient } from './client';
import type { Category, SubCategory } from '../types';

export interface CategoryCreateInput {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface SubCategoryCreateInput {
  name: string;
  slug: string;
  category_id: number;
}

export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  async createCategory(data: CategoryCreateInput): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  async createSubCategory(data: SubCategoryCreateInput): Promise<SubCategory> {
    const response = await apiClient.post<SubCategory>('/categories/subcategories', data);
    return response.data;
  },
};

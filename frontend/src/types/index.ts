export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  subcategories: SubCategory[];
}

export interface ProductImage {
  id: number;
  image_path: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  price?: number | null;
  dimensions?: string | null;
  material?: string | null;
  in_stock: boolean;
  is_featured: boolean;
  subcategory_id: number;
  created_at: string;
  subcategory?: SubCategory | null;
  images: ProductImage[];
}

export interface ProductCreateInput {
  title: string;
  slug: string;
  subcategory_id: number;
  description?: string;
  price?: number;
  dimensions?: string;
  material?: string;
  in_stock?: boolean;
  is_featured?: boolean;
}

export interface ProductUpdateInput {
  title?: string;
  slug?: string;
  subcategory_id?: number;
  description?: string;
  price?: number;
  dimensions?: string;
  material?: string;
  in_stock?: boolean;
  is_featured?: boolean;
}

export interface ServiceRequest {
  id: number;
  customer_name: string;
  phone_number: string;
  address: string;
  service_type: string;
  issue_description: string;
  attached_image?: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | string;
  created_at: string;
}

export interface ServiceRequestCreateInput {
  customer_name: string;
  phone_number: string;
  address: string;
  service_type: string;
  issue_description: string;
  attached_image?: string | null;
}

export interface ExchangeRequest {
  id: number;
  customer_name: string;
  phone_number: string;
  item_type: string;
  quantity: number;
  condition_details: string;
  image_path?: string | null;
  estimated_value?: number | null;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed' | string;
  created_at: string;
}

export interface ExchangeRequestCreateInput {
  customer_name: string;
  phone_number: string;
  item_type: string;
  quantity: number;
  condition_details: string;
  image_path?: string | null;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

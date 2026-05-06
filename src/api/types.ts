export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  is_favorite: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  status: ToolStatus;
  condition: ToolCondition;
  borrowed_by: string | null;
  borrowed_at: string | null;
  due_date: string | null;
  borrower?: ToolUser | null;
}

export interface ToolUser {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export type ToolStatus = 'available' | 'borrowed' | 'maintenance';

export type ToolCondition = 'good' | 'needs_repair' | 'broken' | 'lost';

export type CreateToolDTO = {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  is_favorite?: boolean;
  image_url?: string | null;
  status?: ToolStatus;
  condition?: ToolCondition;
  borrowed_by?: string | null;
  borrowed_at?: string | null;
  due_date?: string | null;
};

export interface UpdateToolDTO extends Partial<CreateToolDTO> {
  is_favorite?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  code: string;
}

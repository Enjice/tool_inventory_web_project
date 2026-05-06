import { supabase } from '../lib/supabase';
import { Tool, CreateToolDTO, UpdateToolDTO, ApiResponse } from './types';

class ApiClient {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async get<T>(table: string, query?: any): Promise<ApiResponse<T>> {
    try {
      let supabaseQuery = supabase.from(table).select('*');
      
      if (query?.orderBy) {
        supabaseQuery = supabaseQuery.order(query.orderBy, { ascending: query.ascending ?? true });
      }
      
      const { data, error } = await supabaseQuery;
      
      if (error) throw error;
      
      return {
        data: data as T,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById<T>(table: string, id: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        data: data as T,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(table: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([{ ...data, createdAt: new Date(), updatedAt: new Date() }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        data: result as T,
        success: true,
        message: 'Successfully created',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(table: string, id: string, data: any): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updatedAt: new Date() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        data: result as T,
        success: true,
        message: 'Successfully updated',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(table: string, id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return {
        data: null,
        success: true,
        message: 'Successfully deleted',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ErrorResponse {
    console.error('API Error:', error);
    return {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'UNKNOWN_ERROR',
    };
  }
}

export const apiClient = ApiClient.getInstance();
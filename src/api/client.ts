import { supabaseRequest } from '../lib/supabase';
import type { ApiResponse, ErrorResponse } from './types';

type QueryOptions = {
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, string>;
};

class ApiClient {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async get<T>(table: string, query?: QueryOptions): Promise<ApiResponse<T>> {
    try {
      const params: Record<string, string> = {
        select: '*',
        ...query?.filters,
      };

      if (query?.orderBy) {
        params.order = `${query.orderBy}.${query.ascending === false ? 'desc' : 'asc'}`;
      }

      const data = await supabaseRequest<T>(table, { query: params });

      return {
        data,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById<T>(table: string, id: string): Promise<ApiResponse<T>> {
    try {
      const [data] = await supabaseRequest<T[]>(table, {
        query: {
          select: '*',
          id: `eq.${id}`,
          limit: '1',
        },
      });

      return {
        data,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(table: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const [result] = await supabaseRequest<T[]>(table, {
        method: 'POST',
        body: [data],
      });

      return {
        data: result,
        success: true,
        message: 'Successfully created',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(table: string, id: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const [result] = await supabaseRequest<T[]>(table, {
        method: 'PATCH',
        query: {
          id: `eq.${id}`,
        },
        body: data,
      });

      return {
        data: result,
        success: true,
        message: 'Successfully updated',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(table: string, id: string): Promise<ApiResponse<null>> {
    try {
      await supabaseRequest<unknown[]>(table, {
        method: 'DELETE',
        query: {
          id: `eq.${id}`,
        },
      });

      return {
        data: null,
        success: true,
        message: 'Successfully deleted',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ErrorResponse {
    console.error('API Error:', error);

    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'REQUEST_ERROR',
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
}

export const apiClient = ApiClient.getInstance();

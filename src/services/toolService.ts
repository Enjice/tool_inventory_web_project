import { supabase } from '../lib/supabase';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  is_favorite: boolean;
  image_url?: string;
  created_at: string;
}

class ToolService {
  async getAllTools() {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tool[];
  }

  async createTool(tool: Omit<Tool, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('tools')
      .insert([tool])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTool(id: string, updates: Partial<Tool>) {
    const { data, error } = await supabase
      .from('tools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteTool(id: string) {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export const toolService = new ToolService();
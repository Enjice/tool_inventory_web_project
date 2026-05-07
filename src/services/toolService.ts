import type { CreateToolDTO, Tool, ToolUser, UpdateToolDTO } from '../types';
import { supabaseRequest } from '../lib/supabase';

class ToolService {
  async getAllTools() {
    const tools = await supabaseRequest<Tool[]>('tools', {
      query: {
        select: '*',
        order: 'created_at.desc',
      },
    });
    const users = await this.getUsers();
    // 3. Связываем заемщиков с инструментами
    return tools.map((tool) => ({
      ...tool,
      borrower: users.find((user) => user.id === tool.borrowed_by) ?? null,
    }));
  }

  async getUsers() {
    return supabaseRequest<ToolUser[]>('users', {
      query: {
        select: '*',
        order: 'full_name.asc',
      },
    });
  }

  async createTool(tool: CreateToolDTO) {
    const [created] = await supabaseRequest<Tool[]>('tools', {
      method: 'POST',
      body: [tool],
    });

    return created;
  }

  async updateTool(id: string, updates: UpdateToolDTO) {
    const [updated] = await supabaseRequest<Tool[]>('tools', {
      method: 'PATCH',
      query: {
        id: `eq.${id}`,
      },
      body: updates,
    });

    return updated;
  }

  async deleteTool(id: string) {
    await supabaseRequest<Tool[]>('tools', {
      method: 'DELETE',
      query: {
        id: `eq.${id}`,
      },
    });
  }
}

export const toolService = new ToolService();
export type { Tool, ToolUser };

import { create } from 'zustand';
import type { CreateToolDTO, Tool, ToolUser, UpdateToolDTO } from '../api/types';
import { toolService } from '../services/toolService';

interface ToolState {
  tools: Tool[];
  users: ToolUser[];
  loading: boolean;
  error: string | null;
  loadTools: () => Promise<void>;
  addTool: (tool: CreateToolDTO) => Promise<boolean>;
  updateTool: (id: string, updates: UpdateToolDTO) => Promise<boolean>;
  deleteTool: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useToolStore = create<ToolState>((set, get) => ({
  tools: [],
  users: [],
  loading: false,
  error: null,

  loadTools: async () => {
    try {
      set({ loading: true, error: null });
      const [tools, users] = await Promise.all([
        toolService.getAllTools(),
        toolService.getUsers(),
      ]);
      set({ tools, users, loading: false });
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to load tools', loading: false });
    }
  },

  addTool: async (tool) => {
    try {
      const created = await toolService.createTool(tool);
      const borrower = get().users.find((user) => user.id === created.borrowed_by) ?? null;
      set((state) => ({
        tools: [{ ...created, borrower }, ...state.tools],
        error: null,
      }));
      return true;
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to add tool' });
      return false;
    }
  },

  updateTool: async (id, updates) => {
    try {
      const updated = await toolService.updateTool(id, updates);
      const borrower = get().users.find((user) => user.id === updated.borrowed_by) ?? null;
      set((state) => ({
        tools: state.tools.map((tool) => (tool.id === id ? { ...updated, borrower } : tool)),
        error: null,
      }));
      return true;
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to update tool' });
      return false;
    }
  },

  deleteTool: async (id) => {
    try {
      await toolService.deleteTool(id);
      set((state) => ({
        tools: state.tools.filter((tool) => tool.id !== id),
        error: null,
      }));
      return true;
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to delete tool' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

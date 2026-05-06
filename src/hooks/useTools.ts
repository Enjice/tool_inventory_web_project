import { useEffect } from 'react';
import type { Tool } from '../api/types';
import { useToolStore } from '../store/toolStore';

export const useTools = () => {
  const tools = useToolStore((state) => state.tools);
  const users = useToolStore((state) => state.users);
  const loading = useToolStore((state) => state.loading);
  const error = useToolStore((state) => state.error);
  const loadTools = useToolStore((state) => state.loadTools);
  const addTool = useToolStore((state) => state.addTool);
  const updateTool = useToolStore((state) => state.updateTool);
  const deleteTool = useToolStore((state) => state.deleteTool);
  const clearError = useToolStore((state) => state.clearError);

  useEffect(() => {
    if (tools.length === 0 && !loading) {
      void loadTools();
    }
  }, [loadTools, loading, tools.length]);

  return {
    tools,
    users,
    loading,
    error,
    addTool,
    updateTool,
    deleteTool,
    loadTools,
    clearError,
  };
};

export type { Tool };

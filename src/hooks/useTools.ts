import { useState, useEffect } from 'react';
import { toolService, Tool } from '../services/toolService';

export const useTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await toolService.getAllTools();
      setTools(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tools');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTool = async (tool: Omit<Tool, 'id' | 'created_at'>) => {
    try {
      const newTool = await toolService.createTool(tool);
      setTools([newTool, ...tools]);
      return true;
    } catch (err) {
      setError('Failed to add tool');
      console.error(err);
      return false;
    }
  };

  const updateTool = async (id: string, updates: Partial<Tool>) => {
    try {
      const updated = await toolService.updateTool(id, updates);
      setTools(tools.map(t => t.id === id ? updated : t));
      return true;
    } catch (err) {
      setError('Failed to update tool');
      console.error(err);
      return false;
    }
  };

  const deleteTool = async (id: string) => {
    try {
      await toolService.deleteTool(id);
      setTools(tools.filter(t => t.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete tool');
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  return { tools, loading, error, addTool, updateTool, deleteTool, loadTools };
};
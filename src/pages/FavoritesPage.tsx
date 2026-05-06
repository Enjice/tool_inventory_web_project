import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolList } from '../components/tools/ToolList';
import { useTools } from '../hooks/useTools';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { tools, loading, error, deleteTool, updateTool, loadTools, clearError } = useTools();
  const favorites = tools.filter((tool) => tool.is_favorite);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this tool?')) {
      await deleteTool(id);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Favorite Tools</h1>
        <p className="text-gray-600 mt-2">Pinned tools with their condition and availability.</p>
      </div>
      <ToolList
        tools={favorites}
        isLoading={loading}
        error={error}
        onRetry={loadTools}
        onEdit={(id) => navigate(`/edit/${id}`)}
        onDelete={handleDelete}
        onToggleFavorite={(id, currentState) => updateTool(id, { is_favorite: !currentState })}
        onClearError={clearError}
      />
    </div>
  );
};

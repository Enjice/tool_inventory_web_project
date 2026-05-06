import React from 'react';
import { Typography } from 'antd';
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
        <Typography.Title level={1}>Favorite Tools</Typography.Title>
        <Typography.Paragraph type="secondary">
          Pinned tools with their condition and availability.
        </Typography.Paragraph>
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

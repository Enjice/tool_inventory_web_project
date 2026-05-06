import React, { useMemo, useState } from 'react';
import { Segmented, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ToolList } from '../components/tools/ToolList';
import { useTools } from '../hooks/useTools';

type AvailabilityFilter = 'all' | 'available' | 'borrowed';

const availabilityFilters: { value: AvailabilityFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Free' },
  { value: 'borrowed', label: 'Borrowed' },
];

export const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { tools, loading, error, deleteTool, updateTool, loadTools, clearError } = useTools();
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');

  const filteredTools = useMemo(() => {
    if (availabilityFilter === 'all') {
      return tools;
    }

    return tools.filter((tool) => tool.status === availabilityFilter);
  }, [availabilityFilter, tools]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this tool?')) {
      await deleteTool(id);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Typography.Title level={1}>Tool Catalog</Typography.Title>
        <Typography.Paragraph type="secondary">
          Browse tools, condition, and current availability.
        </Typography.Paragraph>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Space wrap>
          <Segmented
            onChange={(value) => setAvailabilityFilter(value as AvailabilityFilter)}
            options={availabilityFilters}
            value={availabilityFilter}
          />
        </Space>
        <Typography.Text type="secondary">
          {filteredTools.length} of {tools.length} tools
        </Typography.Text>
      </div>
      <ToolList
        tools={filteredTools}
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

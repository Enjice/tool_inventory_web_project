import React, { useMemo, useState } from 'react';
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
        <h1 className="text-3xl font-bold text-gray-900">Tool Catalog</h1>
        <p className="text-gray-600 mt-2">Browse tools, condition, and current availability.</p>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-full rounded-lg border border-gray-200 bg-white p-1 shadow-sm sm:w-auto">
          {availabilityFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setAvailabilityFilter(filter.value)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
                availabilityFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {filteredTools.length} of {tools.length} tools
        </span>
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

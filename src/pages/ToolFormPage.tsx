import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CreateToolDTO } from '../api/types';
import { ToolForm } from '../components/tools/ToolForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useTools } from '../hooks/useTools';

export const ToolFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tools, users, loading, addTool, updateTool, loadTools } = useTools();
  const [saving, setSaving] = useState(false);
  const tool = id ? tools.find((item) => item.id === id) : undefined;

  useEffect(() => {
    if (tools.length === 0 && !loading) {
      void loadTools();
    }
  }, [loadTools, loading, tools.length]);

  const handleSubmit = async (data: CreateToolDTO) => {
    setSaving(true);
    const success = id ? await updateTool(id, data) : await addTool(data);
    setSaving(false);

    if (success) {
      navigate('/');
    }
  };

  if (id && loading && !tool) {
    return <LoadingSpinner message="Loading tool..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Tool' : 'Add New Tool'}
        </h1>
        <p className="text-gray-600 mt-2">
          {id ? 'Update tool details and availability.' : 'Add a tool to inventory.'}
        </p>
      </div>

      <ToolForm
        initialData={tool}
        users={users}
        onSubmit={handleSubmit}
        isLoading={saving}
        isEditMode={Boolean(id)}
      />
    </div>
  );
};

import React from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { Tool } from '../../api/types';
import { ToolCard } from './ToolCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

interface ToolListProps {
  tools: Tool[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, currentState: boolean) => void;
  onClearError: () => void;
}

export const ToolList: React.FC<ToolListProps> = ({
  tools,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onToggleFavorite,
  onClearError,
}) => {
  if (isLoading) {
    return <LoadingSpinner message="Loading tools..." />;
  }
  
  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} onDismiss={onClearError} />;
  }
  
  if (tools.length === 0) {
    return (
      <Result
        icon={<AppstoreOutlined />}
        subTitle="Get started by adding your first tool!"
        title="No tools found"
      />
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

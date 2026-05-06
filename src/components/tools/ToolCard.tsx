import React from 'react';
import { Tool } from '../../api/types';
import { Button } from '../common/Button';

interface ToolCardProps {
  tool: Tool;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, currentState: boolean) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onEdit, onDelete, onToggleFavorite }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
          <button
            onClick={() => onToggleFavorite?.(tool.id, tool.isFavorite)}
            className="text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            {tool.isFavorite ? (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 stroke-current fill-none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-gray-500">Category: {tool.category}</span>
          <span className="font-semibold text-blue-600">${tool.price}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">Quantity: {tool.quantity}</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit?.(tool.id)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete?.(tool.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import type { Tool, ToolCondition, ToolStatus } from '../../api/types';
import { Button } from '../common/Button';

const statusLabels: Record<ToolStatus, string> = {
  available: 'Available',
  borrowed: 'Borrowed',
  maintenance: 'Maintenance',
};

const conditionLabels: Record<ToolCondition, string> = {
  good: 'Good',
  needs_repair: 'Needs repair',
  broken: 'Broken',
  lost: 'Lost',
};

const statusStyles: Record<ToolStatus, string> = {
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  borrowed: 'bg-amber-50 text-amber-700 border-amber-200',
  maintenance: 'bg-sky-50 text-sky-700 border-sky-200',
};

interface ToolCardProps {
  tool: Tool;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, currentState: boolean) => void;
}

const formatDate = (value: string | null) => {
  if (!value) return null;

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const borrowerName = tool.borrower?.full_name ?? 'Not assigned';
  const borrowedAt = formatDate(tool.borrowed_at);
  const dueDate = formatDate(tool.due_date);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {tool.image_url && (
        <img className="h-40 w-full object-cover" src={tool.image_url} alt={tool.name} />
      )}
      <div className="p-5">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
            <p className="text-sm text-gray-500">{tool.category}</p>
          </div>
          <button
            type="button"
            aria-label="Toggle favorite"
            onClick={() => onToggleFavorite?.(tool.id, tool.is_favorite)}
            className="text-yellow-500 hover:text-yellow-600 transition-colors"
          >
            {tool.is_favorite ? (
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

        <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[tool.status]}`}>
            {statusLabels[tool.status]}
          </span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
            {conditionLabels[tool.condition]}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center justify-between">
            <span>Price</span>
            <span className="font-semibold text-blue-600">${tool.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Quantity</span>
            <span className="font-medium text-gray-900">{tool.quantity}</span>
          </div>
          {tool.status === 'borrowed' && (
            <>
              <div className="flex items-center justify-between gap-4">
                <span>Borrowed by</span>
                <span className="text-right font-medium text-gray-900">{borrowerName}</span>
              </div>
              {borrowedAt && (
                <div className="flex items-center justify-between">
                  <span>Borrowed at</span>
                  <span className="font-medium text-gray-900">{borrowedAt}</span>
                </div>
              )}
              {dueDate && (
                <div className="flex items-center justify-between">
                  <span>Due date</span>
                  <span className="font-medium text-gray-900">{dueDate}</span>
                </div>
              )}
            </>
          )}
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

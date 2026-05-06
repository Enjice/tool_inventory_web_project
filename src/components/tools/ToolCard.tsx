import React from 'react';
import { DeleteOutlined, EditOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Image, Space, Tag, Tooltip, Typography } from 'antd';
import type { Tool, ToolCondition, ToolStatus } from '../../api/types';

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

const statusColors: Record<ToolStatus, string> = {
  available: 'green',
  borrowed: 'gold',
  maintenance: 'blue',
};

const conditionColors: Record<ToolCondition, string> = {
  good: 'success',
  needs_repair: 'warning',
  broken: 'error',
  lost: 'default',
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
    <Card
      actions={[
        <Button icon={<EditOutlined />} key="edit" onClick={() => onEdit?.(tool.id)}>
          Edit
        </Button>,
        <Button danger icon={<DeleteOutlined />} key="delete" onClick={() => onDelete?.(tool.id)}>
          Delete
        </Button>,
      ]}
      className="h-full overflow-hidden"
      cover={
        tool.image_url ? (
          <Image
            alt={tool.name}
            className="h-40 w-full object-cover"
            preview={false}
            src={tool.image_url}
          />
        ) : undefined
      }
      hoverable
    >
      <Space className="w-full" direction="vertical" size="middle">
        <div className="flex justify-between items-start gap-3">
          <div>
            <Typography.Title className="!mb-1" level={4}>
              {tool.name}
            </Typography.Title>
            <Typography.Text type="secondary">{tool.category}</Typography.Text>
          </div>
          <Tooltip title={tool.is_favorite ? 'Remove from favorites' : 'Add to favorites'}>
            <Button
              aria-label="Toggle favorite"
              icon={tool.is_favorite ? <StarFilled /> : <StarOutlined />}
              onClick={() => onToggleFavorite?.(tool.id, tool.is_favorite)}
              shape="circle"
              type="text"
            />
          </Tooltip>
        </div>

        <Typography.Paragraph className="!mb-0" type="secondary">
          {tool.description}
        </Typography.Paragraph>

        <Space wrap>
          <Tag color={statusColors[tool.status]}>{statusLabels[tool.status]}</Tag>
          <Tag color={conditionColors[tool.condition]}>{conditionLabels[tool.condition]}</Tag>
        </Space>

        <Descriptions column={1} size="small">
          <Descriptions.Item label="Price">${tool.price}</Descriptions.Item>
          <Descriptions.Item label="Quantity">{tool.quantity}</Descriptions.Item>
          {tool.status === 'borrowed' && (
            <>
              <Descriptions.Item label="Borrowed by">{borrowerName}</Descriptions.Item>
              {borrowedAt && <Descriptions.Item label="Borrowed at">{borrowedAt}</Descriptions.Item>}
              {dueDate && <Descriptions.Item label="Due date">{dueDate}</Descriptions.Item>}
            </>
          )}
        </Descriptions>
      </Space>
    </Card>
  );
};

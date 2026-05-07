import React, { useMemo, useState } from 'react';
import { Alert, Card, Form, Space } from 'antd';
import type { CreateToolDTO, Tool, ToolCondition, ToolStatus, ToolUser } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ToolFormProps {
  initialData?: Tool;
  users: ToolUser[];
  onSubmit: (data: CreateToolDTO) => Promise<void>;
  isLoading: boolean;
  isEditMode: boolean;
}

const toDateTimeLocal = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const toIsoOrNull = (value: string) => (value ? new Date(value).toISOString() : null);

export const ToolForm: React.FC<ToolFormProps> = ({
  initialData,
  users,
  onSubmit,
  isLoading,
  isEditMode,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    category: initialData?.category ?? '',
    price: initialData?.price?.toString() ?? '',
    quantity: initialData?.quantity?.toString() ?? '',
    image_url: initialData?.image_url ?? '',
    status: initialData?.status ?? 'available',
    condition: initialData?.condition ?? 'good',
    borrowed_by: initialData?.borrowed_by ?? '',
    borrowed_at: toDateTimeLocal(initialData?.borrowed_at),
    due_date: toDateTimeLocal(initialData?.due_date),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'Power Tools', label: 'Power Tools' },
    { value: 'Hand Tools', label: 'Hand Tools' },
    { value: 'Measuring Tools', label: 'Measuring Tools' },
    { value: 'Safety Equipment', label: 'Safety Equipment' },
    { value: 'Other', label: 'Other' },
  ];

  const statusOptions: { value: ToolStatus; label: string }[] = [
    { value: 'available', label: 'Available' },
    { value: 'borrowed', label: 'Borrowed by user' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  const conditionOptions: { value: ToolCondition; label: string }[] = [
    { value: 'good', label: 'Good' },
    { value: 'needs_repair', label: 'Needs repair' },
  ];

  const userOptions = useMemo(
    () => users.map((user) => ({ value: user.id, label: user.full_name })),
    [users],
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.quantity || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }
    if (formData.status === 'borrowed' && !formData.borrowed_by) {
      newErrors.borrowed_by = 'Select who borrowed this tool';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validate()) return;

    const isBorrowed = formData.status === 'borrowed';
    await onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      image_url: formData.image_url.trim() || null,
      status: formData.status as ToolStatus,
      condition: formData.condition as ToolCondition,
      borrowed_by: isBorrowed ? formData.borrowed_by : null,
      borrowed_at: isBorrowed ? toIsoOrNull(formData.borrowed_at) : null,
      due_date: isBorrowed ? toIsoOrNull(formData.due_date) : null,
      is_favorite: initialData?.is_favorite ?? false,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'status' && value === 'borrowed') {
        return {
          ...prev,
          status: value as ToolStatus,
          borrowed_at: prev.borrowed_at || toDateTimeLocal(new Date().toISOString()),
        };
      }

      if (name === 'status' && value !== 'borrowed') {
        return {
          ...prev,
          status: value as ToolStatus,
          borrowed_by: '',
          borrowed_at: '',
          due_date: '',
        };
      }

      return { ...prev, [name]: value };
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Card>
      <Form layout="vertical" onSubmitCapture={handleSubmit}>
        <Input
          error={errors.name}
          label="Tool Name"
          name="name"
          onChange={handleChange}
          placeholder="Enter tool name"
          value={formData.name}
        />

        <Input
          error={errors.description}
          label="Description"
          multiline
          name="description"
          onChange={handleChange}
          placeholder="Describe the tool"
          rows={4}
          value={formData.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            error={errors.category}
            label="Category"
            name="category"
            onChange={handleChange}
            options={categories}
            type="select"
            value={formData.category}
          />
          <Input
            label="Condition"
            name="condition"
            onChange={handleChange}
            options={conditionOptions}
            type="select"
            value={formData.condition}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            error={errors.price}
            label="Price (₽)"
            name="price"
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={formData.price}
          />
          <Input
            error={errors.quantity}
            label="Quantity"
            name="quantity"
            onChange={handleChange}
            placeholder="0"
            type="number"
            value={formData.quantity}
          />
        </div>

        <Input
          label="Image URL"
          name="image_url"
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          value={formData.image_url}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Status"
            name="status"
            onChange={handleChange}
            options={statusOptions}
            type="select"
            value={formData.status}
          />
          {formData.status === 'borrowed' && (
            <Input
              disabled={userOptions.length === 0}
              error={errors.borrowed_by}
              label="Borrowed by"
              name="borrowed_by"
              onChange={handleChange}
              options={userOptions}
              type="select"
              value={formData.borrowed_by}
            />
          )}
        </div>

        {formData.status === 'borrowed' && userOptions.length === 0 && (
          <Alert
            className="mb-4"
            message="No users found in Supabase users table."
            showIcon
            type="warning"
          />
        )}

        {formData.status === 'borrowed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Borrowed at"
              name="borrowed_at"
              onChange={handleChange}
              type="datetime-local"
              value={formData.borrowed_at}
            />
            <Input
              label="Due date"
              name="due_date"
              onChange={handleChange}
              type="datetime-local"
              value={formData.due_date}
            />
          </div>
        )}

        <Form.Item className="!mb-0 !mt-6">
          <Space>
            <Button type="submit" isLoading={isLoading}>
              {isEditMode ? 'Update Tool' : 'Add Tool'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

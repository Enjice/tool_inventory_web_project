import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface ToolFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  isEditMode: boolean;
}

export const ToolForm: React.FC<ToolFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  isEditMode,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    quantity: initialData?.quantity || '',
    imageUrl: initialData?.imageUrl || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const categories = [
    { value: 'power', label: 'Power Tools' },
    { value: 'hand', label: 'Hand Tools' },
    { value: 'measuring', label: 'Measuring Tools' },
    { value: 'safety', label: 'Safety Equipment' },
    { value: 'other', label: 'Other' },
  ];
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.quantity || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Tool Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter tool name"
      />
      
      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        multiline
        rows={4}
        placeholder="Describe the tool"
      />
      
      <Input
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
        type="select"
        options={categories}
      />
      
      <Input
        label="Price ($)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        step="0.01"
        placeholder="0.00"
      />
      
      <Input
        label="Quantity"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        error={errors.quantity}
        placeholder="0"
      />
      
      <Input
        label="Image URL (optional)"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />
      
      <div className="flex gap-3 mt-6">
        <Button type="submit" isLoading={isLoading}>
          {isEditMode ? 'Update Tool' : 'Add Tool'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
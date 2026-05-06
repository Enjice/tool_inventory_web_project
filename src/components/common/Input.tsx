import React from 'react';
import { Form, Input as AntInput, Select } from 'antd';

interface InputProps {
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  multiline?: boolean;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  options?: { value: string; label: string }[];
  placeholder?: string;
  rows?: number;
  step?: string;
  type?: string;
  value?: string | number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  multiline = false,
  options,
  className = '',
  ...props
}) => {
  const renderInput = () => {
    const { disabled, name, onChange, placeholder, rows, step, type, value } = props;

    if (multiline) {
      return (
        <AntInput.TextArea
          className={className}
          disabled={disabled}
          name={name}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          placeholder={placeholder}
          rows={rows}
          value={value}
        />
      );
    }
    
    if (options && props.type === 'select') {
      return (
        <Select
          className={className}
          disabled={disabled}
          onChange={(nextValue) => {
            onChange?.({
              target: { name, value: nextValue ?? '' },
            } as React.ChangeEvent<HTMLSelectElement>);
          }}
          options={options}
          placeholder="Select..."
          value={value || undefined}
        />
      );
    }
    
    return (
      <AntInput
        className={className}
        disabled={disabled}
        name={name}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        placeholder={placeholder}
        step={step}
        type={type}
        value={value}
      />
    );
  };
  
  return (
    <Form.Item
      help={error}
      label={label}
      validateStatus={error ? 'error' : undefined}
    >
      {renderInput()}
    </Form.Item>
  );
};

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  options?: { value: string; label: string }[];
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  multiline = false,
  options,
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent';
  
  const renderInput = () => {
    if (multiline) {
      return (
        <textarea
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }
    
    if (options && props.type === 'select') {
      return (
        <select className={`${baseStyles} ${errorStyles} ${className}`} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          <option value="">Select...</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    return <input className={`${baseStyles} ${errorStyles} ${className}`} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />;
  };
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
import React from 'react';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizes = {
    sm: 'small',
    md: 'default',
    lg: 'large',
  } as const;
  
  return (
    <Spin className="flex justify-center p-8" size={sizes[size]} tip={message} />
  );
};

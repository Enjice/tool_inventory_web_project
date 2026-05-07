import React from 'react';
import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';

interface ButtonProps extends Omit<AntButtonProps, 'danger' | 'htmlType' | 'loading' | 'size' | 'type' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  type,
  ...props
}) => {
  const antSizes = {
    sm: 'small',
    md: 'middle',
    lg: 'large',
  } as const;

  const antTypes = {
    primary: 'primary',
    secondary: 'default',
    danger: 'primary',
  } as const;

  return (
    <AntButton
      className={className}
      danger={variant === 'danger'}
      disabled={disabled}
      htmlType={type}
      loading={isLoading}
      size={antSizes[size]}
      type={antTypes[variant]}
      {...props}
    >
      {children}
    </AntButton>
  );
};

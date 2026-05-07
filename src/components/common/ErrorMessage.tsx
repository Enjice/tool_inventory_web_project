import React from 'react';
import { Alert, Button, Space } from 'antd';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <Alert
      action={
        onRetry ? (
          <Space>
            <Button size="small" onClick={onRetry}>
              Retry
            </Button>
          </Space>
        ) : undefined
      }
      closable={Boolean(onDismiss)}
      message={message}
      onClose={onDismiss}
      showIcon
      type="error"
    />
  );
};

import React from 'react';
import { Layout as AntLayout, Menu, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { key: '/', label: <Link to="/">Catalog</Link> },
    { key: '/favorites', label: <Link to="/favorites">Favorites</Link> },
    { key: '/add', label: <Link to="/add">Add Tool</Link> },
  ];

  return (
    <AntLayout className="min-h-screen">
      <AntLayout.Header className="!h-auto !bg-white !px-0 shadow-sm">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/">
            <Typography.Title className="!mb-0" level={3}>
              Tool Inventory
            </Typography.Title>
          </Link>
          <Menu
            className="min-w-0 flex-1 justify-end border-0"
            items={navItems}
            mode="horizontal"
            selectedKeys={[location.pathname]}
          />
        </div>
      </AntLayout.Header>
      <AntLayout.Content className="container mx-auto px-4 py-8">
        {children}
      </AntLayout.Content>
    </AntLayout>
  );
};

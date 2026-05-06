import React from 'react';
import { Link } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Tool Inventory
            </Link>
            <nav className="flex gap-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600">Catalog</Link>
              <Link to="/favorites" className="text-gray-600 hover:text-blue-600">Favorites</Link>
              <Link to="/add" className="text-gray-600 hover:text-blue-600">Add Tool</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
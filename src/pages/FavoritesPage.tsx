import React from 'react';

export const FavoritesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Favorite Tools</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Your favorite tools will appear here.</p>
      </div>
    </div>
  );
};
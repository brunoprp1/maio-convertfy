import React from 'react';

type BadgeProps = {
  status: 'active' | 'pending' | 'paid' | 'inactive';
  children: React.ReactNode;
};

const Badge: React.FC<BadgeProps> = ({ status, children }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyles()}`}
    >
      {children}
    </span>
  );
};

export default Badge;
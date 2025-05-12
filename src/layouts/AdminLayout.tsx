import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { useAuthContext } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark">
      <Sidebar userType="admin" />
      
      <div className="flex-1 w-full lg:ml-[220px]">
        <Header title={`Bem-vindo, ${user.name}`} />
        <main className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminClients from './pages/admin/Clients';
import AdminFinancials from './pages/admin/Financials';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';
import ViewClient from './pages/admin/ViewClient';
import EditClient from './pages/admin/EditClient';
import CreateClient from './pages/admin/CreateClient';
import Billing from './pages/admin/Billing';
import ClaimedRewards from './pages/admin/ClaimedRewards';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import ClientCampaigns from './pages/client/Campaigns';
import ClientFinancials from './pages/client/Financials';
import ClientSupport from './pages/client/Support';
import ClientSettings from './pages/admin/Settings';
import ClientProfile from './pages/client/Profile';
import Notifications from './pages/client/Notifications';
import Rewards from './pages/client/Rewards';

function App() {
  useEffect(() => {
    // Set light theme as default if no theme is set
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
    } else {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="clients/:id" element={<ViewClient />} />
            <Route path="clients/:id/edit" element={<EditClient />} />
            <Route path="clients/new" element={<CreateClient />} />
            <Route path="financials" element={<AdminFinancials />} />
            <Route path="billing" element={<Billing />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="claimed-rewards" element={<ClaimedRewards />} />
          </Route>
          
          {/* Client Routes */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="/client/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="campaigns" element={<ClientCampaigns />} />
            <Route path="financials" element={<ClientFinancials />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="support" element={<ClientSupport />} />
            <Route path="settings" element={<ClientSettings />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
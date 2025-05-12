import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/firebase';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isClient: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        setIsAdmin(user.role === 'admin');
        setIsClient(user.role === 'client');
        
        // Only redirect if we're at login or register
        if (['/login', '/register', '/'].includes(location.pathname)) {
          navigate(user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
        }
      } else if (!['/login', '/register'].includes(location.pathname)) {
        navigate('/login');
      }
    }
  }, [user, loading, navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isClient }}>
      {children}
    </AuthContext.Provider>
  );
};
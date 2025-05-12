import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Settings, LogOut, User, HelpCircle, Menu } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../../services/firebase/auth';
import { useAuthContext } from '../../contexts/AuthContext';

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNotificationsClick = () => {
    setShowNotifications(true);
    setUnreadNotifications(0);
  };

  const handleToggleSidebar = () => {
    document.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  if (!user) return null;

  return (
    <header className="bg-white dark:bg-dark-50 h-16 border-b border-gray-200 dark:border-dark-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <button
          onClick={handleToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-100 mr-2"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-base md:text-xl font-semibold text-gray-800 dark:text-dark-900 truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationsClick}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-500 dark:text-dark-500" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
              <div className="fixed inset-0 bg-black/50 dark:bg-black/80 lg:hidden" onClick={() => setShowNotifications(false)} />
              <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:top-full lg:right-0 lg:bottom-auto lg:left-auto bg-white dark:bg-dark-50 rounded-t-2xl lg:rounded-lg shadow-xl lg:mt-2 lg:w-80 max-h-[80vh] lg:max-h-96 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-200">
                  <h3 className="font-medium text-gray-900 dark:text-dark-900">Notificações</h3>
                </div>
                <div className="overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 dark:border-dark-200 hover:bg-gray-50 dark:hover:bg-dark-100">
                    <p className="font-medium text-gray-900 dark:text-dark-900">Nova mensagem</p>
                    <p className="text-sm text-gray-500 dark:text-dark-500">Você recebeu uma nova mensagem</p>
                    <p className="text-xs text-gray-400 dark:text-dark-400 mt-1">2 minutos atrás</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-dark-100">
                    <p className="font-medium text-gray-900 dark:text-dark-900">Atualização do sistema</p>
                    <p className="text-sm text-gray-500 dark:text-dark-500">O sistema foi atualizado</p>
                    <p className="text-xs text-gray-400 dark:text-dark-400 mt-1">1 hora atrás</p>
                  </div>
                </div>
                <div className="p-4 text-center border-t border-gray-100 dark:border-dark-200">
                  <Link 
                    to="/client/notifications"
                    className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    Ver todas as notificações
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center bg-gray-50 dark:bg-dark-100 rounded-full py-1 px-2 md:px-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-200"
          >
            <Avatar 
              name={user.name} 
              size="sm"
              className="mr-2" 
            />
            <span className="text-sm font-medium mr-1 hidden md:block text-gray-900 dark:text-dark-900 max-w-[120px] truncate">
              {user.name}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-dark-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-50 rounded-lg shadow-lg border border-gray-200 dark:border-dark-200 z-50">
              <div className="p-2">
                <Link
                  to={`/${user.role}/profile`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-700 hover:bg-gray-50 dark:hover:bg-dark-100 rounded-md"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={16} className="mr-3" />
                  Meu Perfil
                </Link>
                <Link
                  to={`/${user.role}/settings`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-700 hover:bg-gray-50 dark:hover:bg-dark-100 rounded-md"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={16} className="mr-3" />
                  Configurações
                </Link>
                {user.role === 'client' && (
                  <Link
                    to="/client/support"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-700 hover:bg-gray-50 dark:hover:bg-dark-100 rounded-md"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <HelpCircle size={16} className="mr-3" />
                    Ajuda
                  </Link>
                )}
                <div className="border-t border-gray-100 dark:border-dark-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md"
                >
                  <LogOut size={16} className="mr-3" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
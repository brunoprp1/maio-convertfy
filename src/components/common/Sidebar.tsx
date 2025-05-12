import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  BarChart2, 
  Settings, 
  MessageSquare,
  Store as StoreIcon,
  HelpCircle,
  Receipt,
  ChevronDown,
  CheckCircle,
  XCircle,
  X,
  Award
} from 'lucide-react';
import ConvertfyLogo from '../../assets/convertfy-logo';
import { useAuthContext } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Store } from '../../types/firebase';

type SidebarProps = {
  userType: 'admin' | 'client';
};

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsOpen(prev => !prev);
    };

    document.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => document.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      if (user?.id) {
        try {
          const storesQuery = query(
            collection(db, 'stores'),
            where('clientId', '==', user.id)
          );
          
          const querySnapshot = await getDocs(storesQuery);
          const storesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Store[];

          setStores(storesData);
          if (storesData.length === 1) {
            setSelectedStore(storesData[0]);
          }
        } catch (error) {
          console.error('Error fetching stores:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (userType === 'client') {
      fetchStores();
    }
  }, [user, userType]);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setShowStoreSelector(false);
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const adminLinks = [
    { title: 'Dashboard', icon: <BarChart3 size={20} />, path: '/admin/dashboard' },
    { title: 'Clientes', icon: <Users size={20} />, path: '/admin/clients' },
    { title: 'Financeiro', icon: <CreditCard size={20} />, path: '/admin/financials' },
    { title: 'Cobranças', icon: <Receipt size={20} />, path: '/admin/billing' },
    { title: 'Relatórios', icon: <BarChart2 size={20} />, path: '/admin/reports' },
    { title: 'Conquistas', icon: <Award size={20} />, path: '/admin/claimed-rewards' },
  ];

  const clientLinks = [
    { title: 'Dashboard', icon: <BarChart3 size={20} />, path: '/client/dashboard' },
    { title: 'Campanhas', icon: <MessageSquare size={20} />, path: '/client/campaigns' },
    { title: 'Financeiro', icon: <CreditCard size={20} />, path: '/client/financials' },
    { title: 'Conquistas', icon: <Award size={20} />, path: '/client/rewards' },
    { title: 'Suporte', icon: <HelpCircle size={20} />, path: '/client/support' },
  ];

  const settingsLink = {
    title: 'Configurações',
    icon: <Settings size={20} />,
    path: `/${userType}/settings`
  };

  const links = userType === 'admin' ? adminLinks : clientLinks;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full bg-[#171E28] text-white w-[280px] z-[60]
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:w-[220px]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative h-20 flex items-center justify-center border-b border-white/10">
          <ConvertfyLogo />
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {userType === 'client' && !loading && stores.length > 0 && (
          <div className="px-4 mb-6">
            <div className="relative">
              <button
                onClick={() => setShowStoreSelector(!showStoreSelector)}
                className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center">
                  <StoreIcon size={20} className="mr-2" />
                  <div>
                    <span className="text-sm font-medium block truncate">
                      {selectedStore ? selectedStore.name : 'Selecione uma loja'}
                    </span>
                    {selectedStore && (
                      <span className="text-xs text-white/70 block capitalize">
                        {selectedStore.platform}
                      </span>
                    )}
                  </div>
                </div>
                {stores.length > 1 && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${showStoreSelector ? 'rotate-180' : ''}`} 
                  />
                )}
              </button>

              {showStoreSelector && stores.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-50 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="max-h-64 overflow-y-auto">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => handleStoreSelect(store)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-100 text-left"
                      >
                        <div>
                          <p className="text-gray-900 dark:text-dark-900 font-medium">{store.name}</p>
                          <p className="text-gray-500 dark:text-dark-500 text-sm capitalize">{store.platform}</p>
                        </div>
                        {store.status === 'active' ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <nav className="mt-8">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center py-3 px-6 text-sm
                      ${isActive 
                        ? 'bg-white/10 border-l-4 border-white font-medium' 
                        : 'hover:bg-white/5'}
                      transition-colors duration-200
                    `}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.title}
                  </Link>
                </li>
              );
            })}

            {userType === 'admin' && (
              <li className="mt-auto">
                <Link
                  to={settingsLink.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center py-3 px-6 text-sm
                    ${location.pathname === settingsLink.path 
                      ? 'bg-white/10 border-l-4 border-white font-medium' 
                      : 'hover:bg-white/5'}
                    transition-colors duration-200
                  `}
                >
                  <span className="mr-3">{settingsLink.icon}</span>
                  {settingsLink.title}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
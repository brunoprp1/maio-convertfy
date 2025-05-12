import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { Bell, Filter, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'payment' | 'campaign' | 'alert';
  status: 'unread' | 'read';
  createdAt: string;
};

const mockNotifications: Notification[] = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Notificação ${i + 1}`,
  message: `Mensagem da notificação ${i + 1}`,
  type: ['system', 'payment', 'campaign', 'alert'][Math.floor(Math.random() * 4)] as Notification['type'],
  status: Math.random() > 0.5 ? 'read' : 'unread',
  createdAt: '2 minutos atrás'
}));

const Notifications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-blue-100 text-blue-600';
      case 'payment':
        return 'bg-green-100 text-green-600';
      case 'campaign':
        return 'bg-purple-100 text-purple-600';
      case 'alert':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && notification.type !== filters.type) {
      return false;
    }
    if (filters.status !== 'all' && notification.status !== filters.status) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-8 w-8 text-gray-400" />
        <h1 className="text-2xl font-semibold">Notificações</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
            placeholder="Buscar notificação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filtros
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="system">Sistema</option>
                <option value="payment">Pagamento</option>
                <option value="campaign">Campanha</option>
                <option value="alert">Alerta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="unread">Não lidas</option>
                <option value="read">Lidas</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4 mb-6">
        {paginatedNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 bg-white rounded-lg border ${
              notification.status === 'unread' ? 'border-[#0066FF] bg-blue-50/50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${getNotificationIcon(notification.type)}`}>
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {notification.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-500">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredNotifications.length)} de {filteredNotifications.length} resultados
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded border ${
                  currentPage === page
                    ? 'bg-[#0066FF] text-white border-[#0066FF]'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
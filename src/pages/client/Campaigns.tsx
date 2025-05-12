import React, { useState } from 'react';
import CampaignTable from '../../components/client/CampaignTable';
import { campaigns } from '../../data/mockData';
import { Search, Filter, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import TimeFilter from '../../components/ui/TimeFilter';

const ClientCampaigns: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [timeFilter, setTimeFilter] = useState('30days');
  const [filters, setFilters] = useState({
    channel: 'all',
    status: 'all',
    minRevenue: '',
    maxRevenue: '',
  });

  const handleTimeFilterChange = (value: string, startDate?: Date, endDate?: Date) => {
    setTimeFilter(value);
    // Here you would typically fetch data for the new date range
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Análise de Campanhas</h1>
        <TimeFilter value={timeFilter} onChange={handleTimeFilterChange} />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
            placeholder="Buscar campanha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtros
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Exportar
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Canal
              </label>
              <select
                name="channel"
                value={filters.channel}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="active">Ativa</option>
                <option value="completed">Concluída</option>
                <option value="scheduled">Agendada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receita Mínima
              </label>
              <input
                type="number"
                name="minRevenue"
                value={filters.minRevenue}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receita Máxima
              </label>
              <input
                type="number"
                name="maxRevenue"
                value={filters.maxRevenue}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="R$ 999.999,99"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <CampaignTable campaigns={campaigns} />
      </div>
    </div>
  );
};

export default ClientCampaigns;
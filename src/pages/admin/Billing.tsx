import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TimeFilter from '../../components/ui/TimeFilter';
import { Search, Filter, Download, X } from 'lucide-react';
import Badge from '../../components/ui/Badge';

type BillingFilters = {
  type: 'all' | 'subscription' | 'commission';
  status: 'all' | 'paid' | 'pending';
  minValue: string;
  maxValue: string;
  startDate: string;
  endDate: string;
};

const Billing: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BillingFilters>({
    type: 'all',
    status: 'all',
    minValue: '',
    maxValue: '',
    startDate: '',
    endDate: ''
  });

  const mockBillings = [
    {
      id: '1',
      client: 'Moda Shop',
      type: 'subscription',
      value: 297.00,
      dueDate: '15/05/2025',
      status: 'paid',
      paymentDate: '13/05/2025',
      paymentMethod: 'Cartão de crédito'
    },
    {
      id: '2',
      client: 'Tênis Sport',
      type: 'commission',
      value: 1250.75,
      dueDate: '20/05/2025',
      status: 'pending'
    },
    {
      id: '3',
      client: 'Loja Virtual Express',
      type: 'subscription',
      value: 297.00,
      dueDate: '10/05/2025',
      status: 'paid',
      paymentDate: '09/05/2025',
      paymentMethod: 'PIX'
    },
    {
      id: '4',
      client: 'Tech Gear',
      type: 'commission',
      value: 875.50,
      dueDate: '25/05/2025',
      status: 'pending'
    }
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      minValue: '',
      maxValue: '',
      startDate: '',
      endDate: ''
    });
    setSearchQuery('');
  };

  const filteredBillings = useMemo(() => {
    return mockBillings.filter(billing => {
      // Search query filter
      if (searchQuery && !billing.client.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && billing.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && billing.status !== filters.status) {
        return false;
      }

      // Value range filter
      if (filters.minValue && billing.value < parseFloat(filters.minValue)) {
        return false;
      }
      if (filters.maxValue && billing.value > parseFloat(filters.maxValue)) {
        return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const billingDate = new Date(billing.dueDate.split('/').reverse().join('-'));
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          if (billingDate < startDate) return false;
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          if (billingDate > endDate) return false;
        }
      }

      return true;
    });
  }, [mockBillings, searchQuery, filters]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Cobranças</h1>
        <TimeFilter value={timeFilter} onChange={setTimeFilter} />
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
            placeholder="Buscar por cliente..."
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
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filtros</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500"
              onClick={clearFilters}
            >
              <X size={16} className="mr-2" />
              Limpar Filtros
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="subscription">Assinatura</option>
                <option value="commission">Comissão</option>
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
                <option value="paid">Pago</option>
                <option value="pending">Pendente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Mínimo
              </label>
              <input
                type="number"
                name="minValue"
                value={filters.minValue}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Máximo
              </label>
              <input
                type="number"
                name="maxValue"
                value={filters.maxValue}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="R$ 999.999,99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">CLIENTE</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">TIPO</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">VALOR</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">VENCIMENTO</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">STATUS</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">PAGAMENTO</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">MÉTODO</th>
              </tr>
            </thead>
            <tbody>
              {filteredBillings.map((billing) => (
                <tr key={billing.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium">{billing.client}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize">
                      {billing.type === 'subscription' ? 'Assinatura' : 'Comissão'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    R$ {billing.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">{billing.dueDate}</td>
                  <td className="py-3 px-4">
                    <Badge status={billing.status as 'paid' | 'pending'}>
                      {billing.status === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {billing.paymentDate || '-'}
                  </td>
                  <td className="py-3 px-4">
                    {billing.paymentMethod || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {filteredBillings.length} de {mockBillings.length} resultados
          </p>
          <div className="flex space-x-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0066FF] text-white">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300">
              ...
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300">
              11
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300">
              &gt;
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Billing;
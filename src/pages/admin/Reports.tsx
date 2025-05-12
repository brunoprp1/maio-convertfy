import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TimeFilter from '../../components/ui/TimeFilter';
import { 
  BarChart3, 
  Users, 
  SendHorizontal, 
  Store,
  Download, 
  Filter, 
  Calendar,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart
} from 'lucide-react';

const ReportCard = ({ title, description, icon, selected, onClick }) => (
  <Card 
    className={`flex flex-col h-full hover:shadow-md cursor-pointer transition-shadow ${
      selected ? 'ring-2 ring-[#0066FF]' : ''
    }`}
    onClick={onClick}
  >
    <div className="p-4 bg-gray-50 rounded-t-lg flex items-center gap-3">
      <div className="bg-[#0066FF] p-2 rounded-full text-white">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
    <div className="p-4 flex-1">
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </Card>
);

const Badge = ({ children, status }) => {
  const colors = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {children}
    </span>
  );
};

const AdminReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('stores');
  const [timeFilter, setTimeFilter] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const mockStoreData = [
    {
      name: 'Moda Shop',
      totalRevenue: 125000,
      previousRevenue: 115000,
      averageTicket: 350,
      conversionRate: 3.2,
      campaignsSent: 24,
      campaignRevenue: 45000,
      revenueShare: 36,
      roi: 4.5,
      performance: 'above'
    },
    {
      name: 'Tênis Sport',
      totalRevenue: 85000,
      previousRevenue: 92000,
      averageTicket: 280,
      conversionRate: 2.8,
      campaignsSent: 18,
      campaignRevenue: 28000,
      revenueShare: 32.9,
      roi: 3.8,
      performance: 'below'
    },
    {
      name: 'Tech Store',
      totalRevenue: 95000,
      previousRevenue: 82000,
      averageTicket: 420,
      conversionRate: 3.5,
      campaignsSent: 20,
      campaignRevenue: 35000,
      revenueShare: 36.8,
      roi: 4.2,
      performance: 'above'
    },
    {
      name: 'Baby Store',
      totalRevenue: 78000,
      previousRevenue: 65000,
      averageTicket: 245,
      conversionRate: 2.9,
      campaignsSent: 16,
      campaignRevenue: 25000,
      revenueShare: 32.1,
      roi: 3.5,
      performance: 'above'
    }
  ];

  const totals = mockStoreData.reduce((acc, curr) => ({
    totalRevenue: acc.totalRevenue + curr.totalRevenue,
    campaignRevenue: acc.campaignRevenue + curr.campaignRevenue,
    campaignsSent: acc.campaignsSent + curr.campaignsSent
  }), {
    totalRevenue: 0,
    campaignRevenue: 0,
    campaignsSent: 0
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <div className="flex items-center gap-4">
          <TimeFilter value={timeFilter} onChange={setTimeFilter} />
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Exportar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div onClick={() => setSelectedReport('revenue')}>
          <ReportCard 
            title="Relatório de Receita" 
            description="Análise completa de receitas, incluindo MRR, crescimento e projeções financeiras."
            icon={<BarChart3 size={20} />}
            selected={selectedReport === 'revenue'}
          />
        </div>
        
        <div onClick={() => setSelectedReport('clients')}>
          <ReportCard 
            title="Relatório de Clientes" 
            description="Métricas de clientes, incluindo novos cadastros, retenção e valor médio de cliente."
            icon={<Users size={20} />}
            selected={selectedReport === 'clients'}
          />
        </div>
        
        <div onClick={() => setSelectedReport('campaigns')}>
          <ReportCard 
            title="Relatório de Campanhas" 
            description="Desempenho de campanhas por canal, taxas de conversão e ROI por cliente."
            icon={<SendHorizontal size={20} />}
            selected={selectedReport === 'campaigns'}
          />
        </div>
        
        <div onClick={() => setSelectedReport('stores')}>
          <ReportCard 
            title="Desempenho das Lojas" 
            description="Análise comparativa do desempenho das lojas, métricas de crescimento e conversão."
            icon={<Store size={20} />}
            selected={selectedReport === 'stores'}
          />
        </div>
      </div>

      {selectedReport === 'stores' && (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
                placeholder="Buscar loja..."
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
            </div>
          </div>

          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Faturamento Total</p>
                <p className="text-2xl font-semibold">
                  R$ {totals.totalRevenue.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Faturamento via Campanhas</p>
                <p className="text-2xl font-semibold">
                  R$ {totals.campaignRevenue.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total de Campanhas</p>
                <p className="text-2xl font-semibold">
                  {totals.campaignsSent}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Média de Conversão</p>
                <p className="text-2xl font-semibold">
                  {(mockStoreData.reduce((acc, curr) => acc + curr.conversionRate, 0) / mockStoreData.length).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">LOJA</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">FATURAMENTO TOTAL</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">CRESCIMENTO</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">TICKET MÉDIO</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">CONVERSÃO</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">CAMPANHAS</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">RECEITA CAMPANHAS</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">% FATURAMENTO</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ROI</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">PERFORMANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStoreData.map((store, index) => {
                    const growth = ((store.totalRevenue - store.previousRevenue) / store.previousRevenue) * 100;
                    
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium">{store.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          R$ {store.totalRevenue.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          R$ {store.averageTicket.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          {store.conversionRate}%
                        </td>
                        <td className="py-3 px-4">
                          {store.campaignsSent}
                        </td>
                        <td className="py-3 px-4">
                          R$ {store.campaignRevenue.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          {store.revenueShare}%
                        </td>
                        <td className="py-3 px-4">
                          {store.roi}x
                        </td>
                        <td className="py-3 px-4">
                          <Badge status={store.performance === 'above' ? 'positive' : 'negative'}>
                            {store.performance === 'above' ? 'Acima da média' : 'Abaixo da média'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminReports;
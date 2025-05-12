import React, { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import RevenueChart from '../../components/charts/RevenueChart';
import DistributionChart from '../../components/charts/DistributionChart';
import TimeFilter from '../../components/ui/TimeFilter';
import { dashboardData } from '../../data/mockData';
import { getAsaasFinancialMetrics, AsaasFinancialData } from '../../services/api/asaas';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Send,
  Users,
  Clock,
  RefreshCcw,
  XCircle,
  AlertOctagon,
  MessageSquare,
  ShoppingCart,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('30days');
  const [contractType, setContractType] = useState('all');
  const [asaasData, setAsaasData] = useState<AsaasFinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const data = dashboardData.adminDashboard;

  useEffect(() => {
    fetchAsaasData();
  }, [timeFilter]);

  const fetchAsaasData = async () => {
    setLoading(true);
    setError('');
    try {
      const financialData = await getAsaasFinancialMetrics();
      setAsaasData(financialData);
    } catch (err) {
      console.error('Error fetching Asaas data:', err);
      if (err instanceof Error && err.message.includes('configure')) {
        setError('Integração com Asaas não configurada. Configure suas credenciais nas configurações.');
      } else {
        setError('Erro ao carregar dados do Asaas. Por favor, tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calcular valores baseados nos dados da Asaas
  // Receita Total: valor a receber (pendingAmount + receivedAmount)
  // Receita Líquida: valor já recebido (receivedAmount)
  const totalRevenue = asaasData ? (asaasData.pendingAmount + asaasData.receivedAmount) : data.totalRevenue;
  const receivedAmount = asaasData ? asaasData.receivedAmount : data.netRevenue;
  const pendingAmount = asaasData ? asaasData.pendingAmount : 0;
  const mrr = asaasData ? asaasData.monthlyRevenue : data.mrr;
  
  // Usar dados mockados para as porcentagens de mudança por enquanto
  const mrrChange = data.mrrChange;
  const revenueChange = data.totalRevenueChange;
  const receivedChange = data.netRevenueChange;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard Administrativo</h1>
        <div className="flex items-center gap-4">
          <select
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
          >
            <option value="all">Todos os Contratos</option>
            <option value="partner">Parceiro</option>
            <option value="flexible">Flexível</option>
            <option value="quarterly">3 Meses</option>
            <option value="biannual">6 Meses</option>
          </select>
          <TimeFilter value={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
          <p className="text-yellow-700">{error}</p>
          <Link to="/admin/settings?tab=integrations">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings size={16} />
              Configurar Asaas
            </Button>
          </Link>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="MRR"
            value={mrr}
            change={mrrChange}
            variant="currency"
            icon={<DollarSign className="text-green-600" size={20} />}
          />
          
          <StatCard
            title="Receita Total (A Receber)"
            value={totalRevenue}
            change={revenueChange}
            variant="currency"
            icon={<TrendingUp className="text-blue-600" size={20} />}
          />
          
          <StatCard
            title="Receita Recebida"
            value={receivedAmount}
            change={receivedChange}
            variant="currency"
            icon={<DollarSign className="text-indigo-600" size={20} />}
          />
          
          <StatCard
            title="Receita Pendente"
            value={pendingAmount}
            change={0}
            variant="currency"
            icon={<AlertOctagon className="text-yellow-600" size={20} />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart type="admin" />
        </div>
        
        <div className="lg:col-span-1">
          <DistributionChart type="admin" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <RefreshCcw className="text-green-600" size={20} />
            <h3 className="font-medium">Clientes Ativos</h3>
          </div>
          <p className="text-2xl font-bold">{asaasData?.totalCustomers || data.clientMetrics.activeClients}</p>
          <p className="text-sm text-green-600 mt-1">
            +{data.clientMetrics.activeClientsChange}% esse mês
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="text-red-600" size={20} />
            <h3 className="font-medium">Taxa de Churn</h3>
          </div>
          <p className="text-2xl font-bold">{data.clientMetrics.churnRate}%</p>
          <p className="text-sm text-green-600 mt-1">
            {data.clientMetrics.churnRateChange}% esse mês
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-600" size={20} />
            <h3 className="font-medium">Novos Clientes</h3>
          </div>
          <p className="text-2xl font-bold">{asaasData?.totalCustomers || data.clientMetrics.activeClients}</p>
          <p className="text-sm text-green-600 mt-1">
            +{data.clientMetrics.activeClientsChange}% esse mês
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="text-purple-600" size={20} />
            <h3 className="font-medium">Ticket Médio</h3>
          </div>
          <p className="text-2xl font-bold">
            R$ {data.clientMetrics.cac.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-green-600 mt-1">
            +{data.clientMetrics.cacChange}% esse mês
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-medium mb-4">Clientes Recentes</h3>
          <div className="space-y-4">
            {data.recentClients.map(client => (
              <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar name={client.name} size="sm" />
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                <Badge status={client.status as 'active' | 'inactive'}>
                  {client.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-[#5947FD]" size={24} />
              <h3 className="text-lg font-medium">Campanhas Recentes</h3>
            </div>
            <Link to="/admin/campaigns" className="text-[#0066FF] text-sm hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="space-y-4">
            {[
              {
                id: '1',
                name: 'Black Friday Principal',
                client: 'Moda Shop',
                date: '24/11/2024',
                revenue: 45680
              },
              {
                id: '2',
                name: 'Recuperação de Carrinho',
                client: 'Tech Store',
                date: '14/11/2024',
                revenue: 12560
              },
              {
                id: '3',
                name: 'Lançamento Verão',
                client: 'Fashion Store',
                date: '09/10/2024',
                revenue: 25480
              }
            ].map(campaign => (
              <div key={campaign.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-gray-500">{campaign.client}</p>
                    <p className="text-xs text-gray-400 mt-1">{campaign.date}</p>
                  </div>
                  <p className="font-medium text-green-600">
                    R$ {campaign.revenue.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertOctagon className="text-red-600" size={24} />
            <h3 className="text-lg font-medium">Clientes em Risco</h3>
          </div>
          <Link to="/admin/clients" className="text-[#0066FF] text-sm hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">CLIENTE</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">FATURAS PENDENTES</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">VALOR TOTAL</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ÚLTIMO PAGAMENTO</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">DIAS EM ATRASO</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: '1',
                  name: 'Tech Store',
                  email: 'contact@techstore.com',
                  pendingInvoices: 2,
                  totalPending: 594.00,
                  lastPayment: '10/03/2025',
                  daysOverdue: 15
                },
                {
                  id: '2',
                  name: 'Fashion Shop',
                  email: 'admin@fashionshop.com',
                  pendingInvoices: 1,
                  totalPending: 297.00,
                  lastPayment: '15/03/2025',
                  daysOverdue: 8
                }
              ].map((client) => (
                <tr key={client.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{client.pendingInvoices}</td>
                  <td className="py-3 px-4">
                    R$ {client.totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">{client.lastPayment}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.daysOverdue > 10 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.daysOverdue} dias
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link 
                      to={`/admin/clients/${client.id}`}
                      className="text-[#0066FF] text-sm hover:underline"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
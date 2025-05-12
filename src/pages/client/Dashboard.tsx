import React, { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ChannelIcon from '../../components/ui/ChannelIcon';
import RevenueChart from '../../components/charts/RevenueChart';
import DistributionChart from '../../components/charts/DistributionChart';
import TimeFilter from '../../components/ui/TimeFilter';
import { dashboardData, campaigns } from '../../data/mockData';
import { DollarSign, TrendingUp, Target, Send, ArrowUpRight, ChevronRight, Award, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampaignDetails from '../../components/client/CampaignDetails';
import { getKlaviyoRevenue } from '../../services/api/klaviyo';

const ClientDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('30days');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const data = dashboardData.clientDashboard;

  useEffect(() => {
    const fetchKlaviyoRevenue = async () => {
      try {
        setLoading(true);
        const revenue = await getKlaviyoRevenue();
        setTotalRevenue(revenue);
        setError('');
      } catch (err) {
        console.error('Error fetching Klaviyo revenue:', err);
        if (err instanceof Error && err.message.includes('configure')) {
          setError('Integração com Klaviyo não configurada. Configure suas credenciais nas configurações.');
        } else {
          setError('Erro ao carregar dados do Klaviyo. Por favor, tente novamente mais tarde.');
        }
        // Use mock data as fallback when Klaviyo fails
        setTotalRevenue(data.totalRevenue);
      } finally {
        setLoading(false);
      }
    };

    fetchKlaviyoRevenue();
  }, [data.totalRevenue]);

  // Mock current revenue and next milestone
  const currentRevenue = 75000;
  const nextMilestone = 100000;
  const progress = (currentRevenue / nextMilestone) * 100;

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
          <p className="text-yellow-700">{error}</p>
          <Link to="/client/settings?tab=integrations">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings size={16} />
              Configurar Klaviyo
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Visão Geral de Resultados</h1>
        <TimeFilter value={timeFilter} onChange={handleTimeFilterChange} />
      </div>

      <Card className="mb-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowRevenueDetails(true)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-[#5947FD]" />
              <div>
                <h3 className="font-medium">Próxima Conquista</h3>
                <p className="text-sm text-gray-500">
                  Faltam R$ {(nextMilestone - currentRevenue).toLocaleString('pt-BR')} para R$ {nextMilestone.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <Link to="/client/rewards" className="text-[#5947FD] text-sm hover:underline flex items-center gap-1">
              Ver todas conquistas
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-[#5947FD] rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">R$ {currentRevenue.toLocaleString('pt-BR')}</span>
            <span className="text-gray-500">R$ {nextMilestone.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#5947FD]/0 via-[#5947FD]/5 to-[#5947FD]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard
          title="Faturamento Total"
          value={totalRevenue}
          change={data.totalRevenueChange}
          variant="currency"
          icon={<DollarSign className="text-green-600" size={20} />}
        />
        
        <StatCard
          title="Faturamento atribuído"
          value={data.attributedRevenue}
          change={data.attributedRevenueChange}
          variant="currency"
          icon={<TrendingUp className="text-blue-600" size={20} />}
        />
        
        <StatCard
          title="Taxa de conversão"
          value={data.conversionRate}
          change={data.conversionRateChange}
          variant="percentage"
          icon={<Target className="text-purple-600" size={20} />}
        />
        
        <StatCard
          title="Campanhas enviadas"
          value={data.campaignsSent}
          icon={<Send className="text-indigo-600" size={20} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart type="client" />
        </div>
        
        <div className="lg:col-span-1">
          <DistributionChart type="client" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card>
          <div className="flex items-center mb-4">
            <ChannelIcon channel="email" className="mr-3" />
            <h3 className="text-lg font-medium">Email Marketing</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Receita</span>
              <span className="font-medium">
                R$ {data.channels.email.revenue.toLocaleString('pt-BR')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de abertura</span>
              <span className="font-medium">{data.channels.email.openRate}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de cliques</span>
              <span className="font-medium">{data.channels.email.clickRate}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Campanhas</span>
              <span className="font-medium">{data.channels.email.campaigns}</span>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center mb-4">
            <ChannelIcon channel="whatsapp" className="mr-3" />
            <h3 className="text-lg font-medium">WhatsApp</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Receita</span>
              <span className="font-medium">
                R$ {data.channels.whatsapp.revenue.toLocaleString('pt-BR')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Mensagens enviadas</span>
              <span className="font-medium">
                {data.channels.whatsapp.messagesSent.toLocaleString('pt-BR')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de entrega</span>
              <span className="font-medium">{data.channels.whatsapp.deliveryRate}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de interação</span>
              <span className="font-medium">{data.channels.whatsapp.interactionRate}%</span>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center mb-4">
            <ChannelIcon channel="sms" className="mr-3" />
            <h3 className="text-lg font-medium">SMS</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Receita</span>
              <span className="font-medium">
                R$ {data.channels.sms.revenue.toLocaleString('pt-BR')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Mensagens enviadas</span>
              <span className="font-medium">
                {data.channels.sms.messagesSent.toLocaleString('pt-BR')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">CTR</span>
              <span className="font-medium">{data.channels.sms.ctr}%</span>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Desempenho das Campanhas</h3>
          <Link 
            to="/client/campaigns" 
            className="text-[#0066FF] hover:text-[#0055D4] flex items-center gap-1 text-sm font-medium"
          >
            Ver todas
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          {campaigns.slice(0, 3).map((campaign) => (
            <button
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign)}
              className="w-full flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left gap-4"
            >
              <div className="flex items-center gap-4">
                <ChannelIcon channel={campaign.type} />
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-500">{campaign.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 lg:gap-12">
                <div className="flex-1 lg:text-right">
                  <p className="text-sm text-gray-500">Abertura</p>
                  <p className="font-medium text-gray-900">{campaign.openRate}%</p>
                </div>
                <div className="flex-1 lg:text-right">
                  <p className="text-sm text-gray-500">Conversões</p>
                  <p className="font-medium text-gray-900">{campaign.conversions}</p>
                </div>
                <div className="flex-1 lg:text-right">
                  <p className="text-sm text-gray-500">Receita</p>
                  <p className="font-medium text-gray-900">
                    R$ {campaign.revenue.toLocaleString('pt-BR')}
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-400 hidden lg:block" />
              </div>
            </button>
          ))}
        </div>
      </Card>

      {selectedCampaign && (
        <CampaignDetails
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
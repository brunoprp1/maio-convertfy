import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, Filter, Download, Award, Mail } from 'lucide-react';
import TimeFilter from '../../components/ui/TimeFilter';
import Badge from '../../components/ui/Badge';

const ClaimedRewards: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for claimed rewards
  const claimedRewards = [
    {
      id: '1',
      clientName: 'Moda Shop',
      clientEmail: 'contato@modashop.com.br',
      milestone: 50000,
      achievementName: 'Primeiro Marco',
      claimedAt: '15/03/2025',
      status: 'pending',
    },
    {
      id: '2',
      clientName: 'Tech Store',
      clientEmail: 'contato@techstore.com.br',
      milestone: 100000,
      achievementName: 'Crescimento Constante',
      claimedAt: '10/03/2025',
      status: 'sent',
    },
    {
      id: '3',
      clientName: 'Baby Store',
      clientEmail: 'contato@babystore.com.br',
      milestone: 250000,
      achievementName: 'Parceiro Prata',
      claimedAt: '05/03/2025',
      status: 'sent',
    },
  ];

  const handleSendReward = (rewardId: string) => {
    // Handle sending reward logic here
    console.log('Sending reward:', rewardId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-[#5947FD]" />
          <h1 className="text-2xl font-semibold">Conquistas Resgatadas</h1>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select className="block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="sent">Enviado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marco
              </label>
              <select className="block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="all">Todos</option>
                <option value="50k">R$ 50.000</option>
                <option value="100k">R$ 100.000</option>
                <option value="250k">R$ 250.000</option>
                <option value="500k">R$ 500.000</option>
                <option value="1m">R$ 1.000.000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Resgate
              </label>
              <input
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">CLIENTE</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">CONQUISTA</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">MARCO</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">DATA DE RESGATE</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">STATUS</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {claimedRewards.map((reward) => (
                <tr key={reward.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{reward.clientName}</p>
                      <p className="text-sm text-gray-500">{reward.clientEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">{reward.achievementName}</td>
                  <td className="py-4 px-4">
                    R$ {reward.milestone.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-4 px-4">{reward.claimedAt}</td>
                  <td className="py-4 px-4">
                    <Badge status={reward.status as 'pending' | 'active'}>
                      {reward.status === 'pending' ? 'Pendente' : 'Enviado'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      {reward.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => handleSendReward(reward.id)}
                        >
                          <Mail size={16} />
                          Enviar Prêmio
                        </Button>
                      )}
                    </div>
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

export default ClaimedRewards;
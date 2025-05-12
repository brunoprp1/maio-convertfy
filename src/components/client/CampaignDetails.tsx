import React, { useEffect } from 'react';
import { X, Mail, Users, DollarSign, MousePointer, ShoppingCart, ArrowRight, Clock } from 'lucide-react';
import Card from '../ui/Card';
import { Campaign } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

type CampaignDetailsProps = {
  campaign: Campaign;
  onClose: () => void;
  isOpen: boolean;
};

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, onClose, isOpen }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  if (!isOpen) return null;

  const metrics = [
    {
      label: 'Alcance',
      value: campaign.reach.toLocaleString('pt-BR'),
      icon: <Users className="text-blue-600" />,
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Taxa de Abertura',
      value: `${campaign.openRate?.toLocaleString('pt-BR')}%`,
      icon: <Mail className="text-green-600" />,
      bgColor: 'bg-green-100',
    },
    {
      label: 'Taxa de Clique',
      value: '12.5%',
      icon: <MousePointer className="text-purple-600" />,
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Conversões',
      value: campaign.conversions.toString(),
      icon: <ShoppingCart className="text-orange-600" />,
      bgColor: 'bg-orange-100',
    },
  ];

  const timelineEvents = [
    { time: '10:00', event: 'Campanha iniciada', status: 'success' },
    { time: '10:15', event: '2.500 emails enviados', status: 'success' },
    { time: '10:30', event: '5.000 emails enviados', status: 'success' },
    { time: '11:00', event: 'Primeira conversão registrada', status: 'success' },
    { time: '12:00', event: 'Meta de abertura atingida', status: 'success' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <AnimatePresence>
        <motion.div
          initial={{ x: 600 }}
          animate={{ x: 0 }}
          exit={{ x: 600 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white w-full max-w-2xl h-full overflow-y-auto"
        >
          <div className="sticky top-0 bg-white z-10 border-b">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-xl font-semibold">{campaign.name}</h2>
                <p className="text-sm text-gray-500">{campaign.date}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      {metric.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{metric.label}</p>
                      <p className="text-xl font-semibold">{metric.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card>
              <h3 className="text-lg font-medium mb-4">Desempenho Financeiro</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Receita Total</p>
                      <p className="text-lg font-semibold">
                        R$ {campaign.revenue.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">ROI</p>
                    <p className="text-lg font-semibold text-green-600">
                      {campaign.roi}x
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Ticket Médio</p>
                    <p className="font-semibold">R$ 350,00</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Custo por Conversão</p>
                    <p className="font-semibold">R$ 12,50</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Taxa de Conversão</p>
                    <p className="font-semibold">2.8%</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium mb-4">Linha do Tempo</h3>
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Clock size={16} className="text-blue-600" />
                      </div>
                      {index !== timelineEvents.length - 1 && (
                        <div className="w-px h-full bg-gray-200 my-2"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.event}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium mb-4">Segmentação</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Clientes ativos nos últimos 30 dias</span>
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Compraram categoria "Verão"</span>
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Ticket médio &gt; R$ 200</span>
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CampaignDetails;
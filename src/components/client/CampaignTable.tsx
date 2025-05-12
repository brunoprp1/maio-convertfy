import React, { useState } from 'react';
import { Campaign } from '../../types';
import ChannelIcon from '../ui/ChannelIcon';
import { ChevronRight } from 'lucide-react';
import CampaignDetails from './CampaignDetails';

type CampaignTableProps = {
  campaigns: Campaign[];
};

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  return (
    <>
      <div className="space-y-4 p-4">
        {campaigns.map((campaign) => (
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

            <div className="grid grid-cols-3 lg:flex items-center gap-4 lg:gap-12">
              <div className="text-left lg:text-right">
                <p className="text-sm text-gray-500">Abertura</p>
                <p className="font-medium text-gray-900">{campaign.openRate}%</p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-sm text-gray-500">Conversões</p>
                <p className="font-medium text-gray-900">{campaign.conversions}</p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-sm text-gray-500">Receita</p>
                <p className="font-medium text-gray-900">R$ {campaign.revenue.toLocaleString('pt-BR')}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400 hidden lg:block" />
            </div>
          </button>
        ))}
      </div>

      {selectedCampaign && (
        <CampaignDetails
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </>
  );
};

export default CampaignTable;
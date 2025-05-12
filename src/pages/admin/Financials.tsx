import React, { useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import RevenueChart from '../../components/charts/RevenueChart';
import DistributionChart from '../../components/charts/DistributionChart';
import { dashboardData } from '../../data/mockData';
import { Period } from '../../types';

const AdminFinancials: React.FC = () => {
  const [period, setPeriod] = useState<Period>('30 dias');
  const data = dashboardData.adminDashboard;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Visão Geral Financeira</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['7 dias', '30 dias', '90 dias'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`
              px-3 py-1 text-sm rounded-md
              ${period === p 
                ? 'bg-[#0066FF] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            {p}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="MRR"
          value={data.mrr}
          change={data.mrrChange}
          variant="currency"
        />
        
        <StatCard
          title="Receita Total"
          value={data.totalRevenue}
          change={data.totalRevenueChange}
          variant="currency"
        />
        
        <StatCard
          title="Faturamento Líquido"
          value={data.netRevenue}
          change={data.netRevenueChange}
          variant="currency"
        />
        
        <StatCard
          title="Taxa de Inadimplência"
          value={data.defaultRate}
          change={data.defaultRateChange}
          variant="percentage"
          isInverted={true}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart type="admin" />
        </div>
        
        <div className="lg:col-span-1">
          <DistributionChart type="admin" />
        </div>
      </div>
    </div>
  );
};

export default AdminFinancials;
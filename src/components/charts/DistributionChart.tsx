import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

type DistributionChartProps = {
  data?: any;
  type: 'client' | 'admin';
  className?: string;
};

const clientData = [
  { name: 'Email', value: 45, amount: 18750, color: '#5947FD' },
  { name: 'WhatsApp', value: 35, amount: 7550, color: '#10B981' },
  { name: 'SMS', value: 20, amount: 11550, color: '#F59E0B' }
];

const adminData = [
  { name: 'Assinaturas', value: 60, amount: 29700, color: '#5947FD' },
  { name: 'Comissões', value: 40, amount: 14150, color: '#10B981' }
];

const DistributionChart: React.FC<DistributionChartProps> = ({ type, className = '' }) => {
  const data = type === 'client' ? clientData : adminData;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900 mb-1">{data.name}</p>
          <p className="text-gray-600 mb-1">{data.value}%</p>
          <p className="text-gray-600 font-medium">
            R$ {data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col gap-4 w-full mt-6">
        {payload.map((entry: any, index: number) => (
          <div 
            key={`item-${index}`} 
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">
                {entry.value} ({entry.payload.value}%)
              </span>
            </div>
            <span className="text-gray-900">
              R$ {entry.payload.amount.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`card h-full min-h-[400px] p-6 ${className}`}
    >
      <h3 className="text-base md:text-lg font-medium mb-6">
        {type === 'client' ? 'Distribuição por Canal' : 'Distribuição de Receita'}
      </h3>
      
      <div className="h-[340px] flex flex-col">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1500}
                strokeWidth={0}
              >
                {data.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                content={<CustomLegend />}
                verticalAlign="bottom"
                height={140}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default DistributionChart;
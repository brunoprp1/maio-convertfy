import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

type RevenueChartProps = {
  data?: any;
  type: 'client' | 'admin';
  className?: string;
};

const mockData = [
  { name: '01/03', total: 45000, attributed: 15000 },
  { name: '02/03', total: 42000, attributed: 14000 },
  { name: '03/03', total: 48000, attributed: 16500 },
  { name: '04/03', total: 51000, attributed: 18000 },
  { name: '05/03', total: 47000, attributed: 16000 },
  { name: '06/03', total: 52000, attributed: 19000 },
  { name: '07/03', total: 49000, attributed: 17500 },
];

const RevenueChart: React.FC<RevenueChartProps> = ({ type, className = '' }) => {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card h-full min-h-[400px] ${className}`}
    >
      <h3 className="text-base md:text-lg font-medium mb-4">
        {type === 'client' ? 'Evolução de Receita' : 'Receita por Categoria'}
      </h3>
      
      <div className="h-[340px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={mockData} 
            margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              fontSize={12}
              tickFormatter={formatCurrency}
              width={80}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Receita']}
              contentStyle={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              iconSize={8}
              wrapperStyle={{
                fontSize: '0.875rem',
                paddingTop: '1rem'
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Faturamento Total"
              stroke="#5947FD"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="attributed"
              name="Faturamento Convertfy"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RevenueChart;
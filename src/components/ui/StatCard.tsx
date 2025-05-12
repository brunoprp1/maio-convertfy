import React from 'react';
import Card from './Card';
import ValueChangeIndicator from './ValueChangeIndicator';
import { motion } from 'framer-motion';

type StatCardProps = {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'currency' | 'percentage';
  className?: string;
  isInverted?: boolean;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'default',
  className = '',
  isInverted = false,
}) => {
  const formatValue = () => {
    if (typeof value === 'string') return value;
    
    switch (variant) {
      case 'currency':
        return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      case 'percentage':
        return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`;
      default:
        return value.toLocaleString('pt-BR');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="h-full"
    >
      <Card className={`flex flex-col h-full hover:shadow-md transition-all duration-200 ${className}`}>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-gray-50 dark:bg-dark-100 rounded-lg">
              {icon}
            </div>
          )}
          <span className="text-gray-500 dark:text-dark-500 text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900 dark:text-dark-900">{formatValue()}</span>
          {change !== undefined && (
            <ValueChangeIndicator 
              value={change} 
              isInverted={isInverted} 
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
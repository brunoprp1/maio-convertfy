import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type ValueChangeIndicatorProps = {
  value: number;
  className?: string;
  isInverted?: boolean;
};

const ValueChangeIndicator: React.FC<ValueChangeIndicatorProps> = ({
  value,
  className = '',
  isInverted = false,
}) => {
  const isPositive = value >= 0;
  const isGood = isInverted ? !isPositive : isPositive;
  
  return (
    <span
      className={`
        inline-flex items-center gap-1 text-sm
        ${isGood ? 'text-success dark:text-success' : 'text-error dark:text-error'}
        ${className}
      `}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {isPositive ? '+' : ''}
      {value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
    </span>
  );
};

export default ValueChangeIndicator;
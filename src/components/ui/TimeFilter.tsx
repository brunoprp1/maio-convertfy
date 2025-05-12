import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

type TimeFilterProps = {
  value: string;
  onChange: (value: string, startDate?: Date, endDate?: Date) => void;
};

const TimeFilter: React.FC<TimeFilterProps> = ({ value, onChange }) => {
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const customDateRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: 'Hoje', value: 'today' },
    { label: 'Últimos 3 dias', value: '3days' },
    { label: '7 dias', value: '7days' },
    { label: '30 dias', value: '30days' },
    { label: 'Mês passado', value: 'lastMonth' },
    { label: 'Personalizado', value: 'custom' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customDateRef.current && !customDateRef.current.contains(event.target as Node)) {
        setShowCustomDates(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === 'custom') {
      setShowCustomDates(true);
    } else {
      onChange(newValue);
      setShowCustomDates(false);
    }
  };

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      onChange('custom', new Date(startDate), new Date(endDate));
      setShowCustomDates(false);
    }
  };

  return (
    <div className="relative" ref={customDateRef}>
      <div className="relative">
        <select
          value={value}
          onChange={handleSelectChange}
          className="appearance-none pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-200 rounded-md bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900 focus:outline-none focus:ring-primary focus:border-primary"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-dark-400" />
      </div>

      {showCustomDates && (
        <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-dark-50 rounded-lg shadow-lg border border-gray-200 dark:border-dark-200 z-50 w-72">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-md text-sm bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-200 rounded-md text-sm bg-white dark:bg-dark-50 text-gray-900 dark:text-dark-900"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCustomDates(false)}
                className="px-3 py-2 text-sm text-gray-600 dark:text-dark-600 hover:text-gray-800 dark:hover:text-dark-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleCustomDateSubmit}
                className="px-3 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark"
                disabled={!startDate || !endDate}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeFilter;
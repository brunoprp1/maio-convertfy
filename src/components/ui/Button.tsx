import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  icon,
  fullWidth = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary-dark text-white dark:bg-primary dark:hover:bg-primary-dark dark:text-white';
      case 'secondary':
        return 'bg-primary hover:bg-primary-dark text-white dark:bg-primary dark:hover:bg-primary-dark dark:text-white';
      case 'outline':
        return 'border border-primary text-primary hover:bg-primary/5 dark:border-primary dark:text-primary dark:hover:bg-primary/10';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-800 dark:hover:bg-dark-100 dark:text-dark-800';
      case 'link':
        return 'bg-transparent text-primary hover:text-primary-dark hover:underline dark:text-primary dark:hover:text-primary-light p-0';
      default:
        return 'bg-primary hover:bg-primary-dark text-white dark:bg-primary dark:hover:bg-primary-dark dark:text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1 px-3';
      case 'md':
        return 'text-sm py-2 px-4';
      case 'lg':
        return 'text-base py-3 px-6';
      default:
        return 'text-sm py-2 px-4';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        rounded-md font-medium flex items-center justify-center gap-2
        transition-colors duration-200 ease-in-out focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
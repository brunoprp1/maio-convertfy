import React from 'react';

type AvatarProps = {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  name,
  image,
  size = 'md',
  className = '',
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'md':
        return 'w-10 h-10 text-sm';
      case 'lg':
        return 'w-12 h-12 text-base';
      default:
        return 'w-10 h-10 text-sm';
    }
  };

  return (
    <div
      className={`
        ${getSizeStyles()} 
        rounded-full flex items-center justify-center 
        bg-primary text-white font-medium shadow-sm
        ${className}
      `}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};

export default Avatar;
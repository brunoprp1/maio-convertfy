import React from 'react';
import { MessageSquare, Mail, MessageCircle } from 'lucide-react';

type ChannelIconProps = {
  channel: 'email' | 'whatsapp' | 'sms';
  size?: number;
  className?: string;
};

const ChannelIcon: React.FC<ChannelIconProps> = ({ 
  channel, 
  size = 16, 
  className = '' 
}) => {
  const getIcon = () => {
    switch (channel) {
      case 'email':
        return (
          <div className={`bg-blue-100 p-1 rounded-md ${className}`}>
            <Mail size={size} className="text-blue-600" />
          </div>
        );
      case 'whatsapp':
        return (
          <div className={`bg-green-100 p-1 rounded-md ${className}`}>
            <MessageCircle size={size} className="text-green-600" />
          </div>
        );
      case 'sms':
        return (
          <div className={`bg-orange-100 p-1 rounded-md ${className}`}>
            <MessageSquare size={size} className="text-orange-600" />
          </div>
        );
      default:
        return null;
    }
  };

  return getIcon();
};

export default ChannelIcon;
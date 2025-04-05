import React from 'react';

type IconName = 
  | 'user'
  | 'box'
  | 'map-pin'
  | 'syringe'
  | 'clipboard'
  | 'pill'
  | 'log-out'
  | 'chevron-right';

interface IconProps {
  name: IconName;
}

const Icon: React.FC<IconProps> = ({ name }) => {
  const iconMap: Record<IconName, React.ReactNode> = {
    'user': <div className="w-5 h-5 flex items-center justify-center">👤</div>,
    'box': <div className="w-5 h-5 flex items-center justify-center">📦</div>,
    'map-pin': <div className="w-5 h-5 flex items-center justify-center">📍</div>,
    'syringe': <div className="w-5 h-5 flex items-center justify-center">💉</div>,
    'clipboard': <div className="w-5 h-5 flex items-center justify-center">📋</div>,
    'pill': <div className="w-5 h-5 flex items-center justify-center">💊</div>,
    'log-out': <div className="w-5 h-5 flex items-center justify-center">🚪</div>,
    'chevron-right': <div className="w-5 h-5 flex items-center justify-center">▶️</div>
  };
  
  return <>{iconMap[name]}</>;
};

export default Icon;
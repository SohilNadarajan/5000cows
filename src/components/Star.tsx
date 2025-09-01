import React from 'react';
import './Star.css';

interface StarProps {
  size?: number;
  className?: string;
}

export const Star: React.FC<StarProps> = ({ size = 20, className = '' }) => {
  return (
    <div 
      className={`star-container ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: '8px'
      }}
    >
      <div className="star-outline"></div>
    </div>
  );
};

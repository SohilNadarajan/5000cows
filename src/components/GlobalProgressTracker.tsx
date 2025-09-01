import React from 'react';
import { calculateTotalCows } from '../constants';
import '../styles/shared.css';

interface GlobalProgressTrackerProps {
  totalCowsFound: number;
}

export const GlobalProgressTracker: React.FC<GlobalProgressTrackerProps> = ({
  totalCowsFound,
}) => {
  const totalCows = calculateTotalCows();
  const percentage = Math.round((totalCowsFound / totalCows) * 100);

  return (
    <div className="component-container" style={{
      minWidth: '400px',
      width: '50vw',
    }}>
      {/* Total Progress title - left aligned */}
      <div className="title">
        Total Progress
      </div>
      
      {/* Bottom row with fraction and remaining count */}
      <div className="flex-row">
        {/* Left side - fraction */}
        <div className="fraction">
          {totalCowsFound} / {totalCows} Cows
        </div>
        
        {/* Right side - remaining count */}
        <div className="secondary-info">
          {totalCows - totalCowsFound} cows remaining
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container" style={{
        height: '16px',
        marginBottom: '15px',
        position: 'relative',
      }}>
        {/* Progress fill with gradient */}
        <div className="progress-bar-fill" style={{
          width: `${percentage}%`,
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '20px',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
        }}>
          {/* Shine effect */}
          <div className="progress-bar-shine" style={{
            borderRadius: '20px 20px 0 0',
          }} />
        </div>
        
        {/* Progress percentage overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: percentage > 50 ? '#FDF6E3' : '#8b4513',
          fontSize: '11px',
          fontWeight: 'bold',
          textShadow: percentage > 50 ? '1px 1px 2px rgba(0, 0, 0, 0.5)' : 'none',
          pointerEvents: 'none',
        }}>
          {percentage}%
        </div>
      </div>
    </div>
  );
};

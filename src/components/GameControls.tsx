import React from 'react';
import '../styles/shared.css';
import { Star } from './Star';

interface GameControlsProps {
  currentLevel: number;
  totalLevels: number;
  cowsFound: number;
  cowsToFind: number;
  onPreviousLevel: () => void;
  onNextLevel: () => void;
  onHint: () => void;
  onReset: () => void;
  isCompleted: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  currentLevel,
  totalLevels,
  cowsFound,
  cowsToFind,
  onPreviousLevel,
  onNextLevel,
  onHint,
  onReset,
  isCompleted,
}) => {
  return (
    <div className="component-container" style={{
      width: '250px',
    }}>
      <div className="title" style={{ display: 'flex', alignItems: 'center' }}>
        Level {currentLevel}
        {isCompleted && <Star size={24} />}
      </div>

      <div className="flex-row">
        <div className="fraction">{cowsFound} / {cowsToFind} Cows</div>
        <div className="secondary-info">{currentLevel} of {totalLevels} levels</div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${(cowsFound / cowsToFind) * 100}%`,
            background: isCompleted 
              ? 'linear-gradient(90deg, #D4AF37 0%, #F4E4A6 50%, #D4AF37 100%)'
              : undefined
          }} 
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: (cowsFound / cowsToFind) * 100 > 50 ? '#FDF6E3' : '#8b4513',
          fontSize: '11px',
          fontWeight: 'bold',
          textShadow: (cowsFound / cowsToFind) * 100 > 50 ? '1px 1px 2px rgba(0, 0, 0, 0.5)' : 'none',
          pointerEvents: 'none',
        }}>
          {Math.round((cowsFound / cowsToFind) * 100)}%
        </div>
      </div>

      <div className="nav-buttons">
        <button onClick={onPreviousLevel} disabled={currentLevel <= 1}>← Prev</button>
        <button onClick={onNextLevel} disabled={currentLevel >= totalLevels}>Next →</button>
      </div>

      <div className="action-buttons">
        <button onClick={onHint} disabled={isCompleted}>Hint</button>
        <button onClick={onReset}>Reset Game</button>
      </div>
    </div>

  );
};

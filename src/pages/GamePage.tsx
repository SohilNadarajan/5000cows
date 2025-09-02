import React, { useState } from 'react';
import { WordSearchGrid } from '../components/WordSearchGrid';
import { GameControls } from '../components/GameControls';
import { useGameState } from '../hooks/useGameState';
import { Position } from '../types';
import { generateHint } from '../utils/hintSystem';
import { getGridDimensionsForLevel } from '../utils/gridSizeCalculator';
import { GlobalProgressTracker } from '../components/GlobalProgressTracker';
import { Star } from '../components/Star';

export const GamePage: React.FC = () => {
  const {
    gameState,
    isLoading,
    currentLevel,
    currentLevelData,
    addFoundCow,
    changeLevel,
    resetGame,
    isGameComplete,
    getTotalCowsFound,
    getRandomUnfinishedLevel,
  } = useGameState();


  const [hintArea, setHintArea] = useState<{
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  } | null>(null);
  const [showHintMessage, setShowHintMessage] = useState(false);

  if (isLoading || !currentLevelData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'black',
        fontSize: '24px',
      }}>
        Loading...
      </div>
    );
  }

  const handleCowFound = (positions: Position[], cowIndex: number) => {
    const updatedLevelData = addFoundCow(currentLevel, positions, cowIndex);
    if (!updatedLevelData) return;
  
    // Level completion is now handled visually with gold highlighting and star
    // No popup needed
  };  

  const handlePreviousLevel = () => {
    if (currentLevel > 1) {
      // Skip level 50 - go directly from 51 to 49
      const prevLevel = currentLevel === 51 ? 49 : currentLevel - 1;
      changeLevel(prevLevel);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < (gameState?.totalLevels || 99)) {
      // Skip level 50 - go directly from 49 to 51
      const nextLevel = currentLevel === 49 ? 51 : currentLevel + 1;
      changeLevel(nextLevel);
    }
  };

  const handleRandomLevel = () => {
    const randomLevel = getRandomUnfinishedLevel();
    changeLevel(randomLevel);
  };

  const handleHint = () => {
    const { width, height } = getGridDimensionsForLevel(currentLevel);
    const hint = generateHint(currentLevelData.grid, currentLevelData.foundCows, width, height);
    
    if (hint) {
      setHintArea(hint);
      
      // Clear hint after 3 seconds
      setTimeout(() => {
        setHintArea(null);
      }, 3000);
    } else {
      // Show feedback when no hints are available
      setShowHintMessage(true);
      setTimeout(() => {
        setShowHintMessage(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      resetGame();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#FDF6E3',
      padding: '20px',
      gap: '20px',
    }}>
      {/* Game Title */}
      <div style={{
        textAlign: 'center',
        color: 'white',
        marginBottom: '0px',
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          margin: '0', 
          color: '#000',
          fontFamily: "'Cormorant Infant', serif",
          fontWeight: 500
        }}>
          5000 Cows
        </h1>
        {/* <p style={{ fontSize: '18px', margin: '10px 0', color: '#333' }}>
          Find all the COWs in each level!
        </p> */}
      </div>

      {/* Global Progress Tracker */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '0px',
      }}>
        <GlobalProgressTracker totalCowsFound={getTotalCowsFound()} />
      </div>

      {/* Main Game Area */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr", // three columns
          justifyItems: "center",
          width: "100%",
        }}
      >
        {/* Left: Controls */}
        <div style={{ justifySelf: "end", marginTop: "20px", marginRight: "30px", zIndex: 1000 }}>
                      <GameControls
              currentLevel={currentLevel}
              totalLevels={gameState?.totalLevels || 100}
              cowsFound={currentLevelData.foundCows.length}
              cowsToFind={currentLevelData.cowsToFind}
              onPreviousLevel={handlePreviousLevel}
              onNextLevel={handleNextLevel}
              onRandomLevel={handleRandomLevel}
              onHint={handleHint}
              onReset={handleReset}
              isCompleted={currentLevelData.isCompleted}
            />
        </div>

        {/* Center: Grid + instructions */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
          <WordSearchGrid
            grid={currentLevelData.grid}
            foundCows={currentLevelData.foundCows}
            onCowFound={handleCowFound}
            isCompleted={currentLevelData.isCompleted}
            level={currentLevel}
            hintArea={hintArea}
          />
          <div
            style={{
              color: "black",
              textAlign: "center",
              maxWidth: "400px",
              fontSize: "14px",
              lineHeight: "1.4",
            }}
          >
            <p>Drag your mouse across letters to find COWs</p>
          </div>
        </div>

        {/* Right: Dummy spacer equal to controls */}
        <div style={{ width: "250px" }} /> {/* match controls width */}
      </div>



      {/* Hint Message Overlay */}
      {showHintMessage && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          backgroundColor: '#2a2a2a',
          padding: '20px 30px',
          borderRadius: '8px',
          textAlign: 'center',
          color: 'white',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          animation: 'hintMessageIn 0.3s ease forwards',
        }}>
          <p style={{ fontSize: '16px', margin: '0', color: '#ff6b6b' }}>
            No hints available!
          </p>
        </div>
      )}

      {/* Game Complete Check */}
      {isGameComplete() && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#FDF6E3',
            padding: '50px',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#8B4513',
            maxWidth: '600px',
            // border: '3px solid #D4AF37',
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.3)',
            fontFamily: "'Lato', serif",
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
              <Star size={40} />
              <Star size={50} />
              <Star size={40} />
            </div>
            <h2 style={{ 
              fontSize: '42px', 
              margin: '0 0 20px 0', 
              color: '#8B4513',
              fontFamily: "'Cormorant Infant', serif",
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>
              CONGRATULATIONS!
            </h2>
            <p style={{ 
              fontSize: '28px', 
              margin: '0 0 20px 0',
              color: '#D4AF37',
              fontFamily: "'Cormorant Infant', sans-serif",
              fontWeight: '600'
            }}>
              You've found all 5000 cows!
            </p>
            <p style={{ 
              fontSize: '18px', 
              margin: '0 0 40px 0', 
              color: '#8B4513',
              fontFamily: "'Lato', sans-serif",
              opacity: 0.8,
              lineHeight: '1.5'
            }}>
              You've completed every level and found every single COW in the game. What an incredible achievement! 🐄
            </p>
            <button
              onClick={() => handleReset}
              style={{
                padding: '18px 40px',
                fontSize: '20px',
                backgroundColor: '#8B4513',
                color: '#FDF6E3',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#A0522D';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 69, 19, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8B4513';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.3)';
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

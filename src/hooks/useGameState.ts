import { useState, useEffect } from 'react';
import { GameState, LevelData, FoundCow } from '../types';
import { 
  loadGameState, 
  saveGameState, 
  initializeGameState, 
  resetGameState
} from '../utils/storage';
import { getCowColor } from '../utils/colorGradient';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
    } else {
      const newState = initializeGameState();
      setGameState(newState);
      saveGameState(newState);
    }
    setIsLoading(false);
  }, []);

  const updateGameState = (newState: GameState) => {
    setGameState(newState);
    saveGameState(newState);
  };

  const addFoundCow = (
    level: number,
    positions: FoundCow['positions'],
    cowIndex: number
  ): LevelData | null => {
    if (!gameState) return null;
  
    const currentLevelData = gameState.levels[level];
    if (!currentLevelData) return null;
    
    // Prevent adding cows if level is already completed
    if (currentLevelData.isCompleted) {
      return currentLevelData;
    }
    
    // Prevent adding duplicate cows (same three positions in any order)
    const normalize = (posArr: FoundCow['positions']) =>
      posArr.map(p => `${p.row},${p.col}`).sort().join('|');
    const newPositionsKey = normalize(positions);
    const isDuplicate = currentLevelData.foundCows.some(cow => normalize(cow.positions) === newPositionsKey);
    if (isDuplicate) {
      return currentLevelData;
    }
  
    const newFoundCow: FoundCow = {
      id: `cow-${level}-${Date.now()}`,
      positions,
      color: getCowColor(level, cowIndex, currentLevelData.cowsToFind),
    };
  
    // Build the updated foundCows array first
    const updatedFoundCows = [...currentLevelData.foundCows, newFoundCow];
  
    const updatedLevelData: LevelData = {
      ...currentLevelData,
      foundCows: updatedFoundCows,
      isCompleted: updatedFoundCows.length >= currentLevelData.cowsToFind, // ✅ calculate after adding new cow
    };
  
    const updatedGameState: GameState = {
      ...gameState,
      levels: {
        ...gameState.levels,
        [level]: updatedLevelData,
      },
    };
  
    updateGameState(updatedGameState);
    return updatedLevelData;
  };

  const changeLevel = (newLevel: number) => {
    if (!gameState) return;
  
    const updatedGameState: GameState = {
      ...gameState,
      currentLevel: newLevel,
    };
  
    // ✅ Save + update React state in one place
    updateGameState(updatedGameState);
  };

  const resetGame = () => {
    const newState = resetGameState();
    setGameState(newState);
  };

  const getCurrentLevelData = (): LevelData | null => {
    if (!gameState) return null;
    return gameState.levels[gameState.currentLevel] || null;
  };

  const getCompletedLevels = (): number[] => {
    if (!gameState) return [];
    return Object.values(gameState.levels)
      .filter(level => level.isCompleted)
      .map(level => level.level);
  };

  const isGameComplete = (): boolean => {
    if (!gameState) return false;
    return Object.values(gameState.levels).every(level => level.isCompleted);
  };

  const getTotalCowsFound = (): number => {
    if (!gameState) return 0;
    return Object.values(gameState.levels).reduce((total, level) => {
      // Only count up to the required number of cows for each level
      // This prevents extra cows from being counted toward the total
      return total + Math.min(level.foundCows.length, level.cowsToFind);
    }, 0);
  };

  return {
    gameState,
    isLoading,
    currentLevel: gameState?.currentLevel || 1,
    currentLevelData: getCurrentLevelData(),
    addFoundCow,
    changeLevel,
    resetGame,
    getCompletedLevels,
    isGameComplete,
    getTotalCowsFound,
  };
};

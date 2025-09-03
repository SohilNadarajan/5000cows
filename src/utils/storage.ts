import { GameState, LevelData } from '../types';
import { STORAGE_KEY, TOTAL_LEVELS, getCowsForLevel } from '../constants';
import { generateWordSearch } from './wordSearchGenerator';
import { getGridDimensionsForLevel } from './gridSizeCalculator';

export const saveGameState = (gameState: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return null;
};

export const initializeGameState = (): GameState => {
  const levels: Record<number, LevelData> = {};
  
  for (let level = 1; level <= TOTAL_LEVELS; level++) {
    if (level === 50) continue; // Skip level 50
    
    const cowsToFind = getCowsForLevel(level);
    const { width, height } = getGridDimensionsForLevel(level);
    levels[level] = {
      level,
      cowsToFind,
      grid: generateWordSearch(cowsToFind, width, height),
      foundCows: [],
      isCompleted: false,
    };
  }
  
  return {
    currentLevel: 1,
    levels,
    totalLevels: TOTAL_LEVELS,
  };
};

export const resetGameState = (): GameState => {
  const newState = initializeGameState();
  saveGameState(newState);
  return newState;
};

export const updateLevelData = (gameState: GameState, level: number, levelData: LevelData): GameState => {
  const newState: GameState = {
    ...gameState,
    levels: {
      ...gameState.levels,
      [level]: levelData,
    },
  };
  saveGameState(newState);
  return newState;
};

export const setCurrentLevel = (gameState: GameState, level: number): GameState => {
  const newState: GameState = {
    ...gameState,
    currentLevel: level,
  };
  saveGameState(newState);
  return newState;
};

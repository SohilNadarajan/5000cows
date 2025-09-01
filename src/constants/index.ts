

export const GRID_PADDING = 20;

export const TOTAL_LEVELS = 100;

// Calculate total cows (1+2+...+100 = 5050, but we skip level 50, so total = 5000)
export const calculateTotalCows = (): number => {
  let total = 0;
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    if (i !== 50) { // Skip level 50
      total += i;
    }
  }
  return total;
};

export const getCowsForLevel = (level: number): number => {
  return level === 50 ? 0 : level; // Level 50 is skipped
};

export const isValidLevel = (level: number): boolean => {
  return level >= 1 && level <= TOTAL_LEVELS;
};

export const STORAGE_KEY = '5000cows_game_state';

// Calculate grid dimensions based on level number
// Returns rectangular grids (wider than tall) for better space utilization
export const getGridDimensionsForLevel = (level: number): { width: number; height: number } => {
  if (level <= 3) return { width: 8, height: 6 };          // Very easy (1-3 COWs)
  if (level <= 6) return { width: 10, height: 8 };         // Easy (4-6 COWs)
  if (level <= 10) return { width: 12, height: 9 };        // Slightly harder (7-10 COWs)
  if (level <= 15) return { width: 14, height: 10 };       // Medium (11-15 COWs)
  if (level <= 20) return { width: 16, height: 11 };       // Medium (16-20 COWs)
  if (level <= 30) return { width: 18, height: 12 };       // Medium-large (21-30 COWs)
  if (level <= 40) return { width: 20, height: 13 };       // Larger (31-40 COWs)
  if (level <= 49) return { width: 22, height: 14 };       // Large (41-49 COWs)
  if (level <= 60) return { width: 24, height: 16 };       // Extra challenge (51-60 COWs)
  if (level <= 70) return { width: 26, height: 18 };       // Hard (61-70 COWs)
  if (level <= 80) return { width: 28, height: 20 };       // Very hard (71-80 COWs)
  if (level <= 90) return { width: 30, height: 22 };       // Endgame (81-90 COWs)
  return { width: 32, height: 24 };                        // Maximum difficulty (91-100 COWs)
};

// Legacy function for backward compatibility - returns the larger dimension
export const getGridSizeForLevel = (level: number): number => {
  const { width, height } = getGridDimensionsForLevel(level);
  return Math.max(width, height);
};


// Calculate cell size based on grid dimensions to maintain reasonable display
export const getCellSizeForGrid = (width: number, height: number): number => {
  return 32;
};

// Legacy function for backward compatibility
export const getCellSizeForGridLegacy = (gridSize: number): number => {
  return getCellSizeForGrid(gridSize, gridSize);
};

// Get grid configuration for a level
export const getGridConfigForLevel = (level: number): { 
  width: number; 
  height: number; 
  cellSize: number;
  gridSize: number; // Legacy compatibility
} => {
  const { width, height } = getGridDimensionsForLevel(level);
  const cellSize = getCellSizeForGrid(width, height);
  const gridSize = Math.max(width, height); // Legacy compatibility
  
  return { width, height, cellSize, gridSize };
};

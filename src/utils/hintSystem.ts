import { Position } from '../types';

export const generateHint = (grid: string[][], foundCows: { positions: Position[] }[], width: number, height: number): {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
} | null => {
  // Find all possible COW positions that haven't been found yet
  const possibleCows: Position[][] = [];
  
  // Use the same directions as the word search generator
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // Up-left, Up, Up-right
    [0, -1],           [0, 1],    // Left, Right
    [1, -1],  [1, 0],  [1, 1]     // Down-left, Down, Down-right
  ];
  
  // Check all directions for COW sequences
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      for (const [dRow, dCol] of directions) {
        // Check if we can form "COW" in this direction
        const positions: Position[] = [];
        let isValidCow = true;
        
        for (let i = 0; i < 3; i++) {
          const checkRow = row + (i * dRow);
          const checkCol = col + (i * dCol);
          
          // Check bounds
          if (checkRow < 0 || checkRow >= height || checkCol < 0 || checkCol >= width) {
            isValidCow = false;
            break;
          }
          
          // Check if letter matches COW pattern
          const expectedLetter = ['C', 'O', 'W'][i];
          if (grid[checkRow][checkCol] !== expectedLetter) {
            isValidCow = false;
            break;
          }
          
          positions.push({ row: checkRow, col: checkCol });
        }
        
        if (isValidCow) {
          // Check if this COW hasn't been found yet
          const isFound = foundCows.some(cow => {
            if (cow.positions.length !== 3) return false;
            
            // Check if all positions match (in any order)
            const cowPositions = cow.positions.map(p => `${p.row},${p.col}`).sort();
            const checkPositions = positions.map(p => `${p.row},${p.col}`).sort();
            
            return cowPositions.join('|') === checkPositions.join('|');
          });
          
          if (!isFound) {
            possibleCows.push(positions);
          }
        }
      }
    }
  }
  
  if (possibleCows.length === 0) {
    return null;
  }
  
  // Pick a random COW to hint at
  const randomCow = possibleCows[Math.floor(Math.random() * possibleCows.length)];
  
  // Calculate the bounding box for the hint area
  const rows = randomCow.map(pos => pos.row);
  const cols = randomCow.map(pos => pos.col);
  
  const startRow = Math.max(0, Math.min(...rows) - 1);
  const endRow = Math.min(height - 1, Math.max(...rows) + 1);
  const startCol = Math.max(0, Math.min(...cols) - 1);
  const endCol = Math.min(width - 1, Math.max(...cols) + 1);
  
  return {
    startRow,
    endRow,
    startCol,
    endCol,
  };
};

// Legacy function for backward compatibility
export const generateHintLegacy = (grid: string[][], foundCows: { positions: Position[] }[], gridSize: number) => {
  return generateHint(grid, foundCows, gridSize, gridSize);
};
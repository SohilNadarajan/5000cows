import { Position } from '../types';

export const generateWordSearch = (cowsToFind: number, width: number, height: number): string[][] => {
  // Keep trying until we get exactly the right number of COWs
  let attempts = 0;
  const maxAttempts = 200; // Increased attempts for more complex grids
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      const grid = attemptGridGeneration(cowsToFind, width, height);
      
      // Verify the grid has exactly the required number of COWs
      const actualCows = countCowsInGrid(grid, width, height);
      
      if (actualCows === cowsToFind) {
        return grid;
      }
    } catch (error) {
      // If generation fails, try again
      continue;
    }
  }
  
  // If we still haven't succeeded, use a fallback method
  return generateFallbackGrid(cowsToFind, width, height);
};

// Legacy function for backward compatibility
export const generateWordSearchLegacy = (cowsToFind: number, gridSize: number): string[][] => {
  return generateWordSearch(cowsToFind, gridSize, gridSize);
};

const attemptGridGeneration = (cowsToFind: number, width: number, height: number): string[][] => {
  const grid: string[][] = Array(height).fill(null).map(() => 
    Array(width).fill('')
  );
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // Up-left, Up, Up-right
    [0, -1],           [0, 1],    // Left, Right
    [1, -1],  [1, 0],  [1, 1]     // Down-left, Down, Down-right
  ];

  // Use a more sophisticated placement strategy
  const placedCows = placeCowsIntelligently(grid, cowsToFind, width, height, directions);
  
  if (placedCows < cowsToFind) {
    throw new Error(`Could only place ${placedCows} out of ${cowsToFind} COWs`);
  }

  // Fill remaining empty cells safely
  fillEmptyCellsSafely(grid, width, height);
  
  return grid;
};

const placeCowsIntelligently = (
  grid: string[][], 
  cowsToFind: number, 
  width: number, 
  height: number, 
  directions: number[][]
): number => {
  let placedCows = 0;
  const maxAttempts = width * height * 10; // More attempts for complex grids
  let attempts = 0;
  
  // Create a list of all possible positions and shuffle them
  const allPositions: { row: number; col: number }[] = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      allPositions.push({ row, col });
    }
  }
  
  // Shuffle positions for random placement
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }
  
  // Try to place COWs using different strategies
  const strategies = [
    () => placeCowsWithSpacing(grid, cowsToFind, width, height, directions, allPositions),
    () => placeCowsWithDirectionVariety(grid, cowsToFind, width, height, directions, allPositions),
    () => placeCowsWithConflictAvoidance(grid, cowsToFind, width, height, directions, allPositions)
  ];
  
  for (const strategy of strategies) {
    const result = strategy();
    if (result >= cowsToFind) {
      return result;
    }
    if (result > placedCows) {
      placedCows = result;
    }
  }
  
  return placedCows;
};

const placeCowsWithSpacing = (
  grid: string[][], 
  cowsToFind: number, 
  width: number, 
  height: number, 
  directions: number[][],
  positions: { row: number; col: number }[]
): number => {
  let placedCows = 0;
  const usedPositions = new Set<string>();
  
  for (const pos of positions) {
    if (placedCows >= cowsToFind) break;
    
    // Check if this position is too close to existing COWs
    const posKey = `${pos.row},${pos.col}`;
    if (usedPositions.has(posKey)) continue;
    
    // Try each direction
    for (const [dRow, dCol] of directions) {
      if (canPlaceWord(grid, pos.row, pos.col, dRow, dCol, width, height)) {
        // Check if placing this COW would create conflicts
        if (!wouldCreateConflicts(grid, pos.row, pos.col, dRow, dCol, width, height, usedPositions)) {
          placeWord(grid, pos.row, pos.col, dRow, dCol);
          placedCows++;
          
          // Mark all positions of this COW as used
          for (let i = 0; i < 3; i++) {
            const cowRow = pos.row + (i * dRow);
            const cowCol = pos.col + (i * dCol);
            usedPositions.add(`${cowRow},${cowCol}`);
          }
          break;
        }
      }
    }
  }
  
  return placedCows;
};

const placeCowsWithDirectionVariety = (
  grid: string[][], 
  cowsToFind: number, 
  width: number, 
  height: number, 
  directions: number[][],
  positions: { row: number; col: number }[]
): number => {
  let placedCows = 0;
  
  for (const pos of positions) {
    if (placedCows >= cowsToFind) break;
    
    // Generate a completely random direction
    const dRow = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    const dCol = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    
    // Skip the [0, 0] direction (no movement)
    if (dRow === 0 && dCol === 0) continue;
    
    if (canPlaceWord(grid, pos.row, pos.col, dRow, dCol, width, height)) {
      placeWord(grid, pos.row, pos.col, dRow, dCol);
      placedCows++;
    }
  }
  
  return placedCows;
};

const placeCowsWithConflictAvoidance = (
  grid: string[][], 
  cowsToFind: number, 
  width: number, 
  height: number, 
  directions: number[][],
  positions: { row: number; col: number }[]
): number => {
  let placedCows = 0;
  
  for (const pos of positions) {
    if (placedCows >= cowsToFind) break;
    
    // Try directions in random order
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
    
    for (const [dRow, dCol] of shuffledDirections) {
      if (canPlaceWord(grid, pos.row, pos.col, dRow, dCol, width, height)) {
        // Check if this placement would create unwanted diagonal COWs
        if (!wouldCreateDiagonalConflicts(grid, pos.row, pos.col, dRow, dCol, width, height)) {
          placeWord(grid, pos.row, pos.col, dRow, dCol);
          placedCows++;
          break;
        }
      }
    }
  }
  
  return placedCows;
};

const wouldCreateConflicts = (
  grid: string[][], 
  startRow: number, 
  startCol: number, 
  dRow: number, 
  dCol: number,
  width: number, 
  height: number,
  usedPositions: Set<string>
): boolean => {
  // Check if any position of this COW would conflict with existing placements
  for (let i = 0; i < 3; i++) {
    const row = startRow + (i * dRow);
    const col = startCol + (i * dCol);
    const posKey = `${row},${col}`;
    
    if (usedPositions.has(posKey)) {
      return true;
    }
  }
  return false;
};

const wouldCreateDiagonalConflicts = (
  grid: string[][], 
  startRow: number, 
  startCol: number, 
  dRow: number, 
  dCol: number,
  width: number, 
  height: number
): boolean => {
  // Temporarily place the COW
  const tempGrid = grid.map(row => [...row]);
  placeWord(tempGrid, startRow, startCol, dRow, dCol);
  
  // Check if this creates any new diagonal COWs
  const newCows = countCowsInGrid(tempGrid, width, height);
  const originalCows = countCowsInGrid(grid, width, height);
  
  return newCows > originalCows + 1; // Should only add exactly 1 COW
};

const tryPlaceCow = (grid: string[][], width: number, height: number, directions: number[][]): boolean => {
  // Try different strategies for placement
  const strategies = [
    () => tryRandomPlacement(grid, width, height, directions),
    () => tryEdgePlacement(grid, width, height, directions),
    () => tryCenterPlacement(grid, width, height, directions)
  ];
  
  for (const strategy of strategies) {
    if (strategy()) {
      return true;
    }
  }
  
  return false;
};

const tryRandomPlacement = (grid: string[][], width: number, height: number, directions: number[][]): boolean => {
  const maxAttempts = 100; // Increased for larger grids
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const startRow = Math.floor(Math.random() * height);
    const startCol = Math.floor(Math.random() * width);
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const [dRow, dCol] = direction;
    
    if (canPlaceWord(grid, startRow, startCol, dRow, dCol, width, height)) {
      placeWord(grid, startRow, startCol, dRow, dCol);
      return true;
    }
  }
  
  return false;
};

const tryEdgePlacement = (grid: string[][], width: number, height: number, directions: number[][]): boolean => {
  // Try placing COWs along edges where there's more space
  const edgePositions = [
    ...Array.from({length: width}, (_, i) => ({row: 0, col: i})),           // Top edge
    ...Array.from({length: width}, (_, i) => ({row: height-1, col: i})),    // Bottom edge
    ...Array.from({length: height}, (_, i) => ({row: i, col: 0})),          // Left edge
    ...Array.from({length: height}, (_, i) => ({row: i, col: width-1}))     // Right edge
  ];
  
  for (const pos of edgePositions) {
    for (const [dRow, dCol] of directions) {
      if (canPlaceWord(grid, pos.row, pos.col, dRow, dCol, width, height)) {
        placeWord(grid, pos.row, pos.col, dRow, dCol);
        return true;
      }
    }
  }
  
  return false;
};

const tryCenterPlacement = (grid: string[][], width: number, height: number, directions: number[][]): boolean => {
  // Try placing COWs in the center area
  const centerStartRow = Math.floor(height / 3);
  const centerEndRow = Math.floor(2 * height / 3);
  const centerStartCol = Math.floor(width / 3);
  const centerEndCol = Math.floor(2 * width / 3);
  
  for (let row = centerStartRow; row < centerEndRow; row++) {
    for (let col = centerStartCol; col < centerEndCol; col++) {
      for (const [dRow, dCol] of directions) {
        if (canPlaceWord(grid, row, col, dRow, dCol, width, height)) {
          placeWord(grid, row, col, dRow, dCol);
          return true;
        }
      }
    }
  }
  
  return false;
};

const canPlaceWord = (
  grid: string[][], 
  startRow: number, 
  startCol: number, 
  dRow: number, 
  dCol: number,
  width: number,
  height: number
): boolean => {
  const word = 'COW';
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + (i * dRow);
    const col = startCol + (i * dCol);
    
    // Check bounds
    if (row < 0 || row >= height || col < 0 || col >= width) {
      return false;
    }
    
    // Check if cell is empty or already has the correct letter
    if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
      return false;
    }
  }
  
  return true;
};

const placeWord = (
  grid: string[][], 
  startRow: number, 
  startCol: number, 
  dRow: number, 
  dCol: number
): void => {
  const word = 'COW';
  
  for (let i = 0; i < word.length; i++) {
    const row = startRow + (i * dRow);
    const col = startCol + (i * dCol);
    grid[row][col] = word[i];
  }
};

const fillEmptyCellsSafely = (grid: string[][], width: number, height: number): void => {
  const letters = ['C', 'O', 'W'];
  
  // Create a list of empty positions and shuffle them for random filling
  const emptyPositions: { row: number; col: number }[] = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (grid[row][col] === '') {
        emptyPositions.push({ row, col });
      }
    }
  }
  
  // Shuffle for random order
  for (let i = emptyPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emptyPositions[i], emptyPositions[j]] = [emptyPositions[j], emptyPositions[i]];
  }
  
  for (const pos of emptyPositions) {
    const { row, col } = pos;
    
    // Try each letter and check if it creates an unwanted COW
    const safeLetters = letters.filter(letter => {
      // Temporarily place the letter
      grid[row][col] = letter;
      
      // Check if this creates any new COWs in any direction
      const createsNewCow = checkForNewCows(grid, row, col, width, height);
      
      // Remove the letter
      grid[row][col] = '';
      
      return !createsNewCow;
    });
    
    // If no safe letters, use the letter that creates the least conflicts
    let letterToUse = 'C';
    if (safeLetters.length > 0) {
      letterToUse = safeLetters[Math.floor(Math.random() * safeLetters.length)];
    } else {
      // Find the letter that creates the fewest new COWs
      let minConflicts = Infinity;
      for (const letter of letters) {
        grid[row][col] = letter;
        const conflicts = countNewCowsCreated(grid, row, col, width, height);
        grid[row][col] = '';
        
        if (conflicts < minConflicts) {
          minConflicts = conflicts;
          letterToUse = letter;
        }
      }
    }
    
    grid[row][col] = letterToUse;
  }
};

const checkForNewCows = (grid: string[][], row: number, col: number, width: number, height: number): boolean => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // Up-left, Up, Up-right
    [0, -1],           [0, 1],    // Left, Right
    [1, -1],  [1, 0],  [1, 1]     // Down-left, Down, Down-right
  ];
  
  for (const [dRow, dCol] of directions) {
    // Check if this position could be part of a COW
    for (let offset = -2; offset <= 0; offset++) {
      const positions = [];
      let isValid = true;
      
      // Check 3 consecutive positions
      for (let i = 0; i < 3; i++) {
        const checkRow = row + (offset + i) * dRow;
        const checkCol = col + (offset + i) * dCol;
        
        if (checkRow < 0 || checkRow >= height || checkCol < 0 || checkCol >= width) {
          isValid = false;
          break;
        }
        
        positions.push({ row: checkRow, col: checkCol });
      }
      
      if (isValid) {
        const word = positions.map(pos => grid[pos.row][pos.col]).join('');
        if (word === 'COW') {
          return true; // Found a new COW
        }
      }
    }
  }
  
  return false;
};

const countNewCowsCreated = (grid: string[][], row: number, col: number, width: number, height: number): number => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // Up-left, Up, Up-right
    [0, -1],           [0, 1],    // Left, Right
    [1, -1],  [1, 0],  [1, 1]     // Down-left, Down, Down-right
  ];
  
  let newCowsCount = 0;
  
  for (const [dRow, dCol] of directions) {
    // Check if this position could be part of a COW
    for (let offset = -2; offset <= 0; offset++) {
      const positions = [];
      let isValid = true;
      
      // Check 3 consecutive positions
      for (let i = 0; i < 3; i++) {
        const checkRow = row + (offset + i) * dRow;
        const checkCol = col + (offset + i) * dCol;
        
        if (checkRow < 0 || checkRow >= height || checkCol < 0 || checkCol >= width) {
          isValid = false;
          break;
        }
        
        positions.push({ row: checkRow, col: checkCol });
      }
      
      if (isValid) {
        const word = positions.map(pos => grid[pos.row][pos.col]).join('');
        if (word === 'COW') {
          newCowsCount++;
        }
      }
    }
  }
  
  return newCowsCount;
};

const countCowsInGrid = (grid: string[][], width: number, height: number): number => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // Up-left, Up, Up-right
    [0, -1],           [0, 1],    // Left, Right
    [1, -1],  [1, 0],  [1, 1]     // Down-left, Down, Down-right
  ];
  
  let cowCount = 0;
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      for (const [dRow, dCol] of directions) {
        // Check if we can form "COW" in this direction
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
        }
        
        if (isValidCow) {
          cowCount++;
        }
      }
    }
  }
  
  return cowCount;
};

const generateFallbackGrid = (cowsToFind: number, width: number, height: number): string[][] => {
  // Create a grid with COWs using a more sophisticated fallback approach
  const grid: string[][] = Array(height).fill(null).map(() => 
    Array(width).fill('')
  );
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // Up-left, Up, Up-right
    [0, -1],           [0, 1],    // Left, Right
    [1, -1],  [1, 0],  [1, 1]     // Down-left, Down, Down-right
  ];
  
  // Use the intelligent placement strategy for fallback too
  const placedCows = placeCowsIntelligently(grid, cowsToFind, width, height, directions);
  
  // Fill remaining cells with only C, O, W letters using the safe method
  fillEmptyCellsSafely(grid, width, height);
  
  return grid;
};

export const findCowAtPosition = (
  grid: string[][], 
  positions: Position[]
): boolean => {
  if (positions.length !== 3) return false;
  
  // Sort positions to check if they form a line
  const sortedPositions = [...positions].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });
  
  // Check if positions are in a straight line
  const [pos1, pos2, pos3] = sortedPositions;
  
  // Check horizontal
  if (pos1.row === pos2.row && pos2.row === pos3.row) {
    const letters = positions.map(p => grid[p.row][p.col]).join('');
    return letters === 'COW';
  }
  
  // Check vertical
  if (pos1.col === pos2.col && pos2.col === pos3.col) {
    const letters = positions.map(p => grid[p.row][p.col]).join('');
    return letters === 'COW';
  }
  
  // Check diagonal
  const dRow = pos2.row - pos1.row;
  const dCol = pos2.col - pos1.col;
  
  if (pos3.row === pos2.row + dRow && pos3.col === pos2.col + dCol) {
    const letters = positions.map(p => grid[p.row][p.col]).join('');
    return letters === 'COW';
  }
  
  return false;
};

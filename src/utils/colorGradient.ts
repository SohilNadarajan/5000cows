// Generate a rainbow gradient color based on position in the gradient
const getRainbowColor = (position: number, totalSteps: number): string => {
  // Normalize position to 0-1 range
  const normalizedPosition = position / Math.max(totalSteps - 1, 1);
  
  // Convert to hue (0-360 degrees)
  // Use 330 degrees instead of 360 to avoid red-red repetition
  const hue = normalizedPosition * 330;
  
  // Use HSL to create vibrant colors
  return `hsla(${hue}, 70%, 60%, 0.7)`;
};

// Generate colors for a specific level
export const generateLevelColors = (level: number, cowsToFind: number): string[] => {
  const colors: string[] = [];
  
  for (let i = 0; i < cowsToFind; i++) {
    // Calculate the position in the rainbow gradient for this cow
    const position = i;
    const totalSteps = cowsToFind;
    
    colors.push(getRainbowColor(position, totalSteps));
  }
  
  return colors;
};

// Get a specific color for a cow at a given index in a level
export const getCowColor = (level: number, cowIndex: number, cowsToFind: number): string => {
  const colors = generateLevelColors(level, cowsToFind);
  return colors[cowIndex] || '#ff0000'; // Fallback to red if something goes wrong
};

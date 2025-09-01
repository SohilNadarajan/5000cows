# 5000 Cows - Word Search Game

A modern, interactive word search game where players find "COW" words across 99 levels, totaling exactly 5000 cows to discover!

## 🎮 Game Overview

5000 Cows is a beautifully designed word search game built with React and TypeScript. Players drag their mouse across letters to find "COW" words in various directions (horizontal, vertical, and diagonal). The game features 99 levels with increasing difficulty, dynamic grid sizes, and a sophisticated cow placement algorithm.

## ✨ Features

### 🎯 Core Gameplay
- **99 Levels**: Progress through increasingly challenging levels
- **5000 Total Cows**: Find exactly 5000 "COW" words across all levels
- **Dynamic Grid Sizes**: Grids grow larger and become rectangular for higher levels
- **Smart Cow Placement**: Advanced algorithm prevents predictable patterns and unintended diagonals
- **Visual Feedback**: Rainbow-colored highlighting for found cows, gold highlighting when levels are completed

### 🎨 Modern UI/UX
- **Beige/Brown Theme**: Elegant color scheme with cream backgrounds and brown accents
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Tracking**: Global progress bar and per-level progress indicators
- **Completion Stars**: Beautiful gold stars appear when levels are completed
- **Smooth Animations**: Polished transitions and hover effects

### 🧠 Smart Features
- **Hint System**: Get hints to help find remaining cows
- **Level Navigation**: Easy navigation between levels
- **Game State Persistence**: Progress is automatically saved
- **Completion Detection**: Prevents extra cows from being counted once levels are completed
- **Scrollable Grids**: Large grids are scrollable while maintaining fixed cell sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 5000cows
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to start playing!

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🏗️ Project Structure

```
5000cows/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── GameControls.tsx      # Level controls and navigation
│   │   ├── GlobalProgressTracker.tsx  # Overall progress display
│   │   ├── Star.tsx              # Gold star component for completion
│   │   ├── Star.css              # Star styling
│   │   └── WordSearchGrid.tsx    # Main game grid component
│   ├── constants/
│   │   └── index.ts              # Game constants and calculations
│   ├── hooks/
│   │   └── useGameState.ts       # Game state management
│   ├── pages/
│   │   └── GamePage.tsx          # Main game page
│   ├── styles/
│   │   └── shared.css            # Shared component styles
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   ├── colorGradient.ts      # Color generation for found cows
│   │   ├── gridSizeCalculator.ts # Grid dimension calculations
│   │   ├── hintSystem.ts         # Hint generation logic
│   │   ├── storage.ts            # Game state persistence
│   │   └── wordSearchGenerator.ts # Core word search generation
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── README.md
```

## 🎮 How to Play

1. **Start the Game**: The game begins at Level 1
2. **Find COWs**: Drag your mouse across three consecutive letters to spell "COW"
3. **Directions**: COWs can be found horizontally, vertically, or diagonally
4. **Progress**: Watch your progress bars fill as you find cows
5. **Complete Levels**: Find all required cows to complete a level
6. **Advance**: Use the navigation buttons to move between levels
7. **Get Hints**: Use the hint button if you're stuck

## 🔧 Technical Details

### Key Technologies
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **CSS3**: Modern styling with flexbox and grid
- **Local Storage**: Game state persistence

### Algorithm Highlights

#### Word Search Generation
- **Intelligent Placement**: Uses multiple strategies to place COWs
- **Conflict Avoidance**: Prevents unintended diagonal COWs
- **Direction Variety**: Random direction selection for natural patterns
- **Safe Filling**: Only uses C, O, W letters to fill empty spaces

#### Grid Sizing
- **Dynamic Dimensions**: Grids grow from 8x6 to 32x24
- **Rectangular Layouts**: Higher levels use wider grids
- **Fixed Cell Size**: 40px cells with scrolling for large grids

### Performance Optimizations
- **Efficient Rendering**: Optimized React components
- **Smart State Management**: Minimal re-renders
- **Lazy Loading**: Components load as needed
- **Memory Management**: Proper cleanup and state management

## 🎨 Customization

### Colors and Themes
The game uses CSS custom properties for easy theming:
```css
:root {
  --cream: #FDF6E3;
  --brown: #8B4513;
  --brown-dark: #3A1F0B;
  --brown-light: #A0522D;
}
```

### Grid Configuration
Grid sizes can be adjusted in `src/utils/gridSizeCalculator.ts`:
```typescript
export const getGridDimensionsForLevel = (level: number): { width: number; height: number } => {
  if (level <= 3) return { width: 8, height: 6 };
  // ... more configurations
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Game not loading**
   - Check that all dependencies are installed: `npm install`
   - Ensure Node.js version is 14 or higher

2. **Progress not saving**
   - Check browser's local storage permissions
   - Try clearing browser cache and reloading

3. **Grid not displaying properly**
   - Check browser console for errors
   - Ensure CSS is loading correctly

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and TypeScript
- Inspired by classic word search puzzles
- Special thanks to the open-source community

## 📊 Game Statistics

- **Total Levels**: 99
- **Total Cows**: 5000
- **Grid Sizes**: 8x6 to 32x24
- **Directions**: 8 (horizontal, vertical, diagonal)
- **Completion Time**: Varies by player skill

---

**Happy Cow Hunting! 🐄✨**
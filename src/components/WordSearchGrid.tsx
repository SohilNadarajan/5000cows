import React, { useState, useRef } from 'react';
import { Position, FoundCow } from '../types';
import { GRID_PADDING } from '../constants';
import { findCowAtPosition } from '../utils/wordSearchGenerator';
import { getCellSizeForGrid, getGridDimensionsForLevel } from '../utils/gridSizeCalculator';

interface WordSearchGridProps {
  grid: string[][];
  foundCows: FoundCow[];
  onCowFound: (positions: Position[], cowIndex: number) => void;
  isCompleted: boolean;
  level: number; // Changed from gridSize to level
  hintArea?: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  } | null;
}

export const WordSearchGrid: React.FC<WordSearchGridProps> = ({
  grid,
  foundCows,
  onCowFound,
  isCompleted,
  level,
  hintArea,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { width, height } = getGridDimensionsForLevel(level);
  const cellSize = getCellSizeForGrid(width, height);

  const getPositionFromEvent = (e: React.MouseEvent | React.TouchEvent): Position | null => {
    const gridElement = gridRef.current;
    if (!gridElement) return null;

    const rect = gridElement.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left - GRID_PADDING;
    const y = clientY - rect.top - GRID_PADDING;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < height && col >= 0 && col < width) {
      return { row, col };
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCompleted) return;
    const position = getPositionFromEvent(e);
    if (position) {
      setIsDragging(true);
      setDragStart(position);
      setSelectedPositions([position]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const currentPosition = getPositionFromEvent(e);
    if (!currentPosition) return;

    const positions: Position[] = [];
    const dRow = currentPosition.row - dragStart.row;
    const dCol = currentPosition.col - dragStart.col;
    const steps = Math.max(Math.abs(dRow), Math.abs(dCol));

    for (let i = 0; i <= steps; i++) {
      const row = dragStart.row + Math.round((dRow * i) / steps);
      const col = dragStart.col + Math.round((dCol * i) / steps);
      if (row >= 0 && row < height && col >= 0 && col < width) {
        positions.push({ row, col });
      }
    }

    setSelectedPositions(positions);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragStart(null);

    if (selectedPositions.length === 3 && findCowAtPosition(grid, selectedPositions)) {
      if (!isCompleted) {
        onCowFound(selectedPositions, foundCows.length);
      }
    }

    setSelectedPositions([]);
  };

  // Proper pill rendering between first and last positions
  const getPillStyle = (positions: Position[], color: string, isCompleted: boolean) => {
    if (positions.length < 2) return null;
  
    const first = positions[0];
    const last = positions[positions.length - 1];
  
    const x1 = first.col * cellSize + cellSize / 2 + GRID_PADDING;
    const y1 = first.row * cellSize + cellSize / 2 + GRID_PADDING;
    const x2 = last.col * cellSize + cellSize / 2 + GRID_PADDING;
    const y2 = last.row * cellSize + cellSize / 2 + GRID_PADDING;
  
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
  
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
  
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
    return {
      position: 'absolute' as const,
      width: length + cellSize,
      height: cellSize * 0.6,
      background: isCompleted
        ? 'linear-gradient(90deg, #D4AF37 0%, #F4E4A6 50%, #D4AF37 100%)'
        : color,
      borderRadius: cellSize * 0.3,
      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      top: centerY,
      left: centerX,
      pointerEvents: 'none' as const,
      zIndex: 0,
    };
  };  

  return (
    <div
      ref={gridRef}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
        gap: '0px',
        borderRadius: '8px',
        backgroundColor: '#FDF6E3',
        padding: GRID_PADDING,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={(e) => {
        e.preventDefault();
        handleMouseDown(e as any);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        handleMouseMove(e as any);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleMouseUp();
      }}
    >
      {/* Render pills for found cows */}
      {foundCows.map(cow => (
        <div 
          key={cow.id} 
          style={getPillStyle(
            cow.positions, 
            cow.color,          // original color
            isCompleted
          )!} 
        />
      ))}

      {/* Render pill for current selection */}
      {selectedPositions.length > 1 && (
        <div style={getPillStyle(selectedPositions, '#4a90e2', isCompleted)!} />
      )}

      {/* Render hint area overlay */}
      {hintArea && (
        <div
          style={{
            position: 'absolute',
            top: hintArea.startRow * cellSize + GRID_PADDING,
            left: hintArea.startCol * cellSize + GRID_PADDING,
            width: (hintArea.endCol - hintArea.startCol + 1) * cellSize,
            height: (hintArea.endRow - hintArea.startRow + 1) * cellSize,
            backgroundColor: 'rgba(139, 69, 19, 0.1)',
            border: '2px solid #8b4513',
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Render letters on top */}
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selectedPositions.some(pos => pos.row === rowIndex && pos.col === colIndex);
          const foundCow = foundCows.find(cow =>
            cow.positions.some(pos => pos.row === rowIndex && pos.col === colIndex)
          );

          const isInHintArea = hintArea &&
            rowIndex >= hintArea.startRow && rowIndex <= hintArea.endRow &&
            colIndex >= hintArea.startCol && colIndex <= hintArea.endCol;

          let color = '#000';
          if (foundCow) color = '#000';
          else if (isSelected) color = '#fff';
          else if (isInHintArea) color = '#8b4513';

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: cellSize,
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: "'Cormorant Infant', serif",
                color,
                backgroundColor: 'transparent',
                cursor: isCompleted ? 'default' : 'crosshair',
                userSelect: 'none',
                zIndex: 1,
              }}
            >
              {cell}
            </div>
          );
        })
      )}
    </div>
  );
};

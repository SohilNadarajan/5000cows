import React, { useState, useRef } from 'react';
import { Position, FoundCow } from '../types';
import { GRID_PADDING } from '../constants';
import { findCowAtPosition } from '../utils/wordSearchGenerator';
import { getCellSizeForGrid } from '../utils/gridSizeCalculator';

interface WordSearchGridProps {
  grid: string[][];
  foundCows: FoundCow[];
  onCowFound: (positions: Position[], cowIndex: number) => void;
  isCompleted: boolean;
  gridSize: number;
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
  gridSize,
  hintArea,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Calculate cell size based on grid size
  const cellSize = getCellSizeForGrid(gridSize, gridSize);

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

    // Account for the padding of the grid container
    const x = clientX - rect.left - GRID_PADDING;
    const y = clientY - rect.top - GRID_PADDING;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
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

    // Calculate positions between start and current
    const positions: Position[] = [];
    const dRow = currentPosition.row - dragStart.row;
    const dCol = currentPosition.col - dragStart.col;

    const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
    
    for (let i = 0; i <= steps; i++) {
      const row = dragStart.row + Math.round((dRow * i) / steps);
      const col = dragStart.col + Math.round((dCol * i) / steps);
      
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        positions.push({ row, col });
      }
    }

    setSelectedPositions(positions);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setDragStart(null);

    // Check if selected positions form a COW
    if (selectedPositions.length === 3 && findCowAtPosition(grid, selectedPositions)) {
      // Only call onCowFound if the level is not completed or if this is a new cow
      if (!isCompleted) {
        onCowFound(selectedPositions, foundCows.length);
      }
    }

    setSelectedPositions([]);
  };

  const getCellStyle = (row: number, col: number) => {
    // Check if this position is in a found cow
    const foundCow = foundCows.find(cow =>
      cow.positions.some(pos => pos.row === row && pos.col === col)
    );

    // Check if this position is currently selected
    const isSelected = selectedPositions.some(pos => pos.row === row && pos.col === col);

    // Check if this position is in hint area
    const isInHintArea = hintArea && 
      row >= hintArea.startRow && row <= hintArea.endRow &&
      col >= hintArea.startCol && col <= hintArea.endCol;

    let backgroundColor = '#2a2a2a';
    let color = '#fff';
    let borderColor = '#444';

    if (foundCow) {
      backgroundColor = foundCow.color;
      color = '#000';
      borderColor = foundCow.color;
    } else if (isSelected) {
      backgroundColor = '#4a90e2';
      color = '#fff';
      borderColor = '#4a90e2';
    } else if (isInHintArea) {
      backgroundColor = '#ff6b6b';
      color = '#fff';
      borderColor = '#ff6b6b';
    }

    return {
      width: cellSize,
      height: cellSize,
      backgroundColor,
      color,
      border: `1px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      cursor: isCompleted ? 'default' : 'crosshair',
      userSelect: 'none' as const,
      transition: 'background-color 0.1s ease',
    };
  };

  return (
    <div
      ref={gridRef}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        gap: '0px',
        border: '2px solid #333',
        borderRadius: '8px',
        backgroundColor: '#1a1a1a',
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
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={getCellStyle(rowIndex, colIndex)}
          >
            {cell}
          </div>
        ))
      )}
    </div>
  );
};

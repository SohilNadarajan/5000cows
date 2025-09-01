export interface LevelData {
  level: number;
  cowsToFind: number;
  grid: string[][];
  foundCows: FoundCow[];
  isCompleted: boolean;
}

export interface FoundCow {
  id: string;
  positions: Position[];
  color: string;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  currentLevel: number;
  levels: Record<number, LevelData>;
  totalLevels: number;
}

export interface DragState {
  isDragging: boolean;
  startPosition: Position | null;
  currentPosition: Position | null;
  selectedPositions: Position[];
}

export interface HintState {
  isActive: boolean;
  hintArea: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  } | null;
}

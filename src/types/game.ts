export type CellType = 'empty' | 'iron' | 'gold';

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  type: CellType;
  purity?: number;
  dangerLevel?: number;
}

export interface LogMessage {
  id: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  timestamp: number;
}

export type GameStatus = 'idle' | 'running' | 'success' | 'failed';

export interface GameState {
  drone: Position;
  grid: Cell[][];
  logs: LogMessage[];
  status: GameStatus;
}

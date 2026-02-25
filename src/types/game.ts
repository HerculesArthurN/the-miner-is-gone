// ─── Cell Types ────────────────────────────────────────────────────────────────

export type CellType =
  | 'empty'
  | 'fog'      // FogOfWar — desconhecido, requer scan
  | 'wall'     // Parede sólida — colisão
  | 'iron'     // Minério: ferro
  | 'gold'     // Minério: ouro
  | 'crystal'  // Minério: cristal (capítulos avançados)
  | 'isotope'  // Minério: isótopo quântico (cap 6+)
  | 'hazard'   // Perigo: gás/lava
  | 'portal';  // Portal (cap 6)

export interface Cell {
  x: number;
  y: number;
  type: CellType;
  // Propriedades de minério
  purity?: number;      // 0–100
  density?: number;     // Peso do minério (para knapsack)
  value?: number;       // Valor econômico
  isotopeId?: string;
  // Propriedades de perigo
  dangerLevel?: number; // 0–100
  hazardKind?: 'gas' | 'lava' | 'magnetic';
  // Estado visual
  revealed?: boolean;   // Fog of war revelado por scan
}

// ─── Position ──────────────────────────────────────────────────────────────────

export interface Position {
  x: number;
  y: number;
}

// ─── Drone State ───────────────────────────────────────────────────────────────

export interface DroneState extends Position {
  battery: number;     // 0–100
  cargo: CargoItem[];
  ticksUsed: number;
}

export interface CargoItem {
  type: CellType;
  quantity: number;
  density?: number;
  value?: number;
}

// ─── Logs ──────────────────────────────────────────────────────────────────────

export type LogType = 'info' | 'success' | 'error' | 'warning' | 'system';

export interface LogMessage {
  id: string;
  type: LogType;
  message: string;
  timestamp: number;
}

// ─── Game Status ───────────────────────────────────────────────────────────────

export type GameStatus = 'idle' | 'running' | 'success' | 'failed';

export type Medal = 'none' | 'bronze' | 'silver' | 'gold';

// ─── Game State ────────────────────────────────────────────────────────────────

export interface GameState {
  drone: DroneState;
  grid: Cell[][];
  logs: LogMessage[];
  status: GameStatus;
  ticksUsed: number;
  batteryUsed: number;
  medal: Medal;
}

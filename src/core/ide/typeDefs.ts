/**
 * Definições progressivas de tipos da API do jogo por capítulo.
 *
 * Cada capítulo injeta um conjunto diferente de declarações TypeScript (.d.ts)
 * no Monaco Editor. O jogador só vê os métodos que aquele capítulo ensina.
 *
 * Isso é pedagógico: não faz sentido expor api.scanNodes() no Capítulo 1.
 */

// ─── Base Types (disponíveis em TODOS os capítulos) ──────────────────────────

const COMMON_TYPES = `
/** Console do Computador de Bordo */
declare const console: {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};
`;

// ─── API por Capítulo ─────────────────────────────────────────────────────────

/** Capítulo 1: The Basics — API mínima para introdução */
const CHAPTER_1_API = `
${COMMON_TYPES}

/**
 * Move o drone para a posição absoluta (x, y) no grid.
 * @param x Coluna de destino (começa em 0, da esquerda para a direita)
 * @param y Linha de destino (começa em 0, de cima para baixo)
 */
declare function move(x: number, y: number): Promise<void>;

/**
 * Comanda o drone a minerar o bloco na posição atual.
 * Lança um erro se não há nada para minerar.
 * @param material Nome do material a ser minerado (ex: "ferro")
 */
declare function mine(material: string): Promise<void>;
`;

/** Capítulo 2: Everyday Types — scan() com retorno tipado */
const CHAPTER_2_API = `
${CHAPTER_1_API}

/** Resultado retornado pelo scanner do drone */
interface ScanResult {
  /** Tipo da célula: 'empty', 'iron', 'gold', 'wall', 'hazard', etc. */
  type: string;
  /** Pureza do minério (0–100). Presente apenas em células de minério. */
  purity?: number;
  /** Nível de perigo (0–100). Presente em células do tipo 'hazard'. */
  dangerLevel?: number;
}

/**
 * Escaneia a célula na posição relativa ao drone.
 * @param dx Deslocamento em X (-1, 0, 1)
 * @param dy Deslocamento em Y (-1, 0, 1)
 * @returns Dados da célula ou null se fora dos limites
 */
declare function scan(dx?: number, dy?: number): Promise<ScanResult | null>;
`;

/** Capítulo 3: Narrowing — scan com union types mais ricos */
const CHAPTER_3_API = `
${COMMON_TYPES}

type CellKind = 'empty' | 'iron' | 'gold' | 'wall' | 'hazard' | 'fog';

type ScanResult =
  | { kind: 'empty' }
  | { kind: 'wall' }
  | { kind: 'fog' }
  | { kind: 'iron'; purity: number }
  | { kind: 'gold'; purity: number }
  | { kind: 'hazard'; dangerLevel: number; hazardKind: 'gas' | 'lava' };

declare function move(x: number, y: number): Promise<void>;
declare function mine(material: string): Promise<void>;
declare function scan(dx?: number, dy?: number): Promise<ScanResult | null>;
`;

/** Capítulo 4: More on Functions — transmit e log */
const CHAPTER_4_API = `
${CHAPTER_3_API}

/**
 * Transmite dados para o terminal do operador.
 * Não consome bateria nem ticks.
 */
declare function transmit(data: unknown): void;
`;

/** Capítulo 5: Object Types — scanArea retorna array */
const CHAPTER_5_API = `
${CHAPTER_4_API}

/**
 * Escaneia uma área retangular ao redor do drone.
 * @param radius Raio do scan (1 = célula adjacente)
 */
declare function scanArea(radius: number): Promise<ScanResult[][]>;

/** Retorna o inventário atual do drone */
declare function getInventory(): { type: string; quantity: number }[];
`;

/** Capítulo 6: Generics — API completa */
const CHAPTER_6_API = `
${CHAPTER_5_API}

/** Informação completa de minério */
interface OreInfo {
  type: string;
  purity: number;
  density: number;
  value: number;
  isotopeId?: string;
}

/** Retorna todos os minérios detectados no scan area */
declare function scanArea(radius: number): Promise<OreInfo[]>;

/** Status do drone */
interface DroneStatus {
  battery: number;
  ticksUsed: number;
  cargoWeight: number;
  position: { x: number; y: number };
}

declare function getStatus(): DroneStatus;
`;

/** Capítulo 7: Classes — mainframe multi-drone */
const CHAPTER_7_API = `
${CHAPTER_6_API}

/** Controle de múltiplos drones via Mainframe */
declare const mainframe: {
  /** Lista de IDs dos drones ativos */
  droneIds: readonly string[];
  /** Envia comando para um drone específico */
  send(droneId: string, command: 'move' | 'mine' | 'scan'): Promise<void>;
  /** Retorna status de todos os drones */
  getAllStatus(): DroneStatus[];
};
`;

/** Capítulo 8: Type Manipulation — API mínima (foco em tipos) */
const CHAPTER_8_API = `
${COMMON_TYPES}

/** 
 * No Capítulo 8, o ambiente magnético destrói código JavaScript.
 * A solução existe apenas no sistema de tipos.
 * Apenas tipos utilitários estão disponíveis no escopo.
 */
`;

// ─── Mapa de Capítulo → TypeDefs ─────────────────────────────────────────────

const TYPE_DEFS_BY_CHAPTER: Record<number, string> = {
  1: CHAPTER_1_API,
  2: CHAPTER_2_API,
  3: CHAPTER_3_API,
  4: CHAPTER_4_API,
  5: CHAPTER_5_API,
  6: CHAPTER_6_API,
  7: CHAPTER_7_API,
  8: CHAPTER_8_API,
};

/**
 * Retorna as definições de tipo (.d.ts) para o capítulo especificado.
 * Deve ser injetado no Monaco via addExtraLib() ao montar o editor.
 */
export function getTypeDefsForChapter(chapter: number): string {
  return TYPE_DEFS_BY_CHAPTER[chapter] ?? TYPE_DEFS_BY_CHAPTER[1];
}

/**
 * Retorna as definições de tipo para um nível específico.
 * Permite override por nível (um nível pode ter tipos customizados).
 */
export function getTypeDefsForLevel(
  chapter: number,
  customTypeDefs?: string
): string {
  const baseApi = getTypeDefsForChapter(chapter);
  if (customTypeDefs && customTypeDefs.trim()) {
    return `
${baseApi}
// ─── Level Specific Overrides ───────────────────────────────────────
${customTypeDefs}
        `;
  }
  return baseApi;
}

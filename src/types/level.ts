import { Cell, CellType, GameState } from './game';

// ─── Handbook Reference ────────────────────────────────────────────────────────

export interface HandbookRef {
    /** Ex: "Everyday Types › Union Types" */
    section: string;
    /** URL direta com anchor para a seção exata */
    url: string;
}

// ─── Mission ───────────────────────────────────────────────────────────────────

export interface LevelMission {
    /** Texto narrativo exibido no terminal ao iniciar o nível (suporta markdown) */
    briefing: string;
    /** Critério de vitória descrito em linguagem humana */
    objective: string;
}

// ─── Hardware Constraints ─────────────────────────────────────────────────────

export interface HardwareConstraints {
    /** Bateria inicial do drone (default: 100) */
    maxBattery: number;
    /** Máximo de chamadas à API antes de timeout (default: 10000) */
    maxApiCalls?: number;
    /** Máximo de ticks antes de falha por timeout */
    maxTicks?: number;
    /** Limite de peso total de carga (para o Knapsack Problem) */
    maxCargoWeight?: number;
}

// ─── Scoring ───────────────────────────────────────────────────────────────────

export interface LevelScoring {
    /** Prata: lista de padrões proibidos no código do jogador */
    silver: {
        forbiddenPatterns: string[]; // ex: ["any", "@ts-ignore", "as any"]
    };
    /** Ouro: dentro dos limites de eficiência */
    gold: {
        maxTicks: number;
        maxBatteryUsed: number;
    };
}

// ─── Level Definition Contract ─────────────────────────────────────────────────

export interface ILevelDefinition {
    /** Identificador único — ex: "ch1-l1" */
    id: string;

    /** Capítulo ao qual pertence (1–8) */
    chapter: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

    /** Número do nível dentro do capítulo */
    levelInChapter: number;

    /** Título exibido no header — ex: "Static Type Checking" */
    title: string;

    /** Referência à seção do TypeScript Handbook */
    handbookRef: HandbookRef;

    /** Textos narrativos da missão */
    mission: LevelMission;

    /**
     * Grid inicial declarado como array 2D de CellType.
     * O motor cria o array de Cell[][] a partir disso.
     * Linha 0 = topo, Coluna 0 = esquerda.
     * Ex: [['empty', 'wall'], ['iron', 'empty']]
     */
    initialGrid: CellType[][];

    /** Posição inicial do drone */
    droneStart: { x: number; y: number };

    /** Restrições de hardware para este nível */
    hardware: HardwareConstraints;

    /**
     * String contendo declarações TypeScript (.d.ts) da API disponível.
     * Injetada no Monaco Editor via addExtraLib().
     * Determina quais métodos o jogador pode ver no IntelliSense.
     */
    apiTypeDefs: string;

    /** Código inicial exibido no Monaco ao abrir o nível */
    starterCode: string;

    /**
     * Função pura que avalia o estado final do jogo.
     * Retorna true se a missão foi cumprida.
     */
    victoryCondition: (state: GameState) => boolean;

    /** Critérios para o sistema de medalhas */
    scoring: LevelScoring;
}

// ─── Chapter Definition ────────────────────────────────────────────────────────

export interface IChapterDefinition {
    chapter: number;
    title: string;
    environment: string; // Descrição do ambiente/bioma
    levels: ILevelDefinition[];
}

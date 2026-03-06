import { ILevelDefinition } from '../../types/level';

export const chapter4Levels: ILevelDefinition[] = [
    // ─── 4.1: Function Type Expressions ───────────────────────────────────────
    {
        id: '4.1',
        chapter: 4,
        levelInChapter: 1,
        title: 'Comandos Programáveis',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions',
            section: 'Function Type Expressions'
        },
        mission: {
            briefing: `# Ato 4.1 — Ritmos Automáticos ⚙️

O Golem agora aceita uma "Rotina de Automação". Você deve passar um encantamento callback que defina se o material encontrado na mina deve ser extraído ou ignorado.

No TS, definimos tipos de feitiço como: \`(material: string) => boolean\`.`,
            objective: "Defina o tipo da função de filtragem rúnica corretamente.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'iron', 'gold'],
            ['empty', 'empty', 'empty'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      type FilterFn = (material: string) => boolean;
      declare function autoMine(filter: FilterFn): Promise<void>;
    `,
        starterCode: `async function main() {
  // A função autoMine espera um callback (material: string) => boolean
  // Minde apenas "gold"
  const goldFilter = (m: string): boolean => m === "gold";
  
  await move(2, 0);
  const result = await scan(0, 0);
  
  if (result && goldFilter(result.type)) {
     await mine();
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'gold') && !state.drone.cargo.some(c => c.type === 'iron'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 4.2: Generic Functions ───────────────────────────────────────────────
    {
        id: '4.2',
        chapter: 4,
        levelInChapter: 2,
        title: 'O Transmissor Universal',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions',
            section: 'Generic Functions'
        },
        mission: {
            briefing: `# Ato 4.2 — O Transmissor Universal 📡

A guilda precisa transmitir diferentes tipos de pergaminhos de dados. Ao invés de criar um feitiço para cada tipo, usaremos **Generics** para criar uma magia transmissora universal.

Generics permitem que o ingrediente de entrada determine a forma do ritual final.`,
            objective: "Use um feitiço genérico para transmitir dados de cristais.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'crystal', 'empty'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      declare function transmit<T>(payload: T): void;
    `,
        starterCode: `interface CrystalData {
  purity: number;
  weight: number;
}

async function main() {
  await move(1, 0);
  const info = await scan(0, 0);
  
  if (info && info.type === "crystal") {
    // Transmita usando o tipo genérico <CrystalData>
    transmit<CrystalData>({ 
      purity: info.purity || 0, 
      weight: 1.5 
    });
    await mine();
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'crystal'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 4.3: Function Overloads ──────────────────────────────────────────────
    {
        id: '4.3',
        chapter: 4,
        levelInChapter: 3,
        title: 'Scanner Multifuncional',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads',
            section: 'Function Overloads'
        },
        mission: {
            briefing: `O sensor estelar foi atualizado. Ele agora suporta dois modos: Scan de Proximidade (com dx, dy) ou Scan de Localização (com x, y absoluto).\n\nTypeScript permite definir múltiplas assinaturas para a mesma função (Overloads).`,
            objective: "Use o overload correto do scanner para localizar o Isótopo.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'isotope', 'empty'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      // Overload 1: Relativo
      declare function scan(dx: number, dy: number): Promise<ScanResult | null>;
      // Overload 2: Absoluto (usando config objeto)
      declare function scan(config: { x: number; y: number }): Promise<ScanResult | null>;
    `,
        starterCode: `async function main() {
  // Use o modo absoluto para verificar [2, 2]
  const res = await scan({ x: 2, y: 2 });
  
  if (res && res.type === "isotope") {
    await move(2, 2);
    await mine();
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'isotope'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 4.4: Rest Parameters ──────────────────────────────────────────────────
    {
        id: '4.4',
        chapter: 4,
        levelInChapter: 4,
        title: 'Log de Eventos em Massa',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments',
            section: 'Rest Parameters'
        },
        mission: {
            briefing: `Precisamos logar vários eventos de uma só vez para economizar largura de banda. Use Rest Parameters (\`...args\`) para aceitar um número variável de mensagens.\n\nIsso permite passar 1, 2 ou 10 argumentos para a mesma função.`,
            objective: "Envie múltiplos logs em uma única chamada.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['iron', 'gold', 'crystal'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      declare function batchLog(...messages: string[]): void;
    `,
        starterCode: `async function main() {
  // Minere tudo e logue em batch
  await move(0, 0); await mine();
  await move(1, 0); await mine();
  await move(2, 0); await mine();
  
  batchLog("Ferro coletado", "Ouro coletado", "Cristal coletado");
}`,
        victoryCondition: (state) => state.drone.cargo.length >= 3,
        scoring: {
            gold: { maxTicks: 10, maxBatteryUsed: 200 },
            silver: { forbiddenPatterns: [] }
        }
    }
];

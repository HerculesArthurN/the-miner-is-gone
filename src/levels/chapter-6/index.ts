import { ILevelDefinition } from '../../types/level';

export const chapter6Levels: ILevelDefinition[] = [
  // ─── 6.1: Intro to Generics ───────────────────────────────────────────────
  {
    id: '6.1',
    chapter: 6,
    levelInChapter: 1,
    title: 'Identidade Digital',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#hello-world-of-generics',
      section: 'Hello World of Generics'
    },
    mission: {
      briefing: `O drone recuperou um processador de dados danificado. Ele precisa de uma função que retorne exatamente o que recebe, mas sem perder a informação de tipo (usar 'any' é proibido).\n\nGenerics funcionam como 'variáveis de tipo' que capturam o tipo do argumento.`,
      objective: "Implemente a função genérica 'identity' para processar sinais.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'iron'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      declare function validateSignal<T>(signal: T): T;
    `,
    starterCode: `// Use <T> para capturar o tipo de entrada
function identity<T>(arg: T): T {
  return arg;
}

async function main() {
  const signal = "S-77";
  const processed = identity(signal); // 'processed' deve ser string
  
  if (processed === "S-77") {
    await move(1, 0);
    await mine();
  }
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'iron'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: ["any"] }
    }
  },

  // ─── 6.2: Working with Generic Type Variables ─────────────────────────────
  {
    id: '6.2',
    chapter: 6,
    levelInChapter: 2,
    title: 'Processador de Lotes',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables',
      section: 'Working with Generic Type Variables'
    },
    mission: {
      briefing: `Muitas vezes trabalhamos com arrays de tipos genéricos. Se tentarmos acessar '.length' em um tipo 'T', o TS reclamará, pois não sabe se 'T' tem essa propriedade. No entanto, se o argumento for 'T[]', o TS saberá que é um array.\n\nFiltre o inventário recuperado usando um array genérico.`,
      objective: "Use T[] para lidar com listas de itens genéricos.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'iron', 'gold'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      interface Item { id: string; }
      declare function transmitItems<T>(items: T[]): void;
    `,
    starterCode: `function getFirst<T>(items: T[]): T | undefined {
  // O TS entende que 'items' é um array, então .length funciona
  if (items.length > 0) return items[0];
  return undefined;
}

async function main() {
  const inventory = [{ id: "iron" }, { id: "gold" }];
  const first = getFirst(inventory);
  
  if (first && first.id === "iron") {
    await move(1, 0);
    await mine();
  }
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'iron'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 6.3: Generic Interfaces ──────────────────────────────────────────────
  {
    id: '6.3',
    chapter: 6,
    levelInChapter: 3,
    title: 'Analisador de Pureza',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types',
      section: 'Generic Types'
    },
    mission: {
      briefing: `Podemos definir interfaces que aceitam parâmetros de tipo. Isso é útil para criar estruturas de dados reutilizáveis como 'Result<T>'.\n\nAnalise os dados do scanner usando uma interface genérica.`,
      objective: "Defina e use uma interface genérica para capturar resultados.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'crystal'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      interface CrystalData { clarity: number; }
      interface AnalysisResult<T> { data: T; timestamp: number; }
      declare function finalizeAnalysis<T>(res: AnalysisResult<T>): void;
    `,
    starterCode: `async function main() {
  const crystalInfo: CrystalData = { clarity: 0.95 };
  
  // Use a interface genérica AnalysisResult
  const result: AnalysisResult<CrystalData> = {
    data: crystalInfo,
    timestamp: Date.now()
  };
  
  finalizeAnalysis(result);
  await move(1, 0);
  await mine();
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'crystal'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 6.4: Generic Classes ─────────────────────────────────────────────────
  {
    id: '6.4',
    chapter: 6,
    levelInChapter: 4,
    title: 'Cofre Modular',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes',
      section: 'Generic Classes'
    },
    mission: {
      briefing: `Classes também podem ser genéricas. Isso permite criar contêineres que mantêm a segurança de tipos para seus métodos internos.\n\nO drone tem um novo 'SecureVault<T>' para materiais sensíveis.`,
      objective: "Instancie e utilize uma classe genérica.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'isotope'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      declare class SecureVault<T> {
        constructor(initial: T);
        getItem(): T;
      }
      declare function shipVault<T>(v: SecureVault<T>): void;
    `,
    starterCode: `interface Isotope { id: string; radiation: number; }

async function main() {
  const iso: Isotope = { id: "U-235", radiation: 400 };
  
  // O TS infere ou você pode passar explicitamente: new SecureVault<Isotope>(...)
  const vault = new SecureVault(iso);
  
  shipVault(vault);
  await move(1, 0);
  await mine();
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'isotope'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 6.5: Generic Constraints ─────────────────────────────────────────────
  {
    id: '6.5',
    chapter: 6,
    levelInChapter: 5,
    title: 'Restrição de Escaneamento',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints',
      section: 'Generic Constraints'
    },
    mission: {
      briefing: `Às vezes, queremos um Generic que aceite apenas tipos com certas propriedades. Usamos 'extends' para criar restrições.\n\nApenas objetos que possuem uma propriedade 'purity' podem ser processados pelo refinador.`,
      objective: "Crie uma função genérica restrita à interface 'Minable'.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'gold'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      interface Minable { purity: number; }
    `,
    starterCode: `// T deve possuir a interface Minable
function refine<T extends Minable>(item: T): number {
  return item.purity * 2;
}

async function main() {
  const res = await scan(1, 0);
  
  if (res && res.type === "gold" && res.purity !== undefined) {
    const value = refine({ purity: res.purity });
    transmit({ refined_value: value });
    await move(1, 0);
    await mine();
  }
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'gold'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  },

  // ─── 6.6: Default Generic Types ───────────────────────────────────────────
  {
    id: '6.6',
    chapter: 6,
    levelInChapter: 6,
    title: 'Módulos de Backup',
    handbookRef: {
      url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-parameter-defaults',
      section: 'Generic Parameter Defaults'
    },
    mission: {
      briefing: `Podemos fornecer um tipo padrão para um parâmetro genérico. Se o desenvolvedor não especificar o tipo, o TS usará o padrão.\n\nConfigurações de rede do drone usam 'JSON' como formato padrão, mas podem ser alteradas.`,
      objective: "Use parâmetros genéricos com valores default.",
    },
    droneStart: { x: 0, y: 0 },
    initialGrid: [
       ['empty', 'crystal'],
    ],
    hardware: { maxBattery: 500 },
    apiTypeDefs: `
      interface DefaultConfig { version: string; }
      declare function setupNetwork<T = DefaultConfig>(conf: T): void;
    `,
    starterCode: `async function main() {
  // Chamada usando o tipo padrão DefaultConfig
  setupNetwork({ version: "v2.0.4" });
  
  // Chamada especificando um tipo customizado
  setupNetwork<{ secure: boolean }>({ secure: true });

  await move(1, 0);
  await mine();
}`,
    victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'crystal'),
    scoring: {
      gold: { maxTicks: 2, maxBatteryUsed: 50 },
      silver: { forbiddenPatterns: [] }
    }
  }
];

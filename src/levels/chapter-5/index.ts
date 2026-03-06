import { ILevelDefinition } from '../../types/level';

export const chapter5Levels: ILevelDefinition[] = [
    // ─── 5.1: Property Modifiers (readonly / ?) ──────────────────────────────
    {
        id: '5.1',
        chapter: 5,
        levelInChapter: 1,
        title: 'Manutreção Estrita',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#property-modifiers',
            section: 'Property Modifiers'
        },
        mission: {
            briefing: `# Ato 5.1 — Runas Imutáveis 🛡️

O pergaminho de missões da guilda possui segredos que não devem ser alterados após sua criação (\`readonly\`) e anotações opcionais (\`?\`) para observações do aprendiz.

Use esses modificadores para garantir que a história da forja permaneça intocada pelos séculos.

📖 **Estude o Cânone:** [Object Types › Property Modifiers](https://www.typescriptlang.org/docs/handbook/2/objects.html#property-modifiers)`,
            objective: "Proteja os dados do Golem usando runas de leitura exclusivas (readonly) e campos opcionais.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'iron'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      interface Mission {
        readonly id: string;
        target: string;
        notes?: string;
      }
      declare function archiveMission(m: Mission): void;
    `,
        starterCode: `async function main() {
  const current: Mission = {
    id: "SEC-77",
    target: "iron"
  };
  
  // Tente alterar current.id (vai dar erro se for readonly!)
  // Descomente para testar:
  // current.id = "X"; 
  
  if (current.target === "iron") {
    await move(1, 0);
    await mine();
  }
  
  archiveMission(current);
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'iron'),
        scoring: {
            gold: { maxTicks: 2, maxBatteryUsed: 50 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 5.2: Index Signatures ────────────────────────────────────────────────
    {
        id: '5.2',
        chapter: 5,
        levelInChapter: 2,
        title: 'Catálogo Dinâmico',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures',
            section: 'Index Signatures'
        },
        mission: {
            briefing: `O mercado de minérios flutua a cada segundo. Precisamos de um objeto que aceite qualquer nome de mineral como chave e um número (preço) como valor.\n\nExemplo: \`{ [key: string]: number }\`.`,
            objective: "Crie um mapeamento dinâmico de preços para os minérios encontrados.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'iron', 'gold'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      interface PriceMap {
        [mineral: string]: number;
      }
      declare function updateMarket(prices: PriceMap): void;
    `,
        starterCode: `async function main() {
  const currentPrices: PriceMap = {
    "iron": 100,
    "gold": 5000,
    "crystal": 12000
  };
  
  updateMarket(currentPrices);
  
  await move(2, 0);
  await mine();
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'gold'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 5.3: Extending Types (Intersection) ──────────────────────────────────
    {
        id: '5.3',
        chapter: 5,
        levelInChapter: 3,
        title: 'Fusão de Sensores',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types',
            section: 'Intersection Types'
        },
        mission: {
            briefing: `Um Isótopo não é apenas um minério, ele também é um perigo biológico. No TS, podemos combinar tipos usando interseção (\`&\`) para criar um novo tipo que tenha todas as propriedades.\n\nCombine \`Ore\` e \`Hazardous\` para descrever o isótopo.`,
            objective: "Use interseção para tipar o Isótopo perigoso.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'empty', 'isotope'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      interface Ore { type: string; weight: number; }
      interface Hazardous { radiationLevel: number; dangerZone: boolean; }
      
      // O isótopo é a interseção dos dois
      type IsotopeResult = Ore & Hazardous;
      
      declare function analyzeIsotope(data: IsotopeResult): void;
    `,
        starterCode: `async function main() {
  await move(2, 0);
  const scanRes = await scan(0, 0);
  
  if (scanRes) {
    const rawData: IsotopeResult = {
      type: "isotope",
      weight: 0.5,
      radiationLevel: 9000,
      dangerZone: true
    };
    
    analyzeIsotope(rawData);
    await mine();
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'isotope'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 5.4: Generic Object Types ────────────────────────────────────────────
    {
        id: '5.4',
        chapter: 5,
        levelInChapter: 4,
        title: 'Container Segregado',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#generic-object-types',
            section: 'Generic Object Types'
        },
        mission: {
            briefing: `O compartimento de carga do drone pode ser especializado para diferentes tipos de materiais. Vamos criar um \`Box<Type>\` genérico para transportar ouro ou cristais separadamente.\n\nIsso evita misturar tipos sensíveis.`,
            objective: "Crie instâncias especializadas de um container genérico.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['gold', 'crystal'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      interface Box<T> {
        content: T;
        label: string;
      }
      declare function shipBox<T>(box: Box<T>): void;
    `,
        starterCode: `interface Gold { purity: number; }
interface Crystal { clarity: string; }

async function main() {
  await move(0, 0);
  await mine();
  
  const goldBox: Box<Gold> = {
    content: { purity: 99 },
    label: "OURO_REFINADO"
  };
  
  shipBox(goldBox);
  
  await move(1, 0);
  await mine();
  
  const crystalBox: Box<Crystal> = {
    content: { clarity: "IF" },
    label: "CRISTAL_PURO"
  };
  
  shipBox(crystalBox);
}`,
        victoryCondition: (state) => state.drone.cargo.length >= 2,
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 150 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 5.5: Tuple Types ───────────────────────────────────────────────────
    {
        id: '5.5',
        chapter: 5,
        levelInChapter: 5,
        title: 'Vetor de Navegação',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types',
            section: 'Tuple Types'
        },
        mission: {
            briefing: `Coordenadas 3D são representadas no drone como uma Tupla fixa: \`[number, number, number]\`. Diferente de um array comum, uma tupla tem tamanho e tipos de elementos fixos por posição.\n\nAcesse o ponto de extração Z-12.`,
            objective: "Use Tuplas para definir vetores de movimento.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'crystal'],
        ],
        hardware: { maxBattery: 1000 },
        apiTypeDefs: `
      type Coord3D = [number, number, number];
      declare function teleportTo(target: Coord3D): Promise<void>;
    `,
        starterCode: `async function main() {
  // O ponto Z-12 está em [4, 2, 12]
  // Estreite como uma tupla: [number, number, number]
  const target: Coord3D = [4, 2, 12];
  
  await teleportTo(target);
  
  const res = await scan(0, 0);
  if (res && res.type === "crystal") {
    await mine();
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'crystal'),
        scoring: {
            gold: { maxTicks: 2, maxBatteryUsed: 20 },
            silver: { forbiddenPatterns: [] }
        }
    }
];

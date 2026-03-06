import { ILevelDefinition } from '../../types/level';

export const chapter3Levels: ILevelDefinition[] = [
    // ─── 3.1: typeof Type Guards ──────────────────────────────────────────────
    {
        id: '3.1',
        chapter: 3,
        levelInChapter: 1,
        title: 'O Protetor de Tipos',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards',
            section: 'typeof type guards'
        },
        mission: {
            briefing: `# Ato 3.1 — O Protetor de Runas 🛡️

Os cristais de percepção do Golem estão captando ecos confusos. Precisamos discernir se o que reluz à frente é matéria física (string) ou se houve uma interferência mágica.

No TypeScript, usamos o operador \`typeof\` para **"Estreitar"** (Narrowing) uma possibilidade rúnica dentro de uma condição. Isso garante que o Golem só manipule o que ele realmente entende.`,
            objective: "Use 'typeof' para confirmar se o eco é uma 'string' antes de minerar.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'iron', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      // O scan neste nível retorna 'any' para forçar o uso de typeof
      declare function scan(dx: number, dy: number): any;
    `,
        starterCode: `async function main() {
  const result = await scan(1, 1);
  
  // O sensor é instável. O 'result' pode ser qualquer coisa.
  // Use typeof para garantir que é uma 'string' antes de minerar.
  if (typeof result === "string") {
    if (result === "iron") {
      await move(1, 1);
      await mine();
    }
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'iron'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 3.2: Truthiness Narrowing ────────────────────────────────────────────
    {
        id: '3.2',
        chapter: 3,
        levelInChapter: 2,
        title: 'O Vácuo do Nulo',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing',
            section: 'Truthiness narrowing'
        },
        mission: {
            briefing: `# Ato 3.2 — O Vácuo da Incerteza 🌑

Muitas vezes, suas magias podem retornar \`null\` ou \`undefined\` caso a percepção falhe. Na Magia Rúnica, podemos usar a **Verdade** (Truthiness) para filtrar esses vazios.

Se tentarmos extrair essência de um \`null\`, o Golem entrará em colapso. Verifique a existência do resultado antes de prosseguir.`,
            objective: "Lide com o resultado nulo da percepção usando uma checagem de existência rúnica.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'empty', 'empty'],
            ['empty', 'gold', 'empty'],
            ['empty', 'empty', 'empty'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      interface BasicScan { type: string; }
      declare function scan(dx: number, dy: number): BasicScan | null;
    `,
        starterCode: `async function main() {
  const res = await scan(1, 1);
  
  // Erro: 'res' pode ser null!
  // estreite o tipo verificando se 'res' existe.
  if (res) {
    if (res.type === "gold") {
      await move(1, 1);
      await mine();
    }
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'gold'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 3.3: The 'in' operator narrowing ─────────────────────────────────────
    {
        id: '3.3',
        chapter: 3,
        levelInChapter: 3,
        title: 'Propriedades Fantasmas',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing',
            section: 'The in operator narrowing'
        },
        mission: {
            briefing: `# Ato 3.3 — Propriedades Espectrais 👻

A percepção agora detecta dois tipos de depósitos: Minérios Comuns (com a runa \`type\`) e Isótopos Raros (com a marca \`isotopeId\`).

Use o operador \`in\` para confirmar se a marca rúnica \`isotopeId\` existe no objeto antes de tratá-lo como um isótopo sagrado.`,
            objective: "Identifique o Isótopo usando o operador rúnico 'in'.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'empty', 'empty'],
            ['empty', 'isotope', 'empty'],
            ['empty', 'empty', 'empty'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      interface Ore { type: string; }
      interface Radioactive { isotopeId: string; type: "isotope" }
      declare function scan(dx: number, dy: number): Ore | Radioactive;
    `,
        starterCode: `async function main() {
  const info = await scan(1, 1);
  
  // Use "isotopeId" in info para estreitar o tipo
  if ("isotopeId" in info) {
    transmit({ active: info.isotopeId });
    await move(1, 1);
    await mine();
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'isotope'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 3.4: Discriminated Unions ────────────────────────────────────────────
    {
        id: '3.4',
        chapter: 3,
        levelInChapter: 4,
        title: 'União Discriminada',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions',
            section: 'Discriminated unions'
        },
        mission: {
            briefing: `# Ato 3.4 — A União Revelação 🕯️

Este é o padrão mais poderoso da nossa ordem. Todos os resultados de percepção agora possuem uma runa comum chamada \`kind\`.

Dependendo do valor dessa runa ("success" ou "danger"), o restante do pergaminho se transforma! O Scriptorium é sábio o suficiente para entender essa transmutação de tipos.`,
            objective: "Use a runa 'kind' para diferenciar entre sucesso e o perigo iminente.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'hazard', 'empty'],
            ['empty', 'crystal', 'empty'],
            ['empty', 'empty', 'empty'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      interface Success { kind: "success"; material: string; purity: number; }
      interface Danger { kind: "danger"; dangerLevel: number; }
      type ScanResponse = Success | Danger;
      declare function scan(dx: number, dy: number): ScanResponse;
    `,
        starterCode: `async function main() {
  const res = await scan(1, 1);
  
  // Verifique res.kind
  if (res.kind === "success") {
    // Aqui res.material existe!
    if (res.material === "crystal" && res.purity > 80) {
       await move(1, 1);
       await mine();
    }
  } else {
    log("warning", "Perigo detectado: " + res.dangerLevel);
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'crystal'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 3.5: Using Type Predicates ───────────────────────────────────────────
    {
        id: '3.5',
        chapter: 3,
        levelInChapter: 5,
        title: 'O Predicado de Tipos',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates',
            section: 'Using type predicates'
        },
        mission: {
            briefing: `Às vezes queremos mover a lógica de Narrowing para uma função separada. Para o TS entender que a função checa o tipo, usamos a sintaxe \`arg is Type\`. \n\nCrie uma função que identifique se um bloco é de ouro puro.`,
            objective: "Crie e use um Type Predicate para encontrar ouro.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'empty', 'empty'],
            ['empty', 'gold', 'empty'],
            ['empty', 'empty', 'empty'],
        ],
        hardware: { maxBattery: 500 },
        apiTypeDefs: `
      interface Block { type: string; purity: number; }
      declare function scan(dx: number, dy: number): any;
    `,
        starterCode: `interface GoldInfo { type: "gold"; purity: number; }

// Implemente o predicado: res is GoldInfo
function isHighQualityGold(res: any): res is GoldInfo {
  return res && res.type === "gold" && res.purity > 90;
}

async function main() {
  const data = await scan(1, 1);
  if (isHighQualityGold(data)) {
    await move(1, 1);
    await mine();
  }
}`,
        victoryCondition: (state) => state.drone.cargo.some(c => c.type === 'gold'),
        scoring: {
            gold: { maxTicks: 5, maxBatteryUsed: 100 },
            silver: { forbiddenPatterns: [] }
        }
    },

    // ─── 3.6: Exhaustiveness checking (never) ─────────────────────────────────
    {
        id: '3.6',
        chapter: 3,
        levelInChapter: 6,
        title: 'A Noite Eterna',
        handbookRef: {
            url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking',
            section: 'Exhaustiveness checking'
        },
        mission: {
            briefing: `O sistema de segurança exige que tratemos TODOS os tipos de blocos possíveis. Se um novo tipo for adicionado e não o tratarmos, o código não deve compilar.\n\nUsamos o tipo \`never\` para garantir que cobrimos todos os casos em um \`switch\` ou bloco condicional.`,
            objective: "Garanta que todos os materiais ('iron', 'gold', 'crystal') sejam processados usando o tipo 'never'.",
        },
        droneStart: { x: 0, y: 0 },
        initialGrid: [
            ['empty', 'empty', 'iron'],
            ['empty', 'gold', 'empty'],
            ['crystal', 'empty', 'empty'],
        ],
        hardware: { maxBattery: 1000 },
        apiTypeDefs: `
      type Material = "iron" | "gold" | "crystal";
      declare function scan(dx: number, dy: number): { type: Material };
    `,
        starterCode: `async function main() {
  // Vá até as coordenadas e mine tudo!
  const positions = [[2, 0], [1, 1], [0, 2]];
  
  for (const [x, y] of positions) {
    const info = await scan(x - 0, y - 0); // hack para dx/dy se drone em 0,0
    
    switch (info.type) {
      case "iron":
      case "gold":
      case "crystal":
        await move(x, y);
        await mine();
        await move(0, 0); // Volta pra base
        break;
      default:
        // Se info.type for coberto, 'info.type' aqui será 'never'
        const _exhaustiveCheck: never = info.type;
        return _exhaustiveCheck;
    }
  }
}`,
        victoryCondition: (state) =>
            state.drone.cargo.some(c => c.type === 'iron') &&
            state.drone.cargo.some(c => c.type === 'gold') &&
            state.drone.cargo.some(c => c.type === 'crystal'),
        scoring: {
            gold: { maxTicks: 20, maxBatteryUsed: 500 },
            silver: { forbiddenPatterns: [] }
        }
    }
];

import { ILevelDefinition } from '../../types/level';
import { GameState } from '../../types/game';

// ─── API Typedefs do Capítulo 2 ───────────────────────────────────────────────
const CH2_API = `
declare function move(x: number, y: number): Promise<void>;
declare function mine(material: string): Promise<void>;

interface ScanResult {
  type: string;
  purity?: number;
  dangerLevel?: number;
}

declare function scan(dx?: number, dy?: number): Promise<ScanResult | null>;
declare const console: { log: (...args: unknown[]) => void };
`;

// ─── Nível 2-1: Primitives ────────────────────────────────────────────────────

export const level_2_1: ILevelDefinition = {
    id: 'ch2-l1',
    chapter: 2,
    levelInChapter: 1,
    title: 'Primitives: string, number, boolean',
    handbookRef: {
        section: 'Everyday Types › The primitives',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean',
    },
    mission: {
        briefing: `# Missão 2.1 — Calibrando os Sensores

Os sensores do drone precisam ser calibrados com os tipos corretos.
Configure as variáveis com as anotações de tipo adequadas.

📖 Leia: [Everyday Types › The primitives](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean)

- \`string\` → texto (nomes, materiais, mensagens)
- \`number\` → números (coordenadas, temperatura, porcentagem)
- \`boolean\` → verdadeiro/falso (flags, condições)`,
        objective: 'Calibrar os 3 sensores com os tipos corretos e coletar o ferro.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'iron', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 15 },
    apiTypeDefs: CH2_API,
    starterCode: `// Calibre os sensores com os tipos corretos!

// Sensor 1: Nome do operador (texto)
const operatorName: ___ = "Hercules";

// Sensor 2: Temperatura do reator (número)
const reactorTemp: ___ = 2400;

// Sensor 3: Modo noturno ativo (verdadeiro/falso)
const nightMode: ___ = true;

console.log("Operador:", operatorName);
console.log("Reator a", reactorTemp, "°C | Modo noturno:", nightMode);

// Com sensores calibrados, inicie a extração
await move(2, 1);
await mine("ferro");
`,
    victoryCondition: (state: GameState) => state.grid[1][2].type === 'empty',
    scoring: {
        silver: { forbiddenPatterns: ['any'] },
        gold: { maxTicks: 5, maxBatteryUsed: 25 },
    },
};

// ─── Nível 2-2: Arrays ────────────────────────────────────────────────────────

export const level_2_2: ILevelDefinition = {
    id: 'ch2-l2',
    chapter: 2,
    levelInChapter: 2,
    title: 'Arrays',
    handbookRef: {
        section: 'Everyday Types › Arrays',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays',
    },
    mission: {
        briefing: `# Missão 2.2 — A Esteira Linear

O scanner detectou uma linha de minérios. Em vez de escrever o mesmo
comando 4 vezes, use um **Array** tipado e um loop.

📖 Leia: [Everyday Types › Arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)

- \`number[]\` é o mesmo que \`Array<number>\`
- Um array de coordenadas pode ser \`[number, number][]\` (array de tuplas)`,
        objective: 'Coletar todos os 4 ferros na linha y=2 usando um array tipado.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'iron', 'iron', 'iron', 'iron'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 20 },
    apiTypeDefs: CH2_API,
    starterCode: `// Missão: Coletar ferro em x = 1, 2, 3, 4 (todos na linha y=2)
// Use um array tipado e um loop!

// ✅ Declare o array de coordenadas X com tipo explícito
const xTargets: number[] = [1, 2, 3, 4];

for (const x of xTargets) {
  await move(x, 2);
  await mine("ferro");
}
`,
    victoryCondition: (state: GameState) =>
        state.grid[2].slice(1, 5).every(cell => cell.type === 'empty'),
    scoring: {
        silver: { forbiddenPatterns: ['any'] },
        gold: { maxTicks: 12, maxBatteryUsed: 60 },
    },
};

// ─── Nível 2-3: Proibição de any ─────────────────────────────────────────────

export const level_2_3: ILevelDefinition = {
    id: 'ch2-l3',
    chapter: 2,
    levelInChapter: 3,
    title: 'Por que evitar "any"',
    handbookRef: {
        section: 'Everyday Types › any',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
    },
    mission: {
        briefing: `# Missão 2.3 — A Armadilha do \`any\`

O script abaixo usa \`any\` em todo lugar — o TypeScript aceita, mas
perde toda a capacidade de te proteger.

\`any\` é uma porta de saída que **desabilita** o sistema de tipos.
Código com \`any\` pode parecer certo, mas vai falhar em runtime.

📖 Leia: [Everyday Types › any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

**Desafio:** Substitua TODOS os \`any\` por tipos concretos.
Este nível tem \`forbiddenPatterns: ["any"]\` — usar \`any\` resulta em Bronze.`,
        objective: 'Substituir todos os any por tipos corretos e coletar o ouro.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'gold', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 10 },
    apiTypeDefs: CH2_API,
    starterCode: `// ❌ Código com any — funciona mas é perigoso!
// Substitua todos os 'any' por tipos concretos (string, number, boolean)

function createCommand(material: any, x: any, y: any): any {
  return { material, x, y };
}

const cmd: any = createCommand("ouro", 3, 1);

await move(cmd.x, cmd.y);
await mine(cmd.material);
`,
    victoryCondition: (state: GameState) => state.grid[1][3].type === 'empty',
    scoring: {
        silver: { forbiddenPatterns: ['any', '@ts-ignore'] },
        gold: { maxTicks: 5, maxBatteryUsed: 20 },
    },
};

// ─── Nível 2-4: Functions ─────────────────────────────────────────────────────

export const level_2_4: ILevelDefinition = {
    id: 'ch2-l4',
    chapter: 2,
    levelInChapter: 4,
    title: 'Functions: Parameter & Return Types',
    handbookRef: {
        section: 'Everyday Types › Functions',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions',
    },
    mission: {
        briefing: `# Missão 2.4 — Contratos de Função

Funções TypeScript têm contratos: você especifica os tipos dos
parâmetros **e** o tipo de retorno.

📖 Leia: [Everyday Types › Functions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions)

\`\`\`typescript
function greet(name: string): string {
  return "Olá, " + name;
}
\`\`\`

**Objetivo:** Implementar 3 funções com assinaturas tipadas corretas.`,
        objective: 'Implementar as 3 funções tipadas e coletar ferro e ouro.',
    },
    initialGrid: [
        ['empty', 'iron', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'gold', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 20 },
    apiTypeDefs: CH2_API,
    starterCode: `// Implemente as funções com os tipos corretos nos parâmetros e retorno!

// Função 1: calcula a distância de Manhattan entre dois pontos
function manhattanDistance(x1: ___, y1: ___, x2: ___, y2: ___): ___ {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

// Função 2: retorna uma mensagem de status do drone
function getStatusMessage(battery: ___): ___ {
  if (battery > 50) return "NORMAL";
  if (battery > 20) return "ALERTA";
  return "CRÍTICO";
}

// Função 3: verifica se o material é minerável
function isMaterial(name: ___): ___ {
  return name === "ferro" || name === "ouro";
}

console.log("Distância até ferro:", manhattanDistance(0, 0, 1, 0));
console.log("Status:", getStatusMessage(80));

await move(1, 0);
await mine("ferro");
await move(3, 3);
await mine("ouro");
`,
    victoryCondition: (state: GameState) =>
        state.grid[0][1].type === 'empty' && state.grid[3][3].type === 'empty',
    scoring: {
        silver: { forbiddenPatterns: ['any', '___'] },
        gold: { maxTicks: 8, maxBatteryUsed: 40 },
    },
};

// ─── Nível 2-5: Object Types ──────────────────────────────────────────────────

export const level_2_5: ILevelDefinition = {
    id: 'ch2-l5',
    chapter: 2,
    levelInChapter: 5,
    title: 'Object Types & Optional Properties',
    handbookRef: {
        section: 'Everyday Types › Object Types',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object-types',
    },
    mission: {
        briefing: `# Missão 2.5 — O Relatório de Missão

O sistema de telemetria precisa de um tipo que descreva o relatório
de cada missão. Algumas informações são obrigatórias; outras, opcionais.

📖 Leia: [Everyday Types › Object Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object-types)

\`\`\`typescript
// '?' marca a propriedade como opcional
interface MissionReport {
  timestamp: number;       // obrigatório
  warnings?: string[];     // opcional
}
\`\`\``,
        objective: 'Modelar MissionReport com propriedades opcionais e minar o cristal.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'crystal', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 15 },
    apiTypeDefs: CH2_API,
    starterCode: `// Defina o tipo MissionReport com propriedades obrigatórias e opcionais

interface MissionReport {
  timestamp: number;         // obrigatório: timestamp Unix
  oreCollected: string;      // obrigatório: material coletado
  hazardsDetected?: number;  // opcional: quantidade de perigos detectados
  operatorNote?: string;     // opcional: nota do operador
}

// Criando um relatório com campos opcionais ausentes (totalmente válido!)
const report: MissionReport = {
  timestamp: Date.now(),
  oreCollected: "cristal",
  // hazardsDetected e operatorNote são opcionais — não precisam estar aqui
};

console.log("Iniciando missão. Alvo:", report.oreCollected);

await move(2, 2);
await mine(report.oreCollected);

// Adiciona nota opcional após coleta
report.operatorNote = "Cristal coletado com sucesso.";
console.log("Relatório:", report.operatorNote);
`,
    victoryCondition: (state: GameState) => state.grid[2][2].type === 'empty',
    scoring: {
        silver: { forbiddenPatterns: ['any'] },
        gold: { maxTicks: 6, maxBatteryUsed: 30 },
    },
};

// ─── Nível 2-6: Union Types ───────────────────────────────────────────────────

export const level_2_6: ILevelDefinition = {
    id: 'ch2-l6',
    chapter: 2,
    levelInChapter: 6,
    title: 'Union Types',
    handbookRef: {
        section: 'Everyday Types › Union Types',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types',
    },
    mission: {
        briefing: `# Missão 2.6 — O Escâner Polimórfico

O drone pode encontrar diferentes tipos de células. Em vez de usar
\`string\` genérico, use um **Union Type** para restringir os valores possíveis.

📖 Leia: [Everyday Types › Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

\`\`\`typescript
type CellKind = 'empty' | 'iron' | 'gold' | 'wall';
\`\`\`

**Objetivo:** Usar union types para classificar a célula e decidir a ação.`,
        objective: 'Classificar as células e coletar apenas ferro e ouro (não tentar minerar paredes).',
    },
    initialGrid: [
        ['empty', 'iron', 'wall', 'gold', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 20 },
    apiTypeDefs: CH2_API,
    starterCode: `// Use Union Types para classificar o que o drone encontra!

type Minable = 'iron' | 'gold';
type CellKind = Minable | 'empty' | 'wall';

// Verifica se a célula é minerável (type guard simples)
function canMine(kind: string): kind is Minable {
  return kind === 'iron' || kind === 'gold';
}

// Tenta coletar as células em x = 1, 2, 3 (linha y=0)
const targets = [
  { x: 1, kind: 'iron'  as CellKind },
  { x: 2, kind: 'wall'  as CellKind }, // parede! não tente minerar
  { x: 3, kind: 'gold'  as CellKind },
];

for (const target of targets) {
  await move(target.x, 0);
  
  if (canMine(target.kind)) {
    // Só minera se for minerável
    await mine(target.kind);
    console.log("Coletado:", target.kind);
  } else {
    console.log("Ignorando:", target.kind, "(não é minerável)");
  }
}
`,
    victoryCondition: (state: GameState) =>
        state.grid[0][1].type === 'empty' && state.grid[0][3].type === 'empty',
    scoring: {
        silver: { forbiddenPatterns: ['any'] },
        gold: { maxTicks: 8, maxBatteryUsed: 35 },
    },
};

// ─── Nível 2-7: Type Aliases vs Interfaces ────────────────────────────────────

export const level_2_7: ILevelDefinition = {
    id: 'ch2-l7',
    chapter: 2,
    levelInChapter: 7,
    title: 'Type Aliases vs. Interfaces',
    handbookRef: {
        section: 'Everyday Types › Type Aliases vs. Interfaces',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces',
    },
    mission: {
        briefing: `# Missão 2.7 — type vs interface

Quando usar \`type\` e quando usar \`interface\`?

📖 Leia: [Differences between type aliases and interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

**Regra prática:**
- Use \`interface\` para contratos de **objeto** que podem ser estendidos
- Use \`type\` para **unions**, **intersections** e aliases simples`,
        objective: 'Organizar os tipos corretamente e coletar os minérios.',
    },
    initialGrid: [
        ['empty', 'empty', 'iron', 'empty', 'gold'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 15 },
    apiTypeDefs: CH2_API,
    starterCode: `// ✅ Use 'type' para unions e aliases
type OreKind = 'ferro' | 'ouro';
type Coordinate = [number, number];

// ✅ Use 'interface' para contratos de objeto (pode ser extendida)
interface DroneCommand {
  target: Coordinate;
  material: OreKind;
}

// ✅ Extender interface é natural
interface PrioritizedCommand extends DroneCommand {
  priority: 'high' | 'low';
}

const commands: PrioritizedCommand[] = [
  { target: [2, 0], material: 'ferro', priority: 'high' },
  { target: [4, 0], material: 'ouro',  priority: 'low'  },
];

for (const cmd of commands) {
  const [x, y] = cmd.target;
  await move(x, y);
  await mine(cmd.material);
}
`,
    victoryCondition: (state: GameState) =>
        state.grid[0][2].type === 'empty' && state.grid[0][4].type === 'empty',
    scoring: {
        silver: { forbiddenPatterns: ['any'] },
        gold: { maxTicks: 8, maxBatteryUsed: 40 },
    },
};

// ─── Nível 2-8: Type Assertions ───────────────────────────────────────────────

export const level_2_8: ILevelDefinition = {
    id: 'ch2-l8',
    chapter: 2,
    levelInChapter: 8,
    title: 'Type Assertions',
    handbookRef: {
        section: 'Everyday Types › Type Assertions',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions',
    },
    mission: {
        briefing: `# Missão 2.8 — Dados de Sistema Legado

A API legada da mineradora retorna \`unknown\` — TypeScript não sabe
o tipo. Você precisa fazer uma **assertiva de tipo** com segurança.

📖 Leia: [Everyday Types › Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

⚠️ Use \`as\` apenas quando **você tem certeza** do tipo. Sempre valide
a estrutura antes de fazer o cast — caso contrário, erros em runtime.`,
        objective: 'Converter o dado legado com segurança e coletar o cristal.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'crystal', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 10 },
    apiTypeDefs: CH2_API,
    starterCode: `// A API legada retorna 'unknown'. Converta com segurança!

interface LegacyTarget {
  x: number;
  y: number;
  resource: string;
}

// Simula dado do sistema legado (tipo desconhecido)
function fetchLegacyData(): unknown {
  return { x: 1, y: 2, resource: "cristal" };
}

const rawData = fetchLegacyData();

// ✅ Valide ANTES de fazer o cast
if (
  typeof rawData === 'object' &&
  rawData !== null &&
  'x' in rawData &&
  'y' in rawData &&
  'resource' in rawData
) {
  // Agora é seguro fazer a assertiva
  const target = rawData as LegacyTarget;
  await move(target.x, target.y);
  await mine(target.resource);
}
`,
    victoryCondition: (state: GameState) => state.grid[2][1].type === 'empty',
    scoring: {
        silver: { forbiddenPatterns: ['any', 'as any'] },
        gold: { maxTicks: 5, maxBatteryUsed: 20 },
    },
};

// ─── Nível 2-9: Literal Types e null/undefined ────────────────────────────────

export const level_2_9: ILevelDefinition = {
    id: 'ch2-l9',
    chapter: 2,
    levelInChapter: 9,
    title: 'Literal Types & null/undefined',
    handbookRef: {
        section: 'Everyday Types › Literal Types',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types',
    },
    mission: {
        briefing: `# Missão 2.9 — Direções Estritas

O sistema de navegação só aceita direções exatas como strings.
Use **Literal Types** para restringir o que pode ser passado.

📖 Leia: [Everyday Types › Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

\`\`\`typescript
type Direction = 'N' | 'S' | 'E' | 'W';
// Agora só 'N', 'S', 'E', 'W' são aceitos — não 'North' nem 'norte'
\`\`\`

Trate também o sensor que pode retornar \`null\` quando offline.`,
        objective: 'Navegar usando literal types e tratar o sensor nullável.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'iron'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 12 },
    apiTypeDefs: CH2_API,
    starterCode: `// Literal Types: restringe os valores aceitos para um conjunto fixo

type Direction = 'N' | 'S' | 'E' | 'W';

// Converte direção para deslocamento (dx, dy)
function directionToOffset(dir: Direction): [number, number] {
  switch (dir) {
    case 'N': return [0, -1];
    case 'S': return [0, 1];
    case 'E': return [1, 0];
    case 'W': return [-1, 0];
  }
}

// ❌ Isso seria um erro de tipo:
// const bad: Direction = 'Norte'; // não existe no union

const route: Direction[] = ['E', 'E', 'E', 'E'];
let pos = { x: 0, y: 0 };

for (const dir of route) {
  const [dx, dy] = directionToOffset(dir);
  pos = { x: pos.x + dx, y: pos.y + dy };
  await move(pos.x, pos.y);
}

await mine("ferro");
`,
    victoryCondition: (state: GameState) => state.grid[0][4].type === 'empty',
    scoring: {
        silver: { forbiddenPatterns: ['any'] },
        gold: { maxTicks: 8, maxBatteryUsed: 35 },
    },
};

// ─── Nível 2-10: Enums (Clímax) ───────────────────────────────────────────────

export const level_2_10: ILevelDefinition = {
    id: 'ch2-l10',
    chapter: 2,
    levelInChapter: 10,
    title: 'Enums — Status do Sistema (Clímax)',
    handbookRef: {
        section: 'Everyday Types › Enums',
        url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#enums',
    },
    mission: {
        briefing: `# Missão 2.10 — O Sistema de Status ⚡ CLÍMAX

Você chegou ao desafio final do Capítulo 2!

Use \`enum\` para modelar os estados do drone e o grau dos minérios.
O drone deve percorrer um ciclo completo de estados: Idle → Mining → Returning → Idle.

📖 Leia: [Everyday Types › Enums](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#enums)

\`\`\`typescript
enum DroneStatus { Idle, Mining, Returning, Critical }
enum OreGrade { A = 'A', B = 'B', C = 'C' }
\`\`\`

**Objetivo:** Implementar o ciclo completo de estados e coletar todos os minérios de grau A.`,
        objective: 'Coletar apenas minérios de grau A usando enums para controle de status.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'iron', 'empty', 'gold', 'empty'],
        ['empty', 'empty', 'iron', 'empty', 'empty'],
        ['empty', 'gold', 'empty', 'iron', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 200, maxTicks: 40 },
    apiTypeDefs: CH2_API,
    starterCode: `// Capítulo 2 — Clímax: Enums para controle de estado

enum DroneStatus {
  Idle = 'IDLE',
  Mining = 'MINING',
  Returning = 'RETURNING',
  Critical = 'CRITICAL',
}

enum OreGrade {
  A = 'A', // Alta qualidade — coletar
  B = 'B', // Qualidade média — ignorar
  C = 'C', // Baixa qualidade — ignorar
}

function getStatusMessage(status: DroneStatus): string {
  switch (status) {
    case DroneStatus.Idle:      return "🟢 Sistema em standby";
    case DroneStatus.Mining:    return "⛏️ Extração em andamento";
    case DroneStatus.Returning: return "🔄 Retornando à base";
    case DroneStatus.Critical:  return "🔴 ALERTA CRÍTICO!";
  }
}

// Grade dos minérios mapeados no grid (posição -> grade)
const oreGrades: Map<string, OreGrade> = new Map([
  ["1,1", OreGrade.A],  // ferro grau A ✅
  ["3,1", OreGrade.B],  // ouro grau B ❌
  ["2,2", OreGrade.A],  // ferro grau A ✅
  ["1,3", OreGrade.C],  // ouro grau C ❌
  ["3,3", OreGrade.A],  // ferro grau A ✅
]);

let status = DroneStatus.Idle;
console.log(getStatusMessage(status));

const targets = [
  { x: 1, y: 1, material: "ferro" },
  { x: 3, y: 1, material: "ouro"  },
  { x: 2, y: 2, material: "ferro" },
  { x: 1, y: 3, material: "ouro"  },
  { x: 3, y: 3, material: "ferro" },
];

for (const t of targets) {
  const grade = oreGrades.get(\`\${t.x},\${t.y}\`);
  
  if (grade === OreGrade.A) {
    status = DroneStatus.Mining;
    console.log(getStatusMessage(status));
    await move(t.x, t.y);
    await mine(t.material);
  } else {
    console.log(\`Grau \${grade} em (\${t.x},\${t.y}) — ignorando.\`);
  }
}

status = DroneStatus.Returning;
console.log(getStatusMessage(status));
await move(0, 0);

status = DroneStatus.Idle;
console.log(getStatusMessage(status));
`,
    victoryCondition: (state: GameState) => {
        // Deve ter coletado os 3 grau A: (1,1), (2,2), (3,3)
        return (
            state.grid[1][1].type === 'empty' &&
            state.grid[2][2].type === 'empty' &&
            state.grid[3][3].type === 'empty'
        );
    },
    scoring: {
        silver: { forbiddenPatterns: ['any'] },
        gold: { maxTicks: 20, maxBatteryUsed: 100 },
    },
};

// ─── Exportação do Capítulo 2 ─────────────────────────────────────────────────

export const chapter2Levels: ILevelDefinition[] = [
    level_2_1,
    level_2_2,
    level_2_3,
    level_2_4,
    level_2_5,
    level_2_6,
    level_2_7,
    level_2_8,
    level_2_9,
    level_2_10,
];

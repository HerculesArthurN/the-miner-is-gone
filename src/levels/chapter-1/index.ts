import { ILevelDefinition } from '../../types/level';
import { GameState } from '../../types/game';

// ─── API Typedefs do Capítulo 1 ───────────────────────────────────────────────
const CH1_API = `
declare function move(x: number, y: number): Promise<void>;
declare function mine(material: string): Promise<void>;
declare const console: { log: (...args: unknown[]) => void };
`;

// ─── Nível 1-1: Static Type Checking ─────────────────────────────────────────

export const level_1_1: ILevelDefinition = {
    id: 'ch1-l1',
    chapter: 1,
    levelInChapter: 1,
    title: 'Static Type Checking',
    handbookRef: {
        section: 'The Basics › Static type-checking',
        url: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html#static-type-checking',
    },
    mission: {
        briefing: `# Missão 1.1 — O Primeiro Log

O engenheiro-chefe sumiu. Ele deixou um script quebrado no painel de controle.
O drone não parte porque há um \`erro de tipo\` silencioso no código.

O TypeScript detecta esse tipo de erro **antes** de você executar qualquer coisa —
é o que chamamos de **análise estática**.

📖 Leia: [The Basics › Static type-checking](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#static-type-checking)

**Objetivo:** Corrija as anotações de tipo e mova o drone até o ferro.`,
        objective: 'Coletar o ferro em (2, 2) sem erros de tipo.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'iron', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 20 },
    apiTypeDefs: CH1_API,
    starterCode: `// Missão: Corrija os erros de tipo e mova o drone até o ferro em (2, 2).
// O TypeScript garante que você passe os tipos CORRETOS antes de executar.

// ❌ Erro: x deveria ser number, mas está recebendo string
const targetX: number = "2"; // <- corrija aqui
const targetY: number = 2;

await move(targetX, targetY);
await mine("ferro");
`,
    victoryCondition: (state: GameState) => {
        return state.grid[2][2].type === 'empty';
    },
    scoring: {
        silver: { forbiddenPatterns: ['any', '@ts-ignore', 'as any'] },
        gold: { maxTicks: 5, maxBatteryUsed: 30 },
    },
};

// ─── Nível 1-2: Non-Exception Failures ───────────────────────────────────────

export const level_1_2: ILevelDefinition = {
    id: 'ch1-l2',
    chapter: 1,
    levelInChapter: 2,
    title: 'Non-Exception Failures',
    handbookRef: {
        section: 'The Basics › Non-exception Failures',
        url: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html#non-exception-failures',
    },
    mission: {
        briefing: `# Missão 1.2 — Erros Silenciosos

Em JavaScript, acessar uma propriedade que não existe retorna \`undefined\` — sem erro.
O TypeScript **recusa** esse acesso silencioso e avisa antes do runtime.

Isso evita bugs difíceis de rastrear: o código "funciona" mas retorna lixo.

📖 Leia: [The Basics › Non-exception Failures](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#non-exception-failures)

**Objetivo:** Corrija o acesso incorreto à propriedade do objeto de configuração.`,
        objective: 'Corrigir o código e mover o drone até o ouro.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'gold', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 15 },
    apiTypeDefs: CH1_API,
    starterCode: `// Missão: O objeto de configuração foi digitado errado.
// O TypeScript deve rejeitar o acesso à propriedade incorreta.

interface DroneTarget {
  positionX: number;
  positionY: number;
  material: string;
}

const target: DroneTarget = {
  positionX: 1,
  positionY: 1,
  material: "ouro",
};

// ❌ Erro: 'x' não existe em DroneTarget. A propriedade correta é 'positionX'
await move(target.x, target.positionY); // <- corrija aqui
await mine(target.material);
`,
    victoryCondition: (state: GameState) => {
        return state.grid[1][1].type === 'empty';
    },
    scoring: {
        silver: { forbiddenPatterns: ['any', '@ts-ignore'] },
        gold: { maxTicks: 5, maxBatteryUsed: 25 },
    },
};

// ─── Nível 1-3: Types for Tooling (IntelliSense) ─────────────────────────────

export const level_1_3: ILevelDefinition = {
    id: 'ch1-l3',
    chapter: 1,
    levelInChapter: 3,
    title: 'Types for Tooling',
    handbookRef: {
        section: 'The Basics › Types for Tooling',
        url: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html#types-for-tooling',
    },
    mission: {
        briefing: `# Missão 1.3 — O Autocomplete como Aliado

O TypeScript não apenas **detecta erros** — ele também **guia** você.

O IntelliSense (autocomplete) sabe exatamente quais propriedades e métodos
existem, e te mostra em tempo real enquanto você digita.

📖 Leia: [The Basics › Types for Tooling](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#types-for-tooling)

**Objetivo:** Complete o código usando o autocomplete para chegar ao ferro.
Tente digitar \`config.\` e veja as sugestões aparecerem!`,
        objective: 'Usar o IntelliSense para completar o código e coletar o ferro.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'iron', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 10 },
    apiTypeDefs: CH1_API,
    starterCode: `// Missão: Use o autocomplete para preencher os dados de destino.
// Coloque o cursor após "config." e veja o IntelliSense em ação!

interface MissionConfig {
  targetX: number;
  targetY: number;
  oreMaterial: string;
}

const config: MissionConfig = {
  targetX: 3,
  targetY: 0,
  oreMaterial: "ferro",
};

// Complete digitando config. e escolhendo as propriedades
await move(config./* targetX */, config./* targetY */);
await mine(config./* oreMaterial */);
`,
    victoryCondition: (state: GameState) => {
        return state.grid[0][3].type === 'empty';
    },
    scoring: {
        silver: { forbiddenPatterns: ['any', '@ts-ignore'] },
        gold: { maxTicks: 4, maxBatteryUsed: 20 },
    },
};

// ─── Nível 1-4: Strictness (Clímax) ──────────────────────────────────────────

export const level_1_4: ILevelDefinition = {
    id: 'ch1-l4',
    chapter: 1,
    levelInChapter: 4,
    title: 'Strictness — Corrigindo o Código Legado',
    handbookRef: {
        section: 'The Basics › Strictness',
        url: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness',
    },
    mission: {
        briefing: `# Missão 1.4 — A Auditoria do Código Legado ⚡

O script de controle deixado pelo engenheiro desaparecido está cheio de problemas:
variáveis sem tipo, uso de \`any\` e possíveis valores \`null\` ignorados.

Com \`strict: true\` ativo, o compilador recusa todo esse código perigoso.
**Você precisa corrigir tudo antes do deploy.**

📖 Leia: [The Basics › Strictness](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness)

> \`noImplicitAny\` → proíbe variáveis sem tipo inferível  
> \`strictNullChecks\` → força você a tratar \`null\` e \`undefined\`

**Objetivo:** Corrigir TODO o código legado, mover e minerar o ferro E o ouro.`,
        objective: 'Coletar ferro em (1,1) e ouro em (3,3) com 0 erros de tipo.',
    },
    initialGrid: [
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'iron', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'gold', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
    ],
    droneStart: { x: 0, y: 0 },
    hardware: { maxBattery: 100, maxTicks: 25 },
    apiTypeDefs: CH1_API,
    starterCode: `// CÓDIGO LEGADO — Corrija todos os erros para fazer o deploy!
// O compilador está com strict: true. Nenhum any, nenhum null ignorado.

// ❌ Erro 1: parâmetros sem tipo (noImplicitAny)
function goTo(x, y) {
  return move(x, y);
}

// ❌ Erro 2: variável pode ser null (strictNullChecks)
function getMaterial(): string | null {
  return "ferro";
}

const material = getMaterial();
// ❌ Erro 3: 'material' pode ser null — não pode passar direto para mine()
await goTo(1, 1);
await mine(material);

// Depois de corrigir o ferro, vá buscar o ouro também
await goTo(3, 3);
await mine("ouro");
`,
    victoryCondition: (state: GameState) => {
        return state.grid[1][1].type === 'empty' && state.grid[3][3].type === 'empty';
    },
    scoring: {
        silver: { forbiddenPatterns: ['any', '@ts-ignore', 'as any', '!'] },
        gold: { maxTicks: 10, maxBatteryUsed: 50 },
    },
};

// ─── Exportação do Capítulo 1 ─────────────────────────────────────────────────

export const chapter1Levels: ILevelDefinition[] = [
    level_1_1,
    level_1_2,
    level_1_3,
    level_1_4,
];

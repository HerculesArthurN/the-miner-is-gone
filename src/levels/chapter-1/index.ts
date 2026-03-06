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
        briefing: `# Ato 1.1 — As Runas Conflitantes 📜
    
O Mestre Forjador desapareceu, deixando para trás segredos e um Golem de Ferro imóvel. O pergaminho de controle está com as runas borradas.

O Golem não desperta porque há um **erro de tipo** rúnico no código. Em nossa Ordem, o TypeScript é a magia que detecta esses conflitos **antes** mesmo de acendermos a forja. Isso é o que chamamos de **Análise Estática**.

📖 **Estude o Cânone:** [The Basics › Static type-checking](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#static-type-checking)

**Seu Teste:** Corrija as anotações rúnicas (tipos) e guie o Golem até o minério de ferro em (2, 2).`,
        objective: 'Despertar o Golem corrigindo o conflito de tipos e minerar em (2, 2).',
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
    starterCode: `// Missão: Desperte o Golem corrigindo o conflito de tipos.
// O Grimório exige que o destino seja um 'number' puro.

// ❌ Conflito: targetX deveria ser number, mas está recebendo string
const targetX: number = "2"; // <- purifique esta runa
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
        briefing: `# Ato 1.2 — Sussurros Inexistentes 🕯️

No dialeto comum (JavaScript), tentar invocar um feitiço que não existe apenas resulta em silêncio (undefined). Mas um Mestre Forjador não aceita incertezas.

A Magia Rúnica **bloqueia** qualquer tentativa de acessar o que não existe antes mesmo do Golem se mover. Isso evita que o constructo falhe no meio da mina.

📖 **Estude o Cânone:** [The Basics › Non-exception Failures](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#non-exception-failures)

**Seu Teste:** Corrija o acesso à propriedade rúnica no objeto de configuração para que o Golem encontre o ouro.`,
        objective: 'Corrigir as propriedades do objeto e guiar o Golem até o ouro.',
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
    starterCode: `// Missão: O pergaminho de direção foi escrito com termos mundanos.
// O Grimório rejeita o que não foi formalmente declarado na interface.

interface GolemTarget {
  positionX: number;
  positionY: number;
  material: string;
}

const target: GolemTarget = {
  positionX: 1,
  positionY: 1,
  material: "ouro",
};

// ❌ Conflito: 'x' não existe em GolemTarget. A runa correta é 'positionX'
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
        briefing: `# Ato 1.3 — A Visão do Scriptorium 👁️

A Magia Rúnica não serve apenas para punir erros; ela serve para **guiar** sua pena.

O **Scriptorium** (IntelliSense) conhece cada contrato e cada runa disponível. Ele sussurra as possibilidades enquanto você escreve, garantindo que suas mãos nunca tremam.

📖 **Estude o Cânone:** [The Basics › Types for Tooling](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#types-for-tooling)

**Seu Teste:** Complete o feitiço usando as visões do Scriptorium (autocomplete) para chegar ao ferro em (3, 0).
*Dica: Digite \`config.\` e veja a magia acontecer!*`,
        objective: 'Usar o auxílio do Scriptorium para completar o feitiço e minerar.',
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
        briefing: `# Ato 1.4 — O Ritual de Rigor (Clímax) ⚡

Encontramos pergaminhos antigos escritos por aprendizes descuidados. Eles estão repletos de magias instáveis: runas sem nome (\`any\`) e fluxos que podem secar (\`null\`) sem aviso.

Como novo Mestre da Forja, você deve ativar o **Ritual de Rigor** (\`strict: true\`). Isso forçará cada magia a ser declarada com pureza total.

📖 **Estude o Cânone:** [The Basics › Strictness](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness)

> \`noImplicitAny\` → Proíbe runas sem essência definida.  
> \`strictNullChecks\` → Obriga o tratamento de fluxos vazios.

**Seu Teste:** Purifique o código antigo, garantindo que o Golem colete o ferro (1,1) e o ouro (3,3).`,
        objective: 'Purificar o código legado (0 erros em modo strict) e coletar dois minérios.',
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
    starterCode: `// PERGAMINHOS IMPUROS — Purifique o código para o Golem aceitar o comando!
// A Forja está em modo Estrito. Nenhuma runa sem essência, nenhum fluxo vazio.

// ❌ Conflito 1: parâmetros sem essência (noImplicitAny)
function goTo(x, y) {
  return move(x, y);
}

// ❌ Conflito 2: o fluxo de material pode secar (strictNullChecks)
function getMaterial(): string | null {
  return "ferro";
}

const material = getMaterial();
// ❌ Conflito 3: 'material' pode ser null. A forja exige tratamento!
await goTo(1, 1);
await mine(material);

// Após coletar o ferro, guie o Golem até o ouro
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

import { Cell } from '../types/game';

export interface TutorialStep {
  title: string;
  content: string;
  codeExample?: string;
  highlightSelector?: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  initialCode: string;
  gridSize: number;
  droneStart: { x: number, y: number };
  gridSetup: (grid: Cell[][]) => void;
  winCondition: (state: any) => boolean; // Custom check logic if needed
  tutorial: string;
  steps: TutorialStep[];
  apiDocs: { name: string, signature: string }[];
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "Fase 1: O Despertar",
    subtitle: "Tipos Primitivos",
    description: "O drone precisa coletar o Ferro localizado em (2, 2). Use tipos primitivos (number, string) para controlar o drone.",
    initialCode: `// Fase 1: O Despertar
// Objetivo: Mover até o Ferro (2,2) e minerar.
// Dica: Use move(x, y) e mine("Material")

move(1, 0);
`,
    gridSize: 5,
    droneStart: { x: 0, y: 0 },
    gridSetup: (grid) => {
      grid[2][2].type = 'iron';
    },
    winCondition: (grid) => {
      // Level 1: Win if the iron at 2,2 is gone
      return grid[2][2].type === 'empty';
    },
    tutorial: `
# Bem-vindo ao DroneTS! 🚀

Nesta primeira fase, vamos aprender sobre os **Tipos Primitivos** no TypeScript.

### O que são Tipos Primitivos?
No TypeScript (e JavaScript), os tipos primitivos são os blocos básicos de construção de dados. Os mais comuns são:
- **number**: Representa números (inteiros ou decimais). Ex: \`10\`, \`3.14\`.
- **string**: Representa texto. Deve estar entre aspas. Ex: \`"Ferro"\`, \`'Ouro'\`.
- **boolean**: Representa verdadeiro (\`true\`) ou falso (\`false\`).

### Como controlar o Drone?
Você tem duas funções principais:
1. \`move(x, y)\`: Move o drone para as coordenadas X e Y. Ambas devem ser do tipo **number**.
2. \`mine(material)\`: Tenta minerar o bloco na posição atual. O material deve ser uma **string**.

**Dica:** O grid começa em (0,0) no canto superior esquerdo. Para chegar em (2,2), você precisa se mover!
`,
    steps: [
      {
        title: "Bem-vindo!",
        content: "Olá, Operador. Você está no comando de um drone de mineração avançado controlado por TypeScript. Vamos começar com o básico.",
        highlightSelector: "#game-view"
      },
      {
        title: "O Campo de Mineração",
        content: "Este é o seu campo de visão. O drone começa em (0,0). Seu objetivo é coletar o minério de **Ferro** em (2,2).",
        highlightSelector: "#game-view"
      },
      {
        title: "O Editor de Código",
        content: "Aqui é onde você escreve as instruções. TypeScript nos ajuda a evitar erros antes mesmo de executarmos o código.",
        codeExample: "move(2, 2);\nmine('Ferro');",
        highlightSelector: "#editor-view"
      },
      {
        title: "Tipos Primitivos",
        content: "Note que `move` recebe dois `number` e `mine` recebe uma `string`. Se você tentar passar um texto para `move`, o editor avisará!",
        highlightSelector: "#editor-view"
      },
      {
        title: "Execução",
        content: "Quando estiver pronto, clique em 'Executar Código'. O drone seguirá suas instruções sequencialmente.",
        highlightSelector: "#action-bar"
      }
    ],
    apiDocs: [
      { name: 'move', signature: '(x: number, y: number): void' },
      { name: 'mine', signature: '(material: string): void' }
    ]
  },
  {
    id: 2,
    title: "Fase 2: O Contrato",
    subtitle: "Interfaces & Objetos",
    description: "A mina contém minérios de diferentes qualidades. Use a função scan() para verificar a pureza. Colete apenas Ferro com pureza > 80.",
    initialCode: `// Fase 2: O Contrato
// Objetivo: Minerar Ferro com pureza > 80.
// Dica: scan() retorna { material: string, purity: number } ou null.

interface ScanResult {
  material: string;
  purity: number;
}

move(1, 2);
const result = scan();

if (result && result.purity > 80) {
  mine("Ferro");
}
`,
    gridSize: 5,
    droneStart: { x: 0, y: 0 },
    gridSetup: (grid) => {
      // Trap: Low purity iron
      grid[2][1].type = 'iron';
      grid[2][1].purity = 40;
      
      // Target: High purity iron
      grid[3][3].type = 'iron';
      grid[3][3].purity = 90;
    },
    winCondition: (grid) => {
      // Level 2: Win if the high purity iron at 3,3 is gone
      // AND the low purity iron at 2,1 is STILL THERE (optional, but good practice)
      return grid[3][3].type === 'empty';
    },
    tutorial: `
# Interfaces & Objetos 💎

Agora que você sabe mover o drone, vamos lidar com dados mais complexos usando **Interfaces**.

### O que é uma Interface?
Uma \`interface\` no TypeScript define o "formato" de um objeto. Ela diz quais propriedades um objeto deve ter e de qual tipo elas são.

\`\`\`typescript
interface ScanResult {
  material: string;
  purity: number;
}
\`\`\`

### A função scan()
Nesta fase, você tem acesso à função \`scan()\`. Ela retorna um objeto do tipo \`ScanResult\` ou \`null\` (se não houver nada no bloco).

### O Desafio
A mina agora tem minérios de qualidades diferentes. O seu contrato exige apenas **Ferro** com **pureza superior a 80%**.
- Use \`const result = scan();\` para obter os dados.
- Use um \`if\` para verificar se o resultado existe e se a pureza é suficiente.
`,
    steps: [
      {
        title: "Interfaces",
        content: "Interfaces definem a estrutura de objetos. Elas são fundamentais para garantir que você está acessando propriedades que realmente existem.",
        highlightSelector: "#editor-view"
      },
      {
        title: "Scanner Ativo",
        content: "A função `scan()` retorna um objeto. Você pode acessar suas propriedades usando o ponto: `result.purity`.",
        codeExample: "const result = scan();\nif (result) {\n  console.log(result.purity);\n}",
        highlightSelector: "#terminal-view"
      }
    ],
    apiDocs: [
      { name: 'move', signature: '(x: number, y: number): void' },
      { name: 'scan', signature: '(): { material: string, purity: number } | null' },
      { name: 'mine', signature: '(material: string): void' }
    ]
  },
  {
    id: 3,
    title: "Fase 3: A Refinaria",
    subtitle: "Union Types",
    description: "A mina contém Ferro e Ouro. Colete ambos os minérios. Use Union Types para definir o tipo de material aceito.",
    initialCode: `// Fase 3: A Refinaria
// Objetivo: Coletar Ferro (1,1) e Ouro (3,3).
// Dica: Use await para aguardar a conclusão de cada tarefa.

type Ore = 'Ferro' | 'Ouro';

async function collect(x: number, y: number, material: Ore) {
  await move(x, y);
  await mine(material);
}

// Execute a coleta sequencialmente
await collect(1, 1, 'Ferro');
await collect(3, 3, 'Ouro');
`,
    gridSize: 5,
    droneStart: { x: 0, y: 0 },
    gridSetup: (grid) => {
      grid[1][1].type = 'iron';
      grid[3][3].type = 'gold';
    },
    winCondition: (grid) => {
      // Level 3: Win if all ores are gone
      return grid.flat().every(c => c.type === 'empty');
    },
    tutorial: `
# Union Types & Async/Await ⚡

Nesta fase, vamos aprender a lidar com múltiplos tipos possíveis e operações que levam tempo.

### Union Types
Às vezes, uma variável pode aceitar mais de um tipo de valor. Usamos o símbolo \`|\` para criar um **Union Type**.
\`\`\`typescript
type Ore = 'Ferro' | 'Ouro';
\`\`\`
Isso garante que você só possa passar esses dois textos específicos para a função.

### Async / Await
Mover e minerar são ações físicas que levam tempo. No código, chamamos isso de operações **Assíncronas**.
Para garantir que o drone termine de se mover antes de tentar minerar, usamos a palavra-chave \`await\`.

**Exemplo:**
\`\`\`typescript
await move(1, 1);
await mine("Ferro");
\`\`\`
Sem o \`await\`, o drone tentaria minerar *enquanto* ainda está se movendo!
`,
    steps: [
      {
        title: "Operações Assíncronas",
        content: "Ações físicas levam tempo. Use `await` para esperar o drone terminar uma tarefa antes de começar a próxima.",
        highlightSelector: "#editor-view"
      },
      {
        title: "Union Types",
        content: "O tipo `Ore` restringe os valores para apenas 'Ferro' ou 'Ouro'. Isso evita erros de digitação!",
        codeExample: "type Ore = 'Ferro' | 'Ouro';",
        highlightSelector: "#editor-view"
      }
    ],
    apiDocs: [
      { name: 'move', signature: '(x: number, y: number): Promise<void>' },
      { name: 'mine', signature: '(material: "Ferro" | "Ouro"): Promise<void>' }
    ]
  },
  {
    id: 4,
    title: "Fase 4: A Esteira",
    subtitle: "Arrays & Loops",
    description: "Uma linha de minérios foi detectada. Use um array de coordenadas e um loop para coletar todos de forma eficiente.",
    initialCode: `// Fase 4: A Esteira
// Objetivo: Coletar todos os minérios na linha y=2.
// Dica: Use um loop for...of para iterar sobre os valores de x.

const targets = [1, 2, 3, 4];

for (const x of targets) {
  await move(x, 2);
  await mine("Ferro");
}
`,
    gridSize: 5,
    droneStart: { x: 0, y: 0 },
    gridSetup: (grid) => {
      for (let x = 1; x <= 4; x++) {
        grid[2][x].type = 'iron';
      }
    },
    winCondition: (grid) => {
      return grid.flat().every(c => c.type === 'empty');
    },
    tutorial: `
# Arrays & Loops 🔄

Trabalhar com um bloco de cada vez é lento. Vamos aprender a automatizar tarefas usando **Arrays** e **Loops**.

### Arrays (Matrizes)
Um Array é uma lista ordenada de valores.
\`\`\`typescript
const targets = [1, 2, 3, 4];
\`\`\`

### Loops (Laços de Repetição)
O loop \`for...of\` permite que você execute o mesmo código para cada item de uma lista.

\`\`\`typescript
for (const x of targets) {
  await move(x, 2);
  await mine("Ferro");
}
\`\`\`

### O Desafio
Há uma linha inteira de Ferro na coordenada Y = 2. Em vez de escrever \`move\` e \`mine\` quatro vezes, use um loop para percorrer as coordenadas X de 1 a 4.
`,
    steps: [
      {
        title: "Automatização",
        content: "Arrays guardam listas de dados. Loops permitem processar essas listas automaticamente.",
        highlightSelector: "#editor-view"
      },
      {
        title: "A Esteira",
        content: "Observe a linha de minérios no grid. Um loop é a forma mais eficiente de coletar todos.",
        highlightSelector: "#game-view"
      }
    ],
    apiDocs: [
      { name: 'move', signature: '(x: number, y: number): Promise<void>' },
      { name: 'mine', signature: '(material: string): Promise<void>' }
    ]
  },
  {
    id: 5,
    title: "Fase 5: O Protocolo de Segurança",
    subtitle: "Enums & Switch",
    description: "O setor está instável. Alguns blocos são perigosos (Perigo > 50%). Use scan() para verificar o perigo antes de minerar.",
    initialCode: `// Fase 5: O Protocolo de Segurança
// Objetivo: Coletar apenas minérios seguros (Perigo <= 50%).
// Dica: Use scan() e verifique a propriedade dangerLevel.

enum Status {
  Safe,
  Danger
}

async function processBlock(x: number, y: number) {
  await move(x, y);
  const info = scan();
  
  if (info && info.dangerLevel <= 50) {
    await mine(info.material);
  }
}

// Escaneie e colete os blocos em (1,1), (2,2) e (3,3)
await processBlock(1, 1);
await processBlock(2, 2);
await processBlock(3, 3);
`,
    gridSize: 5,
    droneStart: { x: 0, y: 0 },
    gridSetup: (grid) => {
      // Safe
      grid[1][1].type = 'iron';
      grid[1][1].dangerLevel = 10;
      
      // Dangerous
      grid[2][2].type = 'gold';
      grid[2][2].dangerLevel = 80;
      
      // Safe
      grid[3][3].type = 'iron';
      grid[3][3].dangerLevel = 30;
    },
    winCondition: (grid) => {
      // Win if the safe blocks are gone
      return grid[1][1].type === 'empty' && grid[3][3].type === 'empty';
    },
    tutorial: `
# Enums & Segurança 🛡️

Nesta fase, vamos aprender sobre **Enums** e como criar códigos robustos para lidar com ambientes perigosos.

### O que são Enums?
Um \`enum\` (abreviação de enumeration) permite definir um conjunto de constantes nomeadas. Isso torna o código mais legível e menos propenso a erros do que usar números mágicos ou strings soltas.

\`\`\`typescript
enum Status {
  Safe,   // Valor 0
  Danger  // Valor 1
}
\`\`\`

### Protocolo de Segurança: dangerLevel
O setor atual contém bolsas de gás instáveis. Cada bloco agora possui uma propriedade \`dangerLevel\` (0 a 100).
- **Perigo <= 50**: Seguro para mineração.
- **Perigo > 50**: **INSTÁVEL**. Tentar minerar resultará em explosão imediata e perda do drone.

### O Desafio
Você deve coletar apenas os minérios seguros. 
1. Mova-se até o alvo.
2. Use \`scan()\` para obter as informações do bloco.
3. Verifique o \`dangerLevel\`.
4. Use uma estrutura condicional (\`if\`) ou um \`switch\` para decidir se deve minerar.
`,
    steps: [
      {
        title: "Categorizando com Enums",
        content: "Enums são ótimos para representar estados. Em vez de lembrar que '0' significa seguro, você usa `Status.Safe`. Isso deixa seu código documentado por natureza.",
        highlightSelector: "#editor-view"
      },
      {
        title: "Zonas de Risco",
        content: "Observe o mapa. Alguns blocos parecem normais, mas escondem perigos. O `dangerLevel` é a sua única defesa contra a destruição.",
        highlightSelector: "#game-view"
      },
      {
        title: "Leitura do Scanner",
        content: "Ao executar `scan()`, o scanner agora reporta o nível de perigo no terminal. Fique atento aos logs!",
        highlightSelector: "#terminal-view"
      },
      {
        title: "Decisão Inteligente",
        content: "No código inicial, criamos uma função `processBlock`. Ela encapsula a lógica de segurança: move, escaneia e só minera se o perigo for baixo.",
        codeExample: "if (info && info.dangerLevel <= 50) {\n  await mine(info.material);\n}",
        highlightSelector: "#editor-view"
      }
    ],
    apiDocs: [
      { name: 'move', signature: '(x: number, y: number): Promise<void>' },
      { name: 'scan', signature: '(): { material: string, purity: number, dangerLevel: number } | null' },
      { name: 'mine', signature: '(material: string): Promise<void>' }
    ]
  },
  {
    id: 6,
    title: "Fase 6: O Labirinto de Dados",
    subtitle: "Recursividade",
    description: "Uma série de depósitos foi encontrada em um padrão complexo. Use uma função recursiva para limpar o setor.",
    initialCode: `// Fase 6: O Labirinto de Dados
// Objetivo: Coletar todos os minérios no caminho (1,1) -> (2,1) -> (2,2) -> (3,2).
// Dica: Uma função recursiva chama a si mesma para resolver subproblemas.

interface Step {
  x: number;
  y: number;
  next?: Step;
}

const path: Step = {
  x: 1, y: 1,
  next: {
    x: 2, y: 1,
    next: {
      x: 2, y: 2,
      next: {
        x: 3, y: 2
      }
    }
  }
};

async function followPath(step: Step) {
  await move(step.x, step.y);
  await mine("Ferro");
  
  if (step.next) {
    await followPath(step.next);
  }
}

await followPath(path);
`,
    gridSize: 5,
    droneStart: { x: 0, y: 0 },
    gridSetup: (grid) => {
      grid[1][1].type = 'iron';
      grid[2][1].type = 'iron';
      grid[2][2].type = 'iron';
      grid[3][2].type = 'iron';
    },
    winCondition: (grid) => {
      return grid.flat().every(c => c.type === 'empty');
    },
    tutorial: `
# Recursividade 🌀

A recursividade é um conceito poderoso onde uma função chama a si mesma para resolver um problema.

### Como funciona?
Uma função recursiva precisa de duas coisas:
1. **Caso Base**: Uma condição que faz a função parar de chamar a si mesma.
2. **Passo Recursivo**: Onde a função executa uma ação e chama a si mesma com um novo conjunto de dados.

### Estruturas de Dados Ligadas
Nesta fase, usamos uma interface \`Step\` que contém as coordenadas atuais e uma referência opcional para o \`next\` (próximo) passo. Isso cria uma "corrente" de comandos.

\`\`\`typescript
interface Step {
  x: number;
  y: number;
  next?: Step;
}
\`\`\`

### O Desafio
O drone deve seguir um caminho definido por objetos aninhados. Use a função \`followPath\` para processar o passo atual e, se houver um próximo, chamar a si mesma recursivamente.
`,
    steps: [
      {
        title: "Recursividade",
        content: "Uma função que chama a si mesma. Parece mágica, mas é lógica pura!",
        highlightSelector: "#editor-view"
      },
      {
        title: "O Labirinto",
        content: "O caminho está estruturado como uma lista ligada. Cada passo aponta para o próximo.",
        highlightSelector: "#game-view"
      }
    ],
    apiDocs: [
      { name: 'move', signature: '(x: number, y: number): Promise<void>' },
      { name: 'mine', signature: '(material: string): Promise<void>' }
    ]
  },
  {
    id: 7,
    title: "Fase 7: O Coletor Universal",
    subtitle: "Generics",
    description: "A tecnologia de mineração evoluiu. Use Generics para criar funções que funcionam com qualquer tipo de dado de minério.",
    initialCode: `// Fase 7: O Coletor Universal
// Objetivo: Criar uma função genérica para processar qualquer minério.
// Dica: Generics <T> permitem que você passe tipos como parâmetros.

interface OreData<T> {
  type: T;
  x: number;
  y: number;
}

async function processOre<T extends string>(data: OreData<T>) {
  await move(data.x, data.y);
  await mine(data.type);
}

const iron: OreData<'Ferro'> = { type: 'Ferro', x: 1, y: 1 };
const gold: OreData<'Ouro'> = { type: 'Ouro', x: 3, y: 3 };

await processOre(iron);
await processOre(gold);
`,
    gridSize: 5,
    droneStart: { x: 0, y: 0 },
    gridSetup: (grid) => {
      grid[1][1].type = 'iron';
      grid[3][3].type = 'gold';
    },
    winCondition: (grid) => {
      return grid.flat().every(c => c.type === 'empty');
    },
    tutorial: `
# Generics (Genéricos) 🧬

Generics são uma das ferramentas mais poderosas do TypeScript. Eles permitem que você crie componentes (funções, classes, interfaces) que funcionam com uma variedade de tipos, mantendo a segurança de tipos.

### Por que usar Generics?
Sem genéricos, você teria que usar o tipo \`any\` (o que é perigoso) ou criar várias versões da mesma função para tipos diferentes.

### Sintaxe
Usamos os símbolos \`<T>\` para indicar um parâmetro de tipo.
\`\`\`typescript
interface OreData<T> {
  type: T;
  x: number;
  y: number;
}
\`\`\`

### Constraints (Restrições)
Podemos restringir o que o \`T\` pode ser usando a palavra \`extends\`.
\`\`\`typescript
async function processOre<T extends string>(data: OreData<T>)
\`\`\`
Isso diz ao TypeScript: "T pode ser qualquer coisa, desde que seja uma string".

### O Desafio
Crie uma função genérica \`processOre\` que aceite um objeto \`OreData\`. Use-a para coletar o Ferro e o Ouro no mapa.
`,
    steps: [
      {
        title: "Generics",
        content: "Pense em Generics como variáveis para tipos. Eles tornam seu código flexível e seguro.",
        highlightSelector: "#editor-view"
      },
      {
        title: "Constraints",
        content: "Usamos `extends` para garantir que o tipo genérico tenha certas características.",
        highlightSelector: "#editor-view"
      }
    ],
    apiDocs: [
      { name: 'move', signature: '(x: number, y: number): Promise<void>' },
      { name: 'mine', signature: '(material: string): Promise<void>' }
    ]
  }
];

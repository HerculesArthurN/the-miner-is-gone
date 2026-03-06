# Product Requirements Document (PRD)
# The Miner is Gone

**Versão:** 2.0  
**Data:** 2026-02-24  
**Status:** Em desenvolvimento

> **Filosofia central:** Cada nível do jogo é a transposição interativa de **uma seção específica da documentação oficial do TypeScript**. O jogador aprende TypeScript jogando, e joga melhor lendo a documentação. O jogo e o Handbook são inseparáveis.

---

## Índice

1. [Resumo Executivo e Objetivos](#1-resumo-executivo-e-objetivos)
2. [Mecânicas Principais (Core Gameplay Loop)](#2-mecânicas-principais-core-gameplay-loop)
3. [Currículo — Mapeamento com o TypeScript Handbook](#3-currículo--mapeamento-com-o-typescript-handbook)
   - [Capítulo 1 · The Basics](#capítulo-1--the-basics)
   - [Capítulo 2 · Everyday Types](#capítulo-2--everyday-types)
   - [Capítulo 3 · Narrowing](#capítulo-3--narrowing)
   - [Capítulo 4 · More on Functions](#capítulo-4--more-on-functions)
   - [Capítulo 5 · Object Types](#capítulo-5--object-types)
   - [Capítulo 6 · Generics](#capítulo-6--generics)
   - [Capítulo 7 · Classes](#capítulo-7--classes)
   - [Capítulo 8 · Type Manipulation](#capítulo-8--type-manipulation)
4. [Arquitetura Técnica](#4-arquitetura-técnica)
5. [Diretrizes de Implementação](#5-diretrizes-de-implementação)

---

## 1. Resumo Executivo e Objetivos

### 1.1 Missão do Produto

**"The Miner is Gone"** é um jogo web educativo de automação onde o jogador escreve a Magia Rúnica do **TypeScript** para controlar Golens mineradores de pedra e ferro. A premissa é simples: o Mestre da Guilda desapareceu e deixou apenas os antigos pergaminhos de documentação. O jogador, um Aprendiz Forjador, precisa escrever os feitiços precisos que mantêm a operação da forja funcionando em segurança.

A progressão do jogo segue **rigorosamente a ordem do TypeScript Handbook oficial** — cada seção da documentação se torna um conjunto de missões. O jogador não apenas aprende TypeScript: ele aprende a *ler documentação técnica*, a habilidade mais valiosa de um desenvolvedor.

**Resultado esperado ao completar o jogo:**  
O jogador terá coberto integralmente o TypeScript Handbook e estará apto a resolver problemas algorítmicos equivalentes ao nível **Hard do LeetCode** com tipos corretos e sem `any`.

### 1.2 Princípio Pedagógico (Learning Philosophy)

```
Documentação → Missão → Código → Consequência Visual → Compreensão
```

Cada missão segue este ciclo:
1. O Terminal/Logs da Guilda exibe o **link direto** para a seção do Handbook relevante.
2. O jogador lê a documentação e entende o conceito.
3. O jogador escreve o código (feitiço rúnico) para resolver a missão.
4. O Golem executa o código: sucesso ou falha têm consequências **visuais imediatas**.
5. O conceito se solidifica pela experiência, não pela memorização.

### 1.3 Público-Alvo

| Perfil | Ponto de entrada no jogo | Meta ao concluir |
|---|---|---|
| **Iniciante absoluto** | Ato 1, Nível 1 | Confortável com tipos primitivos, functions e arrays tipados |
| **Dev JavaScript** | Atos 1–2 (revisão rápida) | Migração sólida para TypeScript com interfaces e tipos de objeto |
| **Dev TypeScript Jr.** | Atos 3–4 | Domínio de narrowing, generics e funções complexas |
| **Dev TypeScript Sênior** | Atos 7–8 | Maestria em type manipulation, mapped types e programação em nível de tipo |

### 1.4 Métricas de Sucesso

| Métrica | O que mede | Target |
|---|---|---|
| **Zero `any`** | % de submissões vencedoras sem uso de `any` ou `@ts-ignore` | > 80% |
| **Doc Click Rate** | % de jogadores que clicam no link do Handbook por nível | > 60% |
| **Progressão até Capítulo 5** | Retenção até Narrowing + Object Types (ponto de inflexão de competência) | > 40% |
| **Conclusão total** | Jogadores que chegam ao fim do Capítulo 8 | > 10% |
| **Study Journey** | Conteúdo sobre o jogo gerado por usuários (vídeos, posts, tweets) | Crescimento orgânico mensal |

---

## 2. Mecânicas Principais (Core Gameplay Loop)

### 2.1 O Ciclo de Jogo

```
[Briefing da Missão]
        ↓
[Leitura do Handbook]  ←── link direto no terminal
        ↓
[Codificação no Monaco Editor]
        ↓  (TypeScript em tempo real)
[Validação Estática pelo LSP]  ←── botão Deploy bloqueado se há erros
        ↓  (0 erros → Deploy habilitado)
[Transpilação no browser: ts.transpileModule]
        ↓
[Execução Segura: new Function / Web Worker]
        ↓
[Animação do drone no grid]
        ↓
[Avaliação da condição de vitória]
        ↓
[Feedback + Ranking + Próximo nível]
```

### 2.2 O Editor (Monaco + IntelliSense Progressivo)

O Monaco Editor é configurado para ensinar, não apenas editar:

- **IntelliSense restrito por nível**: o jogador só vê os métodos e tipos que pertencem ao capítulo atual. `api.scanNodes()` não aparece no autocomplete do Capítulo 1.
- **Hover com link**: passar o mouse sobre `api.move()` mostra a assinatura tipada **e** um link para a seção do Handbook onde aquele padrão é ensinado.
- **Deploy bloqueado**: enquanto existirem erros (squiggles vermelhos), o botão Deploy permanece desabilitado com uma tooltip: *"O Computador de Bordo recusa código com erros de tipagem."*

### 2.3 O Grid de Mineração

Matriz bidimensional. Cada célula tem um estado com representação visual distinta:

| Estado | Visual | Comportamento |
|---|---|---|
| `FogOfWar` | Névoa escura pulsante | Inacessível; requer `scan()` para revelar |
| `Empty` | Chão de rocha | Transitável sem custo de bateria extra |
| `Wall` | Parede sólida | Colisão fatal: interrompe execução |
| `Ore` | Brilho neon por tipo de isótopo | Coletável via `mine()` |
| `Hazard` | Lava / gás com animação | Dano progressivo à bateria |
| `Portal` | Anel magnético girando | Teleporta o drone (introduzido no Capítulo 6) |

### 2.4 Sistema de Ticks e Bateria

Cada ação da API consome recursos. A ineficiência algorítmica tem consequência direta:

| Ação | Ticks | Bateria |
|---|---|---|
| `api.move(dx, dy)` | 1 | 10 unidades |
| `api.mine()` | 1 | 15 unidades |
| `api.scan(dx, dy)` | 1 | 5 unidades |
| `api.transmit(data)` | 0 | 0 |
| Loop desnecessário | +N | +N × custo |

**Thermal throttling**: código com complexidade O(n²) em grids grandes aciona uma animação de superaquecimento visível e dobra o custo de bateria por tick.

### 2.5 Sistema de Ranking por Missão

Cada missão é avaliada em três dimensões ao término:

| Medalha | Critério |
|---|---|
| 🥉 Bronze | Missão concluída (condição de vitória atingida) |
| 🥈 Prata | Missão concluída + sem uso de `any` / `@ts-ignore` |
| 🥇 Ouro | Prata + dentro do limite ótimo de ticks/bateria |

---

## 3. Currículo — Mapeamento com o TypeScript Handbook

> Cada "Capítulo" do jogo corresponde exatamente a uma seção do TypeScript Handbook. Os níveis dentro de cada capítulo cobrem os subtópicos da documentação em sequência.

---

### Capítulo 1 · The Basics

📖 **Doc:** [typescriptlang.org/docs/handbook/2/basic-types.html](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)  
🏔️ **Ambiente:** A superfície da mina. Luz natural, corredores retos, sem perigos.  
🎯 **Objetivo pedagógico:** Entender *por que* TypeScript existe e o que o compilador faz por nós.

#### Nível 1.1 — Static Type Checking
**Conceito:** O que é análise estática. Por que o TypeScript detecta erros antes de rodar.  
**Missão:** O painel de controle tem um bug de tipo. O drone não parte.  
**Desafio:** O jogador recebe um código JavaScript com um erro de tipo silencioso (somar `number + string`) e deve corrigi-lo adicionando anotações de tipo.  
**Condição de vitória:** O código compila sem erros e o drone se move 3 casas para frente.

#### Nível 1.2 — Non-Exception Failures
**Conceito:** Erros que JavaScript ignora mas TypeScript rejeita (acessar propriedade inexistente, chamar não-função).  
**Missão:** O sistema de telemetria retorna dados mal estruturados.  
**Desafio:** Dado um objeto, o jogador identifica e corrige os acessos a propriedades que TypeScript sabe que não existem.  
**Condição de vitória:** O drone lê a telemetria e coleta o minério na posição correta.

#### Nível 1.3 — Types for Tooling (IntelliSense)
**Conceito:** O IntelliSense como ferramenta de produtividade, não apenas de erro.  
**Missão:** Completar um script incompleto usando apenas o autocomplete.  
**Desafio:** O código starter tem lacunas (`___`). O jogador deve preenchê-las usando apenas o IntelliSense, sem consultar outros recursos.  
**Condição de vitória:** Todos os gaps preenchidos corretamente; drone executa rota completa.

#### Nível 1.4 — Strictness (`strict`, `noImplicitAny`, `strictNullChecks`)
**Conceito:** Modos de rigor do compilador e por que usar o mais estrito possível.  
**Missão (Clímax do Capítulo):** Ativar o modo rigoroso e corrigir todo o código legado da mineradora.  
**Desafio:** O jogador recebe um arquivo `droneController.ts` cheio de `any` implícitos e possíveis `null`. Com `strict: true` ativado no tsconfig simulado, deve corrigir todos os erros até o código compilar limpo.  
**Condição de vitória:** 0 erros com `strict: true`. O drone executa uma varredura de 10 casas sem falhas.

---

### Capítulo 2 · Everyday Types

📖 **Doc:** [typescriptlang.org/docs/handbook/2/everyday-types.html](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)  
⛏️ **Ambiente:** Primeiros túneis. Fog of War leve. Minérios de tipos diferentes aparecem.  
🎯 **Objetivo pedagógico:** Dominar todos os tipos usados no dia a dia para escrever TypeScript sem pensar.

#### Nível 2.1 — Primitives: `string`, `number`, `boolean`
**Conceito:** Os três tipos primitivos fundamentais do TypeScript.  
**Missão:** Calibrar os sensores do drone com os tipos corretos.  
**Desafio:** Preencher as anotações de tipo de um conjunto de variáveis de configuração do drone (temperatura, nome do operador, modo ativo).  
**Condição de vitória:** Compilação limpa. O drone entra no túnel com os parâmetros corretos.

#### Nível 2.2 — Arrays e Tuplas básicas
**Conceito:** `number[]`, `Array<string>`, e tuplas `[number, number]`.  
**Missão:** O scanner retorna um array de coordenadas. O drone precisa percorrê-las em ordem.  
**Desafio:** Tipar corretamente um array de coordenadas `[x, y]` e iterar com `for...of`.  
**Condição de vitória:** O drone visita todas as coordenadas na ordem correta.

#### Nível 2.3 — `any` e `noImplicitAny`
**Conceito:** Por que `any` é perigoso e deve ser evitado.  
**Missão:** Um script antigo usa `any` em todo lugar. Ele falha em produção.  
**Desafio:** Substituir todos os `any` por tipos concretos. Qualquer `any` restante reduz a medalha para Bronze.  
**Regra especial:** `any` e `@ts-ignore` estão nos `forbiddenPatterns` do scorer. Usar qualquer um resulta em derrota automática neste nível.

#### Nível 2.4 — Functions: Parâmetros e Retorno
**Conceito:** Anotar parâmetros e tipos de retorno de funções.  
**Missão:** Escrever as funções de movimentação do drone com assinaturas tipadas.  
**Desafio:** Implementar `moveNorth(steps: number): void`, `getStatus(): string`, e `calculateFuel(distance: number, load: number): number`.  
**Condição de vitória:** As três funções passam nos testes de tipo e o drone executa a rota planejada.

#### Nível 2.5 — Object Types e Optional Properties
**Conceito:** Descrever a forma de objetos com `{ prop: type }` e propriedades opcionais `?`.  
**Missão:** Modelar o relatório de missão retornado pelo scanner.  
**Desafio:** Criar um tipo `MissionReport` com campos obrigatórios (`timestamp`, `oreCollected`) e opcionais (`hazardsDetected?`, `warnings?`). Usar o tipo na função de transmissão.  
**Condição de vitória:** Drone coleta minérios, gera `MissionReport` válido e transmite com sucesso.

#### Nível 2.6 — Union Types
**Conceito:** Tipos que representam "A ou B" com `|`.  
**Missão:** O scanner retorna células de diferentes tipos. O drone precisa agir diferente para cada um.  
**Desafio:** Usar `CellType = 'Empty' | 'Wall' | 'Ore' | 'Hazard'` para tipar o retorno do scan e escrever um `switch` que trata cada caso.

#### Nível 2.7 — Type Aliases vs. Interfaces
**Conceito:** Quando usar `type` e quando usar `interface`. Diferenças práticas.  
**Missão:** Refatorar o sistema de tipos da mineradora para usar a estrutura correta.  
**Desafio:** Dado um código que mistura `type` e `interface` de forma incorreta, reorganizar usando a regra: `interface` para contratos de objeto estendíveis, `type` para unions e tipos compostos.

#### Nível 2.8 — Type Assertions
**Conceito:** `as Type` e quando é legítimo usá-lo (vs. quando é um atalho perigoso).  
**Missão:** A API legada da mineradora retorna `unknown`. O jogador precisa converter com segurança.  
**Desafio:** Receber um `fetchLegacyData(): unknown` e fazer `as` assertion corretamente após validar a estrutura.

#### Nível 2.9 — Literal Types e `null`/`undefined`
**Conceito:** Tipos literais (`'North' | 'South'`), `null`, `undefined` e o operador `!`.  
**Missão:** O sistema de navegação só aceita direções válidas.  
**Desafio:** Tipar direções como `type Direction = 'N' | 'S' | 'E' | 'W'` e lidar com um sensor que pode retornar `null` quando não há leitura.

#### Nível 2.10 — Enums (Clímax do Capítulo)
**Conceito:** `enum` numérico e de string. Quando usar vs. union de literais.  
**Missão (Clímax):** Programar o sistema de status do drone com todas as categorias corretas.  
**Desafio:** Criar um `enum DroneStatus` com estados (`Idle`, `Mining`, `Returning`, `Critical`) e um `enum OreGrade` de string (`'A' | 'B' | 'C'`). Implementar uma função `getStatusMessage(status: DroneStatus): string` retornando mensagens temáticas para cada estado.  
**Condição de vitória:** O drone percorre um ciclo completo (Idle → Mining → Returning → Idle) com todas as transições de estado corretamente tipadas.

---

### Capítulo 3 · Narrowing

📖 **Doc:** [typescriptlang.org/docs/handbook/2/narrowing.html](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)  
🌑 **Ambiente:** Túneis com Fog of War denso. Células de tipos desconhecidos precisam ser identificadas antes de agir.  
🎯 **Objetivo pedagógico:** Escrever código que *se adapta* ao tipo real de um valor em tempo de execução, com segurança total em compile-time.

#### Nível 3.1 — `typeof` Type Guards
**Conceito:** Usar `typeof` para narrowing de primitivos.  
**Missão:** O sensor de profundidade retorna `string | number` dependendo do modelo do equipamento. Tratar ambos os casos.  
**Desafio:** Implementar uma função `parseDepth(value: string | number): number` que usa `typeof` para converter corretamente.

#### Nível 3.2 — Truthiness Narrowing
**Conceito:** `if (value)` como narrowing de `null`, `undefined`, `0`, `""`.  
**Missão:** Verificar se o slot de carga do drone está ocupado antes de tentar descarregar.  
**Desafio:** Receber `cargo: OreData | null | undefined` e usar truthiness narrowing para agir com segurança.

#### Nível 3.3 — Equality Narrowing (`===`, `!==`)
**Conceito:** Narrowing via igualdade estrita.  
**Missão:** O drone precisa confirmar que está na posição exata antes de minerar (evitar minerar coordenada errada).  
**Desafio:** Usar `===` para garantir que `currentPosition.x === targetX && currentPosition.y === targetY` antes de executar `mine()`.

#### Nível 3.4 — `in` Operator Narrowing
**Conceito:** `'property' in object` para distinguir entre tipos de objeto.  
**Missão:** A API retorna `StandardOre | RareIsotope`. Apenas `RareIsotope` tem a propriedade `halfLife`. Identificar e tratar cada um.  
**Desafio:** Usar o operador `in` para fazer narrowing entre as duas interfaces sem type assertion.

#### Nível 3.5 — `instanceof` Narrowing
**Conceito:** Narrowing com classes via `instanceof`.  
**Missão:** O sistema de log da mineradora lança `NetworkError` ou `SensorError`. Tratar cada um diferente.  
**Desafio:** No `catch`, usar `instanceof` para distinguir os erros e emitir alertas temáticos diferentes para cada tipo.

#### Nível 3.6 — Type Predicates (`is`)
**Conceito:** Funções guard com `value is Type`.  
**Missão:** Criar uma função reutilizável que verifica se uma célula é minável.  
**Desafio:** Implementar `function isOre(cell: CellType): cell is Ore` e usá-la em múltiplos pontos do código sem repetir lógica de validação.

#### Nível 3.7 — Discriminated Unions
**Conceito:** Usar uma propriedade `kind` / `type` compartilhada para narrowing elegante.  
**Missão (Clímax do Capítulo):** O mainframe recebe eventos de múltiplas fontes. Cada evento tem uma propriedade `kind`. Roteá-los corretamente.  
**Desafio:** Modelar um `union` discriminado com `{ kind: 'move', direction: Direction } | { kind: 'mine' } | { kind: 'scan', radius: number }` e usar `switch (event.kind)` para despachar cada ação.  
**Condição de vitória:** Drone processa uma fila de 20 eventos mistos sem falhas de tipo ou runtime.

#### Nível 3.8 — Exhaustiveness Checking com `never`
**Conceito:** Como o TypeScript garante que todos os casos de um union foram tratados.  
**Missão (Bônus Difícil):** Um novo tipo de célula `Unstable` é adicionado ao sistema. Encontrar todos os pontos do código que não tratam esse novo caso.  
**Desafio:** Usar o padrão `default: const x: never = event` para que o compilador aponte todos os `switch` que precisam ser atualizados. Resolver todos os erros.

---

### Capítulo 4 · More on Functions

📖 **Doc:** [typescriptlang.org/docs/handbook/2/functions.html](https://www.typescriptlang.org/docs/handbook/2/functions.html)  
⚙️ **Ambiente:** Sala de máquinas. Sistemas modulares. Os drones recebem módulos de plugin.  
🎯 **Objetivo pedagógico:** Dominar funções como cidadãos de primeira classe em TypeScript — tipando callbacks, sobrecargas e genéricos básicos.

#### Nível 4.1 — Function Type Expressions e Call Signatures
**Conceito:** Tipar funções como valores: `(param: Type) => ReturnType`.  
**Missão:** O módulo de IA do drone aceita uma função de "decisão" plugável.  
**Desafio:** Definir o tipo `DecisionFn = (context: DroneContext) => Action` e implementar duas decisões intercambiáveis: `aggressiveMine` e `conservativeMine`.

#### Nível 4.2 — Generic Functions (Inferência)
**Conceito:** Funções genéricas onde o TypeScript infere `T` automaticamente.  
**Missão:** O drone precisa de uma função `first()` que retorna o primeiro elemento de qualquer array, com tipo correto.  
**Desafio:** Implementar `function first<T>(arr: T[]): T | undefined` e usá-la com arrays de diferentes tipos sem precisar especificar `T` manualmente.

#### Nível 4.3 — Generic Functions com Constraints
**Conceito:** `<T extends Constraint>` para limitar o que o genérico aceita.  
**Missão:** O sistema de ordenação de carga só funciona com itens que têm propriedade `weight`.  
**Desafio:** Implementar `function sortByCargo<T extends { weight: number }>(items: T[]): T[]`. O TypeScript deve rejeitar chamadas com objetos sem `weight`.

#### Nível 4.4 — Optional Parameters e Default Values
**Conceito:** Parâmetros opcionais `param?: Type` e valores padrão `param = defaultValue`.  
**Missão:** A função de varredura deve funcionar com ou sem raio especificado.  
**Desafio:** Implementar `function scanArea(centerX: number, centerY: number, radius?: number): ScanResult[]` com raio padrão de 1 quando não especificado.

#### Nível 4.5 — Function Overloads
**Conceito:** Múltiplas assinaturas para uma função com comportamento diferente por input.  
**Missão:** O transmissor do drone precisa serializar `string` e `number` de formas diferentes.  
**Desafio:** Criar sobrecargas para `transmit(data: string): string` e `transmit(data: number): string`, com implementação única que trata os dois casos.

#### Nível 4.6 — Rest Parameters e Destructuring
**Conceito:** `...args: Type[]` e desestruturação tipada de parâmetros.  
**Missão (Clímax do Capítulo):** O mainframe precisa aceitar um número variável de comandos em batch.  
**Desafio:** Implementar `function batchCommands(...commands: DroneCommand[]): Promise<void>` que executa todos os comandos em sequência. O tipo `DroneCommand` deve ser um discriminated union dos comandos existentes.

---

### Capítulo 5 · Object Types

📖 **Doc:** [typescriptlang.org/docs/handbook/2/objects.html](https://www.typescriptlang.org/docs/handbook/2/objects.html)  
🏗️ **Ambiente:** A refinaria. Estruturas complexas de processamento. Dados em múltiplas camadas.  
🎯 **Objetivo pedagógico:** Modelar estruturas de dado complexas de forma precisa, extensível e segura.

#### Nível 5.1 — `readonly` Properties
**Conceito:** Propriedades que não podem ser reatribuídas após criação.  
**Missão:** As coordenadas de origem de um drone são imutáveis após bootstrap.  
**Desafio:** Modelar `DroneConfig` com `readonly id: string` e `readonly homeBase: [number, number]`. O TypeScript deve rejeitar qualquer tentativa de reatribuição.

#### Nível 5.2 — Index Signatures
**Conceito:** `[key: string]: ValueType` para objetos com chaves dinâmicas.  
**Missão:** O mapa de minérios é construído dinamicamente a partir de scans. As coordenadas são chaves string.  
**Desafio:** Criar `type MineMap = { [coords: string]: OreData | null }` e implementar as funções de leitura e escrita no mapa com tipos corretos.

#### Nível 5.3 — Extending Types (`extends`)
**Conceito:** Uma interface pode estender outra para herdar suas propriedades.  
**Missão:** Diferentes modelos de drone compartilham uma base comum mas têm capacidades extras.  
**Desafio:** Criar `interface BaseDrone { id: string; battery: number }`, depois estender: `interface MiningDrone extends BaseDrone { drillStrength: number }` e `interface ScoutDrone extends BaseDrone { scanRadius: number }`.

#### Nível 5.4 — Intersection Types (`&`)
**Conceito:** Combinar múltiplos tipos em um só com `&`.  
**Missão:** Um drone de missão especial precisa das capacidades de Mining E Scout ao mesmo tempo.  
**Desafio:** Criar `type SpecialDrone = MiningDrone & ScoutDrone` e implementar uma função que opera especificamente nesse tipo combinado.

#### Nível 5.5 — Tuple Types
**Conceito:** Arrays de tamanho e tipos fixos: `[string, number]`.  
**Missão:** O sistema de coordenadas usa pares exatos. Uma coordenada inválida causa crash.  
**Desafio:** Tipar coordenadas como `type Coord = [number, number]` e a função de movimento como `move(from: Coord, to: Coord): void`. O TypeScript deve rejeitar `move([1, 2, 3], [0, 0])`.

#### Nível 5.6 — `ReadonlyArray` e Generic Object Types (Clímax)
**Conceito:** Arrays imutáveis e o tipo genérico interno `Array<T>`.  
**Missão (Clímax do Capítulo):** O histórico de missões é um registro imutável.  
**Desafio:** Tipar `missionLog: ReadonlyArray<MissionReport>` e garantir que nenhuma função de callback pode modificá-lo. Implementar `addMission(log: ReadonlyArray<MissionReport>, newEntry: MissionReport): ReadonlyArray<MissionReport>` que retorna um novo array sem mutar o original.

---

### Capítulo 6 · Generics

📖 **Doc:** [typescriptlang.org/docs/handbook/2/generics.html](https://www.typescriptlang.org/docs/handbook/2/generics.html)  
🔬 **Ambiente:** Laboratório de pesquisa. O drone agora opera em múltiplos biomas. O código precisa ser universal.  
🎯 **Objetivo pedagógico:** Escrever código que funciona para *qualquer* tipo, sem perder a segurança de tipos.

#### Nível 6.1 — Hello Generics: A função `identity`
**Conceito:** Introdução ao conceito de `<T>` como "tipo variável".  
**Missão:** O sistema de eco do mainframe deve retornar qualquer dado enviado, com tipo correto.  
**Desafio:** Implementar `function echo<T>(value: T): T`. Provar que `echo(42)` retorna `number` e `echo("hello")` retorna `string` — sem `any`.

#### Nível 6.2 — Generic Interfaces e Classes
**Conceito:** Interfaces e classes que aceitam um parâmetro de tipo.  
**Missão:** A fila de comandos do drone deve ser type-safe para qualquer tipo de comando.  
**Desafio:** Criar `interface Queue<T> { enqueue(item: T): void; dequeue(): T | undefined; size(): number }` e implementar `class DroneQueue<T> implements Queue<T>`.

#### Nível 6.3 — Generic Constraints (`extends keyof`)
**Conceito:** `<K extends keyof T>` para acessar propriedades de forma segura.  
**Missão:** Criar um acessor genérico de propriedades de drone que nunca acessa chave inexistente.  
**Desafio:** Implementar `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`. O TypeScript deve rejeitar `getProperty(drone, 'invalidProp')`.

#### Nível 6.4 — Utility Types: `Partial`, `Required`, `Readonly`, `Record`
**Conceito:** Os Utility Types embutidos do TypeScript que usam Generics internamente.  
**Missão:** O sistema de configuração de missão permite atualizar campos parcialmente.  
**Desafio:** Implementar `function updateMission(base: MissionConfig, updates: Partial<MissionConfig>): MissionConfig`. Depois, criar um `Record<DroneId, DroneStatus>` para o painel de controle.

#### Nível 6.5 — `ReturnType`, `Parameters`, `Awaited`
**Conceito:** Utility Types que extraem informações de funções e Promises.  
**Missão:** O logger de missão precisa capturar automaticamente o tipo de retorno de qualquer função de ação.  
**Desafio:** Usar `ReturnType<typeof api.scan>` para tipar o resultado do scan sem repetir a interface manualmente. Usar `Awaited<>` para unwrapping de Promises assíncronas.

#### Nível 6.6 — O Algoritmo da Mochila Tipado (Clímax do Capítulo)
**Conceito:** Tudo de generics aplicado a um problema algorítmico real.  
**Missão (Clímax):** Os drones cargueiros têm limite de peso. Maximizar o valor extraído.  
**Desafio:** Implementar o algoritmo Knapsack com assinatura genérica:

```typescript
interface Loadable {
  weight: number;
  value: number;
}

function knapsack<T extends Loadable>(
  items: T[],
  capacity: number
): { selected: ReadonlyArray<T>; totalValue: number }
```

O TypeScript deve inferir corretamente que `selected` contém objetos do mesmo tipo `T` passado como entrada — sem `any`, sem cast.

---

### Capítulo 7 · Classes

📖 **Doc:** [typescriptlang.org/docs/handbook/2/classes.html](https://www.typescriptlang.org/docs/handbook/2/classes.html)  
🤖 **Ambiente:** A fábrica de drones. O jogador agora projeta os próprios modelos de drone.  
🎯 **Objetivo pedagógico:** Dominar o modelo de classes do TypeScript, incluindo modificadores de acesso, herança e implementação de interfaces.

#### Nível 7.1 — Class Basics: Fields, Constructor, Methods
**Conceito:** Estrutura básica de uma classe TypeScript.  
**Missão:** Criar a classe base `Drone` da mineradora.  
**Desafio:** Implementar `class Drone` com campos `readonly id: string`, `battery: number`, construtor e método `charge(amount: number): void`.

#### Nível 7.2 — Access Modifiers: `public`, `private`, `protected`
**Conceito:** Controle de visibilidade de membros.  
**Missão:** O sistema de bateria é sensível. Proteger o estado interno.  
**Desafio:** Refatorar `Drone` com `private _battery: number` e um getter público `get battery(): number`. O TypeScript deve rejeitar `drone._battery = 999` de fora da classe.

#### Nível 7.3 — Implementando Interfaces com `implements`
**Conceito:** Uma classe pode implementar um contrato de interface.  
**Missão:** Garantir que todos os modelos de drone cumprem o mesmo contrato operacional.  
**Desafio:** Criar `interface IControllable { move(d: Direction): Promise<void>; mine(): Promise<void> }`. Fazer `class MiningDrone implements IControllable`.

#### Nível 7.4 — Herança com `extends` e `override`
**Conceito:** Subclasses, `super()` e a keyword `override` para sobrescrever com segurança.  
**Missão:** O modelo Ranger é uma versão aprimorada do Drone padrão.  
**Desafio:** Criar `class RangerDrone extends Drone` com `override move(d: Direction)` que consome menos bateria. Usar `super.move()` interno. O compilador deve rejeitar `override` em métodos que não existem na classe pai.

#### Nível 7.5 — Abstract Classes
**Conceito:** Classes abstratas como templates não instanciáveis.  
**Missão (Clímax do Capítulo):** Criar o template base de todos os drones futuros da mineradora.  
**Desafio:** Criar `abstract class BaseDrone` com implementações concretas de `charge()` e `getStatus()`, e o método abstrato `abstract execute(command: DroneCommand): Promise<void>`. Criar `class CargoHauler extends BaseDrone` que implementa `execute`. Provar que `new BaseDrone()` é rejeitado pelo compilador.

---

### Capítulo 8 · Type Manipulation

📖 **Docs:** Seções avançadas do Handbook  
🌋 **Ambiente:** O núcleo do planeta. Ambiente hostil que destrói código em runtime. A solução existe apenas no sistema de tipos.  
🎯 **Objetivo pedagógico:** Programar *com* o sistema de tipos do TypeScript, não apenas para ele.

#### Nível 8.1 — `keyof` e Indexed Access Types (`T[K]`)
📖 [typescriptlang.org/docs/handbook/2/keyof-types.html](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)  
**Conceito:** Extrair o union de chaves de um tipo e acessar o tipo de uma propriedade por chave.  
**Missão:** Construir um validador genérico que verifica qualquer campo de qualquer objeto.  
**Desafio:** Implementar `function validate<T, K extends keyof T>(obj: T, key: K, expected: T[K]): boolean`.

#### Nível 8.2 — `typeof` no nível de tipo
📖 [typescriptlang.org/docs/handbook/2/typeof-types.html](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)  
**Conceito:** Usar `typeof` em contexto de tipo para capturar o tipo de uma variável/função.  
**Missão:** Criar um tipo baseado em um objeto de configuração existente, sem duplicar a definição.  
**Desafio:** Dado `const defaultConfig = { speed: 1, scanRadius: 2 }`, criar `type DroneConfig = typeof defaultConfig` e usar esse tipo como parâmetro de função.

#### Nível 8.3 — Conditional Types
📖 [typescriptlang.org/docs/handbook/2/conditional-types.html](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)  
**Conceito:** `T extends U ? X : Y` — lógica condicional em nível de tipo.  
**Missão:** O sistema de payload precisa retornar tipos diferentes dependendo do tipo de minério.  
**Desafio:** Criar:
```typescript
type OrePayload<T extends OreGrade> =
  T extends 'A' ? PremiumOre :
  T extends 'B' ? StandardOre :
  ScrapOre;
```
Implementar uma função genérica que usa esse tipo condicional no retorno.

#### Nível 8.4 — `infer` dentro de Conditional Types
📖 [typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)  
**Conceito:** Extrair tipos de dentro de estruturas com `infer`.  
**Missão:** Criar um tipo que extrai o tipo do elemento de qualquer array.  
**Desafio:** Implementar `type ElementOf<T> = T extends Array<infer E> ? E : never`. Depois, `type UnwrapPromise<T> = T extends Promise<infer R> ? R : T`. Provar com exemplos no editor.

#### Nível 8.5 — Mapped Types
📖 [typescriptlang.org/docs/handbook/2/mapped-types.html](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)  
**Conceito:** Criar novos tipos transformando as propriedades de um tipo existente com `{ [K in keyof T]: ... }`.  
**Missão:** O sistema de auditoria precisa de uma versão "nullable" e uma versão "somente leitura" de qualquer interface.  
**Desafio:** Implementar manualmente (sem usar os utilitários embutidos):
```typescript
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }
type MyPartial<T> = { [K in keyof T]?: T[K] }
type Nullable<T> = { [K in keyof T]: T[K] | null }
```

#### Nível 8.6 — Template Literal Types
📖 [typescriptlang.org/docs/handbook/2/template-literal-types.html](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)  
**Conceito:** Criar tipos de string com interpolação: `` `prefix_${string}` ``.  
**Missão:** O protocolo de comunicação da mineradora exige IDs com formato estrito.  
**Desafio:** Criar `type DroneId = `drone_${string}`` e `type EventName = `on${Capitalize<string>}`` . O TypeScript deve rejeitar strings fora do formato.

#### Nível 8.7 — O Motor de Inferência (Clímax Final)
**Conceito:** Tudo de type manipulation combinado em um problema complexo.  
**Missão (Boss Final):** O núcleo magnético destrói código JavaScript. A rota para o artefato final deve ser validada *apenas* pelo compilador, em compile-time.  
**Desafio:**

O jogador recebe uma string com o "DNA geológico" do mapa — uma sequência de coordenadas no formato `"0,0->1,0->1,1->2,1"`. Deve criar um sistema de tipos que:

1. **Parseia** a string em uma tupla de coordenadas usando Template Literal Types e `infer`
2. **Valida** que cada passo da rota é adjacente ao anterior (diferença de exatamente 1 em X ou Y, mas não ambos)
3. **Bloqueia o deploy** se a rota não for válida — o erro deve aparecer no Monaco como erro de compilação, não de runtime

```typescript
// O jogador deve construir tipos como:
type ParseCoord<S extends string> =
  S extends `${infer X},${infer Y}` ? [X, Y] : never;

type IsAdjacent<A extends [string, string], B extends [string, string]> =
  // ... lógica de validação de adjacência em nível de tipo

type ValidPath<S extends string> =
  // ... parseia e valida cada segmento de S

// A declaração final que bloqueia o deploy se falhar:
type _PathCheck = ValidPath<"0,0->1,0->1,1"> extends true ? true : never;
const _validate: _PathCheck = true; // Erro de compilação se a rota for inválida!
```

**Condição de vitória:** O código compila limpo para a rota correta. Qualquer rota inválida produz um erro de compilação exibido no Monaco — sem uma única linha de JavaScript sendo executada para validação.

---

## 4. Arquitetura Técnica

### 4.1 Stack

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Framework** | React 18 + TypeScript | Tipagem end-to-end; Concurrent Mode para animações |
| **Build Tool** | Vite | HMR ultrarrápido |
| **Estado Global** | Zustand | Isolamento entre estado do Monaco e motor de jogo; sem re-renders em cascata |
| **Estilização** | Tailwind CSS | Iteração rápida; design system coeso |
| **Animações** | Framer Motion | `layout` prop para interpolações no grid; `AnimatePresence` para fog of war |
| **Editor de Código** | `@monaco-editor/react` | LSP nativo; injeção de `.d.ts` por nível |

**Direção de arte:** Medieval Fantasy / Guild Scriptorium 16-bits. Tema pergaminho envelhecido, pedra maciça e ferro forjado. Magia rúnica brilhante em ciano/âmbar. Fonte Serif (clássica) para títulos e JetBrains Mono (ou Fira Code) estritamente para sintaxe/runas.

### 4.2 Motor de Jogo

**Princípio:** Tick-based, não frame-based. Cada `api.move()` retorna uma `Promise` que pausa o fluxo do sandbox até a animação terminar.

```typescript
// Experiência do jogador no editor
await api.move(1, 0);       // Pausa; aguarda animação de 300ms
await api.mine();            // Pausa; aguarda animação de extração
const cell = await api.scan(0, 1); // Retorna dado tipado do nível
```

### 4.3 Pipeline de Execução e Sandbox (Crítico)

> ⚠️ **Proibido:** Uso de Regex para remover tipagens TypeScript. Falhará em Generics e Conditional Types.

```
[Monaco Editor]  →  [LSP Validation]  →  [ts.transpileModule]  →  [new Function / Worker]
                         ↑                       ↑                         ↑
                   0 erros = Deploy OK      No browser          gameAPI injetado
```

**Proteção contra loops infinitos:**
- Timeout de **3.000ms** via Web Worker `terminate()`
- Contador de iterações no proxy da API: erro ao ultrapassar **10.000 chamadas**
- Mensagens temáticas no console visual para cada tipo de falha

---

## 5. Diretrizes de Implementação

### 5.1 Estrutura de Diretórios

```
/src
├── core/
│   ├── engine/          # Ticks, colisões, validação de limites
│   └── compiler/        # ts.transpileModule, Worker, timeout guard
│
├── store/
│   ├── useGameStore.ts  # Grid, drone, estado visual
│   └── useLevelStore.ts # Capítulo atual, progresso, histórico
│
├── components/
│   ├── ide/             # Monaco, DeployButton, ConsoleOutput, DocLink
│   └── game/            # Grid, Cell, Drone, HUD, FogOfWar
│
└── levels/
    ├── chapter-1/       # 4 níveis
    ├── chapter-2/       # 10 níveis
    ├── chapter-3/       # 8 níveis
    ├── chapter-4/       # 6 níveis
    ├── chapter-5/       # 6 níveis
    ├── chapter-6/       # 6 níveis
    ├── chapter-7/       # 5 níveis
    └── chapter-8/       # 7 níveis
```

### 5.2 Contrato de Interface — `ILevelDefinition`

```typescript
interface ILevelDefinition {
  id: string;                        // "ch2-lvl6" 
  chapter: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  title: string;                     // Ex: "Union Types — O Escâner Polimórfico"
  
  // Referência direta ao TypeScript Handbook
  handbookRef: {
    section: string;                 // Ex: "Everyday Types › Union Types"
    url: string;                     // Link direto para o anchor
  };

  // Narrativa
  mission: {
    briefing: string;                // Texto exibido no terminal
    objective: string;               // Critério humano de vitória
  };

  // Grid inicial
  initialGrid: CellType[][];

  // Restrições de hardware
  hardware: {
    maxBattery: number;
    maxTicks?: number;
    maxCargoWeight?: number;
  };

  // API disponível neste nível (string .d.ts injetada no Monaco)
  apiTypeDefs: string;

  // Código exibido ao abrir o nível
  starterCode: string;

  // Critério de vitória (rodar após execução)
  victoryCondition: (state: GameState) => boolean;

  // Critérios para ranking de medalhas
  scoring: {
    silver: { forbiddenPatterns: string[] }; // Ex: ["any", "@ts-ignore"]
    gold: { maxTicks: number; maxBatteryUsed: number };
  };
}
```

**Regra fundamental:** adicionar um novo nível = criar um arquivo em `/src/levels/chapter-N/`. Nenhuma modificação no motor.

### 5.3 Injeção Progressiva de Tipos no Monaco

```typescript
const handleEditorMount = (editor: IStandaloneCodeEditor, monaco: Monaco) => {
  // Reseta tipos do nível anterior
  monaco.languages.typescript.typescriptDefaults.setExtraLibs([]);

  // Injeta apenas os tipos do nível atual
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    currentLevel.apiTypeDefs,
    'file:///game-api.d.ts'
  );

  // Configura strictness equivalente ao que o nível ensina
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    strict: true,
    noImplicitAny: true,
    strictNullChecks: true,
    target: monaco.languages.typescript.ScriptTarget.ES2020,
  });
};
```

---

*PRD v2.0 — "The Miner is Gone". O jogo e o Handbook andam juntos.*
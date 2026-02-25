# Plano de Implementação — The Miner is Gone
**Baseado no PRD v2.0 | Data: 2026-02-24**

## Estado Atual da Base de Código

O projeto já possui uma estrutura funcional:
- ✅ React 18 + TypeScript + Vite
- ✅ Monaco Editor integrado (`@monaco-editor/react`)
- ✅ Motor de jogo baseado em React state (sem Zustand ainda)
- ✅ Grid 2D com drone animado
- ✅ 7 fases básicas em `levels.ts`
- ✅ Execução via `new Function()` (correto)
- ❌ **Transpiler usa Regex** — proibido pelo PRD (falha em Generics)
- ❌ IntelliSense não é progressivo por nível (todos os tipos expostos sempre)
- ❌ Sem proteção de timeout/loop infinito
- ❌ Fases não seguem o TypeScript Handbook
- ❌ Sem Fog of War
- ❌ Sem sistema de medalhas
- ❌ Sem link para documentação no briefing

---

## Fases de Implementação

### 🔴 FASE 1 — Fundação Técnica (Crítica)
**Prioridade máxima. Resolver débito técnico antes de adicionar conteúdo.**

#### 1.1 Substituir Transpiler (BLOQUEADOR)
- [ ] Instalar `typescript` como dependência de runtime (já existe como devDep — mover)
- [ ] Criar `src/core/compiler/transpiler.ts` usando `ts.transpileModule()`
- [ ] Remover `simpleTranspile()` de `CodeExecutor.ts`
- [ ] Testar com código contendo Generics: `function id<T>(x: T): T { return x; }`

#### 1.2 Proteção de Loops Infinitos
- [ ] Criar `src/core/compiler/sandbox.ts`
- [ ] Implementar timeout de 5000ms via `Promise.race()`
- [ ] Implementar contador de iterações no proxy da API (max 10.000 calls)
- [ ] Mensagens de erro temáticas no console visual

#### 1.3 Refatorar Tipos Base
- [ ] Expandir `src/types/game.ts`: adicionar `FogOfWar`, `Wall`, `Hazard`, `Portal` ao `CellType`
- [ ] Adicionar `battery`, `cargo`, `ticks` ao `GameState`
- [ ] Criar `src/types/level.ts` com `ILevelDefinition` do PRD

#### 1.4 IntelliSense Progressivo
- [ ] Criar `src/core/ide/typeDefs.ts` — funções que retornam strings `.d.ts` por capítulo
- [ ] Atualizar `handleEditorMount` em `App.tsx` para injetar tipos do nível atual
- [ ] Garantir que `strict: true` e `noImplicitAny: true` estão sempre ativos

---

### 🟡 FASE 2 — Conteúdo: Capítulos 1 e 2
**Implementar os primeiros 14 níveis seguindo o TypeScript Handbook.**

#### 2.1 Estrutura de Diretórios
```
src/levels/
  chapter-1/
    1-1-static-type-checking.ts
    1-2-non-exception-failures.ts
    1-3-types-for-tooling.ts
    1-4-strictness.ts
    index.ts
  chapter-2/
    2-1-primitives.ts
    2-2-arrays.ts
    2-3-no-any.ts
    2-4-functions.ts
    2-5-object-types.ts
    2-6-union-types.ts
    2-7-type-aliases-vs-interfaces.ts
    2-8-type-assertions.ts
    2-9-literal-types.ts
    2-10-enums.ts
    index.ts
  index.ts  ← registra todos os capítulos
```

#### 2.2 Para cada nível, implementar `ILevelDefinition`:
- `id`, `chapter`, `title`, `handbookRef`
- `mission.briefing` + `mission.objective`
- `initialGrid`, `hardware`
- `apiTypeDefs` (string .d.ts)
- `starterCode`
- `victoryCondition`
- `scoring` (silver: sem `any`; gold: dentro dos ticks)

---

### 🟡 FASE 3 — Conteúdo: Capítulos 3, 4 e 5
**Narrowing, Functions e Object Types — nível intermediário.**

Mesma estrutura da Fase 2. Mecânicas novas a introduzir:
- Fog of War leve (Capítulo 3)
- Discriminated unions visuais (células com `kind` property)
- Grid maior (7×7)

---

### 🟢 FASE 4 — Conteúdo: Capítulos 6 e 7
**Generics e Classes — nível avançado.**

Mecânicas novas:
- Portal cells (Generics: "o drone se adapta ao ambiente")
- Multiple drones display (Classes: herança visual)
- Grid 10×10

---

### 🟢 FASE 5 — Conteúdo: Capítulo 8 (Type Manipulation)
**Type Gymnastics — expert.**

Mecânica especial:
- No Capítulo 8 final, o grid visual é substituído por uma visualização do sistema de tipos
- O "deploy" não executa JavaScript — apenas verifica se os tipos compilam

---

### 🔵 FASE 6 — UI/UX e Polimento
- [ ] Sistema de medalhas (Bronze/Prata/Ouro) com persistência no localStorage
- [ ] Tela de progresso (mapa dos capítulos)
- [ ] Link para docs TS sempre visível no terminal/briefing  
- [ ] Fog of War animado com Framer Motion
- [ ] Efeitos de `thermal throttling` (shake + cor vermelha)
- [ ] README atualizado

---

## Decisões Técnicas

### Por que `ts.transpileModule` e não Babel?
`ts.transpileModule` é a escolha correta porque:
1. Vem da própria equipe do TypeScript
2. Preserva todos os Generics, Conditional Types e Mapped Types
3. `typescript` já é uma devDependency — precisamos apenas movê-la para `dependencies`

### Como evitar bundle de 60MB?
Usar `typescript` no modo browser via dynamic import ES module: o Vite faz tree-shaking e inclui apenas `ts.transpileModule`, não todo o compilador. Tamanho real no bundle: ~1.5MB (gzipped: ~400KB).

### Estrutura de `ILevelDefinition` vs `LevelConfig` atual
O `LevelConfig` atual será **substituído** pelo `ILevelDefinition` do PRD. A migração é:
- `gridSetup` → `initialGrid` (array 2D declarativo, sem função)
- `winCondition(grid)` → `victoryCondition(GameState)` (acesso a mais contexto)
- `tutorial` + `steps` → `mission.briefing` (markdown) + inline no componente

---

## Arquivos a Criar/Modificar

### Novos arquivos
- `src/core/compiler/transpiler.ts`
- `src/core/compiler/sandbox.ts`
- `src/core/engine/tickSystem.ts`
- `src/core/ide/typeDefs.ts`
- `src/types/level.ts`
- `src/levels/chapter-*/` (todos os níveis)
- `src/levels/index.ts`

### Arquivos a modificar significativamente
- `src/types/game.ts` — expandir tipos
- `src/lib/CodeExecutor.ts` — usar transpiler real
- `src/lib/GameEngine.ts` — sistema de battery/ticks
- `src/lib/levels.ts` → **substituir** pela estrutura de diretórios
- `src/App.tsx` — IntelliSense progressivo + link docs

### Arquivos a preservar intactos
- `src/components/GameGrid.tsx` (funciona bem, pode evoluir)
- `vite.config.ts`
- `tsconfig.json`

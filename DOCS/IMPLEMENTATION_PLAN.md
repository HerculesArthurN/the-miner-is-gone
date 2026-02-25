# Plano de Implementação — The Miner is Gone
**Baseado no PRD v2.0 | Data: 2026-02-25**

## Estado Atual da Base de Código

O projeto atingiu maturidade técnica significativa:
- ✅ **Transpiler Real**: Usando `ts.transpileModule()`. Suporta Generics, Conditional Types, etc.
- ✅ **Sandbox Seguro**: Timeout (10s), limite de chamadas (20.000) e injeção dinâmica de métodos.
- ✅ **IntelliSense Progressivo**: Tipos injetados dinamicamente no Monaco por capítulo/nível.
- ✅ **Motor Enriquecido**: Sistema de bateria, ticks, cargo, medalhas e fog of war.
- ✅ **Conteúdo**: 29 níveis implementados (Capítulos 1 ao 5).
- ✅ **Aesthetics**: UI premium com animações, terminal funcional e link direto ao Handbook.

---

## Fases de Implementação

### ✅ FASE 1 — Fundação Técnica (CONCLUÍDA)
- [X] Transpiler oficial TypeScript
- [X] Sandbox com timeout e proteção contra loops
- [X] Contrato `ILevelDefinition` type-safe
- [X] IntelliSense progressivo via `addExtraLib`

### ✅ FASE 2 — Conteúdo: Capítulos 1 e 2 (CONCLUÍDA)
- [X] Cap 1: The Basics (4 níveis)
- [X] Cap 2: Everyday Types (10 níveis)

### ✅ FASE 3 — Conteúdo: Capítulos 3, 4 e 5 (CONCLUÍDA)
- [X] Cap 3: Narrowing (6 níveis) — Uniões discriminadas, predicados, `never`.
- [X] Cap 4: Functions (4 níveis) — Overloads, Generics em funções, Rest params.
- [X] Cap 5: Object Types (5 níveis) — Property modifiers, Index signatures, Tuplas.

---

### 🟡 FASE 4 — Conteúdo: Capítulos 6 e 7
**Generics e Classes — O Drone se torna modular.**

#### 6. Generics (Capítulo 6)
- **Nível 6.1: Generic Classes**: Criar um hardware modular `Module<T>`.
- **Nível 6.2: Constraints**: Usar `T extends { weight: number }`.
- **Nível 6.3: Default types**: `Module<T = Default>`.

#### 7. Classes (Capítulo 7)
- **Nível 7.1: Inheritance**: Criar um `ScoutDrone` que estende `BaseDrone`.
- **Nível 7.2: Private/Protected**: Encapsular a bateria.
- **Nível 7.3: Absolute vs Static**: Usar métodos estáticos para transmissões de rede.

---

### 🔵 FASE 5 — Conteúdo: Capítulo 8 (Type Manipulation)
**Type Gymnastics — O nível final.**

No Capítulo 8, o drone entra em uma zona de alta interferência. O código JavaScript para de funcionar. O jogador deve resolver os problemas APENAS no sistema de tipos (Type-level programming).
- **Nível 8.1: keyof / typeof**: Mapear status dinamicamente.
- **Nível 8.2: Indexed Access**: Criar tipos a partir do inventário.
- **Nível 8.3: Conditional Types**: "Se material X, então carga Y".
- **Nível 8.4: Mapped Types**: Tornar todas as propriedades de um bloco `readonly`.

---

### 🎨 FASE 6 — UI/UX e Landing Page
- [ ] Finalizar `LandingPage.tsx` e integrá-lo com `react-router-dom`.
- [ ] Criar tela de "Game Over" temática e "Victory Screen" com medalhas históricas.
- [ ] Adicionar efeitos sonoros (opcional/placeholders).
- [ ] Polir o `InteractiveTutorial` para novos capítulos.

---

## Decisões Técnicas

- **Dynamic Injection**: O Sandbox agora injeta qualquer método da API automaticamente como global. Isso facilita muito a criação de níveis com APIs customizadas sem mexer no motor core.
- **Overloads**: O `scanDrone` suporta múltiplas assinaturas, provando que o transpiler real lidou bem com o código do jogador (o TypeScript Handbook usa muito overloads).

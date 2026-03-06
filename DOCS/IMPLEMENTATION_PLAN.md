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

### ✅ FASE 4 — Conteúdo: Capítulos 6 e 7 (CONCLUÍDA)
**Generics e Classes — O Drone se torna modular.**

- [X] Cap 6: Generics (6 níveis) — Constraints, Type variables, Generic Interfaces/Classes.
- [X] Cap 7: Classes (5 níveis) — Inheritance, Visibility, Abstract classes, Static members.

---

### ✅ FASE 5 — Conteúdo: Capítulo 8 (Type Manipulation) (CONCLUÍDA)
**Type Gymnastics — O nível final.**

- [X] Cap 8: Type Manipulation (6 níveis) — `keyof`, `typeof`, Indexed Access, Conditional Types, Mapped Types e Template Literals.

---

### 🟢 FASE 6 — UI/UX, Landing Page e Polimento
**Tornar o jogo um produto final de alto impacto.**

- [ ] Finalizar `LandingPage.tsx` e integrá-lo com `react-router-dom`.
- [ ] Criar tela de "Game Over" temática e "Victory Screen" com medalhas históricas.
- [ ] Implementar persistência de progresso no `localStorage`.
- [ ] Melhorar visual do Ground/Walls com texturas ou SVG dinâmico.
- [ ] README atualizado com instruções de contribuição.

---

## Decisões Técnicas

- **Dynamic Injection**: O Sandbox agora injeta qualquer método da API automaticamente como global. Isso facilita muito a criação de níveis com APIs customizadas sem mexer no motor core.
- **Overloads**: O `scanDrone` suporta múltiplas assinaturas, provando que o transpiler real lidou bem com o código do jogador (o TypeScript Handbook usa muito overloads).

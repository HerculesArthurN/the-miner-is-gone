# 📜 Implementation Plan — The Master is Gone

Este documento descreve o roteiro de desenvolvimento e o estado atual da forja rúnica.

## 🏛️ Visão Geral
**"The Master is Gone"** é um jogo educativo Local-First focado no ensino de TypeScript através de desafios práticos de automação.

## 🗺️ Mapa de Implementação

### 🟢 Fase 1: Fundação & Núcleo (Concluído)
- [x] Configuração do ambiente Vite + React + Tailwind.
- [x] Implementação do motor de jogo (GameEngine) baseado em Ticks.
- [x] Integração do Monaco Editor com suporte a tipos dinâmicos.
- [x] Sistema de transpilação in-browser (ts.transpileModule).
- [x] Sandbox de execução segura em Web Workers.

### 🟡 Fase 2: Atos do Grimório (Concluído)
- [x] **Capítulo 1: The Basics** (Fundamentos e Rigor)
- [x] **Capítulo 2: Everyday Types** (Tipos primitivos e Union Types)
- [x] **Capítulo 3: Narrowing** (Refinamento de tipos e Type Guards)
- [x] **Capítulo 4: More on Functions** (Assinaturas, Sobrecarga e Callbacks)
- [x] **Capítulo 5: Object Types** (Interfaces, Extensões e Tuplas)
- [x] **Capítulo 6: Generics** (Abstrações universais e Constraints)
- [x] **Capítulo 7: Classes** (Arquitetura de hardware e Herança)
- [x] **Capítulo 8: Type Manipulation** (Conditional/Mapped Types e Template Literals)

### 🔵 Fase 3: Estética & Imersão (Concluído)
- [x] Identidade visual "Bright Fantasy Scriptorium".
- [x] Efeitos de animação rúnica com Framer Motion.
- [x] Sistema de terminal narrativo.
- [x] HUD de feedback visual para o Golem.

### 🟣 Fase 4: Finalização & Polimento (Atual)
- [x] Revisão total da documentação (PRD e README).
- [x] Tradução de terminologias para manter a atmosfera de Guilda.
- [x] Otimização de performance no Grid.
- [x] Validação final de todos os 50+ níveis.

## 🛠️ Stack Tecnológica
- **UI:** React 18 + Tailwind CSS 4.
- **Estado:** Zustand (Global) + LocalStorage (Persistência).
- **Editor:** @monaco-editor/react.
- **Animações:** Framer Motion.
- **Tipagem:** TypeScript 5.8+.

## ⚙️ Diretrizes de Manutenção
1. **Novos Níveis:** Devem ser adicionados em `src/levels/chapter-N/index.ts`.
2. **Assets:** Devem ser mantidos em `public/assets/` em formato PNG/PNG.
3. **Tipos de Nível:** Devem seguir a interface `ILevelDefinition` definida em `src/types/level.ts`.

---
*Assinado, o Aprendiz Forjador.*

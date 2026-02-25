# 🤖 The Miner is Gone — Chapter 1 & 2

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **"O engenheiro-chefe sumiu. Só resta a documentação. Salve a operação mineradora usando o poder da tipagem estática."**

**The Miner is Gone** é um jogo educativo de automação onde você programa drones mineradores usando **TypeScript**. Mais do que um simples tutorial, o jogo é uma transposição interativa do **TypeScript Handbook Oficial**.

---

## 💎 A Filosofia: "Read the Docs"

Diferente de cursos tradicionais, aqui a documentação é sua melhor amiga. Cada nível é mapeado diretamente para uma seção específica do Handbook.

```text
Documentação 📖 → Missão 🎯 → Código 💻 → Consequência Visual 🚀 → Compreensão ✅
```

Ao completar o jogo, você terá percorrido integralmente os capítulos fundamentais do TypeScript, transformando a leitura técnica em memória muscular.

---

## 🛠️ Mecânicas de Jogo

### ⌨️ IntelliSense Progressivo
O editor (Monaco) é configurado para injetar tipos dinamicamente. No Capítulo 1, você tem acesso apenas ao básico. Conforme avança no Handbook, novas APIs e tipos complexos são desbloqueados no seu IntelliSense.

### 🔋 Gestão de Recursos (Ticks & Bateria)
Cada comando (`move`, `mine`, `scan`) consome bateria e tempo (ticks). O objetivo não é apenas resolver o problema, mas criar algoritmos eficientes. Códigos com complexidade desnecessária (O(n²)) causam superaquecimento no drone!

### 🥇 Sistema de Ranking
- 🥉 **Bronze**: Missão concluída.
- 🥈 **Prata**: Missão concluída + **Zero `any`** (Código estritamente tipado).
- 🥇 **Ouro**: Prata + Eficiência algorítmica (limite de ticks/bateria).

---

## 🚀 Tecnologias

- **Frontend**: React 18, Tailwind CSS, Framer Motion.
- **IDE In-Game**: Monaco Editor (o motor por trás do VS Code).
- **Compilação**: Transpilação em tempo real no browser via `typescript` compiler API.
- **Estado**: Zustand para uma engine tick-based performática.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/HerculesArthurN/the-miner-is-gone.git
cd the-miner-is-gone
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o ambiente:
Crie um arquivo `.env.local` na raiz e adicione sua chave do Gemini (necessária para algumas funcionalidades de IA de apoio):
```env
GEMINI_API_KEY=sua_chave_aqui
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

---

## 🗺️ Mapa de Progresso (Atualmente em Desenvolvimento)

- [x] **Capítulo 1: The Basics** (Fundamentos, Static Checking, Strictness)
- [x] **Capítulo 2: Everyday Types** (Primitives, Unions, Aliases, Interfaces)
- [ ] **Capítulo 3: Narrowing** (Type Guards, Discriminated Unions)
- [ ] **Capítulo 4: More on Functions**
- [ ] ... e mais 4 capítulos planejados.

---

## 👤 Autor

**Hercules Arthur Nardelli**
*Engenheiro de Software em Formação | Especialista em PWA & Local-First Architecture*

---
*Este projeto é uma jornada de aprendizado inspirada pela excelência técnica do TypeScript Handbook.*

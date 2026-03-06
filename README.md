# 🏰 The Miner is Gone — A Forja Rúnica

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **"O Mestre Forjador sumiu. Só resta o antigo Grimório. Salve a forja operando Golens ancestrais com a magia da tipagem estrita."**

**The Miner is Gone** é um jogo educativo com estética Medieval Clássica e Brilhante (RPGs 16-bits), onde você escreve "Magia Rúnica" (**TypeScript**) para controlar Golens mineradores. Mais do que um simples tutorial, o jogo é uma transposição interativa do **TypeScript Handbook Oficial**.

---

## 💎 A Filosofia: "Ler os Antigos Pergaminhos"

Diferente de cursos tradicionais, aqui a documentação é sua melhor amiga. Cada nível é mapeado diretamente para uma seção específica do Handbook.

```text
Documentação 📖 → Missão 🎯 → Código 💻 → Consequência Visual 🚀 → Compreensão ✅
```

Ao completar o jogo, você terá percorrido integralmente os capítulos fundamentais do TypeScript, transformando a leitura técnica em memória muscular.

---

## 🛠️ Mecânicas de Jogo

### ⌨️ Magia Progressiva (IntelliSense)
O editor (Scriptorium/Monaco) é configurado para injetar tipos dinamicamente. No Ato I, você tem acesso apenas aos feitiços básicos. Conforme avança no Handbook, novas APIs e magias complexas são desbloqueadas no seu IntelliSense.

### 🔋 Gestão de Energia (Ticks & Estamina)
Cada instrução (`move`, `mine`, `scan`) consome a estamina e o ritmo (ticks) do Golem. O objetivo não é apenas resolver o problema, mas tecer encantamentos eficientes. Códigos com complexidade desnecessária (O(n²)) superaquecem as runas do constructo!

### 🥇 Chancelas de Mestre (Medalhas)
- 🥉 **Bronze**: Missão concluída.
- 🥈 **Prata**: Magia pura — Código estritamente tipado, com **Zero `any`**.
- 🥇 **Ouro**: Magia lendária — Prata + Eficiência rítmica (limite rigoroso de ticks/bateria).

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

3. Configure o ambiente (opcional):
Crie um arquivo `.env.local` na raiz caso no futuro necessite alguma variável específica de backend. Por ora, o jogo é **Local-First** e roda inteiramente no navegador do aprendiz.

4. Acenda as tochas da forja:
```bash
npm run dev
```

---

## 🗺️ Os Atos do Grimório (Conteúdo Completo 1.0)

- [x] **Ato 1: Primeiros Rituais** (The Basics, Types, Strictness) - 4 níveis
- [x] **Ato 2: Feitiços Básicos** (Everyday Types, Unions, Interfaces) - 10 níveis
- [x] **Ato 3: A Arte do Foco** (Narrowing, Type Guards, Discriminations) - 6 níveis
- [x] **Ato 4: Comandos Complexos** (More on Functions, Overloads, Generics) - 4 níveis
- [x] **Ato 5: Tipos de Matéria** (Object Types, Modifiers, Tuples) - 5 níveis
- [x] **Ato 6: Magia Universal** (Generics Constraints e Variáveis) - 6 níveis
- [x] **Ato 7: Estruturas da Guilda** (Classes, Inheritance, Abstract) - 5 níveis
- [x] **Ato 8: Cânticos Superiores** (Type Manipulation, Mapped/Conditional Types) - 6 níveis

Todos os capítulos implementados com validação por Transpiler real no browser!

---

## 👤 Autor

**Hercules Arthur Nardelli**
*Engenheiro de Software em Formação | Especialista em PWA & Local-First Architecture*

---
*Este projeto é uma jornada de aprendizado inspirada pela excelência técnica do TypeScript Handbook.*

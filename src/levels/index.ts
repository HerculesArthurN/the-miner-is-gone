/**
 * Índice central de todos os capítulos e níveis do jogo.
 * 
 * Para adicionar um novo capítulo/nível:
 * 1. Crie o arquivo em /src/levels/chapter-N/index.ts
 * 2. Exporte o array de níveis
 * 3. Importe e adicione ao ALL_CHAPTERS aqui
 * 
 * O motor de jogo NÃO precisa ser modificado.
 */

import { chapter1Levels } from './chapter-1';
import { chapter2Levels } from './chapter-2';
import { chapter3Levels } from './chapter-3';
import { chapter4Levels } from './chapter-4';
import { chapter5Levels } from './chapter-5';
import { ILevelDefinition, IChapterDefinition } from '../types/level';

// ─── Definição dos Capítulos ──────────────────────────────────────────────────

export const ALL_CHAPTERS: IChapterDefinition[] = [
    {
        chapter: 1,
        title: 'The Basics',
        environment: 'A superfície da mina. Luz natural, corredores retos, sem perigos.',
        levels: chapter1Levels,
    },
    {
        chapter: 2,
        title: 'Everyday Types',
        environment: 'Primeiros túneis. Fog of War leve. Minérios de tipos diferentes.',
        levels: chapter2Levels,
    },
    {
        chapter: 3,
        title: 'Narrowing',
        environment: 'Setores instáveis. Requer análise rigorosa de tipos para evitar falhas de runtime.',
        levels: chapter3Levels,
    },
    {
        chapter: 4,
        title: 'More on Functions',
        environment: 'Sistemas de comando avançados. Automação e sobrecarga de sensores.',
        levels: chapter4Levels,
    },
    {
        chapter: 5,
        title: 'Object Types',
        environment: 'Estruturas de dados complexas. Contêineres genéricos e tuplas de navegação.',
        levels: chapter5Levels,
    },
    // Capítulos futuros — adicione aqui quando implementados:
    // { chapter: 6, title: 'Generics', ... },
    // { chapter: 7, title: 'Classes', ... },
    // { chapter: 8, title: 'Type Manipulation', ... },
];

// ─── Lista plana de todos os níveis ──────────────────────────────────────────

export const ALL_LEVELS: ILevelDefinition[] = ALL_CHAPTERS.flatMap(c => c.levels);

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLevelById(id: string): ILevelDefinition | undefined {
    return ALL_LEVELS.find(l => l.id === id);
}

export function getChapter(chapter: number): IChapterDefinition | undefined {
    return ALL_CHAPTERS.find(c => c.chapter === chapter);
}

export function getFirstLevelOfChapter(chapter: number): ILevelDefinition | undefined {
    return getChapter(chapter)?.levels[0];
}

export function getNextLevel(currentId: string): ILevelDefinition | undefined {
    const idx = ALL_LEVELS.findIndex(l => l.id === currentId);
    if (idx === -1 || idx >= ALL_LEVELS.length - 1) return undefined;
    return ALL_LEVELS[idx + 1];
}

export function getPreviousLevel(currentId: string): ILevelDefinition | undefined {
    const idx = ALL_LEVELS.findIndex(l => l.id === currentId);
    if (idx <= 0) return undefined;
    return ALL_LEVELS[idx - 1];
}

export const FIRST_LEVEL = ALL_LEVELS[0];
export const TOTAL_LEVELS = ALL_LEVELS.length;

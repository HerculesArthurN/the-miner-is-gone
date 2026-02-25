/**
 * Sandbox de execução segura para o código do jogador.
 * 
 * Atualizado para suportar injeção dinâmica de métodos (para maior escalabilidade).
 */

import { LogType } from '../../types/game';

// ─── Tipos da API do Jogo ─────────────────────────────────────────────────────

export interface ScanResult {
    type: string;
    kind?: string; // Para Chapter 3
    purity?: number;
    density?: number;
    dangerLevel?: number;
    isotopeId?: string;
}

export interface GameAPI {
    move: (x: number, y: number) => Promise<void>;
    mine: (material?: string) => Promise<void>;
    scan: (dx?: number, dy?: number | { x: number; y: number }) => Promise<ScanResult | null>;
    transmit: (data: unknown) => void;
    log: (type: LogType, message: string) => void;
    // Suporte para métodos dinâmicos adicionados por capítulos específicos
    [key: string]: any;
}

// ─── Configuração do Sandbox ──────────────────────────────────────────────────

const EXECUTION_TIMEOUT_MS = 10000; // Aumentado para 10s para níveis complexos
const MAX_API_CALLS = 20_000;

const THEMED_ERRORS = {
    timeout: '⚠️ ALERTA: Sobrecarga crítica do sistema de navegação. O Computador de Bordo não respondeu em 10s. Deploy abortado.',
    maxCalls: '🔥 THERMAL SHUTDOWN: Limite de 20.000 operações atingido. Possível loop infinito detectado.',
    wallCollision: '🪨 COLISÃO: Lâmina de tungstênio em contato com parede de granito.',
    outOfBounds: '🚨 ALERTA DE LIMITE: O drone tentou sair dos limites da mina.',
    batteryDead: '🔋 BATERIA CRÍTICA: Energia insuficiente para continuar a operação.',
    runtimeError: (msg: string) => `💥 FALHA DE RUNTIME: ${msg}`,
};

// ─── Executor Principal ───────────────────────────────────────────────────────

export interface SandboxResult {
    success: boolean;
    error?: string;
    apiCallCount: number;
}

export async function executeSandbox(
    jsCode: string,
    api: GameAPI
): Promise<SandboxResult> {
    let callCount = 0;

    // Proxy para contagem de chamadas e proteção
    const proxyHandler: ProxyHandler<GameAPI> = {
        get(target, prop: string) {
            const original = target[prop];
            if (typeof original === 'function') {
                return (...args: any[]) => {
                    callCount++;
                    if (callCount > MAX_API_CALLS) throw new Error(THEMED_ERRORS.maxCalls);
                    return original.apply(target, args);
                };
            }
            return original;
        }
    };

    const protectedApi = new Proxy(api, proxyHandler);

    // Identifica todos os métodos da API para injetar como globais
    const apiMethods = Object.keys(api).filter(key => typeof api[key] === 'function');

    // Console seguro
    const safeConsole = {
        log: (...args: any[]) => api.log('info', args.map(String).join(' ')),
        warn: (...args: any[]) => api.log('warning', args.map(String).join(' ')),
        error: (...args: any[]) => api.log('error', args.map(String).join(' ')),
    };

    try {
        // Cria a função com os nomes dos métodos como argumentos
        const userFn = new Function(
            ...apiMethods,
            'api',
            'console',
            `
            "use strict";
            return (async () => {
                ${jsCode}
            })();
            `
        );

        // Prepara os valores correspondentes aos nomes dos métodos
        const methodValues = apiMethods.map(name => protectedApi[name]);

        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(THEMED_ERRORS.timeout)), EXECUTION_TIMEOUT_MS)
        );

        await Promise.race([
            userFn(...methodValues, protectedApi, safeConsole),
            timeoutPromise,
        ]);

        return { success: true, apiCallCount: callCount };
    } catch (err: any) {
        const message = err.message || String(err);
        let themedMessage = message;

        if (message.includes('wall') || message.includes('parede')) themedMessage = THEMED_ERRORS.wallCollision;
        else if (message.includes('bounds') || message.includes('limite')) themedMessage = THEMED_ERRORS.outOfBounds;
        else if (message.includes('battery') || message.includes('bateria')) themedMessage = THEMED_ERRORS.batteryDead;
        else if (!message.includes('⚠️') && !message.includes('🔥')) themedMessage = THEMED_ERRORS.runtimeError(message);

        return { success: false, error: themedMessage, apiCallCount: callCount };
    }
}

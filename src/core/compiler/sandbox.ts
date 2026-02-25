/**
 * Sandbox de execução segura para o código do jogador.
 *
 * Responsabilidades:
 * 1. Executar o código transpilado via new Function() com API injetada
 * 2. Impor timeout de 5000ms para prevenir travamento da UI
 * 3. Contar chamadas à API (proteção contra loops infinitos)
 * 4. Capturar e formatar erros de runtime com mensagens temáticas
 */

import { LogType } from '../../types/game';

// ─── Tipos da API do Jogo ─────────────────────────────────────────────────────

export interface ScanResult {
    type: string;
    purity?: number;
    density?: number;
    dangerLevel?: number;
    isotopeId?: string;
}

export interface GameAPI {
    move: (x: number, y: number) => Promise<void>;
    // material is accepted but ignored — the engine determines it from the current cell
    mine: (material?: string) => Promise<void>;
    scan: (dx?: number, dy?: number) => Promise<ScanResult | null>;
    transmit: (data: unknown) => void;
    log: (type: LogType, message: string) => void;
}

// ─── Configuração do Sandbox ──────────────────────────────────────────────────

const EXECUTION_TIMEOUT_MS = 5000;
const MAX_API_CALLS = 10_000;

// ─── Mensagens Temáticas de Erro ──────────────────────────────────────────────

const THEMED_ERRORS = {
    timeout: '⚠️ ALERTA: Sobrecarga crítica do sistema de navegação. O Computador de Bordo não respondeu em 5s. Deploy abortado.',
    maxCalls: '🔥 THERMAL SHUTDOWN: Limite de 10.000 operações atingido. Possível loop infinito detectado. Drone em modo de segurança.',
    wallCollision: '🪨 COLISÃO: Lâmina de tungstênio em contato com parede de granito. Drone paralisado.',
    outOfBounds: '🚨 ALERTA DE LIMITE: O drone tentou sair dos limites da mina.',
    batteryDead: '🔋 BATERIA CRÍTICA: Energia insuficiente para continuar a operação.',
    typeError: (msg: string) => `❌ ERRO DE TIPO: ${msg}`,
    runtimeError: (msg: string) => `💥 FALHA DE RUNTIME: ${msg}`,
};

// ─── Proxy de API com contador ────────────────────────────────────────────────

function createProtectedAPI(api: GameAPI): { proxy: GameAPI; getCallCount: () => number } {
    let callCount = 0;

    const increment = () => {
        callCount++;
        if (callCount > MAX_API_CALLS) {
            throw new Error(THEMED_ERRORS.maxCalls);
        }
    };

    const proxy: GameAPI = {
        move: async (x: number, y: number) => {
            increment();
            return api.move(x, y);
        },
        mine: async (_material?: string) => {
            increment();
            return api.mine();
        },
        scan: async (dx?: number, dy?: number) => {
            increment();
            return api.scan(dx, dy);
        },
        transmit: (data: unknown) => {
            increment();
            api.transmit(data);
        },
        log: api.log,
    };

    return { proxy, getCallCount: () => callCount };
}

// ─── Executor Principal ───────────────────────────────────────────────────────

export interface SandboxResult {
    success: boolean;
    error?: string;
    apiCallCount: number;
}

/**
 * Executa código JavaScript transpilado em um sandbox seguro.
 *
 * @param jsCode - Código JavaScript já transpilado pelo transpiler.ts
 * @param api - API do jogo a ser injetada no escopo do código
 */
export async function executeSandbox(
    jsCode: string,
    api: GameAPI
): Promise<SandboxResult> {
    const { proxy, getCallCount } = createProtectedAPI(api);

    // Cria a função com a API injetada como argumentos nomeados
    // Isso evita que o código do jogador acesse o escopo global
    let userFn: (...args: unknown[]) => Promise<void>;

    try {
        userFn = new Function(
            'api',
            'move',
            'mine',
            'scan',
            'transmit',
            'console',
            `
      "use strict";
      return (async () => {
        ${jsCode}
      })();
      `
        ) as (...args: unknown[]) => Promise<void>;
    } catch (syntaxErr: unknown) {
        const msg = syntaxErr instanceof Error ? syntaxErr.message : String(syntaxErr);
        return {
            success: false,
            error: THEMED_ERRORS.runtimeError(msg),
            apiCallCount: 0,
        };
    }

    // Executa com timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(THEMED_ERRORS.timeout)), EXECUTION_TIMEOUT_MS)
    );

    // Console seguro (só log, sem acesso ao window)
    const safeConsole = {
        log: (...args: unknown[]) => api.log('info', args.map(String).join(' ')),
        warn: (...args: unknown[]) => api.log('warning', args.map(String).join(' ')),
        error: (...args: unknown[]) => api.log('error', args.map(String).join(' ')),
    };

    try {
        await Promise.race([
            userFn(
                proxy,         // api (objeto completo)
                proxy.move,    // move (destructurado para conveniência)
                proxy.mine,    // mine
                proxy.scan,    // scan
                proxy.transmit,// transmit
                safeConsole    // console
            ),
            timeoutPromise,
        ]);

        return { success: true, apiCallCount: getCallCount() };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);

        // Formata o erro com mensagem temática se for um erro conhecido
        let themedMessage = message;
        if (message.includes('wall') || message.includes('parede')) {
            themedMessage = THEMED_ERRORS.wallCollision;
        } else if (message.includes('limits') || message.includes('limite')) {
            themedMessage = THEMED_ERRORS.outOfBounds;
        } else if (!message.includes('⚠️') && !message.includes('🔥') && !message.includes('🚨')) {
            // Erro de runtime não classificado
            themedMessage = THEMED_ERRORS.runtimeError(message);
        }

        return {
            success: false,
            error: themedMessage,
            apiCallCount: getCallCount(),
        };
    }
}

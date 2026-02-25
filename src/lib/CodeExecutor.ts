/**
 * CodeExecutor — orquestra transpilação + execução segura.
 *
 * Pipeline:
 * 1. Verificar padrões proibidos no código (medalha)
 * 2. Transpilar TypeScript → JavaScript usando ts.transpileModule
 * 3. Executar no sandbox com timeout e proteção contra loops
 * 4. Retornar resultado com metadados de performance
 */

import { transpileTypeScript } from '../core/compiler/transpiler';
import { executeSandbox, GameAPI } from '../core/compiler/sandbox';
import { LogType } from '../types/game';

export interface ExecutionResult {
  success: boolean;
  error?: string;
  apiCallCount: number;
  hasForbiddenPatterns: boolean;
  forbiddenFound: string[];
}

/**
 * Verifica se o código contém padrões proibidos (para avaliação de medalha).
 */
function detectForbiddenPatterns(code: string, patterns: string[]): string[] {
  return patterns.filter(pattern => {
    // Evita false positives em strings e comentários para casos simples
    const regex = new RegExp(`(?<!['"\/\*])\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    return regex.test(code);
  });
}

/**
 * API pública do executor — aceita o código TypeScript do jogador e executa.
 */
export class CodeExecutor {
  static async execute(
    tsCode: string,
    api: GameAPI & { log: (type: LogType, msg: string) => void },
    forbiddenPatterns: string[] = []
  ): Promise<ExecutionResult> {
    // 1. Detectar padrões proibidos
    const forbiddenFound = detectForbiddenPatterns(tsCode, forbiddenPatterns);
    if (forbiddenFound.length > 0) {
      api.log('warning', `⚠️ Padrões proibidos detectados: ${forbiddenFound.join(', ')} — medalha Ouro/Prata bloqueada.`);
    }

    // 2. Transpilar
    api.log('system', '🔧 Compilando...');
    const transpileResult = await transpileTypeScript(tsCode);

    if (!transpileResult.success) {
      api.log('error', transpileResult.error ?? 'Falha na compilação.');
      return {
        success: false,
        error: transpileResult.error,
        apiCallCount: 0,
        hasForbiddenPatterns: forbiddenFound.length > 0,
        forbiddenFound,
      };
    }

    api.log('system', '✅ Compilação bem-sucedida. Iniciando deploy...');

    // 3. Executar no sandbox
    const sandboxResult = await executeSandbox(transpileResult.code, api);

    if (!sandboxResult.success) {
      api.log('error', sandboxResult.error ?? 'Falha na execução.');
    }

    return {
      success: sandboxResult.success,
      error: sandboxResult.error,
      apiCallCount: sandboxResult.apiCallCount,
      hasForbiddenPatterns: forbiddenFound.length > 0,
      forbiddenFound,
    };
  }
}

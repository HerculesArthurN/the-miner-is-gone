/**
 * Transpiler seguro usando ts.transpileModule da API oficial do TypeScript.
 *
 * ⚠️ IMPORTANTE: Regex para remover tipos TypeScript é PROIBIDO pelo PRD.
 * Regex falha com Generics, Conditional Types e Mapped Types.
 *
 * Esta implementação usa a API oficial e suporta toda a sintaxe TypeScript,
 * incluindo:
 *   - Generics: function id<T extends Obj>(x: T): T
 *   - Conditional Types: T extends U ? X : Y
 *   - Mapped Types: { [K in keyof T]: V }
 *   - Template Literal Types: `prefix_${string}`
 *   - Decorators, abstract classes, etc.
 */

// ts.transpileModule é importado dinamicamente para tree-shaking
// O Vite incluirá apenas o necessário (~400KB gzipped)
let tsCompiler: typeof import('typescript') | null = null;

async function getTypeScriptCompiler() {
    if (!tsCompiler) {
        tsCompiler = await import('typescript');
    }
    return tsCompiler;
}

export interface TranspileResult {
    success: boolean;
    code: string;
    error?: string;
}

/**
 * Transpila código TypeScript para JavaScript ES2020 usando ts.transpileModule.
 *
 * @param tsCode - Código TypeScript escrito pelo jogador
 * @returns Resultado da transpilação com o código JS ou erro
 */
export async function transpileTypeScript(tsCode: string): Promise<TranspileResult> {
    try {
        const ts = await getTypeScriptCompiler();

        const result = ts.transpileModule(tsCode, {
            compilerOptions: {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.None, // código de top-level para new Function()
                strict: true,
                noImplicitAny: true,
                strictNullChecks: true,
                experimentalDecorators: true,
                // Não emitir declarações ou source maps — apenas o JS
                declaration: false,
                declarationMap: false,
                sourceMap: false,
                removeComments: false,
            },
            // diagnostics são erros de transpilação (não de type-checking)
            // A validação de tipos acontece no Monaco Editor (LSP)
            reportDiagnostics: true,
        });

        // Se ts.transpileModule reportou erros sintáticos (não de tipo)
        if (result.diagnostics && result.diagnostics.length > 0) {
            const firstError = result.diagnostics[0];
            const message = typeof firstError.messageText === 'string'
                ? firstError.messageText
                : firstError.messageText.messageText;
            return {
                success: false,
                code: '',
                error: `Erro de Sintaxe: ${message}`,
            };
        }

        return {
            success: true,
            code: result.outputText,
        };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            success: false,
            code: '',
            error: `Falha crítica no transpiler: ${message}`,
        };
    }
}

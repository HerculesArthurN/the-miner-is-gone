// Simple regex-based transpiler for the MVP
// This avoids bundling the entire TypeScript compiler (60MB+) for the browser
const simpleTranspile = (code: string): string => {
  // Remove type annotations: ": string", ": number", ": void", etc.
  // This is a very basic regex and won't handle complex cases, but works for the MVP commands.
  let jsCode = code
    // Remove variable type annotations: let x: number = 1 -> let x = 1
    .replace(/:\s*[a-zA-Z]+/g, '')
    // Remove return types: ): void -> )
    .replace(/\):\s*[a-zA-Z]+/g, ')')
    // Remove 'as' assertions: x as number -> x
    .replace(/\s+as\s+[a-zA-Z]+/g, '');
    
  return jsCode;
};

// Define log types
export type LogType = 'info' | 'success' | 'warning' | 'error';

// Define the API available to the user
export interface GameAPI {
  move: (x: number, y: number) => Promise<void>;
  mine: (material: string) => Promise<void>;
  scan: () => { material: string, purity: number, dangerLevel: number } | null;
  log: (type: LogType, message: string) => void;
}

/**
 * LogManager handles structured logging for the game execution.
 */
class LogManager {
  constructor(private apiLog: (type: LogType, message: string) => void) {}

  info(message: string) {
    this.apiLog('info', message);
  }

  success(message: string) {
    this.apiLog('success', message);
  }

  warning(message: string) {
    this.apiLog('warning', message);
  }

  error(message: string) {
    this.apiLog('error', message);
  }

  /**
   * Formats a message with a timestamp for internal logging if needed.
   */
  private format(message: string): string {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `[${time}] ${message}`;
  }
}

export class CodeExecutor {
  static async execute(code: string, api: GameAPI) {
    const logger = new LogManager(api.log);

    try {
      // 1. Transpile TypeScript to JavaScript (Simulated)
      const jsCode = simpleTranspile(code);

      // 2. Command Queue System
      const commandQueue: (() => Promise<void>)[] = [];
      
      const queuedApi = {
        move: (x: number, y: number) => {
          const p = api.move(x, y);
          commandQueue.push(() => p);
          return p; 
        },
        mine: (material: string) => {
          const p = api.mine(material);
          commandQueue.push(() => p);
          return p;
        },
        scan: () => {
           // Synchronous logic
           const result = api.scan();
           
           // Queue visual feedback
           commandQueue.push(async () => {
             logger.info('Iniciando escaneamento de setor...');
             await new Promise(resolve => setTimeout(resolve, 300));
             if (result) {
               logger.success(`Scanner: ${result.material} (${result.purity}%) detectado. Perigo: ${result.dangerLevel}%`);
             } else {
               logger.warning('Scanner: Setor vazio ou sinal obstruído.');
             }
           });
           
           return result;
        },
        log: (msg: string) => logger.info(msg)
      };

      // Create the function with the queued API
      const runUserCode = new Function('move', 'mine', 'scan', 'console', `
        return (async () => {
          ${jsCode}
        })();
      `);
      
      // Execute the user code
      const userPromise = runUserCode(
        queuedApi.move, 
        queuedApi.mine, 
        queuedApi.scan,
        { log: queuedApi.log }
      );

      // Wait for the user code to finish executing (creating all promises)
      await userPromise;

      // Wait for all visual effects to finish
      // We execute them sequentially
      for (const command of commandQueue) {
        await command();
      }

    } catch (err: any) {
      logger.error(err.message || 'Falha crítica na execução do script.');
      throw err;
    }
  }
}

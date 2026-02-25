import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, GameStatus, Cell, CellType, DroneState, Medal, LogType } from '../types/game';
import { ILevelDefinition } from '../types/level';
import { ALL_LEVELS, getNextLevel, FIRST_LEVEL } from '../levels';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Cria o grid 2D de Cell[][] a partir do array declarativo de CellType[][] do nível */
function buildGridFromLevel(level: ILevelDefinition): Cell[][] {
  return level.initialGrid.map((row, y) =>
    row.map((type, x): Cell => ({
      x,
      y,
      type,
      revealed: type !== 'fog', // células não-fog começam reveladas
    }))
  );
}

function buildInitialDroneState(level: ILevelDefinition): DroneState {
  return {
    x: level.droneStart.x,
    y: level.droneStart.y,
    battery: level.hardware.maxBattery,
    cargo: [],
    ticksUsed: 0,
  };
}

function buildInitialGameState(level: ILevelDefinition): GameState {
  return {
    drone: buildInitialDroneState(level),
    grid: buildGridFromLevel(level),
    logs: [],
    status: 'idle',
    ticksUsed: 0,
    batteryUsed: 0,
    medal: 'none',
  };
}

// ─── Custos de Ação ───────────────────────────────────────────────────────────

const BATTERY_COSTS = {
  move: 10,
  mine: 15,
  scan: 5,
  transmit: 0,
} as const;

// ─── Hook Principal ───────────────────────────────────────────────────────────

export const useGameEngine = () => {
  const [currentLevelId, setCurrentLevelId] = useState<string>(FIRST_LEVEL.id);
  const currentLevel = ALL_LEVELS.find(l => l.id === currentLevelId) ?? FIRST_LEVEL;

  // Estado React para renderização da UI
  const [gameState, setGameState] = useState<GameState>(() =>
    buildInitialGameState(currentLevel)
  );

  // Ref para lógica síncrona de execução (evita closure stale em callbacks)
  const logicRef = useRef({
    drone: buildInitialDroneState(currentLevel),
    grid: buildGridFromLevel(currentLevel),
    apiCallCount: 0,
  });

  // Reset ao mudar de nível
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelId]);

  // ─── Log ────────────────────────────────────────────────────────────────────

  const addLog = useCallback((type: LogType, message: string) => {
    setGameState(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          id: Math.random().toString(36).slice(2, 9),
          type,
          message,
          timestamp: Date.now(),
        },
      ],
    }));
  }, []);

  // ─── Reset ──────────────────────────────────────────────────────────────────

  const resetGame = useCallback(() => {
    const level = ALL_LEVELS.find(l => l.id === currentLevelId) ?? FIRST_LEVEL;
    const initialState = buildInitialGameState(level);

    logicRef.current = {
      drone: buildInitialDroneState(level),
      grid: buildGridFromLevel(level),
      apiCallCount: 0,
    };

    setGameState(initialState);
  }, [currentLevelId]);

  // ─── Move ────────────────────────────────────────────────────────────────────

  const moveDrone = useCallback(async (x: number, y: number): Promise<void> => {
    const level = ALL_LEVELS.find(l => l.id === currentLevelId) ?? FIRST_LEVEL;
    const gridSize = { rows: level.initialGrid.length, cols: level.initialGrid[0].length };

    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error(`Erro de Tipo: coordenadas devem ser números. Recebido: x=${typeof x}, y=${typeof y}`);
    }

    if (x < 0 || x >= gridSize.cols || y < 0 || y >= gridSize.rows) {
      throw new Error(`🚨 ALERTA DE LIMITE: O drone tentou sair dos limites em [${x}, ${y}].`);
    }

    const cell = logicRef.current.grid[y][x];
    if (cell.type === 'wall') {
      throw new Error(`🪨 COLISÃO: Lâmina de tungstênio em contato com parede de granito em [${x}, ${y}].`);
    }

    // Atualiza estado lógico imediatamente
    logicRef.current.drone.x = x;
    logicRef.current.drone.y = y;
    logicRef.current.drone.battery -= BATTERY_COSTS.move;
    logicRef.current.drone.ticksUsed++;
    logicRef.current.apiCallCount++;

    if (logicRef.current.drone.battery <= 0) {
      throw new Error('🔋 BATERIA CRÍTICA: Energia insuficiente para continuar a operação.');
    }

    // Anima na UI com delay
    await new Promise(resolve => setTimeout(resolve, 300));

    setGameState(prev => ({
      ...prev,
      drone: { ...prev.drone, x, y, ticksUsed: prev.drone.ticksUsed + 1, battery: prev.drone.battery - BATTERY_COSTS.move },
      batteryUsed: prev.batteryUsed + BATTERY_COSTS.move,
      ticksUsed: prev.ticksUsed + 1,
    }));

    addLog('info', `Drone → [${x}, ${y}]`);
  }, [addLog, currentLevelId]);

  // ─── Mine ────────────────────────────────────────────────────────────────────

  const mineDrone = useCallback(async (_material?: string): Promise<void> => {
    const { x, y } = logicRef.current.drone;
    const cell = logicRef.current.grid[y][x];

    const MINABLE: CellType[] = ['iron', 'gold', 'crystal', 'isotope'];
    if (!MINABLE.includes(cell.type)) {
      throw new Error(`Erro de Sensor: nada para minerar em [${x}, ${y}]. Célula: ${cell.type}`);
    }

    if (cell.dangerLevel && cell.dangerLevel > 50) {
      throw new Error(`💥 EXPLOSÃO: bloco instável em [${x}, ${y}]. Perigo: ${cell.dangerLevel}%.`);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    // Remove do grid lógico
    logicRef.current.grid[y][x] = { ...cell, type: 'empty' };
    logicRef.current.drone.battery -= BATTERY_COSTS.mine;
    logicRef.current.drone.ticksUsed++;
    logicRef.current.apiCallCount++;

    // Adiciona ao cargo lógico
    const existing = logicRef.current.drone.cargo.find(c => c.type === cell.type);
    if (existing) {
      existing.quantity++;
    } else {
      logicRef.current.drone.cargo.push({ type: cell.type, quantity: 1 });
    }

    // Atualiza UI
    setGameState(prev => {
      const newGrid = prev.grid.map(row => row.map(c => ({ ...c })));
      newGrid[y][x] = { ...newGrid[y][x], type: 'empty' };

      const newDrone: DroneState = {
        ...prev.drone,
        battery: prev.drone.battery - BATTERY_COSTS.mine,
        ticksUsed: prev.drone.ticksUsed + 1,
        cargo: [...logicRef.current.drone.cargo],
      };

      const newState: GameState = {
        ...prev,
        grid: newGrid,
        drone: newDrone,
        batteryUsed: prev.batteryUsed + BATTERY_COSTS.mine,
        ticksUsed: prev.ticksUsed + 1,
      };

      // Verifica vitória
      const level = ALL_LEVELS.find(l => l.id === currentLevelId) ?? FIRST_LEVEL;
      if (level.victoryCondition(newState)) {
        // Calcula medalha
        const hasForbidden = false; // verificado pelo CodeExecutor antes
        const withinBattery = newState.batteryUsed <= level.scoring.gold.maxBatteryUsed;
        const withinTicks = newState.ticksUsed <= level.scoring.gold.maxTicks;
        const medal: Medal =
          withinBattery && withinTicks ? 'gold' :
            !hasForbidden ? 'silver' :
              'bronze';

        return { ...newState, status: 'success', medal };
      }

      return newState;
    });

    addLog('success', `⛏️ Coletado: ${cell.type} em [${x}, ${y}]`);
  }, [addLog, currentLevelId]);

  // ─── Scan ─────────────────────────────────────────────────────────────────────

  const scanDrone = useCallback(async (dxOrConfig: number | { x: number; y: number } = 0, dy = 0) => {
    const { x, y } = logicRef.current.drone;
    let targetX: number;
    let targetY: number;

    if (typeof dxOrConfig === 'object') {
      targetX = dxOrConfig.x;
      targetY = dxOrConfig.y;
    } else {
      targetX = x + dxOrConfig;
      targetY = y + dy;
    }
    const level = ALL_LEVELS.find(l => l.id === currentLevelId) ?? FIRST_LEVEL;
    const gridRows = level.initialGrid.length;
    const gridCols = level.initialGrid[0].length;

    if (targetX < 0 || targetX >= gridCols || targetY < 0 || targetY >= gridRows) {
      return null;
    }

    const cell = logicRef.current.grid[targetY][targetX];
    logicRef.current.drone.battery -= BATTERY_COSTS.scan;
    logicRef.current.apiCallCount++;

    // Revela a célula no fog of war
    if (cell.type === 'fog') {
      logicRef.current.grid[targetY][targetX] = { ...cell, revealed: true };
      setGameState(prev => {
        const newGrid = prev.grid.map(row => row.map(c => ({ ...c })));
        newGrid[targetY][targetX] = { ...newGrid[targetY][targetX], revealed: true };
        return { ...prev, grid: newGrid };
      });
    }

    await new Promise(resolve => setTimeout(resolve, 150));
    addLog('info', `📡 Scan [${targetX}, ${targetY}]: ${cell.type}`);

    return {
      type: cell.type,
      purity: cell.purity,
      density: cell.density,
      dangerLevel: cell.dangerLevel,
      isotopeId: cell.isotopeId,
    };
  }, [addLog, currentLevelId]);

  // ─── Transmit ─────────────────────────────────────────────────────────────────

  const transmit = useCallback((data: unknown) => {
    addLog('info', `📡 Transmissão: ${JSON.stringify(data)}`);
  }, [addLog]);

  // ─── Status ───────────────────────────────────────────────────────────────────

  const setStatus = useCallback((status: GameStatus) => {
    setGameState(prev => ({ ...prev, status }));
  }, []);

  // ─── Next Level ───────────────────────────────────────────────────────────────

  const goToNextLevel = useCallback(() => {
    const next = getNextLevel(currentLevelId);
    if (next) {
      setCurrentLevelId(next.id);
    }
  }, [currentLevelId]);

  const goToLevel = useCallback((levelId: string) => {
    const level = ALL_LEVELS.find(l => l.id === levelId);
    if (level) setCurrentLevelId(levelId);
  }, []);

  // ─── Check Code for Forbidden Patterns ────────────────────────────────────────

  const checkForbiddenPatterns = useCallback((code: string): boolean => {
    const forbidden = currentLevel.scoring.silver.forbiddenPatterns;
    return forbidden.some(pattern =>
      new RegExp(`\\b${pattern}\\b`).test(code)
    );
  }, [currentLevel]);

  return {
    gameState,
    currentLevel,
    allLevels: ALL_LEVELS,
    actions: {
      move: moveDrone,
      mine: mineDrone,
      scan: scanDrone,
      transmit,
      reset: resetGame,
      log: addLog,
      setStatus,
      nextLevel: goToNextLevel,
      goToLevel,
      checkForbiddenPatterns,

      // ─── Extra Utilities for Chapters 4 & 5 ───────────────────────
      autoMine: async (filter: (m: string) => boolean) => {
        const { x, y } = logicRef.current.drone;
        const cell = logicRef.current.grid[y][x];
        if (filter(cell.type)) await mineDrone();
      },
      batchLog: (...msgs: string[]) => msgs.forEach(m => addLog('info', m)),
      teleportTo: async (coords: [number, number, number]) => {
        await moveDrone(coords[0], coords[1]);
      },
      shipBox: (box: any) => addLog('success', `📦 Box [${box.label}] enviada com: ${JSON.stringify(box.content)}`),
      archiveMission: (m: any) => addLog('system', `📁 Missão ${m.id} arquivada.`),
      updateMarket: (p: any) => addLog('system', `📈 Mercado atualizado: ${Object.keys(p).length} itens.`),
      analyzeIsotope: (d: any) => addLog('warning', `⚠️ Radiação: ${d.radiationLevel} uSv/h.`),
    },
  };
};

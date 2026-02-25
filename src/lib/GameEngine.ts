import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Position, LogMessage, Cell, GameStatus } from '../types/game';
import { LEVELS, LevelConfig } from './levels';

export const useGameEngine = () => {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  const createGridForLevel = (level: LevelConfig): Cell[][] => {
    const grid: Cell[][] = [];
    for (let y = 0; y < level.gridSize; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < level.gridSize; x++) {
        row.push({ x, y, type: 'empty' });
      }
      grid.push(row);
    }
    level.gridSetup(grid);
    return grid;
  };

  const [gameState, setGameState] = useState<GameState>({
    drone: { ...currentLevel.droneStart },
    grid: createGridForLevel(currentLevel),
    logs: [],
    status: 'idle',
  });

  // logicState is the authoritative state for the game logic execution
  const logicState = useRef({
    drone: { ...currentLevel.droneStart },
    grid: createGridForLevel(currentLevel),
  });

  // Reset when level changes
  useEffect(() => {
    resetGame();
  }, [currentLevelId]);

  const addLog = useCallback((type: LogMessage['type'], message: string) => {
    const newLog: LogMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: Date.now(),
    };
    setGameState((prev) => ({
      ...prev,
      logs: [...prev.logs, newLog],
    }));
  }, []);

  const resetGame = useCallback(() => {
    const level = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
    const newGrid = createGridForLevel(level);
    const newDrone = { ...level.droneStart };
    
    logicState.current = {
      drone: newDrone,
      grid: newGrid,
    };

    setGameState({
      drone: newDrone,
      grid: newGrid,
      logs: [],
      status: 'idle',
    });
  }, [currentLevelId]);

  const moveDrone = useCallback(async (x: number, y: number) => {
    // Validate coordinates
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error(`Erro de Tipo: Coordenadas devem ser números. Recebido: x=${typeof x}, y=${typeof y}`);
    }

    if (x < 0 || x >= currentLevel.gridSize || y < 0 || y >= currentLevel.gridSize) {
      throw new Error(`Erro de Limite: O drone tentou sair da mina para [${x}, ${y}].`);
    }

    // Update authoritative state immediately
    logicState.current.drone = { x, y };

    // Update UI state with delay for animation effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setGameState((prev) => ({
      ...prev,
      drone: { x, y },
    }));
    
    addLog('info', `Drone moveu para [${x}, ${y}]`);
  }, [addLog, currentLevel.gridSize]);

  const mineBlock = useCallback(async (material: string) => {
    const currentPos = logicState.current.drone;
    const cell = logicState.current.grid[currentPos.y][currentPos.x];

    await new Promise(resolve => setTimeout(resolve, 500));

    if (typeof material !== 'string') {
       throw new Error(`Erro de Tipo: Material deve ser uma string. Recebido: ${typeof material}`);
    }

    if (cell.type === 'empty') {
      throw new Error('Erro de Sensor: Nada para minerar aqui.');
    }

    if (cell.type === 'iron' || cell.type === 'gold') {
      // Check for danger
      if (cell.dangerLevel && cell.dangerLevel > 50) {
          addLog('error', 'EXPLOSÃO! O drone tentou minerar um bloco instável.');
          setGameState(prev => ({ ...prev, status: 'failed' }));
          throw new Error('Protocolo de Segurança Violado: Drone destruído.');
      }

      const expected = cell.type === 'iron' ? 'ferro' : 'ouro';
      
      if (material.toLowerCase() === expected) {
        // Level 2 Check: Purity (Only for Iron in Level 2)
        if (currentLevelId === 2 && cell.type === 'iron') {
           if (cell.purity && cell.purity > 80) {
             addLog('success', `Mineração bem sucedida! Ferro de Alta Pureza (${cell.purity}%) coletado.`);
           } else {
             throw new Error(`Erro de Qualidade: Ferro impuro (${cell.purity}%). Requer > 80%.`);
           }
        } else {
           addLog('success', `Mineração bem sucedida! ${cell.type === 'iron' ? 'Ferro' : 'Ouro'} coletado.`);
        }

        // Remove the block from logic state
        logicState.current.grid[currentPos.y][currentPos.x].type = 'empty';
        
        // Update UI grid
        setGameState(prev => {
            const newGrid = [...prev.grid];
            newGrid[currentPos.y] = [...newGrid[currentPos.y]];
            newGrid[currentPos.y][currentPos.x] = { ...newGrid[currentPos.y][currentPos.x], type: 'empty' };
            return { ...prev, grid: newGrid };
        });

        // Check Win Condition using the level's specific logic
        if (currentLevel.winCondition(logicState.current.grid)) {
             setGameState(prev => ({ ...prev, status: 'success' }));
        }

      } else {
        throw new Error(`Erro de Análise: Material incorreto. Esperado "${expected}", tentou "${material}".`);
      }
    }
  }, [addLog, currentLevelId]);

  const scanBlock = useCallback(() => {
    const currentPos = logicState.current.drone;
    const cell = logicState.current.grid[currentPos.y][currentPos.x];
    
    // Synchronous scan for logic state
    if (cell.type === 'empty') {
        return null;
    }
    
    return {
        material: cell.type === 'iron' ? 'Ferro' : cell.type === 'gold' ? 'Ouro' : 'Desconhecido',
        purity: cell.purity || 100,
        dangerLevel: cell.dangerLevel || 0
    };
  }, []);

  const setStatus = useCallback((status: GameStatus) => {
    setGameState(prev => ({ ...prev, status }));
  }, []);

  const nextLevel = useCallback(() => {
    if (currentLevelId < LEVELS.length) {
        setCurrentLevelId(prev => prev + 1);
    }
  }, [currentLevelId]);

  return {
    gameState,
    currentLevel,
    actions: {
      move: moveDrone,
      mine: mineBlock,
      scan: scanBlock,
      reset: resetGame,
      log: addLog,
      setStatus,
      nextLevel
    }
  };
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGameEngine } from '../lib/GameEngine';
import { CodeExecutor } from '../lib/CodeExecutor';
import { GameGrid } from './GameGrid';
import Editor, { OnMount } from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getTypeDefsForLevel } from '../core/ide/typeDefs';
import {
  Play, RotateCcw, Terminal, CheckCircle, XCircle, AlertTriangle,
  ChevronDown, ChevronUp, GripHorizontal, BookOpen, X, Info,
  Battery, Cpu, ChevronRight, Trophy, ExternalLink, Map
} from 'lucide-react';
import { clsx } from 'clsx';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'miner_code_v3';

// ─── Medal Display ────────────────────────────────────────────────────────────

const MEDAL_CONFIG = {
  none: { label: '', color: '', icon: null },
  bronze: { label: 'Bronze', color: 'text-amber-600', icon: '🥉' },
  silver: { label: 'Prata', color: 'text-slate-300', icon: '🥈' },
  gold: { label: 'Ouro', color: 'text-yellow-400', icon: '🥇' },
};

// ─── Game Component ──────────────────────────────────────────────────────────

export function Game() {
  const { gameState, actions, currentLevel, allLevels } = useGameEngine();

  const [code, setCode] = useState(currentLevel.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const extraLibDisposable = useRef<any>(null);

  // Painéis
  const [showBriefing, setShowBriefing] = useState(true);
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [showHandbook, setShowHandbook] = useState(false);

  // Terminal resizable
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const lastHeightRef = useRef(200);
  const dragStartRef = useRef<{ y: number; h: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  // ─── Quando o nível muda ────────────────────────────────────────────────────

  useEffect(() => {
    setCode(currentLevel.starterCode);
    setShowBriefing(true);
    updateMonacoTypeDefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel.id]);

  // ─── Monaco: IntelliSense Progressivo ─────────────────────────────────────

  const updateMonacoTypeDefs = useCallback(() => {
    if (!monacoRef.current) return;
    const monaco = monacoRef.current;

    // Remove biblioteca anterior para não acumular tipos de capítulos passados
    if (extraLibDisposable.current) {
      extraLibDisposable.current.dispose();
    }

    const typeDefs = getTypeDefsForLevel(currentLevel.chapter, currentLevel.apiTypeDefs);

    extraLibDisposable.current = monaco.languages.typescript.typescriptDefaults.addExtraLib(
      typeDefs,
      'ts:filename/game-api.d.ts'
    );
  }, [currentLevel]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      allowNonTsExtensions: true,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // Injeta tipos do nível atual
    updateMonacoTypeDefs();

    // Shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handleRun);
  };

  // ─── Terminal Resize ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const delta = dragStartRef.current.y - e.clientY;
      const newHeight = Math.max(36, Math.min(dragStartRef.current.h + delta, window.innerHeight - 300));
      setTerminalHeight(newHeight);
      if (newHeight > 40) lastHeightRef.current = newHeight;
    };
    const handleMouseUp = () => {
      setIsResizing(false);
      dragStartRef.current = null;
      document.body.style.cursor = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'row-resize';
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartRef.current = { y: e.clientY, h: terminalHeight };
    setIsResizing(true);
  };

  const toggleTerminal = () => {
    if (!isTerminalCollapsed) {
      lastHeightRef.current = terminalHeight;
      setIsTerminalCollapsed(true);
    } else {
      setTerminalHeight(lastHeightRef.current || 200);
      setIsTerminalCollapsed(false);
    }
  };

  // ─── Run ────────────────────────────────────────────────────────────────────

  const handleRun = async () => {
    if (isRunning) return;

    // Verificar erros no Monaco antes de executar
    if (monacoRef.current && editorRef.current) {
      const markers = monacoRef.current.editor.getModelMarkers({
        resource: editorRef.current.getModel().uri,
      });
      const errors = markers.filter(
        (m: any) => m.severity === monacoRef.current.MarkerSeverity.Error
      );
      if (errors.length > 0) {
        actions.log('error', `❌ ${errors.length} erro(s) de tipo detectado(s). Corrija antes de executar.`);
        actions.setStatus('failed');
        return;
      }
    }

    setIsRunning(true);
    actions.reset();
    actions.setStatus('running');

    try {
      const result = await CodeExecutor.execute(
        code,
        {
          move: actions.move,
          mine: actions.mine,
          scan: actions.scan,
          transmit: actions.transmit,
          log: actions.log,
        },
        currentLevel.scoring.silver.forbiddenPatterns
      );

      if (!result.success && result.error) {
        actions.setStatus('failed');
      }
    } catch (error: any) {
      actions.log('error', error.message);
      actions.setStatus('failed');
    } finally {
      setIsRunning(false);
    }
  };

  // ─── Derived State ──────────────────────────────────────────────────────────

  const medal = gameState.medal;
  const medalCfg = MEDAL_CONFIG[medal];
  const isSuccess = gameState.status === 'success';
  const isFailed = gameState.status === 'failed';
  const batteryPct = Math.max(0, gameState.drone.battery);
  const batteryColor =
    batteryPct > 60 ? 'bg-emerald-500' :
      batteryPct > 30 ? 'bg-amber-500' :
        'bg-red-500';

  // ─── Level Map Panel ────────────────────────────────────────────────────────

  const LevelMapPanel = () => (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <Map size={20} className="text-cyan-400" />
            Mapa de Progresso
          </div>
          <button onClick={() => setShowLevelMap(false)} className="p-1 hover:bg-slate-800 rounded">
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {allLevels.map(level => {
            const isCurrent = level.id === currentLevel.id;
            return (
              <button
                key={level.id}
                onClick={() => { actions.goToLevel(level.id); setShowLevelMap(false); }}
                className={clsx(
                  'w-full text-left p-3 rounded-xl border transition-all',
                  isCurrent
                    ? 'bg-cyan-950/50 border-cyan-500/50 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/30 border-slate-800 hover:border-slate-600'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0',
                    isCurrent ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  )}>
                    {level.chapter}.{level.levelInChapter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">{level.title}</div>
                    <div className="text-xs text-slate-500 truncate">{level.handbookRef.section}</div>
                  </div>
                  {isCurrent && <ChevronRight size={16} className="text-cyan-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── Briefing Panel ─────────────────────────────────────────────────────────

  const BriefingPanel = () => (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-2 py-0.5 bg-cyan-900/50 text-cyan-400 text-xs font-mono rounded-md border border-cyan-800/50">
              Cap. {currentLevel.chapter} · Nível {currentLevel.levelInChapter}
            </div>
            <span className="text-slate-200 font-bold truncate">{currentLevel.title}</span>
          </div>
          <button onClick={() => setShowBriefing(false)} className="p-1 hover:bg-slate-800 rounded">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Readout link */}
        <div className="px-4 py-2 bg-blue-950/30 border-b border-blue-900/30 flex items-center gap-2 text-xs">
          <BookOpen size={12} className="text-blue-400 shrink-0" />
          <span className="text-slate-400">Referência:</span>
          <a
            href={currentLevel.handbookRef.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 truncate"
          >
            {currentLevel.handbookRef.section}
            <ExternalLink size={10} className="shrink-0" />
          </a>
        </div>

        {/* Briefing content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="prose prose-invert prose-sm prose-cyan max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {currentLevel.mission.briefing}
            </ReactMarkdown>
          </div>
        </div>

        {/* Objective chip */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
            <span className="text-slate-300 font-medium">Objetivo:</span>
            <span className="text-slate-400 flex-1">{currentLevel.mission.objective}</span>
          </div>
          <button
            onClick={() => setShowBriefing(false)}
            className="mt-3 w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Entendido. Iniciar Missão →
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col">

      {/* Briefing Modal */}
      {showBriefing && <BriefingPanel />}
      {showLevelMap && <LevelMapPanel />}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm py-2 px-4 shrink-0">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-slate-800 p-1 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 group-hover:scale-110">
              <img src="/logo-favicon.svg" alt="Logo" className="w-full h-full object-contain invert opacity-90 group-hover:opacity-100" />
            </div>
            <span className="text-base font-bold tracking-tight text-white hidden sm:block group-hover:text-cyan-400 transition-colors duration-300">
              The Miner is Gone
            </span>
          </Link>

          {/* Level Info */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
            <button
              onClick={() => setShowLevelMap(true)}
              className="flex items-center gap-2 text-xs font-mono bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors truncate max-w-xs"
            >
              <span className="text-cyan-400 font-bold">{currentLevel.chapter}.{currentLevel.levelInChapter}</span>
              <span className="text-slate-300 truncate">{currentLevel.title}</span>
              <ChevronDown size={12} className="text-slate-500 shrink-0" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Battery */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <Battery size={14} />
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all', batteryColor)}
                  style={{ width: `${batteryPct}%` }}
                />
              </div>
              <span className="font-mono text-[10px] w-6">{batteryPct}%</span>
            </div>

            {/* Ticks */}
            <div className="hidden md:flex items-center gap-1 text-xs text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800">
              <Cpu size={12} className="text-purple-400" />
              {gameState.ticksUsed}t
            </div>

            {/* Handbook */}
            <a
              href={currentLevel.handbookRef.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-400 font-mono bg-blue-950/30 px-3 py-1.5 rounded-lg border border-blue-900/30 hover:bg-blue-950/50 transition-colors"
              title="Abrir TypeScript Handbook"
            >
              <BookOpen size={13} />
              <span className="hidden lg:inline">Handbook</span>
              <ExternalLink size={10} />
            </a>

            {/* Briefing */}
            <button
              onClick={() => setShowBriefing(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              <Info size={13} />
              <span className="hidden lg:inline">Briefing</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <main className="flex-1 grid lg:grid-cols-2 gap-0 overflow-hidden min-h-0">

        {/* ── Left: Game View ─────────────────────────────────────────────── */}
        <div
          id="game-view"
          className="relative flex flex-col items-center justify-center bg-slate-950 border-r border-slate-800 p-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_65%)] pointer-events-none" />

          <GameGrid grid={gameState.grid} drone={gameState.drone} />

          {/* HUD Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="text-[10px] font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-700 text-slate-400">
              [{gameState.drone.x}, {gameState.drone.y}]
            </div>
            {gameState.drone.cargo.length > 0 && (
              <div className="text-[10px] font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-700 text-emerald-400">
                ⛏️ {gameState.drone.cargo.map(c => `${c.quantity}×${c.type}`).join(', ')}
              </div>
            )}
          </div>

          {/* ── Success Overlay ──────────────────────────────────────────── */}
          {isSuccess && (
            <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-500">
              <div className="text-center p-8 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.15)] max-w-sm mx-4">
                <div className="text-5xl mb-3">{medalCfg.icon || '✅'}</div>
                <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white mb-1">Missão Cumprida!</h2>
                {medal !== 'none' && (
                  <p className={clsx('text-lg font-bold mb-2', medalCfg.color)}>
                    <Trophy size={16} className="inline mr-1" />
                    Medalha {medalCfg.label} conquistada
                  </p>
                )}
                <p className="text-slate-400 text-sm mb-5">{currentLevel.mission.objective}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={actions.reset}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reiniciar
                  </button>
                  <button
                    onClick={actions.nextLevel}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Próxima Missão <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Failure Overlay ──────────────────────────────────────────── */}
          {isFailed && (
            <div className="absolute inset-0 bg-slate-950/85 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-500">
              <div className="text-center p-8 bg-slate-900 border border-red-500/40 rounded-2xl shadow-[0_0_60px_rgba(239,68,68,0.15)] max-w-sm mx-4">
                <XCircle size={48} className="text-red-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white mb-2">Sistema Falhou</h2>
                <p className="text-slate-400 text-sm mb-3 max-w-xs mx-auto">
                  {[...gameState.logs].reverse().find(l => l.type === 'error')?.message ?? 'Erro desconhecido.'}
                </p>
                <p className="text-xs text-slate-600 mb-5">
                  Verifique o terminal para detalhes.
                </p>
                <button
                  onClick={actions.reset}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <RotateCcw size={16} />
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: IDE Panel ─────────────────────────────────────────────── */}
        <div className="flex flex-col min-h-0 bg-[#1e1e1e]">

          {/* Mission Bar */}
          <div className="bg-[#252526] border-b border-black/30 px-4 py-2 shrink-0 flex items-center gap-3">
            <div className="flex items-center gap-2 text-amber-400 flex-1 min-w-0">
              <AlertTriangle size={14} />
              <span className="text-xs font-medium truncate">{currentLevel.mission.objective}</span>
            </div>
            <a
              href={currentLevel.handbookRef.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors shrink-0"
            >
              <BookOpen size={10} />
              <span className="hidden sm:inline">{currentLevel.handbookRef.section}</span>
              <ExternalLink size={9} />
            </a>
          </div>

          {/* Editor Tab */}
          <div className="bg-[#2d2d2d] border-b border-black/20 px-4 py-1.5 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <span className="text-blue-400">◆</span>
              drone-controller.ts
              <span className="text-slate-600">|</span>
              <span className="text-slate-500">Cap. {currentLevel.chapter}.{currentLevel.levelInChapter}</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={code}
              onChange={val => setCode(val ?? '')}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                padding: { top: 12, bottom: 12 },
                bracketPairColorization: { enabled: true },
                smoothScrolling: true,
                cursorSmoothCaretAnimation: 'on',
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={startResizing}
            className="h-4 bg-[#252526] hover:bg-slate-700/50 cursor-row-resize flex items-center justify-center border-t border-black/20 transition-colors shrink-0 group"
          >
            <GripHorizontal size={14} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
          </div>

          {/* Terminal */}
          <div
            id="terminal-view"
            className="bg-slate-950 flex flex-col shrink-0 border-t border-black/20 transition-all duration-200"
            style={{ height: isTerminalCollapsed ? 36 : terminalHeight }}
          >
            {/* Terminal Header */}
            <div
              className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800/50 bg-[#252526] cursor-pointer hover:bg-[#2a2a2b] transition-colors shrink-0"
              onClick={toggleTerminal}
            >
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono uppercase tracking-wide">
                <Terminal size={11} />
                Terminal Output
                {gameState.logs.length > 0 && (
                  <span className="bg-slate-700 text-slate-400 rounded px-1 text-[9px]">
                    {gameState.logs.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isTerminalCollapsed
                  ? <ChevronUp size={13} className="text-slate-500" />
                  : <ChevronDown size={13} className="text-slate-500" />
                }
              </div>
            </div>

            {/* Terminal Body */}
            {!isTerminalCollapsed && (
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1 min-h-0">
                {gameState.logs.length === 0 && (
                  <span className="text-slate-700 italic">Pronto. Aguardando execução... (Ctrl+Enter para rodar)</span>
                )}
                {gameState.logs.map(log => (
                  <div
                    key={log.id}
                    className={clsx(
                      'flex items-start gap-2 group leading-relaxed',
                      log.type === 'error' && 'text-red-400',
                      log.type === 'success' && 'text-emerald-400',
                      log.type === 'warning' && 'text-amber-400',
                      log.type === 'system' && 'text-slate-500',
                      log.type === 'info' && 'text-slate-300',
                    )}
                  >
                    <span className="text-slate-700 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity font-mono text-[9px] mt-0.5 tabular-nums">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                    </span>
                    <span className="opacity-30 select-none text-slate-500">›</span>
                    <span className="break-all">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div
            id="action-bar"
            className="p-3 bg-[#252526] border-t border-black/20 flex items-center justify-between gap-2 shrink-0"
          >
            {/* Left: terminal toggle */}
            <button
              onClick={toggleTerminal}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1.5 rounded hover:bg-slate-800"
            >
              <Terminal size={14} />
              <span className="hidden sm:inline">Terminal</span>
            </button>

            {/* Right: Reset + Run */}
            <div className="flex items-center gap-2">
              <button
                onClick={actions.reset}
                disabled={isRunning}
                className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-sm disabled:opacity-40"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleRun}
                disabled={isRunning}
                className={clsx(
                  'px-5 py-2 rounded-lg text-white font-semibold flex items-center gap-2 text-sm shadow-lg transition-all',
                  isRunning
                    ? 'bg-slate-700 cursor-not-allowed opacity-60'
                    : 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/20 active:scale-[0.97]'
                )}
              >
                <Play size={14} fill="currentColor" />
                {isRunning ? 'Executando...' : 'Deploy'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

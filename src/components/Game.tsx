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

  const [code, setCode] = useState(() => {
    return localStorage.getItem(`${STORAGE_KEY}_${currentLevel.id}`) ?? currentLevel.starterCode;
  });
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
    const saved = localStorage.getItem(`${STORAGE_KEY}_${currentLevel.id}`);
    setCode(saved ?? currentLevel.starterCode);
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
    <div className="fixed inset-0 z-50 bg-[#3e2723]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fdf6e3] border-8 border-[#8d6e63] rounded-sm w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[12px_12px_0_rgba(62,39,35,0.4)]">
        <div className="p-4 border-b-4 border-[#8d6e63] flex items-center justify-between bg-[#e6c280]">
          <div className="flex items-center gap-2 text-[#b71c1c] font-bold font-serif text-xl tracking-wide uppercase">
            <Map size={24} className="text-[#b71c1c]" />
            Mapa do Scriptorium
          </div>
          <button onClick={() => setShowLevelMap(false)} className="p-1 hover:bg-[#d7b06b] rounded text-[#3e2723] transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {allLevels.map(level => {
            const isCurrent = level.id === currentLevel.id;
            return (
              <button
                key={level.id}
                onClick={() => { actions.goToLevel(level.id); setShowLevelMap(false); }}
                className={clsx(
                  'w-full text-left p-3 rounded-sm border-2 transition-all shadow-sm',
                  isCurrent
                    ? 'bg-[#1b5e20]/10 border-[#1b5e20] ring-2 ring-[#1b5e20]/50 shadow-[4px_4px_0_rgba(27,94,32,0.2)]'
                    : 'bg-[#f4ebd8] border-[#d7b06b] hover:border-[#b71c1c] hover:shadow-[4px_4px_0_rgba(183,28,28,0.15)] hover:-translate-y-0.5'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-10 h-10 rounded shadow-inner flex items-center justify-center text-sm font-bold font-serif shrink-0 border-2',
                    isCurrent ? 'bg-[#1b5e20] text-[#fdf6e3] border-[#144d18]' : 'bg-[#e6c280] text-[#5d4037] border-[#d7b06b]'
                  )}>
                    Ato {level.chapter}.{level.levelInChapter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-[#3e2723] font-serif uppercase tracking-wide truncate">{level.title}</div>
                    <div className="text-xs text-[#8d6e63] font-mono font-bold truncate">{level.handbookRef.section}</div>
                  </div>
                  {isCurrent && <ChevronRight size={20} className="text-[#1b5e20] shrink-0" strokeWidth={3} />}
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
    <div className="fixed inset-0 z-50 bg-[#3e2723]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fdf6e3] border-8 border-[#8d6e63] rounded-sm w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[12px_12px_0_rgba(62,39,35,0.4)]">
        {/* Header */}
        <div className="p-4 border-b-4 border-[#8d6e63] flex items-center justify-between bg-[#e6c280]">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[#b71c1c] text-amber-50 text-xs font-serif font-bold tracking-widest uppercase rounded-sm shadow-inner border-2 border-[#8d6e63]">
              Ato {currentLevel.chapter} · {currentLevel.levelInChapter}
            </div>
            <span className="text-[#3e2723] font-bold font-serif text-xl tracking-wide uppercase shadow-sm">{currentLevel.title}</span>
          </div>
          <button onClick={() => setShowBriefing(false)} className="p-1 hover:bg-[#d7b06b] rounded text-[#3e2723] transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Readout link */}
        <div className="px-6 py-3 bg-[#e6c280]/30 border-b-2 border-[#d7b06b]/50 flex items-center gap-2 text-xs font-mono font-bold tracking-wide">
          <BookOpen size={14} className="text-[#1b5e20] shrink-0" />
          <span className="text-[#5d4037]">Referência Sagrada:</span>
          <a
            href={currentLevel.handbookRef.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1b5e20] hover:text-[#0f3412] hover:underline flex items-center gap-1 truncate"
          >
            {currentLevel.handbookRef.section}
            <ExternalLink size={12} className="shrink-0" />
          </a>
        </div>

        {/* Briefing content */}
        <div className="flex-1 overflow-y-auto p-6 font-serif text-[#3e2723] leading-relaxed italic text-lg shadow-inner bg-[url('/assets/paper-texture.png')] bg-cover">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {currentLevel.mission.briefing}
          </ReactMarkdown>
        </div>

        {/* Objective chip */}
        <div className="p-5 border-t-4 border-[#8d6e63] bg-[#f4ebd8]">
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 bg-[#b71c1c] rounded-full border-2 border-[#8d6e63] shadow-md">
              <AlertTriangle size={18} className="text-amber-50" />
            </div>
            <span className="text-[#b71c1c] font-bold font-serif uppercase tracking-widest text-base">Missão:</span>
            <span className="text-[#5d4037] flex-1 font-serif font-semibold">{currentLevel.mission.objective}</span>
          </div>
          <button
            onClick={() => setShowBriefing(false)}
            className="mt-4 w-full py-3 bg-[#795548] hover:bg-[#5d4037] text-amber-50 border-t-2 border-x-2 border-b-4 border-[#3e2723] rounded-sm font-serif font-bold text-sm tracking-widest uppercase transition-all active:border-b-0 active:translate-y-1 shadow-md"
          >
            Empunhar a Picareta →
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#fdf6e3] text-[#3e2723] font-sans selection:bg-[#e6c280]/50 flex flex-col">

      {/* Briefing Modal */}
      {showBriefing && <BriefingPanel />}
      {showLevelMap && <LevelMapPanel />}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b-8 border-[#5d4037] bg-[#f4ebd8] py-2 px-4 shrink-0 shadow-md z-10">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded shadow-[inset_0_0_8px_rgba(93,64,55,0.5)] bg-[#e6c280] border-4 border-[#8d6e63] p-1.5 transition-all duration-300 group-hover:scale-105">
              <img src="/logo-favicon.svg" alt="Logo" className="w-full h-full object-contain filter drop-shadow opacity-90 group-hover:opacity-100" />
            </div>
            <span className="text-xl font-bold font-serif tracking-widest text-[#b71c1c] uppercase hidden sm:block drop-shadow-sm">
              The Miner is Gone
            </span>
          </Link>

          {/* Level Info */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
            <button
              onClick={() => setShowLevelMap(true)}
              className="flex items-center gap-3 font-serif bg-[#fdf6e3] hover:bg-[#e6c280] px-4 py-2 rounded-sm border-2 border-[#8d6e63] border-b-4 transition-all truncate max-w-sm shadow-sm active:border-b-2 active:translate-y-[2px]"
            >
              <span className="text-[#b71c1c] font-bold">Ato {currentLevel.chapter}.{currentLevel.levelInChapter}</span>
              <span className="text-[#5d4037] font-semibold truncate">{currentLevel.title}</span>
              <ChevronDown size={16} className="text-[#8d6e63] shrink-0" strokeWidth={3} />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Battery */}
            <div className="hidden md:flex items-center gap-2 font-bold font-serif text-[#b71c1c] bg-[#fdf6e3] border-2 border-[#8d6e63] px-2 py-1 rounded-sm shadow-inner">
              <Battery size={16} />
              <div className="w-16 h-2.5 bg-[#5d4037] rounded-sm overflow-hidden shadow-inner flex border border-[#3e2723]">
                <div
                  className={clsx('h-full transition-all', batteryColor)}
                  style={{ width: `${batteryPct}%` }}
                />
              </div>
              <span className="text-xs w-8 text-right drop-shadow-sm">{batteryPct}%</span>
            </div>

            {/* Ticks */}
            <div className="hidden md:flex items-center gap-2 font-bold font-serif text-[#1b5e20] bg-[#fdf6e3] border-2 border-[#8d6e63] px-3 py-1 rounded-sm shadow-inner">
              <Cpu size={16} className="text-[#1b5e20]" />
              <span className="drop-shadow-sm text-sm">{gameState.ticksUsed}t</span>
            </div>

            {/* Handbook */}
            <a
              href={currentLevel.handbookRef.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#1b5e20] font-serif font-bold bg-[#1b5e20]/10 px-3 py-2 rounded-sm border-2 border-[#1b5e20]/30 hover:bg-[#1b5e20]/20 hover:border-[#1b5e20] transition-colors shadow-sm"
              title="Abrir TypeScript Handbook"
            >
              <BookOpen size={16} />
              <span className="hidden lg:inline uppercase tracking-widest">Ritual</span>
              <ExternalLink size={12} strokeWidth={3} />
            </a>

            {/* Briefing */}
            <button
              onClick={() => setShowBriefing(true)}
              className="flex items-center gap-2 text-sm font-serif font-bold text-amber-50 bg-[#795548] hover:bg-[#5d4037] px-3 py-2 rounded-sm border-t-2 border-x-2 border-b-4 border-[#3e2723] transition-all active:border-b-2 active:translate-y-[2px]"
            >
              <Info size={16} />
              <span className="hidden lg:inline uppercase tracking-widest">Briefing</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <main className="flex-1 grid lg:grid-cols-2 gap-0 overflow-hidden min-h-0 bg-[#e6c280]">

        {/* ── Left: Game View ─────────────────────────────────────────────── */}
        <div
          id="game-view"
          className="relative flex flex-col items-center justify-center bg-[#2d1b14] border-r-8 border-[#5d4037] p-6 overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"
        >

          <GameGrid grid={gameState.grid} drone={gameState.drone} />

          {/* HUD Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
            <div className="text-sm font-serif font-bold bg-[#fdf6e3] px-3 py-1.5 rounded-sm border-2 border-[#8d6e63] text-[#5d4037] shadow-sm">
              [{gameState.drone.x}, {gameState.drone.y}]
            </div>
            {gameState.drone.cargo.length > 0 && (
              <div className="text-sm font-serif font-bold bg-[#1b5e20] px-3 py-1.5 rounded-sm border-2 border-[#144d18] text-amber-50 shadow-sm">
                ⛏️ {gameState.drone.cargo.map(c => `${c.quantity}×${c.type}`).join(', ')}
              </div>
            )}
          </div>

          {/* ── Success Overlay ──────────────────────────────────────────── */}
          {isSuccess && (
            <div className="absolute inset-0 bg-[#fdf6e3]/90 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-500 z-50 p-4">
              <div className="text-center p-10 bg-[#f4ebd8] border-8 border-[#5d4037] shadow-[12px_12px_0_rgba(62,39,35,0.3)] max-w-sm w-full mx-4 relative overflow-hidden rounded-sm">
                
                {/* Decorative corners */}
                <div className="absolute top-2 left-2 text-[#b71c1c]/40 font-serif text-3xl font-bold">⚜</div>
                <div className="absolute top-2 right-2 text-[#b71c1c]/40 font-serif text-3xl font-bold">⚜</div>

                <div className="text-7xl mb-6 relative z-10 drop-shadow-md">
                  {medalCfg.icon || '✅'}
                </div>
                <h2 className="text-3xl font-bold font-serif text-[#1b5e20] mb-2 uppercase tracking-widest">[ RITUAL COMPLETO ]</h2>
                {medal !== 'none' && (
                  <p className={clsx('text-base font-bold font-serif mb-6 uppercase tracking-widest px-4 py-2 inline-flex items-center justify-center shadow-inner border-4 border-[#8d6e63] bg-[#fdf6e3]', medalCfg.color)}>
                    <Trophy size={18} className="mr-2 -translate-y-[1px]" strokeWidth={2.5} />
                    CHANCELA: {medalCfg.label}
                  </p>
                )}
                <p className="text-[#5d4037] text-base mb-8 font-serif italic leading-relaxed font-semibold">{currentLevel.mission.objective}</p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={actions.reset}
                    className="px-4 py-3 bg-[#e6c280] hover:bg-[#d7b06b] text-[#3e2723] border-t-2 border-x-2 border-b-4 border-[#8d6e63] font-serif font-bold uppercase tracking-widest rounded-sm transition-all active:border-b-2 active:translate-y-[2px]"
                  >
                    [ REAJUSTAR ]
                  </button>
                  <button
                    onClick={actions.nextLevel}
                    className="px-6 py-3 bg-[#795548] hover:bg-[#5d4037] border-t-2 border-x-2 border-b-4 border-[#3e2723] text-amber-50 font-serif font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest rounded-sm active:border-b-2 active:translate-y-[2px]"
                  >
                    PRÓXIMO CAPÍTULO <ChevronRight size={18} className="shrink-0" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Failure Overlay ──────────────────────────────────────────── */}
          {isFailed && (
            <div className="absolute inset-0 bg-[#4a0000]/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-500 z-50 p-4">
              <div className="text-center p-10 bg-[#fdf6e3] border-8 border-[#b71c1c] shadow-[12px_12px_0_rgba(62,39,35,0.7)] max-w-sm w-full mx-4 relative overflow-hidden rounded-sm">
                
                {/* Decorative corners */}
                <div className="absolute top-2 left-2 text-[#b71c1c]/40 font-serif text-3xl font-bold">⚜</div>
                <div className="absolute top-2 right-2 text-[#b71c1c]/40 font-serif text-3xl font-bold">⚜</div>

                <div className="bg-[#b71c1c] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-[#5d4037]">
                   <AlertTriangle size={32} className="text-amber-50" strokeWidth={3} />
                </div>
                
                <h2 className="text-2xl font-bold font-serif text-[#b71c1c] mb-4 uppercase tracking-widest">
                  FALHA NA MAGIA
                </h2>
                
                <div className="text-[#3e2723] text-sm mb-8 font-mono font-bold leading-relaxed bg-[#f4ebd8] p-4 border-2 border-[#b71c1c] text-left overflow-auto max-h-32 shadow-inner">
                  <div className="text-[#b71c1c] mb-2 uppercase tracking-widest text-[10px]">&gt; Erro Sintático:</div>
                  {[...gameState.logs].reverse().find(l => l.type === 'error')?.message ?? 'O feitiço falhou de forma desconhecida.'}
                </div>
                
                <button
                  onClick={actions.reset}
                  className="px-6 py-3 bg-[#b71c1c] hover:bg-[#900000] border-t-2 border-x-2 border-b-4 border-[#5d4037] text-amber-50 font-serif font-bold transition-all flex items-center justify-center gap-3 mx-auto uppercase tracking-widest w-full rounded-sm active:border-b-2 active:translate-y-[2px]"
                >
                  <RotateCcw size={16} strokeWidth={3} />
                  [ REPREPARAR RUNAS ]
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: IDE Panel ─────────────────────────────────────────────── */}
        <div className="flex flex-col min-h-0 bg-[#e6c280] shadow-[inset_10px_0_20px_rgba(93,64,55,0.2)]">

          {/* Mission Bar */}
          <div className="bg-[#fdf6e3] border-b-2 border-[#8d6e63] px-4 py-3 shrink-0 flex items-center gap-3">
            <div className="flex items-center gap-3 text-[#b71c1c] flex-1 min-w-0 font-serif">
              <AlertTriangle size={18} />
              <span className="text-sm font-bold truncate tracking-wide">{currentLevel.mission.objective}</span>
            </div>
            <a
              href={currentLevel.handbookRef.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#1b5e20] hover:text-[#0f3412] transition-colors shrink-0 font-bold tracking-widest uppercase bg-[#1b5e20]/10 px-2 py-1 rounded-sm border border-[#1b5e20]/20"
            >
              <BookOpen size={12} />
              <span className="hidden sm:inline">{currentLevel.handbookRef.section}</span>
              <ExternalLink size={10} strokeWidth={3} />
            </a>
          </div>

          {/* Editor Tab */}
          <div className="bg-[#f4ebd8] border-b-4 border-[#8d6e63] px-3 py-2 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#5d4037] text-xs font-mono font-bold uppercase tracking-widest">
              <span className="text-[#b71c1c]">◆</span>
              pergaminho_magico.ts
              <span className="text-[#8d6e63] px-2">|</span>
              <span className="text-[#8d6e63]">Ato {currentLevel.chapter}.{currentLevel.levelInChapter}</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#b71c1c] border border-[#5d4037]" />
              <div className="w-3 h-3 rounded-full bg-[#e6c280] border border-[#5d4037]" />
              <div className="w-3 h-3 rounded-full bg-[#1b5e20] border border-[#5d4037]" />
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0 bg-[#fdf6e3]">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs"
              value={code}
              onChange={val => {
                const newCode = val ?? '';
                setCode(newCode);
                localStorage.setItem(`${STORAGE_KEY}_${currentLevel.id}`, newCode);
              }}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                padding: { top: 16, bottom: 16 },
                smoothScrolling: true,
                cursorSmoothCaretAnimation: 'on',
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={startResizing}
            className="h-5 bg-[#d7b06b] hover:bg-[#8d6e63] cursor-row-resize flex items-center justify-center border-y-2 border-[#8d6e63] transition-colors shrink-0 group"
          >
            <GripHorizontal size={18} className="text-[#5d4037] group-hover:text-[#fdf6e3] transition-colors" />
          </div>

          {/* Terminal */}
          <div
            id="terminal-view"
            className="bg-[#2d1b14] flex flex-col shrink-0 border-t-8 border-[#5d4037] transition-all duration-200"
            style={{ height: isTerminalCollapsed ? 42 : terminalHeight }}
          >
            {/* Terminal Header */}
            <div
              className="flex items-center justify-between px-5 py-2.5 border-b-2 border-[#1a0f0b] bg-[#3e2723] cursor-pointer hover:bg-[#4e342e] transition-colors shrink-0"
              onClick={toggleTerminal}
            >
              <div className="flex items-center gap-3 text-amber-100/90 text-[11px] font-mono font-bold uppercase tracking-widest">
                <Terminal size={14} />
                Logs da Guilda
                {gameState.logs.length > 0 && (
                  <span className="bg-[#b71c1c] text-amber-50 rounded-full px-2 py-0.5 text-[10px] shadow-inner font-sans border border-[#5d4037]">
                    {gameState.logs.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isTerminalCollapsed
                  ? <ChevronUp size={16} className="text-amber-100/50" />
                  : <ChevronDown size={16} className="text-amber-100/50" />
                }
              </div>
            </div>

            {/* Terminal Body */}
            {!isTerminalCollapsed && (
              <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2 min-h-0 text-[#d7b06b]">
                {gameState.logs.length === 0 && (
                  <span className="italic opacity-50">Silêncio na mina... (Ctrl+Enter para comandar)</span>
                )}
                {gameState.logs.map(log => (
                  <div
                    key={log.id}
                    className={clsx(
                      'flex items-start gap-3 group leading-relaxed border-l-2 pl-3 py-0.5 transition-colors',
                      log.type === 'error' && 'text-[#ff5252] border-[#ff5252] bg-[#ff5252]/5',
                      log.type === 'success' && 'text-[#69f0ae] border-[#69f0ae] bg-[#69f0ae]/5',
                      log.type === 'warning' && 'text-[#ffd740] border-[#ffd740] bg-[#ffd740]/5',
                      log.type === 'system' && 'text-[#d7b06b]/50 border-transparent',
                      log.type === 'info' && 'text-[#d7b06b] border-[#5d4037]',
                    )}
                  >
                    <span className="shrink-0 opacity-40 font-bold tabular-nums">
                      [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
                    </span>
                    <span className="break-all font-medium">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div
            id="action-bar"
            className="p-4 bg-[#fdf6e3] border-t-4 border-[#8d6e63] flex items-center justify-between gap-3 shrink-0 shadow-[0_-2px_10px_rgba(62,39,35,0.05)]"
          >
            {/* Left: terminal toggle */}
            <button
              onClick={toggleTerminal}
              className="flex items-center gap-2 font-serif font-bold text-sm tracking-widest uppercase text-[#5d4037] hover:bg-[#e6c280] px-3 py-2 rounded-sm transition-colors border-2 border-transparent hover:border-[#8d6e63]"
            >
              <Terminal size={18} />
              <span className="hidden sm:inline">Logs</span>
            </button>

            {/* Right: Reset + Run */}
            <div className="flex items-center gap-3">
              <button
                onClick={actions.reset}
                disabled={isRunning}
                className="px-4 py-2.5 text-[#b71c1c] font-serif font-bold uppercase tracking-widest text-sm hover:bg-[#b71c1c]/10 rounded-sm transition-colors flex items-center gap-2 shadow-sm border-2 border-[#b71c1c]/20 hover:border-[#b71c1c] disabled:opacity-40"
              >
                <RotateCcw size={16} strokeWidth={2.5} />
                <span className="hidden sm:inline">Descartar</span>
              </button>

              <button
                onClick={handleRun}
                disabled={isRunning}
                className={clsx(
                  'px-8 py-3 rounded-sm font-serif font-bold tracking-widest uppercase flex items-center gap-2 text-sm transition-all',
                  isRunning
                    ? 'bg-[#8d6e63] text-[#f4ebd8] cursor-not-allowed opacity-80 border-2 border-[#5d4037]'
                    : 'bg-[#1b5e20] text-amber-50 border-t-2 border-x-2 border-b-4 border-[#0f3412] hover:bg-[#2e7d32] active:border-b-2 active:translate-y-[2px] shadow-md'
                )}
              >
                <Play size={18} fill="currentColor" strokeWidth={0} />
                {isRunning ? 'Lançando Magia...' : 'Empunhar Picareta'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

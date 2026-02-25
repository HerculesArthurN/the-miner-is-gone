import React, { useState, useEffect, useRef } from 'react';
import { useGameEngine } from './lib/GameEngine';
import { CodeExecutor } from './lib/CodeExecutor';
import { GameGrid } from './components/GameGrid';
import Editor, { OnMount } from '@monaco-editor/react';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, RotateCcw, Terminal, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, GripHorizontal, Save, FolderOpen, Trash2, BookOpen, X, Info } from 'lucide-react';
import { clsx } from 'clsx';

const INITIAL_CODE = `// Fase 1: O Despertar
// Objetivo: Mover até o Ferro (2,2) e minerar.
// Dica: Use move(x, y) e mine("Material")

move(1, 0);
`;

const STORAGE_KEY = 'miner_code_v1';
const SNIPPETS_KEY = 'miner_snippets_v1';

interface SavedSnippet {
  id: string;
  name: string;
  code: string;
  date: number;
}

export default function App() {
  const { gameState, actions, currentLevel } = useGameEngine();
  const [code, setCode] = useState(INITIAL_CODE);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  
  // Update code when level changes (if it's the default code)
  useEffect(() => {
    // Only reset code if it looks like the previous level's default or is empty
    // For now, let's just set it to the new level's initial code
    setCode(currentLevel.initialCode);
    setShowTutorial(true);
  }, [currentLevel.id]);

  const [snippets, setSnippets] = useState<SavedSnippet[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SNIPPETS_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [showSnippetsMenu, setShowSnippetsMenu] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showReference, setShowReference] = useState(false);

  const saveSnippet = () => {
    const name = prompt('Nome do snippet:');
    if (!name) return;
    
    const newSnippet: SavedSnippet = {
        id: Date.now().toString(),
        name,
        code,
        date: Date.now()
    };
    
    const newSnippets = [...snippets, newSnippet];
    setSnippets(newSnippets);
    localStorage.setItem(SNIPPETS_KEY, JSON.stringify(newSnippets));
    actions.log('success', `Snippet "${name}" salvo com sucesso.`);
  };

  const loadSnippet = (snippet: SavedSnippet) => {
    if (confirm(`Carregar "${snippet.name}"? O código atual será substituído.`)) {
        setCode(snippet.code);
        actions.log('info', `Snippet "${snippet.name}" carregado.`);
        setShowSnippetsMenu(false);
    }
  };

  const deleteSnippet = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Deletar este snippet?')) {
        const newSnippets = snippets.filter(s => s.id !== id);
        setSnippets(newSnippets);
        localStorage.setItem(SNIPPETS_KEY, JSON.stringify(newSnippets));
        actions.log('info', 'Snippet deletado.');
    }
  };

  // Load code from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY);
    if (savedCode) {
      // If we have saved code, we might want to keep it, OR we might want to respect the level switch.
      // Let's say: if we are on Level 1 and have saved code, load it.
      // But if we switch levels, the useEffect above handles it.
      // This runs once on mount.
      setCode(savedCode);
    }
  }, []);

  // Save code to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  // Terminal height state with persistence
  const [terminalHeight, setTerminalHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('terminal_height');
      return saved ? parseInt(saved, 10) : 192;
    }
    return 192;
  });
  
  const lastHeightRef = useRef(192);
  const dragStartRef = useRef<{ y: number, h: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Save terminal height
  useEffect(() => {
    localStorage.setItem('terminal_height', terminalHeight.toString());
  }, [terminalHeight]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
       if (!dragStartRef.current) return;
       const delta = dragStartRef.current.y - e.clientY;
       const newHeight = dragStartRef.current.h + delta;
       const clampedHeight = Math.max(36, Math.min(newHeight, window.innerHeight - 300));
       setTerminalHeight(clampedHeight);
       if (clampedHeight > 40) lastHeightRef.current = clampedHeight;
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
    if (terminalHeight > 40) {
      lastHeightRef.current = terminalHeight;
      setTerminalHeight(36); // Collapsed height
    } else {
      setTerminalHeight(lastHeightRef.current || 192);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure TypeScript compiler options for the editor
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      noImplicitAny: true,
    });

    // Add the game API definition to the editor so it knows about move and mine
    const libSource = `
      declare function move(x: number, y: number): Promise<void>;
      declare function mine(material: string): Promise<void>;
      declare function scan(): { material: string, purity: number, dangerLevel: number } | null;
      declare const console: { log: (msg: string) => void };
    `;
    const libUri = 'ts:filename/game.d.ts';
    monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource, libUri);
  };

  const handleRun = async () => {
    if (isRunning) return;

    // Check for TypeScript errors in the editor
    if (monacoRef.current && editorRef.current) {
      const markers = monacoRef.current.editor.getModelMarkers({ resource: editorRef.current.getModel().uri });
      const errors = markers.filter((m: any) => m.severity === monacoRef.current.MarkerSeverity.Error);
      
      if (errors.length > 0) {
        actions.log('error', 'Hardware Incompatibility Error: O código contém erros de tipo. Corrija antes de executar.');
        actions.setStatus('failed');
        return;
      }
    }
    
    setIsRunning(true);
    actions.reset();
    actions.setStatus('running');
    actions.log('info', 'Iniciando sequência de comandos...');

    try {
      await CodeExecutor.execute(code, {
        move: actions.move,
        mine: actions.mine,
        scan: actions.scan,
        log: (type, msg) => actions.log(type, msg),
      });
      
      // Check win condition if not already set by mine()
      // Actually mine() sets it. We just check if we are still running.
      // If status is 'success', we are good.
      // We need to wait a bit to ensure state updates propagate if needed, 
      // but actions.mine handles the success state.
      
    } catch (error: any) {
      actions.log('error', error.message);
      actions.setStatus('failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Terminal size={20} className="text-slate-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              The Miner is Gone <span className="text-slate-500 text-sm font-normal ml-2">{currentLevel.title}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowTutorial(true)}
                className="flex items-center gap-2 text-xs text-cyan-400 font-mono bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/30 hover:bg-cyan-950/50 transition-colors"
             >
                <BookOpen size={14} />
                Tutorial Interativo
             </button>
             <button 
                onClick={() => setShowReference(true)}
                className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800 hover:bg-slate-800 transition-colors"
             >
                <Info size={14} />
                Referência
             </button>
             <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                TS Environment Active
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid lg:grid-cols-2 gap-8 h-[calc(100vh-80px)] relative">
        
        {/* Interactive Tutorial */}
        {showTutorial && (
          <InteractiveTutorial 
            steps={currentLevel.steps} 
            title={currentLevel.subtitle}
            onClose={() => setShowTutorial(false)}
          />
        )}

        {/* Static Reference Panel (Old Tutorial) */}
        {showReference && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
             <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Info size={20} />
                    <span className="font-bold uppercase tracking-wider text-sm">Referência Técnica: {currentLevel.subtitle}</span>
                  </div>
                  <button 
                    onClick={() => setShowReference(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950/30">
                  <div className="prose prose-invert prose-cyan max-w-none markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentLevel.tutorial}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/50">
                  <button 
                    onClick={() => setShowReference(false)}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Fechar Referência
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* Left Panel: Game View */}
        <div id="game-view" className="flex flex-col gap-6 h-full transition-all duration-500">
          <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden group h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] opacity-50 pointer-events-none" />
            
            <GameGrid grid={gameState.grid} drone={gameState.drone} />
            
            {/* Status Overlay */}
            {gameState.status === 'success' && (
              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-500">
                <div className="text-center p-8 bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Missão Cumprida!</h2>
                  <p className="text-slate-400">O drone coletou o ferro com sucesso.</p>
                  {currentLevel.id < 7 ? (
                    <button 
                      onClick={actions.nextLevel}
                      className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                    >
                      Próxima Fase
                    </button>
                  ) : (
                    <div className="mt-6 text-emerald-400 font-bold">
                      Parabéns! Você completou todas as fases disponíveis.
                    </div>
                  )}
                </div>
              </div>
            )}

            {gameState.status === 'failed' && (
              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-500">
                <div className="text-center p-8 bg-slate-900 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                  <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Falha no Sistema</h2>
                  <p className="text-slate-400 max-w-xs mx-auto">
                    {gameState.logs.find(l => l.type === 'error')?.message || "Erro desconhecido."}
                  </p>
                  <button 
                    onClick={actions.reset}
                    className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: IDE & Terminal */}
        <div className="flex flex-col gap-4 h-full">
          {/* Mission Header */}
          <div id="mission-header" className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col gap-3 shrink-0 transition-all duration-500">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-amber-500">{currentLevel.subtitle}</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  {currentLevel.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {currentLevel.apiDocs.map(doc => (
                <div key={doc.name} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                  <span className="text-purple-400">{doc.name}</span>{doc.signature.replace(/: ([a-z]+)/g, ': <span class="text-orange-400">$1</span>').replace(/<span class="text-orange-400">([a-z]+)<\/span>/g, (match, p1) => `<span class="text-orange-400">${p1}</span>`)}
                  {/* DangerouslySetInnerHTML is risky, let's just render text */}
                  {/* Actually let's just render it simply */}
                </div>
              ))}
              {/* Fallback/Manual rendering for better styling if needed, but dynamic is better */}
            </div>
             {/* Dynamic API Docs Rendering */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {currentLevel.apiDocs.map(doc => (
                    <div key={doc.name} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 overflow-x-auto whitespace-nowrap">
                        <span className="text-purple-400">{doc.name}</span>
                        <span className="text-slate-500">{doc.signature}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Editor Container */}
          <div id="editor-view" className="flex-1 bg-[#1e1e1e] rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-0 transition-all duration-500">
            <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-black/20 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">drone-controller.ts</span>
                <div className="h-3 w-px bg-slate-700"></div>
                
                <button 
                  onClick={saveSnippet}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                  title="Salvar Snippet"
                >
                  <Save size={12} />
                  <span>Salvar</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowSnippetsMenu(!showSnippetsMenu)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                    title="Carregar Snippet"
                  >
                    <FolderOpen size={12} />
                    <span>Carregar</span>
                    <ChevronDown size={10} />
                  </button>

                  {showSnippetsMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowSnippetsMenu(false)}
                      />
                      <div className="absolute top-full left-0 mt-1 w-48 bg-[#252526] border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                        {snippets.length === 0 ? (
                          <div className="p-3 text-xs text-slate-500 italic text-center">
                            Nenhum snippet salvo
                          </div>
                        ) : (
                          <div className="max-h-48 overflow-y-auto">
                            {snippets.map(snippet => (
                              <div 
                                key={snippet.id}
                                className="flex items-center justify-between px-3 py-2 hover:bg-slate-700 group cursor-pointer border-b border-slate-800 last:border-0"
                                onClick={() => loadSnippet(snippet)}
                              >
                                <span className="text-xs text-slate-300 truncate flex-1">{snippet.name}</span>
                                <button 
                                  onClick={(e) => deleteSnippet(e, snippet.id)}
                                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
              </div>
            </div>
            
            <div className="flex-1 relative min-h-0">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  padding: { top: 16 },
                }}
              />
            </div>

            {/* Resize Handle */}
            <div 
              onMouseDown={startResizing}
              className="h-4 bg-[#252526] hover:bg-slate-800 cursor-row-resize flex items-center justify-center border-t border-slate-800 shrink-0 transition-colors group z-10"
              title="Arraste para redimensionar"
            >
              <GripHorizontal size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>

            {/* Terminal / Logs (Moved here) */}
            <div 
              id="terminal-view"
              style={{ height: terminalHeight }}
              className="bg-slate-950 flex flex-col shrink-0 transition-all duration-500"
            >
              <div 
                className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#252526] cursor-pointer hover:bg-[#2a2a2b] transition-colors"
                onClick={toggleTerminal}
              >
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-wider">
                  <Terminal size={12} />
                  <span>Terminal Output</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); actions.log('info', 'Terminal limpo.'); }}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                  <button 
                    className="text-slate-400 hover:text-white"
                  >
                    {terminalHeight > 40 ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1">
                {gameState.logs.length === 0 && (
                  <span className="text-slate-700 italic">Pronto. Aguardando execução...</span>
                )}
                {gameState.logs.map((log) => (
                  <div key={log.id} className={clsx(
                    "flex items-start gap-2 group",
                    log.type === 'error' ? "text-red-400" :
                    log.type === 'success' ? "text-emerald-400" :
                    log.type === 'warning' ? "text-amber-400" :
                    "text-slate-300"
                  )}>
                    <span className="text-slate-600 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity font-mono text-[10px] mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="opacity-30 select-none">➜</span>
                    <span className="break-words">{log.type === 'error' ? 'Error: ' : ''}{log.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div id="action-bar" className="p-3 bg-[#252526] border-t border-black/20 flex items-center justify-between gap-3 shrink-0 transition-all duration-500">
              <button
                onClick={toggleTerminal}
                className={clsx(
                  "px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium",
                  terminalHeight > 40 
                    ? "text-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/50" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
                title={terminalHeight > 40 ? "Ocultar Terminal" : "Mostrar Terminal"}
              >
                <Terminal size={16} />
                <span className="hidden sm:inline">Terminal</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={actions.reset}
                  className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  disabled={isRunning}
                >
                  <RotateCcw size={16} />
                  Resetar
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className={clsx(
                    "px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 shadow-lg transition-all",
                    isRunning 
                      ? "bg-slate-700 cursor-not-allowed opacity-50" 
                      : "bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/25 active:scale-95"
                  )}
                >
                  {isRunning ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Play size={16} fill="currentColor" />
                      Executar Código
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-mono">
                    <div className="max-w-2xl w-full border border-red-500/50 bg-red-500/5 p-8 rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <h1 className="text-red-500 text-xl font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-3 h-3 bg-red-500 animate-pulse rounded-full" />
                            Erro Crítico de Sistema
                        </h1>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Ocorreu uma falha na execução do protocolo. O núcleo do sistema foi interrompido para evitar corrupção de dados.
                        </p>
                        <div className="bg-black/40 border border-slate-800 p-4 rounded text-xs text-red-400 overflow-auto max-h-40 mb-6">
                            <code>{this.state.error?.toString()}</code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors uppercase text-sm font-bold tracking-widest"
                        >
                            [ REINICIAR_PROTOCOLO ]
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

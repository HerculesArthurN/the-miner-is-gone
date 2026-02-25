import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, BookOpen, Code, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TutorialStep } from '../lib/levels';
import { clsx } from 'clsx';

interface InteractiveTutorialProps {
  steps: TutorialStep[];
  onClose: () => void;
  title: string;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ steps, onClose, title }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  // Effect to handle highlighting
  useEffect(() => {
    const selector = currentStep?.highlightSelector;
    if (!selector) return;

    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('tutorial-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      if (element) {
        element.classList.remove('tutorial-highlight');
      }
    };
  }, [currentStepIndex, currentStep]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center p-8 lg:p-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
                <p className="text-[10px] text-slate-500 font-mono">PASSO {currentStepIndex + 1} DE {steps.length}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col gap-4">
            <h4 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
              <Target size={20} />
              {currentStep.title}
            </h4>
            
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentStep.content}
              </ReactMarkdown>
            </div>

            {currentStep.codeExample && (
              <div className="mt-2 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
                  <Code size={12} className="text-slate-500" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Exemplo de Código</span>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto">
                  <code>{currentStep.codeExample}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Footer / Navigation */}
          <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={clsx(
                    "h-1 rounded-full transition-all duration-300",
                    i === currentStepIndex ? "w-6 bg-cyan-500" : "w-2 bg-slate-800"
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 group"
              >
                <span>{currentStepIndex === steps.length - 1 ? 'Começar Missão' : 'Próximo'}</span>
                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  Trash2, Download, Layout, Type, Image as ImageIcon, Box, Sparkles, 
  Globe, Zap, Heart, Star, RefreshCw, MousePointer2, List, 
  Layers, Menu, ChevronDown, StickyNote, PlayCircle, PlusCircle,
  Code, Terminal, Cpu, Braces
} from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

// --- Types ---

type AppMode = 'designer' | 'programmer' | 'selection';

type ComponentType = 
  | 'banner' | 'image-grid' | 'icon-grid' | 'list' 
  | 'note' | 'slideshow' | 'buttons' | 'sidebar' 
  | 'horizontal-menu' | 'dropdown';

interface ComponentData {
  id: string;
  type: ComponentType;
  color: string;
  accentColor: string;
  title: string;
  items: string[];
  imageUrl: string;
  icon: any;
  colSpan: number;
  rowSpan: number;
}

interface CodeLine {
  id: string;
  text: string;
  color: string;
  indent: number;
  isComment: boolean;
}

// --- Constants ---

const COLORS = ['#FF006E', '#8338EC', '#3A86FF', '#FB5607', '#FFBE0B', '#38B000', '#00B4D8', '#FF5400', '#2D3436'];
const ICONS = [Zap, Heart, Star, Sparkles, Globe, Box, Layout, RefreshCw, PlayCircle, PlusCircle];

const TITLES = [
  "Inovação Radical", "Design Futurista", "Poder Criativo", "Exploração Digital",
  "Mundo Conectado", "Aventura Tech", "Visão 2026", "Código Mágico",
  "Portal de Ideias", "Fábrica de Apps", "Universo Gamer", "Estúdio Kid"
];

const COMPONENT_TYPES: ComponentType[] = [
  'banner', 'image-grid', 'icon-grid', 'list', 'note', 
  'slideshow', 'buttons', 'sidebar', 'horizontal-menu', 'dropdown'
];

const CODE_SNIPPETS = [
  "function startMagic() {",
  "  const power = Math.random() * 100;",
  "  if (power > 50) {",
  "    console.log('UAU! MUITA MAGIA!');",
  "    launchConfetti();",
  "  }",
  "}",
  "class Robot {",
  "  constructor(name) {",
  "    this.name = name;",
  "    this.energy = 100;",
  "  }",
  "  dance() {",
  "    this.energy -= 10;",
  "    return 'Bip Bop!';",
  "  }",
  "}",
  "// Iniciando sistema de diversão...",
  "const app = new App();",
  "app.run({ mode: 'fun' });",
  "import { Sparkles } from 'magic-library';",
  "export default function Game() {",
  "  return <MagicCanvas />;",
  "}"
];

// --- Audio Helper ---

const playFunSound = (type: 'pop' | 'click' | 'slide' | 'magic' = 'pop') => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  let freq = 200 + Math.random() * 400;
  let duration = 0.1;

  switch (type) {
    case 'pop':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 2, audioCtx.currentTime + 0.1);
      break;
    case 'click':
      oscillator.type = 'square';
      freq = 100 + Math.random() * 80;
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      duration = 0.05;
      break;
    case 'slide':
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(freq * 0.5, audioCtx.currentTime + 0.3);
      duration = 0.3;
      break;
    case 'magic':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 3, audioCtx.currentTime + 0.5);
      duration = 0.5;
      break;
  }

  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export default function App() {
  const [mode, setMode] = useState<AppMode>('selection');
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [codeLines, setCodeLines] = useState<CodeLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Designer Logic ---
  const addComponent = useCallback(() => {
    const id = Math.random().toString(36).substring(2, 9);
    const type = COMPONENT_TYPES[Math.floor(Math.random() * COMPONENT_TYPES.length)];
    const colSpan = Math.random() > 0.7 ? 2 : 1;
    const rowSpan = Math.random() > 0.8 ? 2 : 1;

    const newComp: ComponentData = {
      id,
      type,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      accentColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      title: TITLES[Math.floor(Math.random() * TITLES.length)],
      items: ["Item A", "Item B", "Item C", "Item D"].sort(() => Math.random() - 0.5),
      imageUrl: `https://picsum.photos/seed/${id}/600/400`,
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      colSpan,
      rowSpan,
    };

    setComponents(prev => {
      if (prev.length >= 12) {
        const next = [...prev];
        const randomIndex = Math.floor(Math.random() * next.length);
        next[randomIndex] = newComp;
        return next;
      }
      return [...prev, newComp];
    });
    playFunSound('pop');
  }, []);

  // --- Programmer Logic ---
  const addCodeLine = useCallback(() => {
    const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    const newLine: CodeLine = {
      id: Math.random().toString(36).substring(2, 9),
      text: snippet,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      indent: snippet.startsWith('  ') ? 2 : (snippet.startsWith('    ') ? 4 : 0),
      isComment: snippet.startsWith('//'),
    };

    setCodeLines(prev => {
      const next = [...prev, newLine];
      if (next.length > 25) next.shift();
      return next;
    });
    playFunSound('click');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'selection') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === ' ') e.preventDefault();
      
      if (mode === 'designer') addComponent();
      if (mode === 'programmer') addCodeLine();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, addComponent, addCodeLine]);

  const clearScreen = () => {
    setComponents([]);
    setCodeLines([]);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const saveAsPng = async () => {
    if (!containerRef.current) return;
    const buttons = document.querySelectorAll('.ui-button');
    buttons.forEach(b => (b as HTMLElement).style.display = 'none');

    try {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: mode === 'programmer' ? '#1e1e1e' : '#ffffff',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `meu-trabalho-${mode}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    } catch (err) {
      console.error('Erro ao salvar imagem:', err);
    } finally {
      buttons.forEach(b => (b as HTMLElement).style.display = 'flex');
    }
  };

  const handleInteraction = (id: string) => {
    if (mode === 'designer') {
      setComponents(prev => prev.map(c => {
        if (c.id === id) {
          playFunSound('magic');
          return {
            ...c,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            accentColor: COLORS[Math.floor(Math.random() * COLORS.length)],
          };
        }
        return c;
      }));
    } else {
      setCodeLines(prev => prev.map(l => {
        if (l.id === id) {
          playFunSound('magic');
          return { ...l, color: COLORS[Math.floor(Math.random() * COLORS.length)] };
        }
        return l;
      }));
    }
  };

  const renderComponent = (comp: ComponentData) => {
    const Icon = comp.icon;
    switch (comp.type) {
      case 'banner':
        return (
          <div className="w-full h-full p-6 flex flex-col justify-center items-center text-center text-white rounded-3xl overflow-hidden relative" style={{ backgroundColor: comp.color }}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${comp.imageUrl})`, backgroundSize: 'cover' }} />
            <Icon className="w-12 h-12 mb-4 relative z-10" />
            <h2 className="text-3xl font-black uppercase tracking-tighter relative z-10 leading-none">{comp.title}</h2>
            <div className="mt-4 px-6 py-2 rounded-full bg-white text-black font-bold text-xs relative z-10">SAIBA MAIS</div>
          </div>
        );
      case 'image-grid':
        return (
          <div className="w-full h-full grid grid-cols-2 gap-2 p-2 bg-white rounded-3xl shadow-lg border-4" style={{ borderColor: comp.color }}>
            {[1, 2, 3, 4].map(i => (
              <img key={i} src={`https://picsum.photos/seed/${comp.id + i}/200/200`} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
            ))}
          </div>
        );
      case 'icon-grid':
        return (
          <div className="w-full h-full grid grid-cols-3 gap-4 p-6 bg-white rounded-3xl shadow-lg">
            {ICONS.slice(0, 6).map((Icon, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${comp.color}${i}0` }}>
                  <Icon className="w-5 h-5" style={{ color: comp.color }} />
                </div>
                <span className="text-[8px] font-bold uppercase opacity-40">Link {i}</span>
              </div>
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="w-full h-full p-6 bg-white rounded-3xl shadow-lg border-t-[12px]" style={{ borderTopColor: comp.color }}>
            <h3 className="font-black text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
              <List className="w-4 h-4" /> {comp.title}
            </h3>
            <div className="space-y-3">
              {comp.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: comp.color }} />
                  <div className="h-2 flex-1 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'note':
        return (
          <div className="w-full h-full p-8 rounded-3xl shadow-xl flex flex-col justify-between transform rotate-1" style={{ backgroundColor: comp.color + '20', border: `2px dashed ${comp.color}` }}>
            <StickyNote className="w-8 h-8 opacity-30" style={{ color: comp.color }} />
            <div>
              <h4 className="font-black text-xl mb-2" style={{ color: comp.color }}>{comp.title}</h4>
              <div className="h-2 w-full bg-white/50 rounded-full mb-2" />
              <div className="h-2 w-2/3 bg-white/50 rounded-full" />
            </div>
          </div>
        );
      case 'slideshow':
        return (
          <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl group">
            <img src={comp.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white font-black text-xl uppercase italic">{comp.title}</span>
            </div>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ChevronDown className="rotate-90 text-white w-4 h-4" />
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ChevronDown className="-rotate-90 text-white w-4 h-4" />
            </div>
          </div>
        );
      case 'buttons':
        return (
          <div className="w-full h-full p-6 flex flex-col gap-3 justify-center bg-slate-50 rounded-3xl">
            <div className="w-full py-3 rounded-2xl font-black text-center text-white shadow-lg" style={{ backgroundColor: comp.color }}>COMPRAR</div>
            <div className="w-full py-3 rounded-2xl font-black text-center text-white shadow-lg" style={{ backgroundColor: comp.accentColor }}>ASSINAR</div>
            <div className="w-full py-3 rounded-2xl font-black text-center border-2 border-slate-200 text-slate-400">CANCELAR</div>
          </div>
        );
      case 'sidebar':
        return (
          <div className="w-full h-full flex bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="w-16 h-full flex flex-col items-center py-6 gap-6" style={{ backgroundColor: comp.color }}>
              <Menu className="text-white w-6 h-6" />
              <div className="w-8 h-8 rounded-lg bg-white/20" />
              <div className="w-8 h-8 rounded-lg bg-white/20" />
            </div>
            <div className="flex-1 p-6">
              <div className="h-4 w-24 bg-slate-100 rounded-full mb-4" />
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-50 rounded-full" />
                <div className="h-2 w-full bg-slate-50 rounded-full" />
              </div>
            </div>
          </div>
        );
      case 'horizontal-menu':
        return (
          <div className="w-full h-full flex flex-col bg-white rounded-3xl shadow-lg">
            <div className="h-12 border-b flex items-center px-6 justify-between">
              <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <div className="w-20 h-4 bg-slate-100 rounded-full" />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
              <Globe className="w-8 h-8 mb-2 opacity-20" />
              <span className="font-bold text-[10px] text-slate-300 uppercase tracking-widest">Menu de Navegação</span>
            </div>
          </div>
        );
      case 'dropdown':
        return (
          <div className="w-full h-full p-6 bg-white rounded-3xl shadow-lg flex flex-col justify-center">
            <div className="w-full p-4 rounded-2xl border-2 flex justify-between items-center" style={{ borderColor: comp.color }}>
              <span className="font-bold text-sm uppercase" style={{ color: comp.color }}>Selecionar Opção</span>
              <ChevronDown style={{ color: comp.color }} />
            </div>
            <div className="mt-2 w-full p-4 rounded-2xl bg-slate-50 flex flex-col gap-2">
              <div className="h-2 w-full bg-slate-200 rounded-full" />
              <div className="h-2 w-3/4 bg-slate-200 rounded-full" />
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (mode === 'selection') {
    return (
      <div className="w-full h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.button
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setMode('designer'); playFunSound('magic'); }}
            className="p-12 bg-white rounded-[3rem] shadow-2xl border-8 border-white flex flex-col items-center text-center group"
          >
            <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:rotate-12 transition-transform">
              <Layout className="text-white w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Designer Kid</h2>
            <p className="text-slate-400 font-bold">Crie sites incríveis e coloridos apenas digitando!</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setMode('programmer'); playFunSound('magic'); }}
            className="p-12 bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-slate-800 flex flex-col items-center text-center group"
          >
            <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:-rotate-12 transition-transform">
              <Code className="text-white w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Programmer Kid</h2>
            <p className="text-slate-500 font-bold">Transforme suas teclas em linhas de código mágicas!</p>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-screen overflow-hidden flex flex-col p-4 md:p-8 transition-colors duration-500 ${mode === 'programmer' ? 'bg-slate-950' : 'bg-slate-100'}`}
    >
      {/* UI Controls */}
      <div className="fixed top-6 right-6 flex gap-4 z-50">
        <button
          onClick={() => setMode('selection')}
          tabIndex={-1}
          className="ui-button flex items-center justify-center w-14 h-14 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl shadow-xl border border-slate-200 transition-all hover:scale-110 active:scale-95"
        >
          <RefreshCw className="w-7 h-7" />
        </button>
        <button
          onClick={saveAsPng}
          tabIndex={-1}
          className="ui-button flex items-center justify-center w-14 h-14 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl shadow-xl border border-slate-200 transition-all hover:scale-110 active:scale-95"
        >
          <Download className="w-7 h-7" />
        </button>
        <button
          onClick={clearScreen}
          tabIndex={-1}
          className="ui-button flex items-center justify-center w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95"
        >
          <Trash2 className="w-7 h-7" />
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto relative">
        
        {/* Empty State */}
        {((mode === 'designer' && components.length === 0) || (mode === 'programmer' && codeLines.length === 0)) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-center p-12 rounded-[3rem] shadow-2xl border-4 border-dashed ${mode === 'programmer' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-6 ${mode === 'programmer' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                {mode === 'programmer' ? <Terminal className="text-white w-12 h-12" /> : <Sparkles className="text-white w-12 h-12" />}
              </div>
              <h1 className={`text-5xl font-black mb-4 uppercase tracking-tighter ${mode === 'programmer' ? 'text-white' : 'text-slate-900'}`}>
                {mode === 'programmer' ? 'Code Builder' : 'Site Builder'}
              </h1>
              <p className="text-slate-400 font-bold text-xl mb-8">Digite no teclado para criar!</p>
            </motion.div>
          </div>
        )}

        {mode === 'designer' ? (
          <Reorder.Group 
            axis="y" 
            values={components} 
            onReorder={setComponents}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-y-auto pr-4 custom-scrollbar grid-flow-dense"
            style={{ gridAutoRows: '280px' }}
          >
            <AnimatePresence initial={false}>
              {components.map((comp) => (
                <Reorder.Item
                  key={comp.id}
                  value={comp}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
                  whileDrag={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", zIndex: 100 }}
                  className={`cursor-grab active:cursor-grabbing h-full col-span-${comp.colSpan} row-span-${comp.rowSpan}`}
                  onClick={() => handleInteraction(comp.id)}
                >
                  <div className="w-full h-full transition-transform hover:scale-[1.02]">
                    {renderComponent(comp)}
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        ) : (
          <div className="h-full bg-slate-900 rounded-[3rem] p-12 shadow-2xl border-8 border-slate-800 overflow-y-auto custom-scrollbar font-mono">
            <div className="flex items-center gap-2 mb-8 opacity-30">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-4 text-white text-xs font-bold uppercase tracking-widest">magic_code.js</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {codeLines.map((line, i) => (
                  <motion.div
                    key={line.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => handleInteraction(line.id)}
                    className="flex items-start gap-6 cursor-pointer group"
                    style={{ paddingLeft: `${line.indent * 20}px` }}
                  >
                    <span className="text-slate-700 text-xs w-8 text-right select-none">{i + 1}</span>
                    <span 
                      className={`text-lg font-bold transition-all group-hover:scale-105 origin-left ${line.isComment ? 'italic opacity-50' : ''}`}
                      style={{ color: line.color }}
                    >
                      {line.text}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.div 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-3 h-6 bg-emerald-500 ml-14"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] pointer-events-none">
        <div className="flex gap-8">
          {mode === 'designer' ? (
            <><span>Banner</span><span>Slideshow</span><span>Listas</span><span>Menus</span></>
          ) : (
            <><span>Functions</span><span>Classes</span><span>Loops</span><span>Variables</span></>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Braces className="w-4 h-4" />
          <span>{mode === 'designer' ? 'Designer' : 'Programmer'} Kid Pro v3.0</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${mode === 'programmer' ? '#334155' : '#e2e8f0'};
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${mode === 'programmer' ? '#475569' : '#cbd5e1'};
        }
        .col-span-1 { grid-column: span 1 / span 1; }
        .col-span-2 { grid-column: span 2 / span 2; }
        .row-span-1 { grid-row: span 1 / span 1; }
        .row-span-2 { grid-row: span 2 / span 2; }
      `}} />
    </div>
  );
}

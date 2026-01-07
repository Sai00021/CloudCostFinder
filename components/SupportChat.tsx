import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, User } from '../types';

interface SupportChatProps {
  user: User | null;
}

export const SupportChat: React.FC<SupportChatProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Neural Interface Active. Processing cloud telemetry. How can I optimize your compute today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // NANO DRAG STATE: FAB (56px)
  const [btnPos, setBtnPos] = useState({ x: window.innerWidth - 72, y: window.innerHeight - 84 });
  const [isDraggingBtn, setIsDraggingBtn] = useState(false);
  const btnOffset = useRef({ x: 0, y: 0 });
  const hasMovedBtn = useRef(false);

  // NANO DRAG STATE: Chat Window (320x480)
  const [winPos, setWinPos] = useState({ x: window.innerWidth - 340, y: window.innerHeight - 500 });
  const [isDraggingWin, setIsDraggingWin] = useState(false);
  const winOffset = useRef({ x: 0, y: 0 });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Nano Constants
  const MARGIN = 16;
  const BTN_SIZE = 56;
  const WIN_WIDTH = 320;
  const WIN_HEIGHT = 480;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setBtnPos(prev => {
        const x = prev.x < window.innerWidth / 2 ? MARGIN : window.innerWidth - BTN_SIZE - MARGIN;
        return {
          x,
          y: Math.max(MARGIN, Math.min(window.innerHeight - BTN_SIZE - MARGIN, prev.y))
        };
      });
      setWinPos(prev => ({
        x: Math.max(MARGIN, Math.min(window.innerWidth - WIN_WIDTH - MARGIN, prev.x)),
        y: Math.max(MARGIN, Math.min(window.innerHeight - WIN_HEIGHT - MARGIN, prev.y))
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = (clientX: number, clientY: number, target: 'btn' | 'win') => {
    if (target === 'btn') {
      setIsDraggingBtn(true);
      btnOffset.current = { x: clientX - btnPos.x, y: clientY - btnPos.y };
      hasMovedBtn.current = false;
    } else {
      setIsDraggingWin(true);
      winOffset.current = { x: clientX - winPos.x, y: clientY - winPos.y };
    }
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (isDraggingBtn) {
      setBtnPos(prev => {
        const newX = clientX - btnOffset.current.x;
        const newY = clientY - btnOffset.current.y;
        if (Math.abs(newX - prev.x) > 4 || Math.abs(newY - prev.y) > 4) hasMovedBtn.current = true;
        return {
          x: Math.max(0, Math.min(window.innerWidth - BTN_SIZE, newX)),
          y: Math.max(0, Math.min(window.innerHeight - BTN_SIZE, newY))
        };
      });
    }
    if (isDraggingWin) {
      setWinPos(() => ({
        x: Math.max(0, Math.min(window.innerWidth - WIN_WIDTH, clientX - winOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - WIN_HEIGHT, clientY - winOffset.current.y))
      }));
    }
  }, [isDraggingBtn, isDraggingWin]);

  const handleEnd = useCallback(() => {
    if (isDraggingBtn) {
      setBtnPos(prev => {
        const snapX = prev.x < window.innerWidth / 2 ? MARGIN : window.innerWidth - BTN_SIZE - MARGIN;
        return { ...prev, x: snapX };
      });
      setIsDraggingBtn(false);
    }
    setIsDraggingWin(false);
  }, [isDraggingBtn]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const onUp = () => handleEnd();

    if (isDraggingBtn || isDraggingWin) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDraggingBtn, isDraggingWin, handleMove, handleEnd]);

  const handleSend = async (customMsg?: string) => {
    const textToSend = customMsg || input;
    if (!textToSend.trim() || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: textToSend,
        config: {
          systemInstruction: `You are the Leak Finder Neural Core. You provide lightning-fast cloud architecture optimization. Keep responses extremely concise and high-density.`
        }
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Core sync lost. Retry synaptic link.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Telemetry uplink failure.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        style={{ 
          left: winPos.x, top: winPos.y, width: WIN_WIDTH, height: WIN_HEIGHT,
          display: isOpen ? 'flex' : 'none'
        }}
        className={`fixed z-[200] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-premium flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95`}
      >
        <div 
          onMouseDown={(e) => handleStart(e.clientX, e.clientY, 'win')}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY, 'win')}
          className="bg-slate-900 dark:bg-slate-900 p-4 text-white flex justify-between items-center relative overflow-hidden cursor-grab active:cursor-grabbing border-b border-white/5 flex-shrink-0"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="neural" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor"/></pattern><rect width="100%" height="100%" fill="url(#neural)" /></svg>
          </div>
          
          <div className="relative z-10 flex items-center gap-3 pointer-events-none">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-glow-blue animate-pulse">
              <i className="fas fa-brain text-white text-[10px]"></i>
            </div>
            <div>
              <h4 className="font-black text-[10px] tracking-tight">Neural Core</h4>
              <p className="text-[6px] font-black text-blue-400 uppercase tracking-widest">Enforcer v4</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-all p-2 relative z-20">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/10 dark:bg-slate-950 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[7px] ${m.role === 'user' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-600 text-white'}`}>
                  <i className={`fas ${m.role === 'user' ? 'fa-user' : 'fa-brain'}`}></i>
                </div>
              </div>
              <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[10px] font-medium leading-relaxed shadow-sm ${
                m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[7px]">
                <i className="fas fa-brain"></i>
              </div>
              <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-xl rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1">
                <div className="w-0.5 h-0.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-0.5 h-0.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-0.5 h-0.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
          <div className="flex gap-1.5 bg-slate-50 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Query synaptic core..."
              className="flex-1 bg-transparent border-none px-2 py-1.5 text-[10px] font-bold text-slate-900 dark:text-slate-100 focus:ring-0 placeholder:text-slate-400"
            />
            <button onClick={() => handleSend()} className="w-7 h-7 bg-slate-900 dark:bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-600 transition-all">
              <i className="fas fa-paper-plane text-[9px]"></i>
            </button>
          </div>
        </div>
      </div>

      {!isOpen && (
        <button 
          onMouseDown={(e) => handleStart(e.clientX, e.clientY, 'btn')}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY, 'btn')}
          onClick={() => { if (!hasMovedBtn.current) setIsOpen(true); }}
          style={{ 
            left: btnPos.x, top: btnPos.y, width: BTN_SIZE, height: BTN_SIZE,
            transition: isDraggingBtn ? 'none' : 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)'
          }}
          className={`fixed z-[190] bg-slate-950 dark:bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg cursor-grab active:cursor-grabbing hover:scale-105 group overflow-hidden ${isDraggingBtn ? 'scale-110 !cursor-grabbing' : ''}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center">
            <i className={`fas fa-brain text-lg ${isDraggingBtn ? 'animate-none' : 'animate-pulse'}`}></i>
          </div>
          <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover:border-blue-400 transition-colors"></div>
        </button>
      )}
    </>
  );
};
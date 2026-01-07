import React, { useState, useRef, useEffect } from 'react';
import { chatWithSearch, chatWithMaps, performComplexReasoning, getFastResponse, generateSpeech } from '../aiService';
import { ChatMessage } from '../types';

export const UniversalChatbot: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'model', text: "Systems online. Select a mode to begin." }]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'SEARCH' | 'MAPS' | 'THINKING' | 'FAST'>('SEARCH');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      let reply: ChatMessage;
      if (mode === 'SEARCH') reply = await chatWithSearch(userMsg);
      else if (mode === 'MAPS') reply = await chatWithMaps(userMsg);
      else if (mode === 'THINKING') reply = await performComplexReasoning(userMsg);
      else reply = await getFastResponse(userMsg);

      setMessages(prev => [...prev, reply]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = async (text: string) => {
    try {
      const audioData = await generateSpeech(text);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(audioData);
      const frameCount = dataInt16.length;
      const buffer = ctx.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) {
      console.error("TTS Failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-950 w-full max-w-3xl h-[75vh] rounded-[3rem] shadow-4xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6">
        
        {/* Header / Mode Select */}
        <div className="px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-2">
            {[
              { id: 'SEARCH', label: 'Search', icon: 'fa-globe' },
              { id: 'MAPS', label: 'Spatial', icon: 'fa-map-location-dot' },
              { id: 'THINKING', label: 'Think', icon: 'fa-brain-circuit' },
              { id: 'FAST', label: 'Fast', icon: 'fa-bolt' }
            ].map(m => (
              <button 
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  mode === m.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className={`fas ${m.icon} mr-1.5`}></i> {m.label}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-rose-500"><i className="fas fa-times text-base"></i></button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-6 rounded-[2rem] shadow-sm relative ${
                m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-tl-none'
              }`}>
                {m.isThinking && (
                  <div className="mb-2 flex items-center gap-2 text-indigo-400">
                    <i className="fas fa-microchip text-[10px] animate-pulse"></i>
                    <span className="text-[8px] font-black uppercase tracking-widest">32k Thinking Utilized</span>
                  </div>
                )}
                <p className="text-xs font-semibold leading-relaxed">{m.text}</p>
                {m.grounding && m.grounding.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                    {m.grounding.map((chunk, idx) => {
                      const data = chunk.web || chunk.maps;
                      if (!data) return null;
                      return (
                        <a key={idx} href={data.uri} target="_blank" className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-[8px] font-black text-blue-600 border border-blue-500/10">
                          <i className={`fas ${chunk.web ? 'fa-link' : 'fa-location-dot'}`}></i>
                          {data.title || "Ref"}
                        </a>
                      );
                    })}
                  </div>
                )}
                {m.role === 'model' && (
                  <button onClick={() => speak(m.text)} className="absolute -bottom-3 -right-3 w-8 h-8 bg-slate-950 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl">
                    <i className="fas fa-volume-high text-[10px]"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 animate-bounce">
                <i className="fas fa-brain text-xs"></i>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl rounded-tl-none flex gap-1.5">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 focus-within:border-blue-600 transition-all">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Query synaptic core..."
              className="flex-1 bg-transparent border-none px-4 py-1 text-xs font-black text-slate-950 dark:text-white outline-none"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all active:scale-95 shadow-xl"
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export const LiveVoiceAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const aiRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // PCM Base64 Helpers
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const startLiveSession = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            const pcmBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            setTranscription(prev => [...prev.slice(-4), `Model: ${message.serverContent?.outputTranscription?.text}`]);
          }
          const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioBase64) {
            const buffer = await decodeAudioData(decode(audioBase64), outputCtx, 24000);
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => setIsActive(false),
        onerror: (e) => console.error(e)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        systemInstruction: "You are the Platinum Cloud FinOps Assistant. You help users optimize cloud costs through real-time voice guidance."
      }
    });

    aiRef.current = await sessionPromise;
  };

  useEffect(() => {
    startLiveSession();
    return () => {
      aiRef.current?.close();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl text-center space-y-12 animate-in fade-in zoom-in duration-500">
        
        <div className="relative">
          <div className={`w-48 h-48 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto border-4 border-blue-500/50 transition-all duration-1000 ${isActive ? 'scale-110 shadow-glow-blue' : 'scale-100'}`}>
            <div className={`w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center shadow-4xl transition-transform ${isActive ? 'animate-float' : ''}`}>
              <i className="fas fa-microphone text-5xl text-white"></i>
            </div>
            {isActive && (
              <div className="absolute inset-0 border-8 border-blue-500/20 rounded-full animate-ping"></div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Neural Voice Command</h2>
          <p className="text-blue-400 font-black text-xs uppercase tracking-[0.4em]">{isActive ? 'Synaptic Link Active' : 'Establishing Secure Tunnel...'}</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-left space-y-4 h-64 overflow-y-auto custom-scrollbar">
          {transcription.map((t, i) => (
            <p key={i} className="text-sm font-bold text-slate-300 animate-in slide-in-from-left-4">{t}</p>
          ))}
          {transcription.length === 0 && <p className="text-slate-600 italic text-center pt-10">Listening for tactical instructions...</p>}
        </div>

        <button 
          onClick={onClose}
          className="px-14 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-4xl active:scale-95"
        >
          Terminate Session
        </button>
      </div>
    </div>
  );
};

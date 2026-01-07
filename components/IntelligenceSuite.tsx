import React, { useState, useRef } from 'react';
import { 
  analyzeAsset, generateVideoVeo, generateImage, transcribeAudio
} from '../aiService';
import { editImageWithGemini } from '../imageService';

export const IntelligenceSuite: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState<'VIDEO' | 'GENERATE' | 'EDIT' | 'VISION' | 'VIDEO_ANALYSIS' | 'TRANSCRIPTION'>('VIDEO');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [upload, setUpload] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = () => setUpload(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    // Mandatory key check for paid/pro models
    if (tab === 'VIDEO' || tab === 'GENERATE' || tab === 'EDIT') {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setIsProcessing(true);
    setResult(null);
    try {
      if (tab === 'VIDEO') {
        const videoUrl = await generateVideoVeo(prompt, aspectRatio as any, upload || undefined);
        setResult(videoUrl);
      } else if (tab === 'VISION' || tab === 'VIDEO_ANALYSIS') {
        if (!upload) throw new Error("Please upload an asset.");
        const analysis = await analyzeAsset(upload.split(',')[1], mimeType, prompt || "Summarize tactical findings from this asset.");
        setResult(analysis);
      } else if (tab === 'TRANSCRIPTION') {
        if (!upload) throw new Error("Please upload audio.");
        const text = await transcribeAudio(upload.split(',')[1], mimeType);
        setResult(text);
      } else if (tab === 'EDIT') {
        if (!upload) throw new Error("Please upload an image.");
        const edited = await editImageWithGemini(upload, mimeType, prompt);
        setResult(edited);
      } else if (tab === 'GENERATE') {
        const img = await generateImage(prompt, aspectRatio, imageSize);
        setResult(img);
      }
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found.")) {
        await (window as any).aistudio.openSelectKey();
      }
      alert(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: 'VIDEO', label: 'Veo Gen', icon: 'fa-film' },
    { id: 'GENERATE', label: 'Pro Image', icon: 'fa-image' },
    { id: 'EDIT', label: 'AI Edit', icon: 'fa-wand-magic-sparkles' },
    { id: 'VISION', label: 'Scan', icon: 'fa-eye' },
    { id: 'VIDEO_ANALYSIS', label: 'Video Insight', icon: 'fa-video' },
    { id: 'TRANSCRIPTION', label: 'Voice Text', icon: 'fa-microphone-lines' }
  ];

  const imageRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
  const videoRatios = ['16:9', '9:16'];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-3xl shadow-4xl overflow-hidden flex animate-in zoom-in-95 duration-500">
        
        {/* Compact Sidebar */}
        <div className="w-48 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-1.5">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 px-2">Neural Lab</h2>
          
          {tabs.map(t => (
            <button 
              key={t.id}
              onClick={() => { setTab(t.id as any); setResult(null); if (t.id === 'VIDEO') setAspectRatio('16:9'); }}
              className={`p-2.5 rounded-lg flex items-center gap-3 transition-all text-[10px] font-black uppercase tracking-widest ${
                tab === t.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <i className={`fas ${t.icon} text-xs w-4`}></i>
              {t.label}
            </button>
          ))}

          <div className="mt-auto p-3 bg-slate-950 rounded-xl border border-white/5">
             <div className="flex items-center gap-2 text-emerald-500">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[8px] font-black uppercase tracking-widest">Cores Sync</span>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white tracking-tighter uppercase">
                  {tabs.find(t => t.id === tab)?.label} Laboratory
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Multi-modal generative engine v4.2</p>
              </div>
              <button onClick={onClose} className="text-slate-300 hover:text-rose-500 transition-all"><i className="fas fa-times text-lg"></i></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <div className="space-y-4">
                {(tab !== 'GENERATE') && (
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">1. Asset Ingest</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative group"
                    >
                      {upload ? (
                        mimeType.startsWith('image') ? <img src={upload} className="w-full h-full object-cover" /> : <div className="text-blue-500 font-black uppercase text-[10px]">Asset Ready</div>
                      ) : (
                        <>
                          <i className="fas fa-cloud-arrow-up text-xl text-slate-300 mb-1"></i>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Binary</span>
                        </>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">2. Intelligence Prompt</label>
                  <textarea 
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe transformation or analysis objective..."
                    className="w-full h-20 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-[11px] font-bold text-slate-950 dark:text-white outline-none focus:border-blue-600 transition-all resize-none"
                  />
                </div>

                {(tab === 'VIDEO' || tab === 'GENERATE') && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">3. Aspect Configuration</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(tab === 'VIDEO' ? videoRatios : imageRatios).map(ar => (
                        <button 
                          key={ar}
                          onClick={() => setAspectRatio(ar)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black border transition-all ${aspectRatio === ar ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                        >
                          {ar}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(tab === 'GENERATE') && (
                   <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">4. Precision Scale</label>
                    <div className="flex gap-1.5">
                      {(['1K', '2K', '4K'] as const).map(size => (
                        <button 
                          key={size}
                          onClick={() => setImageSize(size)}
                          className={`flex-1 py-1.5 rounded-lg text-[9px] font-black border transition-all ${imageSize === size ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleAction}
                  disabled={isProcessing}
                  className="w-full py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Thinking...</> : 'Initiate Neural Forge'}
                </button>
              </div>

              {/* Output Section */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Uplink Telemetry</label>
                <div className="min-h-[320px] bg-slate-950 rounded-2xl p-4 border border-white/5 shadow-inner relative overflow-hidden flex flex-col items-center justify-center">
                  {isProcessing ? (
                    <div className="text-center space-y-3">
                      <div className="w-10 h-10 border-2 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest animate-pulse">Streaming Bitstream...</p>
                    </div>
                  ) : result ? (
                    tab === 'VIDEO' ? <video src={result} controls className="w-full max-h-[300px] rounded-lg object-contain" /> :
                    (tab === 'EDIT' || tab === 'GENERATE') ? <img src={result} className="w-full max-h-[300px] rounded-lg object-contain" /> :
                    <div className="prose prose-invert text-blue-200 text-[10px] font-mono leading-relaxed h-[260px] overflow-y-auto custom-scrollbar w-full text-left">
                      {result}
                    </div>
                  ) : (
                    <div className="text-center text-slate-700">
                      <i className="fas fa-satellite-dish text-4xl mb-3 opacity-20"></i>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Ready for Signal Ingest</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
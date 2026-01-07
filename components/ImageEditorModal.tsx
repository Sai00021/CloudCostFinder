import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../imageService';

interface ImageEditorModalProps {
  onClose: () => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await editImageWithGemini(selectedImage, mimeType, prompt);
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to process image strategy.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[4rem] shadow-4xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-12 flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <i className="fas fa-image-edit text-lg"></i>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Creative Strategy Lab</h2>
              </div>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Use AI to edit infrastructure diagrams or branding assets.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-y-auto pr-4 custom-scrollbar flex-1">
            {/* Input Side */}
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block">1. Source Asset</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-video rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                    selectedImage ? 'border-blue-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/50'
                  }`}
                >
                  {selectedImage ? (
                    <>
                      <img src={selectedImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Source" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-black uppercase tracking-widest bg-slate-950/60 px-6 py-3 rounded-2xl backdrop-blur-md">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <i className="fas fa-cloud-upload text-4xl text-slate-300 dark:text-slate-700 mb-4 group-hover:text-blue-500 transition-colors"></i>
                      <p className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Select Image Asset</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block">2. Transformation Logic</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Add a retro filter' or 'Remove the background person'..."
                  className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500/50 transition-all resize-none"
                />
              </div>

              <button 
                onClick={handleEdit}
                disabled={!selectedImage || !prompt.trim() || isProcessing}
                className="w-full py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] shadow-4xl hover:bg-blue-600 dark:hover:bg-blue-50 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed group/btn"
              >
                {isProcessing ? (
                  <><i className="fas fa-circle-notch fa-spin"></i> Neural Processing...</>
                ) : (
                  <><i className="fas fa-wand-sparkles group-hover/btn:rotate-12 transition-transform"></i> Commit AI Transformation</>
                )}
              </button>
              
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-center gap-3">
                  <i className="fas fa-circle-exclamation text-rose-500"></i>
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{error}</p>
                </div>
              )}
            </div>

            {/* Output Side */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block">Generated Result</label>
              <div className="aspect-video rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/30 border-2 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
                {resultImage ? (
                  <>
                    <img src={resultImage} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="Result" />
                    <a 
                      href={resultImage} 
                      download="creative-asset-export.png"
                      className="absolute bottom-6 right-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                    >
                      <i className="fas fa-download mr-2"></i> Save Asset
                    </a>
                  </>
                ) : isProcessing ? (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Running Gemini 2.5 Flash Vision...</p>
                  </div>
                ) : (
                  <div className="text-center opacity-20">
                    <i className="fas fa-atom text-6xl text-slate-300 dark:text-slate-700 mb-6"></i>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Waiting for Strategic Intent</p>
                  </div>
                )}
              </div>
              
              {resultImage && (
                <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-4 mb-4">
                    <i className="fas fa-info-circle text-blue-500"></i>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Model Insights</h4>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    Transformation complete using <span className="font-bold text-blue-600">Gemini 2.5 Flash Image</span>. 
                    The model maintained semantic layout while applying requested filters and edits.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
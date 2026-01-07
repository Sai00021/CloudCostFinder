
import React, { useState, useEffect } from 'react';
import { backend } from '../backendService';

interface DocViewerModalProps {
  type: string;
  onClose: () => void;
}

export const DocViewerModal: React.FC<DocViewerModalProps> = ({ type, onClose }) => {
  const [doc, setDoc] = useState<any>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    backend.getDocumentation(type).then(setDoc);
  }, [type]);

  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl h-[80vh] rounded-[3.5rem] shadow-3xl overflow-hidden flex animate-in zoom-in-95 duration-200">
        
        {/* Sidebar */}
        <div className="w-72 bg-slate-50 border-r border-slate-100 p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              <i className="fas fa-book-open text-xs"></i>
            </div>
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">Developer Hub</span>
          </div>
          
          <nav className="flex-1 space-y-2">
            {doc.sections.map((s: any, i: number) => (
              <button 
                key={i}
                onClick={() => setActiveSection(i)}
                className={`w-full text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeSection === i 
                  ? 'bg-white text-blue-600 shadow-md border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
          
          <div className="mt-auto pt-10 border-t border-slate-200">
             <div className="flex items-center gap-2 text-emerald-500 mb-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[8px] font-black uppercase tracking-widest">API v4.0 Live</span>
             </div>
             <p className="text-[9px] text-slate-400 font-medium">Last updated: 2 hours ago</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-12 py-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{doc.title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            {doc.sections.map((s: any, i: number) => (
              <div 
                key={i} 
                className={`mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 ${activeSection !== i ? 'hidden md:block' : ''}`}
              >
                <h3 className="text-xl font-black text-slate-900 mb-4">{s.title}</h3>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">{s.content}</p>
                
                <div className="relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigator.clipboard.writeText(s.code)}
                      className="bg-slate-700 text-white text-[10px] font-black px-4 py-2 rounded-lg hover:bg-blue-600 transition-all uppercase tracking-widest"
                    >
                      Copy Snippet
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-8 rounded-[2rem] overflow-x-auto border border-slate-800 shadow-2xl">
                    <code className="text-blue-400 font-mono text-sm leading-relaxed">
                      {s.code}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>

          <div className="px-12 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-4">
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Download SDK</button>
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Postman Collection</button>
            </div>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
              Go to Full Wiki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { backend } from '../backendService';
import { CloudResource, TaggingStandard } from '../types';

interface ResourceTaggingModalProps {
  resourceId: string;
  onClose: () => void;
}

export const ResourceTaggingModal: React.FC<ResourceTaggingModalProps> = ({ resourceId, onClose }) => {
  const [resource, setResource] = useState<CloudResource | null>(null);
  const [standards, setStandards] = useState<TaggingStandard[]>([]);
  const [tags, setTags] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [res, stds] = await Promise.all([
        backend.getResource(resourceId),
        backend.getTaggingStandards()
      ]);
      if (res) {
        setResource(res);
        setTags(res.tags || {});
      }
      setStandards(stds);
    };
    loadData();
  }, [resourceId]);

  const handleSave = async () => {
    setIsSaving(true);
    await backend.updateResourceTags(resourceId, tags);
    setIsSaving(false);
    onClose();
  };

  const removeTag = (key: string) => {
    const newTags = { ...tags };
    delete newTags[key];
    setTags(newTags);
  };

  const addTag = () => {
    if (!newKey.trim()) return;
    setTags({ ...tags, [newKey.trim()]: newValue.trim() });
    setNewKey('');
    setNewValue('');
  };

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resource Metadata</h2>
              <p className="text-sm text-slate-500 font-medium">Tagging manager for <span className="text-blue-600 font-bold">{resource.name}</span></p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors"><i className="fas fa-times text-xl"></i></button>
          </div>

          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar mb-10">
            {/* Required Standards Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Governance Requirements</h3>
              <div className="space-y-3">
                {standards.filter(s => s.required).map(s => (
                  <div key={s.key} className={`p-5 rounded-2xl border transition-all ${!tags[s.key] ? 'border-rose-200 bg-rose-50/50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs">{s.key}</span>
                        <span className="bg-rose-100 text-rose-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Required</span>
                      </div>
                      {!tags[s.key] && (
                        <span className="text-rose-500 text-[9px] font-black uppercase flex items-center gap-1">
                          <i className="fas fa-triangle-exclamation"></i>
                          Missing
                        </span>
                      )}
                    </div>
                    <input 
                      type="text" 
                      placeholder={s.allowedValues ? `Allowed: ${s.allowedValues.join(', ')}` : "Enter value..."}
                      value={tags[s.key] || ''}
                      onChange={(e) => setTags({ ...tags, [s.key]: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Tags Section */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Active Metadata</h3>
              <div className="space-y-3">
                {Object.entries(tags).filter(([k]) => !standards.find(s => s.key === k && s.required)).map(([k, v]) => (
                  <div key={k} className="flex gap-2 group">
                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">{k}</span>
                        <span className="text-sm font-black text-slate-800">{v || '<empty>'}</span>
                      </div>
                      <button 
                        onClick={() => removeTag(k)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <i className="fas fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Tag */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Add Custom Tag</h3>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Key (e.g. dept)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:bg-white transition-all outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:bg-white transition-all outline-none"
                />
                <button 
                  onClick={addTag}
                  className="bg-slate-900 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-5 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Discard</button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-arrow-up"></i>}
              Sync Cloud Metadata
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { backend } from '../backendService';
import { TaggingStandard, CloudResource, CostLeak } from '../types';
import { ResourceTaggingModal } from './ResourceTaggingModal';

export const TagManagerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState<'STANDARDS' | 'INVENTORY' | 'BIN'>('STANDARDS');
  const [standards, setStandards] = useState<TaggingStandard[]>([]);
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [resolvedLeaks, setResolvedLeaks] = useState<CostLeak[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  // New Requirement Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReq, setNewReq] = useState<TaggingStandard>({ key: '', required: true, description: '' });

  useEffect(() => {
    backend.getTaggingStandards().then(setStandards);
    backend.getResources().then(setResources);
    backend.getRemediationBin().then(setResolvedLeaks);
  }, [tab]);

  const handlePublishStandards = async () => {
    setIsSaving(true);
    await backend.publishTaggingStandards(standards);
    setIsSaving(false);
  };

  const handleAddRequirement = async () => {
    if (!newReq.key) return;
    await backend.addTaggingStandard(newReq);
    setStandards(await backend.getTaggingStandards());
    setNewReq({ key: '', required: true, description: '' });
    setShowAddForm(false);
  };

  const handleDeleteRequirement = async (key: string) => {
    await backend.deleteTaggingStandard(key);
    setStandards(await backend.getTaggingStandards());
  };

  const handleClearBin = async () => {
    await backend.clearRemediationBin();
    setResolvedLeaks([]);
  };

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {selectedResourceId && (
          <ResourceTaggingModal 
            resourceId={selectedResourceId} 
            onClose={() => {
              setSelectedResourceId(null);
              backend.getResources().then(setResources);
            }} 
          />
        )}

        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setTab('STANDARDS')}
            className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${
              tab === 'STANDARDS' ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Governance Standards
          </button>
          <button 
            onClick={() => setTab('INVENTORY')}
            className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${
              tab === 'INVENTORY' ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Resource Inventory
          </button>
          <button 
            onClick={() => setTab('BIN')}
            className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${
              tab === 'BIN' ? 'text-rose-600 bg-rose-50/50 border-b-2 border-rose-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Remediation Bin
          </button>
          <button onClick={onClose} className="px-8 text-slate-300 hover:text-rose-500"><i className="fas fa-times"></i></button>
        </div>

        <div className="p-10 h-[70vh] overflow-y-auto custom-scrollbar">
          {tab === 'STANDARDS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Tagging Policy Registry</h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                >
                  {showAddForm ? 'Cancel' : '+ New Requirement'}
                </button>
              </div>

              {showAddForm && (
                <div className="p-8 bg-blue-50/30 border border-blue-100 rounded-[2rem] space-y-4 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Tag Key (e.g. cost-center)"
                      value={newReq.key}
                      onChange={e => setNewReq({...newReq, key: e.target.value})}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select 
                      value={newReq.required ? 'true' : 'false'}
                      onChange={e => setNewReq({...newReq, required: e.target.value === 'true'})}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                    >
                      <option value="true">Mandatory</option>
                      <option value="false">Optional</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Description / Purpose"
                    value={newReq.description}
                    onChange={e => setNewReq({...newReq, description: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                  />
                  <button 
                    onClick={handleAddRequirement}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
                  >
                    Save Draft Requirement
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {standards.map((s, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-start hover:bg-white hover:border-blue-200 transition-all group">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-slate-900">key: {s.key}</span>
                        {s.required && <span className="bg-rose-100 text-rose-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Required</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">{s.description}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteRequirement(s.key)}
                      className="text-slate-300 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <i className="fas fa-trash-can text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button 
                  onClick={handlePublishStandards}
                  disabled={isSaving}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bullhorn mr-2"></i>}
                  {isSaving ? 'Deploying Standards...' : 'Publish Standards'}
                </button>
              </div>
            </div>
          )}

          {tab === 'INVENTORY' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Cloud Resource Inventory</h3>
                <div className="bg-slate-100 rounded-xl px-4 py-2 border border-slate-200 flex items-center gap-3">
                  <i className="fas fa-search text-slate-400"></i>
                  <input 
                    type="text" 
                    placeholder="Search resources..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none w-48"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {filteredResources.map(r => {
                  const missingTags = standards.filter(s => s.required && (!r.tags || !r.tags[s.key]));
                  return (
                    <div key={r.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-blue-600 transition-colors">
                          <i className={`fas ${r.type === 'VM' ? 'fa-server' : r.type === 'GKE' ? 'fa-network-wired' : 'fa-cube'}`}></i>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm tracking-tight">{r.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{r.id}</p>
                        </div>
                        {missingTags.length > 0 && (
                          <span className="bg-rose-100 text-rose-600 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                            <i className="fas fa-triangle-exclamation"></i>
                            {missingTags.length} Missing Requirements
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => setSelectedResourceId(r.id)}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        Edit Metadata
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'BIN' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Remediation Bin</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">History of fixed cost leaks</p>
                </div>
                <button 
                  onClick={handleClearBin}
                  className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-4">
                {resolvedLeaks.length > 0 ? resolvedLeaks.map((leak, idx) => (
                  <div key={idx} className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem] flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <i className="fas fa-shield-check text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900">{leak.resourceName}</h4>
                        <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">Saved: ${leak.monthlyWaste.toFixed(2)} / month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100">
                        REMEDIATED
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <i className="fas fa-trash-can text-slate-200 text-5xl mb-6"></i>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">The bin is empty</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Fixed leaks will appear here for governance auditing.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { backend } from '../backendService';
import { IdentityProfile, User } from '../types';

interface IdentityModalProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onClose: () => void;
}

export const IdentityModal: React.FC<IdentityModalProps> = ({ user, onUpdateUser, onClose }) => {
  const [profile, setProfile] = useState<IdentityProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);

  useEffect(() => {
    backend.getIdentityProfile().then(setProfile);
  }, []);

  const handleUpdateProfile = async (updates: Partial<IdentityProfile>) => {
    if (!profile) return;
    setIsSaving(true);
    await backend.updateIdentityProfile(updates);
    setProfile({ ...profile, ...updates });
    setIsSaving(false);
  };

  const handleUpdateUser = async (updates: Partial<User>) => {
    setIsSaving(true);
    const updatedUser = await backend.updateUser(updates);
    onUpdateUser(updatedUser);
    setIsSaving(false);
  };

  const simulateAvatarChange = () => {
    setIsChangingAvatar(true);
    // Use initials style for letter-based avatars based on current user name
    const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    setTimeout(() => {
      handleUpdateUser({ avatar: newAvatar });
      setIsChangingAvatar(false);
    }, 1000);
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <i className="fas fa-user-shield text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Identity Center</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">Global Security Posture</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-6">
            {/* Avatar & Profile Top Section */}
            <div className="flex flex-col items-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="relative group mb-6">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img 
                  src={user.avatar} 
                  className={`relative w-24 h-24 rounded-3xl border-4 border-white dark:border-slate-800 shadow-2xl transition-all object-cover ${isChangingAvatar ? 'animate-pulse opacity-50' : 'group-hover:scale-105'}`} 
                  alt="Profile" 
                />
                <button 
                  onClick={simulateAvatarChange}
                  disabled={isChangingAvatar}
                  className="absolute -bottom-2 -right-2 bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-800 hover:bg-blue-600 transition-colors group-active:scale-90"
                  title="Change Avatar"
                >
                  {isChangingAvatar ? <i className="fas fa-circle-notch fa-spin text-xs"></i> : <i className="fas fa-camera text-xs"></i>}
                </button>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">{user.role}</p>
              </div>
            </div>

            {/* Identity Details */}
            <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Organization</span>
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">{profile.organization}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Two-Factor Auth</span>
                <button 
                  onClick={() => handleUpdateProfile({ mfaEnabled: !profile.mfaEnabled })}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                    profile.mfaEnabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                  }`}
                >
                  {profile.mfaEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recovery Email</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{profile.recoveryEmail || 'Not set'}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl text-white">
              <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Active Telemetry Session</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-desktop text-blue-400"></i>
                </div>
                <div>
                  <p className="text-xs font-bold">{profile.ipAddress}</p>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Authenticated Edge Node</p>
                </div>
              </div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Timestamp: {new Date(profile.lastLogin).toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Rotate Keys
              </button>
              <button className="py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Audit Log
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
            <button 
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
              Sync Profile Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

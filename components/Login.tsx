
import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, Lock, Mail, ChevronRight, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  systemUsers: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, systemUsers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const matchedUser = systemUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (!matchedUser) {
        setError('Invalid institutional credentials. Please verify your email and access key.');
        setIsLoading(false);
        return;
      }

      onLogin({
        ...matchedUser,
        lastLogin: new Date().toISOString()
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.05),transparent)] pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-white rounded-[25px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700 border border-slate-100">
        {/* Navy Header with Green Accent */}
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden border-b-4 border-emerald-500">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <ShieldCheck size={120} className="text-white" />
          </div>
          
          {/* Icon Container instead of Image Logo */}
          <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-[20px] shadow-lg mb-6 p-3 relative z-10 mx-auto overflow-hidden">
            <ShieldCheck className="text-emerald-600" size={64} />
          </div>
          
          <h2 className="text-2xl font-black text-white tracking-widest uppercase">SDMS Portal</h2>
          <p className="text-emerald-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">ETP Nyarurema Management</p>
        </div>

        <div className="p-10 bg-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="name@school.edu"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                <button type="button" className="text-[10px] text-emerald-600 font-black hover:underline uppercase tracking-tighter">Request Reset</button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-2xl text-[11px] font-bold border border-red-100 animate-in slide-in-from-top-2">
                <Info size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center group disabled:opacity-70 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="uppercase tracking-[0.2em] text-xs font-black">Initialize Access</span>
                  <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <button 
              onClick={() => { setEmail('administrator@school.edu'); setPassword('admin123'); }}
              className="px-6 py-2.5 bg-slate-50 text-slate-600 text-[10px] font-black rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-widest border border-slate-200"
            >
              Log in as Administrator
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase opacity-50">Secure Academic Enterprise Architecture</p>
      </div>
    </div>
  );
};

export default Login;


import React, { useState } from 'react';
import { User, Role, LoginEvent, AcademicYear, DisciplineCase, WeekendDismissal, TOTAL_BASE_MARKS } from '../types';
import { Plus, Edit2, Trash2, X, ShieldCheck, Mail, UserCircle, Key, Activity, Clock, Monitor, Archive, RotateCcw, Calendar, History, ShieldAlert, BookOpen, AlertCircle, TrendingDown, ChevronRight, Hash } from 'lucide-react';

interface UserManagementProps {
  systemUsers: User[];
  onAddUser: (u: User) => void;
  onUpdateUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
  currentUser: User;
  loginEvents: LoginEvent[];
  academicYears: AcademicYear[];
  onEndYear: (label: string) => void;
  onSwitchTerm: (term: number) => void;
  activeTerm: number;
  historicalCases: DisciplineCase[];
  historicalDismissals: WeekendDismissal[];
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  systemUsers, onAddUser, onUpdateUser, onDeleteUser, currentUser, loginEvents,
  academicYears, onEndYear, onSwitchTerm, activeTerm, historicalCases, historicalDismissals
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [viewingYear, setViewingYear] = useState<AcademicYear | null>(null);
  const [newYearLabel, setNewYearLabel] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    fullName: '', email: '', password: '', role: 'Staff'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) onUpdateUser({ ...formData, id: editingUser.id });
    else onAddUser({ ...formData, id: `USR-${Date.now()}` });
    closeModal();
  };

  const handleEndYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearLabel.trim()) return;
    onEndYear(newYearLabel);
    setIsYearModalOpen(false);
    setNewYearLabel('');
  };

  const closeModal = () => {
    setEditingUser(null);
    setFormData({ fullName: '', email: '', password: '', role: 'Staff' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Session Controls */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Session Lifecycle</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configure academic periods and data archival</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <div className="flex items-center bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
               <span className="text-[10px] font-black text-slate-400 uppercase px-4 border-r border-slate-100 mr-2">Jump Term:</span>
               <div className="flex space-x-1">
                 {[1, 2, 3].map(t => (
                   <button 
                     key={t}
                     onClick={() => onSwitchTerm(t)}
                     className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                       activeTerm === t 
                       ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                       : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                     }`}
                   >
                     {t}
                   </button>
                 ))}
               </div>
            </div>
            <button 
              onClick={() => setIsYearModalOpen(true)}
              className="flex items-center space-x-3 px-8 py-4 bg-rose-600 text-white rounded-[1.5rem] hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/20 active:scale-95 group font-black uppercase text-[10px] tracking-widest"
            >
              <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
              <span>Finalize Year</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicYears.map(year => (
            <div key={year.id} className={`bg-white p-10 rounded-[2.5rem] border ${year.status === 'Current' ? 'border-emerald-200 bg-emerald-50/20 ring-4 ring-emerald-500/5' : 'border-slate-100'} shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500`}>
              {year.status === 'Current' && (
                <div className="absolute top-0 right-0 p-6">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
              )}
              <div className="mb-8">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center mb-6 shadow-inner ${year.status === 'Current' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {year.status === 'Current' ? <Activity size={28} /> : <Archive size={28} />}
                </div>
                <h4 className="font-black text-slate-800 text-xl uppercase tracking-tight">{year.label}</h4>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className={`px-3 py-1 text-[9px] font-black rounded-xl uppercase tracking-widest border ${year.status === 'Current' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {year.status}
                  </span>
                  <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <Calendar size={12} className="mr-1.5" />
                    <span>Incepted: {year.startDate.split('T')[0]}</span>
                  </div>
                </div>
                {year.status === 'Current' && (
                  <div className="mt-6 flex items-center space-x-2 text-[10px] font-black uppercase text-emerald-600 bg-emerald-100/50 px-3 py-1.5 rounded-xl w-fit">
                    <Hash size={12} />
                    <span>Processing Term {activeTerm}</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setViewingYear(year)}
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 ${
                  year.status === 'Current' 
                  ? 'bg-slate-900 text-white hover:bg-black' 
                  : 'bg-white border-2 border-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                }`}
              >
                <span>Audit Archives</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Operator Registry */}
      <section className="space-y-6">
        <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Credential Management</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Authorized system operators</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Operator</span>
          </button>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Clearance Role</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {systemUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-inner">
                        <UserCircle size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 flex items-center uppercase tracking-tight">
                          {u.fullName} {u.id === currentUser.id && <span className="ml-3 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded uppercase border border-emerald-100 tracking-widest">Self</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold tracking-tight lowercase">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border tracking-[0.1em] ${
                      u.role === 'Administrator' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      u.role === 'Admin' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => { setEditingUser(u); setFormData({fullName: u.fullName, email: u.email, password: u.password||'', role: u.role}); setIsModalOpen(true); }} 
                        className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                      >
                        <Edit2 size={18}/>
                      </button>
                      {u.id !== currentUser.id && u.id !== 'USR-ROOT' && (
                        <button 
                          onClick={() => onDeleteUser(u.id)} 
                          className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <Trash2 size={18}/>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Year Archive Detail Modal */}
      {viewingYear && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col my-auto animate-in zoom-in duration-500">
            <div className="p-12 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 pointer-events-none">
                  <Archive size={280} />
               </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black uppercase tracking-tight">{viewingYear.label} Archives</h3>
                <div className="flex items-center space-x-3 mt-3">
                   <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em]">Historical Audit Log</span>
                   <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{viewingYear.startDate.split('T')[0]} to {viewingYear.endDate?.split('T')[0] || 'Present'}</span>
                </div>
              </div>
              <button onClick={() => setViewingYear(null)} className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:rotate-90 relative z-10 text-white">
                <X size={28}/>
              </button>
            </div>
            
            <div className="p-12 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-12 bg-slate-50/50 flex-1">
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center">
                    <ShieldAlert size={16} className="mr-3 text-rose-500"/> Infraction Ledger
                  </h4>
                  <div className="space-y-4">
                    {historicalCases.filter(c => c.yearId === viewingYear.id).length > 0 ? (
                      historicalCases.filter(c => c.yearId === viewingYear.id).map(c => (
                        <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm group hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-black text-slate-900 text-base uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{c.offenseType}</span>
                              <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest">Term {c.term}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium italic leading-relaxed">"{c.description}"</p>
                            <div className="flex items-center space-x-4 mt-3">
                               <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                                  <Calendar size={10} className="mr-1.5" /> {c.date}
                               </span>
                               <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                                  <UserCircle size={10} className="mr-1.5" /> By {c.recordedBy}
                               </span>
                            </div>
                          </div>
                          <div className="ml-8 text-right">
                            <span className="text-base font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100 shadow-sm">-{c.pointsDeducted}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white p-20 rounded-[3rem] border-4 border-slate-100 border-dashed text-center">
                        <AlertCircle size={48} className="mx-auto mb-6 text-slate-200" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Null session incidents</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 opacity-10">
                     <TrendingDown size={140} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 relative z-10">Archive Stat Block</h4>
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-black uppercase">Total Records</span>
                      <span className="text-2xl font-black">{historicalCases.filter(c => c.yearId === viewingYear.id).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-black uppercase">Total Loss</span>
                      <span className="text-2xl font-black text-rose-400">-{historicalCases.filter(c => c.yearId === viewingYear.id).reduce((s, c) => s + c.pointsDeducted, 0)}</span>
                    </div>
                    <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Status:</span>
                       <span className="text-[10px] font-black bg-white/10 text-slate-300 px-3 py-1 rounded-xl uppercase tracking-widest">{viewingYear.status}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-8 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Dismissal Snapshot</h4>
                  <div className="space-y-6">
                    {historicalDismissals.filter(d => d.yearId === viewingYear.id).length > 0 ? (
                      historicalDismissals.filter(d => d.yearId === viewingYear.id).map(d => (
                         <div key={d.id} className="group">
                            <div className="flex justify-between items-start mb-1">
                               <p className="font-black text-slate-800 text-xs uppercase tracking-tight line-clamp-1">{d.reason}</p>
                               <span className="text-[8px] font-black text-slate-400 uppercase">T{d.term}</span>
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{d.startDate} — {d.status}</p>
                         </div>
                      ))
                    ) : <p className="text-[10px] text-slate-300 italic font-black uppercase tracking-widest">No dismissal history</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Year Finalize Transition Modal */}
      {isYearModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-12 animate-in zoom-in duration-500 border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-rose-600"></div>
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center mb-8 border-4 border-rose-100 shadow-xl">
                 <ShieldAlert size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Close Current Cycle?</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">This destructive action will archive all Term 1-3 data. Students' points will reset to <span className="text-slate-900 font-black">{TOTAL_BASE_MARKS}</span>. Use with extreme caution.</p>
            </div>
            
            <form onSubmit={handleEndYear} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block ml-2">Label for Next Session</label>
                <div className="relative group">
                   <Calendar size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-600 transition-colors" />
                   <input 
                      required 
                      placeholder="e.g. Academic Year 2025" 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-rose-500/5 focus:border-rose-600 transition-all font-black text-slate-800" 
                      value={newYearLabel} 
                      onChange={e=>setNewYearLabel(e.target.value)} 
                    />
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <button 
                  type="submit" 
                  className="w-full py-5 bg-rose-600 text-white font-black rounded-[1.5rem] uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-rose-500/40 active:scale-95 transition-all"
                >
                  Finalize & Archive
                </button>
                <button 
                  type="button" 
                  onClick={()=>setIsYearModalOpen(false)} 
                  className="w-full py-5 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-50 rounded-[1.5rem] transition-all"
                >
                  Abort Operation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Operator Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-12 animate-in zoom-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{editingUser ? 'Profile Adjustment' : 'Operator Access'}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Configure security clearance</p>
              </div>
              <button onClick={closeModal} className="p-3 hover:bg-slate-50 rounded-full text-slate-300 transition-all hover:rotate-90"><X size={28}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Display Identity</label>
                <input required placeholder="Full Name" className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-black uppercase text-xs" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                <input required type="email" placeholder="name@school.edu" className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold lowercase text-xs" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Access Key</label>
                <input required type="password" placeholder="••••••••" className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-medium" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Authority Level</label>
                <select className="w-full px-6 py-4.5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-black text-[10px] appearance-none focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all uppercase tracking-[0.2em]" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value as Role})}>
                  <option value="Staff">Duty Staff Tier</option>
                  <option value="Admin">Administrative Tier</option>
                  <option value="Administrator">SuperUser Control</option>
                </select>
              </div>
              <button className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.5rem] shadow-2xl shadow-slate-900/20 mt-6 active:scale-95 transition-all uppercase tracking-[0.3em] text-xs">
                {editingUser ? 'Update Credentials' : 'Commit Enrollment'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;

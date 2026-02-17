
import React, { useState, useRef, useEffect } from 'react';
import { ExitPermission, Student, ACADEMIC_CLASSES } from '../types';
import { 
  Plane, 
  Search, 
  Plus, 
  X, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle, 
  ShieldAlert, 
  ChevronLeft, 
  Building2, 
  ArrowRightCircle,
  Clock
} from 'lucide-react';

interface ExitPermissionsProps {
  permissions: ExitPermission[];
  students: Student[];
  onAdd: (p: Omit<ExitPermission, 'id' | 'yearId' | 'term' | 'status'>) => void;
  onComplete: (id: string) => void;
}

const ExitPermissions: React.FC<ExitPermissionsProps> = ({ permissions, students, onAdd, onComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentResults, setShowStudentResults] = useState(false);
  const studentResultsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    reason: '',
    destination: '',
    parentContact: '',
    departureDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (studentResultsRef.current && !studentResultsRef.current.contains(event.target as Node)) {
        setShowStudentResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;
    onAdd(formData);
    closeModal();
  };

  const closeModal = () => {
    setFormData({
      studentId: '',
      reason: '',
      destination: '',
      parentContact: '',
      departureDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setStudentSearch('');
    setSelectedClass(null);
    setIsModalOpen(false);
  };

  const activeAway = permissions.filter(p => p.status === 'Away');
  const selectedStudent = students.find(s => s.id === formData.studentId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Exit Registry</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Managing {activeAway.length} active off-campus permits</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-emerald-700 text-white rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="font-black uppercase tracking-widest text-[10px]">Grant Permission</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {permissions.length > 0 ? (
          [...permissions].reverse().map((p) => {
            const student = students.find(s => s.id === p.studentId);
            const isLate = p.status === 'Away' && new Date(p.expectedReturnDate) < new Date();
            
            return (
              <div key={p.id} className={`bg-white rounded-[2.5rem] shadow-sm border p-8 flex flex-col space-y-6 transition-all hover:shadow-xl relative overflow-hidden group ${
                p.status === 'Away' 
                  ? isLate ? 'border-l-8 border-l-rose-500 border-slate-100 bg-rose-50/10' : 'border-l-8 border-l-emerald-500 border-slate-100' 
                  : 'border-slate-100 opacity-60 grayscale-[0.5]'
              }`}>
                {p.status === 'Away' && (
                  <div className="absolute top-0 right-0 p-4">
                    <span className="flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLate ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${isLate ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-lg border-4 border-white">
                      {student?.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xl leading-none uppercase tracking-tight">{student?.fullName}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2 bg-slate-100 px-3 py-1 rounded-lg w-fit">
                        {student?.class} • {student?.regNumber}
                      </p>
                    </div>
                  </div>
                  <span className={`px-5 py-2 text-[10px] font-black rounded-xl uppercase tracking-widest border shadow-sm ${
                    p.status === 'Away' 
                      ? isLate ? 'bg-rose-600 text-white border-rose-500' : 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {isLate ? 'OVERDUE' : p.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-3xl space-y-2 border border-slate-100 group-hover:bg-white transition-colors">
                    <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <MapPin size={12} className="mr-2 text-emerald-600" /> Home Destination
                    </div>
                    <p className="text-sm text-slate-800 font-black tracking-tight">{p.destination}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-3xl space-y-2 border border-slate-100 group-hover:bg-white transition-colors">
                    <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <Phone size={12} className="mr-2 text-blue-600" /> Parent Contact
                    </div>
                    <p className="text-sm text-slate-800 font-black tracking-tight">{p.parentContact}</p>
                  </div>
                </div>

                <div className="bg-slate-900/5 p-6 rounded-3xl space-y-3 border border-slate-100 italic relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <ShieldAlert size={40} />
                  </div>
                  <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <ShieldAlert size={12} className="mr-2 text-amber-500" /> Authorized Reason
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">"{p.reason}"</p>
                </div>

                <div className="grid grid-cols-2 gap-8 text-[10px] font-black uppercase tracking-widest pt-2">
                  <div className="space-y-2">
                    <span className="text-slate-400 flex items-center">
                      <Clock size={12} className="mr-1.5" /> Departure
                    </span>
                    <div className="text-slate-800 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-fit">
                      {p.departureDate}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-slate-400 flex items-center">
                      <Calendar size={12} className="mr-1.5" /> Expected Re-entry
                    </span>
                    <div className={`px-4 py-2 rounded-xl border w-fit ${isLate ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-800 border-slate-100'}`}>
                      {p.expectedReturnDate}
                    </div>
                  </div>
                </div>

                {p.status === 'Away' && (
                  <button 
                    onClick={() => onComplete(p.id)}
                    className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-slate-900/20 active:scale-[0.98] uppercase tracking-[0.2em] text-[10px] mt-2 group"
                  >
                    <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Confirm Student Return & Log Re-entry</span>
                  </button>
                )}
                
                {p.status === 'Returned' && (
                  <div className="flex items-center justify-center space-x-2 py-4 text-emerald-600 bg-emerald-50 rounded-3xl border border-emerald-100 font-black uppercase text-[10px] tracking-widest">
                    <CheckCircle size={16} />
                    <span>Archive: Student Returned Safely</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="lg:col-span-2 py-32 text-center bg-white rounded-[3rem] border-4 border-slate-100 border-dashed">
            <div className="inline-flex p-10 rounded-[2.5rem] bg-slate-50 mb-8 border border-slate-100 shadow-inner">
              <Plane size={80} className="text-slate-200" />
            </div>
            <p className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Registry Clear</p>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] mt-4 max-w-sm mx-auto leading-relaxed">No students are currently away on authorized leave.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-500 my-auto border border-white/20">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-xl shadow-emerald-500/20">
                  <Plane size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Exit Authorization</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Terminal Registry Portal</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-900 bg-white p-3 rounded-full shadow-sm transition-all hover:rotate-90">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              {!selectedClass ? (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-2">
                    <Building2 className="text-emerald-600" size={20} />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Step 1: Choose School Section</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {ACADEMIC_CLASSES.map(cls => {
                      const countInClass = students.filter(s => s.class === cls).length;
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setSelectedClass(cls)}
                          className="p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group relative overflow-hidden"
                        >
                          <span className="text-[8px] font-black text-slate-400 group-hover:text-emerald-600 uppercase mb-1 block tracking-widest">Cohort</span>
                          <span className="text-sm font-black text-slate-800">{cls}</span>
                          <div className="mt-3 text-[9px] font-bold text-slate-400 uppercase">{countInClass} Students</div>
                          <ArrowRightCircle className="absolute bottom-4 right-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : !selectedStudent ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setSelectedClass(null)} className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline bg-emerald-50 px-4 py-2 rounded-xl">
                      <ChevronLeft size={14} className="mr-2" /> Switch Cohort
                    </button>
                    <div className="flex items-center space-x-2">
                       <User className="text-slate-400" size={16} />
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Step 2: Subject Identification</h4>
                    </div>
                  </div>
                  <div className="relative group">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search name in this class..."
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 font-black uppercase text-xs tracking-widest"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {students.filter(s => s.class === selectedClass && (s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || s.regNumber.toLowerCase().includes(studentSearch.toLowerCase()))).map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setFormData({...formData, studentId: s.id, parentContact: s.parentContact});
                        }}
                        className="w-full p-5 flex items-center justify-between bg-white border-2 border-slate-50 rounded-3xl hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left shadow-sm group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                            {s.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{s.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{s.regNumber}</p>
                          </div>
                        </div>
                        <Plus size={18} className="text-emerald-600 group-hover:scale-125 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <User size={120} />
                      </div>
                      <div className="flex items-center space-x-5 relative z-10">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl border-4 border-white/10">
                          {selectedStudent.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-black uppercase tracking-tight">{selectedStudent.fullName}</p>
                          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mt-1">{selectedStudent.regNumber} • {selectedStudent.class}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setFormData({...formData, studentId: ''})} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all relative z-10">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Formal Reason for Travel</label>
                        <input required type="text" className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold text-slate-800" placeholder="e.g. End of Semester Holiday, Family Emergency" value={formData.reason} onChange={e=>setFormData({...formData, reason: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Final Destination</label>
                        <div className="relative group">
                          <MapPin size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input required type="text" className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold text-slate-800" placeholder="Town/District" value={formData.destination} onChange={e=>setFormData({...formData, destination: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Emergency Parent Contact</label>
                        <div className="relative group">
                          <Phone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input required type="tel" className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold text-slate-800" value={formData.parentContact} onChange={e=>setFormData({...formData, parentContact: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Departure Date</label>
                        <input required type="date" className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold text-slate-800" value={formData.departureDate} onChange={e=>setFormData({...formData, departureDate: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Anticipated Return</label>
                        <input required type="date" className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold text-slate-800" value={formData.expectedReturnDate} onChange={e=>setFormData({...formData, expectedReturnDate: e.target.value})} />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex justify-end space-x-4">
                      <button type="button" onClick={closeModal} className="px-10 py-5 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-[1.5rem] transition-all">Abort</button>
                      <button type="submit" className="px-12 py-5 bg-slate-900 text-white font-black rounded-[1.5rem] hover:bg-black transition-all shadow-2xl shadow-slate-900/40 active:scale-95 uppercase tracking-[0.2em] text-[10px]">Verify & Authorize</button>
                    </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitPermissions;

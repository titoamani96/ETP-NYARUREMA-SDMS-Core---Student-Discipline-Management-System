
import React, { useState, useRef, useEffect } from 'react';
import { Student, DisciplineCase, Role } from '../types';
import { Search, Plus, X, ShieldAlert, MinusCircle, User, Calendar, Edit2, Trash2 } from 'lucide-react';

interface CasesProps {
  students: Student[];
  cases: DisciplineCase[];
  activeTerm: number;
  onAdd: (c: DisciplineCase) => void;
  onUpdate: (c: DisciplineCase) => void;
  onDelete: (id: string) => void;
  userRole: Role;
}

const Cases: React.FC<CasesProps> = ({ students, cases, activeTerm, onAdd, onUpdate, onDelete, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<DisciplineCase | null>(null);

  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentResults, setShowStudentResults] = useState(false);
  const studentResultsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Omit<DisciplineCase, 'id'>>({
    studentId: '',
    yearId: '',
    term: activeTerm,
    offenseType: '',
    description: '',
    actionTaken: 'None',
    date: new Date().toISOString().split('T')[0],
    recordedBy: userRole,
    pointsDeducted: 0 
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

  const filteredCases = cases.filter(c => {
    const student = students.find(s => s.id === c.studentId);
    return (
      student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.offenseType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;
    if (editingCase) {
      onUpdate({ ...formData, id: editingCase.id });
    } else {
      onAdd({ ...formData, id: `CASE-${Date.now()}` });
    }
    closeModal();
  };

  const openEdit = (c: DisciplineCase) => {
    setEditingCase(c);
    setFormData({
      studentId: c.studentId,
      yearId: c.yearId,
      term: c.term,
      offenseType: c.offenseType,
      description: c.description,
      actionTaken: c.actionTaken,
      date: c.date,
      recordedBy: c.recordedBy,
      pointsDeducted: c.pointsDeducted
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCase(null);
    setFormData({
      studentId: '',
      yearId: '',
      term: activeTerm,
      offenseType: '',
      description: '',
      actionTaken: 'None',
      date: new Date().toISOString().split('T')[0],
      recordedBy: userRole,
      pointsDeducted: 0
    });
    setStudentSearch('');
    setIsModalOpen(false);
  };

  const matchedStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.regNumber.toLowerCase().includes(studentSearch.toLowerCase())
  ).slice(0, 5);

  const selectedStudent = students.find(s => s.id === formData.studentId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search incident records..." 
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-8 py-3.5 bg-emerald-700 text-white rounded-2xl hover:bg-emerald-800 transition-all w-full sm:w-auto justify-center shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <Plus size={20} />
          <span className="font-bold uppercase tracking-tight">File New Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCases.slice().reverse().map(c => {
          const student = students.find(s => s.id === c.studentId);
          return (
            <div key={c.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col space-y-4 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 flex items-center space-x-2">
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(c)} className="p-1.5 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-emerald-600 shadow-sm transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(c.id)} className="p-1.5 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-red-600 shadow-sm transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 uppercase tracking-widest">
                  -{c.pointsDeducted} Marks
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-xl border border-slate-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  {student?.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">{student?.fullName || 'Removed Student'}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{student?.regNumber} • {student?.class}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest bg-slate-900 text-white">
                    {c.offenseType}
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${
                    c.actionTaken === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    c.actionTaken === 'Weekend' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    c.actionTaken === 'Dismissal' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {c.actionTaken}
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed italic line-clamp-3">
                  "{c.description}"
                </p>
              </div>

              <div className="pt-4 mt-auto border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1.5" />
                  {c.date}
                </div>
                <div className="flex items-center">
                  <User size={12} className="mr-1.5" />
                  By: {c.recordedBy}
                </div>
              </div>
            </div>
          ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-700 text-white rounded-xl">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{editingCase ? 'Modify Incident' : 'Incident Report'}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-widest">Record new behavioral data</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm transition-transform hover:rotate-90">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                <div className="relative" ref={studentResultsRef}>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject Student</label>
                  {selectedStudent ? (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in slide-in-from-left-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                          {selectedStudent.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{selectedStudent.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedStudent.regNumber} • {selectedStudent.class}</p>
                        </div>
                      </div>
                      {!editingCase && (
                        <button 
                          type="button" 
                          onClick={() => { setFormData({...formData, studentId: ''}); setStudentSearch(''); }}
                          className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        required 
                        type="text" 
                        placeholder="Search student by name or ID..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                        value={studentSearch}
                        onChange={(e) => { setStudentSearch(e.target.value); setShowStudentResults(true); }}
                        onFocus={() => setShowStudentResults(true)}
                      />
                      {showStudentResults && studentSearch && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden divide-y divide-slate-50 animate-in fade-in slide-in-from-top-2">
                          {matchedStudents.map(s => (
                            <button 
                              key={s.id}
                              type="button"
                              className="w-full p-4 flex items-center space-x-3 hover:bg-slate-50 text-left transition-colors"
                              onClick={() => {
                                setFormData({...formData, studentId: s.id});
                                setShowStudentResults(false);
                              }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                                {s.fullName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{s.fullName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{s.regNumber} • {s.class}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Offense Nature</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                      value={formData.offenseType}
                      onChange={(e) => setFormData({...formData, offenseType: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Incident Date</label>
                    <input 
                      required 
                      type="date" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description & Context</label>
                  <textarea 
                    required 
                    className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Decided Action</label>
                    <select 
                      required 
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                      value={formData.actionTaken}
                      onChange={(e) => setFormData({...formData, actionTaken: e.target.value as any})}
                    >
                      <option value="None">No Action</option>
                      <option value="Warning">Warning</option>
                      <option value="Weekend">Weekend Dismissal</option>
                      <option value="Dismissal">Expulsion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                      Points Deduction <MinusCircle size={12} className="ml-1.5 text-rose-500" />
                    </label>
                    <input 
                      required 
                      type="number" 
                      min="0" 
                      max="40"
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-rose-600"
                      value={formData.pointsDeducted}
                      onChange={(e) => setFormData({...formData, pointsDeducted: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-8 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest text-xs"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-4 bg-emerald-700 text-white font-black rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 uppercase tracking-widest text-xs"
                >
                  {editingCase ? 'Update Record' : 'Commit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;

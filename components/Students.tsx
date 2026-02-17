
import React, { useState } from 'react';
import { Student, Role, ACADEMIC_CLASSES, DisciplineCase, TOTAL_BASE_MARKS } from '../types';
import { Search, Plus, Edit2, Trash2, X, AlertCircle, Phone, History, Calendar, LayoutGrid, ChevronLeft, ShieldAlert } from 'lucide-react';

interface StudentsProps {
  students: Student[];
  cases: DisciplineCase[];
  onAdd: (s: Student) => void;
  onUpdate: (s: Student) => void;
  onDelete: (id: string) => void;
  userRole: Role;
}

const Students: React.FC<StudentsProps> = ({ students, cases, onAdd, onUpdate, onDelete, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  
  const [selectedClassView, setSelectedClassView] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    fullName: '',
    regNumber: '',
    class: ACADEMIC_CLASSES[0],
    gender: 'Male',
    parentContact: ''
  });

  const getStudentMarks = (studentId: string) => {
    const studentCases = cases.filter(c => c.studentId === studentId);
    const removed = studentCases.reduce((sum, c) => sum + (c.pointsDeducted || 0), 0);
    const remaining = TOTAL_BASE_MARKS - removed;
    return { removed, remaining, list: studentCases };
  };

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClassView ? s.class === selectedClassView : true;
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.regNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdate({ ...formData, id: editingStudent.id });
    } else {
      onAdd({ ...formData, id: `STU-${Date.now()}` });
    }
    closeModal();
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({
      fullName: s.fullName,
      regNumber: s.regNumber,
      class: s.class,
      gender: s.gender,
      parentContact: s.parentContact
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingStudent(null);
    setFormData({ fullName: '', regNumber: '', class: ACADEMIC_CLASSES[0], gender: 'Male', parentContact: '' });
    setIsModalOpen(false);
  };

  const canEdit = userRole !== 'Staff';

  if (!selectedClassView) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Academic Cohorts</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Select a class to manage students</p>
          </div>
          {canEdit && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              <Plus size={20} />
              <span className="font-bold">Enroll Student</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ACADEMIC_CLASSES.map((cls) => {
            const studentCount = students.filter(s => s.class === cls).length;
            return (
              <button
                key={cls}
                onClick={() => setSelectedClassView(cls)}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                  <LayoutGrid size={64} />
                </div>
                <div className="flex flex-col h-full justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">Official Cohort</span>
                    <h4 className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{cls}</h4>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase">{studentCount} Students</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
                      <ChevronLeft className="rotate-180" size={16} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {isModalOpen && renderEnrollmentModal()}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <button 
            onClick={() => { setSelectedClassView(null); setSearchTerm(''); }}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase">{selectedClassView}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Enrollment Roster</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search in class..." 
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {canEdit && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="font-bold text-sm">Enroll</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Points Deducted</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Balance (/40)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => {
                  const { removed, remaining } = getStudentMarks(s.id);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            {s.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{s.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-bold flex items-center">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded mr-2">{s.regNumber}</span>
                              <Phone size={10} className="mr-1" /> {s.parentContact}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setHistoryStudent(s)}
                          className={`text-sm font-black px-3 py-1 rounded-full border transition-all hover:scale-105 ${removed > 0 ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-slate-300 bg-slate-50 border-slate-100'}`}
                        >
                          -{removed}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <span className={`text-sm font-black px-3 py-1 rounded-full border ${
                                remaining > 25 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                                remaining > 10 ? 'text-amber-700 bg-amber-50 border-amber-100' : 
                                'text-red-700 bg-red-50 border-red-200'
                            }`}>
                                {remaining}
                            </span>
                            {remaining <= 10 && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {canEdit && (
                          <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setHistoryStudent(s)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                              <History size={16} />
                            </button>
                            <button onClick={() => openEdit(s)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                              <Edit2 size={16} />
                            </button>
                            {userRole === 'Administrator' && (
                              <button onClick={() => onDelete(s.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium italic">
                    No students enrolled in this class matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && renderEnrollmentModal()}
      {historyStudent && renderHistoryModal()}
    </div>
  );

  function renderHistoryModal() {
    const { list } = getStudentMarks(historyStudent!.id);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 text-white rounded-xl">
                <History size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Student Incident Audit</h3>
                <p className="text-xs text-slate-500 font-medium">{historyStudent!.fullName} • {historyStudent!.regNumber}</p>
              </div>
            </div>
            <button onClick={() => setHistoryStudent(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X size={24} />
            </button>
          </div>
          <div className="p-8 max-h-[60vh] overflow-y-auto">
            {list.length > 0 ? (
              <div className="space-y-6">
                {list.slice().reverse().map((c) => (
                  <div key={c.id} className="relative pl-8 border-l-2 border-slate-100 pb-2">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 tracking-widest">{c.offenseType}</span>
                        <div className="flex items-center text-[10px] text-slate-400 font-bold">
                          <Calendar size={12} className="mr-1" /> {c.date}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-700 italic mb-2">"{c.description}"</p>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                        <div className="flex items-center text-slate-400">
                          <ShieldAlert size={12} className="mr-1" /> Action: {c.actionTaken}
                        </div>
                        <span className="text-rose-600">-{c.pointsDeducted} Points</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Exemplary Record - No Incidents Found</p>
              </div>
            )}
          </div>
          <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end">
            <button 
              onClick={() => setHistoryStudent(null)}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
            >
              Close Record
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderEnrollmentModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{editingStudent ? 'Update Profile' : 'Enroll New Student'}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Fill in the student's official records</p>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm">
              <X size={24} />
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Student Name</label>
                  <input 
                    required type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Registration ID</label>
                  <input 
                    required type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.regNumber}
                    onChange={(e) => setFormData({...formData, regNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Class</label>
                  <select 
                    required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                  >
                    {ACADEMIC_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Parent Contact</label>
                  <input 
                    required type="tel" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.parentContact}
                    onChange={(e) => setFormData({...formData, parentContact: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95">{editingStudent ? 'Update' : 'Enroll'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default Students;

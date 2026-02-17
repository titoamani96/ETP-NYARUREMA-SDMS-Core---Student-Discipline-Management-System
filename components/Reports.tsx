
import React, { useState, useMemo } from 'react';
import { Student, DisciplineCase } from '../types';
import { Printer, Filter, CheckSquare, BookOpen, ShieldCheck } from 'lucide-react';

interface ReportsProps {
  students: Student[];
  cases: DisciplineCase[];
  currentTerm: number;
}

const Reports: React.FC<ReportsProps> = ({ students, cases, currentTerm }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState<string>(currentTerm.toString());

  const classes = useMemo(() => {
    return ['All', ...Array.from(new Set(students.map(s => s.class)))].sort();
  }, [students]);

  const filteredData = useMemo(() => {
    return cases.filter(c => {
      const student = students.find(s => s.id === c.studentId);
      const inClass = selectedClass === 'All' || student?.class === selectedClass;
      const inTerm = selectedTerm === 'All' || c.term.toString() === selectedTerm;
      const afterStart = !dateRange.start || c.date >= dateRange.start;
      const beforeEnd = !dateRange.end || c.date <= dateRange.end;
      return inClass && inTerm && afterStart && beforeEnd;
    });
  }, [cases, students, selectedClass, selectedTerm, dateRange]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (filteredData.length === 0) return;

    const headers = ['Date', 'Term', 'Student Name', 'Reg Number', 'Class', 'Offense Type', 'Description', 'Action Taken', 'Points Deducted', 'Recorded By'];
    
    const rows = filteredData.map(c => {
      const student = students.find(s => s.id === c.studentId);
      return [
        c.date,
        c.term,
        student?.fullName || 'N/A',
        student?.regNumber || 'N/A',
        student?.class || 'N/A',
        c.offenseType,
        `"${c.description.replace(/"/g, '""')}"`,
        c.actionTaken,
        c.pointsDeducted,
        c.recordedBy
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SDMS_Discipline_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Control Panel */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 print-hidden">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
            <Filter size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Audit Parameters</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Define your report scope</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cycle Start Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cycle End Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Academic Term</label>
            <select 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none font-black"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="All">All Terms</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Academic Cohort</label>
            <select 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none font-black"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button 
              onClick={handlePrint}
              disabled={filteredData.length === 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-bold text-sm shadow-xl shadow-slate-900/10 disabled:opacity-50 active:scale-95"
            >
              <Printer size={18} />
              <span className="uppercase tracking-widest text-[10px] font-black">Generate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none">
        <div className="p-12 md:p-16 border-b-8 border-slate-900 bg-slate-50/30 relative">
          <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
             <BookOpen size={240} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-10 relative z-10">
            <div className="flex items-center space-x-8">
              <div className="w-32 h-32 bg-white rounded-3xl p-3 shadow-xl flex items-center justify-center">
                 <ShieldCheck className="text-emerald-600" size={80} />
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Discipline Audit</h1>
                <p className="text-emerald-600 font-black mt-4 uppercase tracking-[0.2em] text-sm">ETP NYARUREMA • Behavioral Registry</p>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="text-[10px] font-black bg-emerald-600 text-white px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">Official Transcript</span>
                  <span className="text-[10px] font-black bg-slate-900 text-white px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">Verified Term Records</span>
                </div>
              </div>
            </div>
            <div className="p-8 border-8 border-slate-900 flex flex-col items-center justify-center bg-white min-w-[160px] shadow-2xl">
              <CheckSquare size={48} className="text-slate-900" />
              <span className="text-[10px] font-black mt-3 uppercase tracking-tighter text-center leading-none">MASTER LOG<br/>AUTHENTICATED</span>
            </div>
          </div>
          
          {/* ... existing rest of report ... */}
        </div>
      </div>
    </div>
  );
};

export default Reports;

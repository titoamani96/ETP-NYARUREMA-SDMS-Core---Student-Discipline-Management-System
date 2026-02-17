
import React from 'react';
import { WeekendDismissal, Student } from '../types';
import { Home, Calendar, CheckCircle, ShieldAlert } from 'lucide-react';

interface WeekendDismissalsProps {
  dismissals: WeekendDismissal[];
  students: Student[];
  onComplete: (id: string) => void;
}

const WeekendDismissals: React.FC<WeekendDismissalsProps> = ({ dismissals, students, onComplete }) => {
  const activeCount = dismissals.filter(d => d.status === 'Active').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with quick stats only */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Weekend Duty Roster</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Managing {activeCount} active dismissals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dismissals.length > 0 ? (
          [...dismissals].reverse().map((d) => {
            const student = students.find(s => s.id === d.studentId);
            return (
              <div key={d.id} className={`bg-white rounded-3xl shadow-sm border p-8 space-y-6 transition-all hover:shadow-xl relative overflow-hidden group ${
                d.status === 'Active' ? 'border-l-8 border-l-red-500 border-slate-100' : 'border-slate-100 opacity-60'
              }`}>
                {d.status === 'Active' && (
                  <div className="absolute top-0 right-0 p-2">
                    <div className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-widest animate-pulse">
                      Urgent Clearance
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-xl border-2 border-slate-50 group-hover:border-red-100 transition-colors">
                      {student?.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg leading-none">{student?.fullName}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{student?.class} • {student?.regNumber}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${
                    d.status === 'Active' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl space-y-2 border border-slate-100 group-hover:bg-white transition-colors">
                  <div className="flex items-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldAlert size={12} className="mr-1.5 text-red-500" /> Ground for Dismissal
                  </div>
                  <p className="text-sm text-slate-700 font-bold leading-relaxed">{d.reason}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-[11px] font-bold">
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase tracking-tighter">Departure Timestamp</span>
                    <div className="flex items-center text-slate-700">
                      <Calendar size={14} className="mr-2 text-blue-500" /> {d.startDate}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase tracking-tighter">Target Re-entry</span>
                    <div className="flex items-center text-slate-700">
                      <Calendar size={14} className="mr-2 text-amber-500" /> {d.returnDate}
                    </div>
                  </div>
                </div>

                {d.status === 'Active' && (
                  <button 
                    onClick={() => onComplete(d.id)}
                    className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                  >
                    <CheckCircle size={20} />
                    <span className="uppercase tracking-widest text-xs">Verify Guardian & Re-admit</span>
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 py-32 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="inline-flex p-8 rounded-full bg-slate-50 mb-6">
              <Home size={64} className="text-slate-200" />
            </div>
            <p className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Null active dismissals</p>
            <p className="text-sm text-slate-400 font-medium mt-2">All students are currently present within school boundaries.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekendDismissals;


import React, { useState } from 'react';
import { Student, DisciplineCase, WeekendDismissal, ExitPermission } from '../types';
import { Users, ShieldAlert, TrendingDown, Home, MinusCircle, Filter, Plane, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardProps {
  students: Student[];
  cases: DisciplineCase[];
  weekendDismissals?: WeekendDismissal[];
  exitPermissions?: ExitPermission[];
  currentTerm: number;
}

const Dashboard: React.FC<DashboardProps> = ({ students, cases, weekendDismissals = [], exitPermissions = [], currentTerm }) => {
  const [termFilter, setTermFilter] = useState<number | 'all'>(currentTerm);

  const filteredCases = termFilter === 'all' 
    ? cases 
    : cases.filter(c => c.term === termFilter);

  const filteredDismissals = termFilter === 'all'
    ? weekendDismissals
    : weekendDismissals.filter(d => d.term === termFilter);

  const filteredExitPermits = termFilter === 'all'
    ? exitPermissions
    : exitPermissions.filter(p => p.term === termFilter);

  const totalPointsDeducted = filteredCases.reduce((sum, c) => sum + (c.pointsDeducted || 0), 0);
  const totalIncidents = filteredCases.filter(c => (c.pointsDeducted || 0) > 0).length;
  const activeDismissals = filteredDismissals.filter(d => d.status === 'Active').length;
  const activeAwayCount = filteredExitPermits.filter(p => p.status === 'Away').length;

  const stats = [
    { label: 'Total Students', value: students.length, subValue: 'Enrolled roster', icon: Users, color: 'emerald' },
    { label: 'Incident Records', value: filteredCases.length, subValue: `Logged in ${termFilter === 'all' ? 'Year' : 'Term ' + termFilter}`, icon: ShieldAlert, color: 'emerald' },
    { label: 'Total Deductions', value: `-${totalPointsDeducted}`, subValue: `${totalIncidents} Infractions`, icon: MinusCircle, color: 'rose' },
    { label: 'Active Dismissals', value: activeDismissals, subValue: 'Away from school', icon: Home, color: 'amber' },
  ];

  const offenseData = Object.entries(
    filteredCases.reduce((acc, c) => {
      acc[c.offenseType] = (acc[c.offenseType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }));

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#ecfdf5'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Filter size={18} />
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Dashboard Context:</span>
        </div>
        <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200">
          {[1, 2, 3, 'all'].map((t) => (
            <button
              key={t}
              onClick={() => setTermFilter(t as any)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                termFilter === t 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'all' ? 'Full Year' : `Term ${t}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform`}>
               <stat.icon size={48} />
            </div>
            <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-tight">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 leading-none my-1">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.subValue}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Infraction Distribution</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Type-based mapping for {termFilter === 'all' ? 'Academic Year' : 'Term ' + termFilter}</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={offenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <YAxis fontSize={9} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 700 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                  {offenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 text-white flex flex-col justify-between overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
              <Plane size={160} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                 <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Plane size={16} className="text-emerald-400" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Exit Registry Alert</h4>
              </div>
              <p className="text-2xl font-black leading-tight tracking-tighter">
                There are currently <span className="text-emerald-400">{activeAwayCount}</span> students away from campus on authorized leave.
              </p>
              <div className="mt-4 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <Clock size={12} className="mr-1.5" /> Monitoring Live Status
              </div>
           </div>
           
           <div className="pt-10 relative z-10">
              <Link 
                to="/exit-permissions"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-xl shadow-emerald-900/40 active:scale-95 group/btn"
              >
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Permit Details</span>
                 <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Recent Incident Log</h3>
          <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl uppercase tracking-widest">Live Feed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Offense Nature</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark Deduction</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCases.slice(-5).reverse().map((c) => {
                const student = students.find(s => s.id === c.studentId);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-xs uppercase border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          {student?.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 transition-colors">{student?.fullName || 'Anonymous'}</p>
                          <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">{student?.regNumber} • {student?.class}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-700 font-bold">{c.offenseType}</span>
                        <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded uppercase">Term {c.term}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                        -{c.pointsDeducted}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">{c.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

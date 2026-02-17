
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Student, DisciplineCase } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  FileBarChart, 
  LogOut, 
  UserCircle,
  Bell,
  Clock,
  MessageSquare,
  Home,
  Menu,
  X,
  ShieldCheck,
  Calendar,
  Plane
} from 'lucide-react';

interface LayoutProps {
  user: User;
  students: Student[];
  cases: DisciplineCase[];
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, students, cases, onLogout, children }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastSeenCaseId, setLastSeenCaseId] = useState<string | null>(() => {
    return localStorage.getItem('sdms_last_seen_case_id');
  });
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Students', path: '/students', icon: Users },
    { label: 'Discipline Cases', path: '/cases', icon: ShieldAlert },
    { label: 'SMS History', path: '/sms-history', icon: MessageSquare },
    { label: 'Weekend Dismissals', path: '/weekend-dismissals', icon: Home },
    { label: 'Exit Permissions', path: '/exit-permissions', icon: Plane },
    { label: 'Reports', path: '/reports', icon: FileBarChart },
  ];

  if (user.role === 'Administrator' || user.role === 'Admin') {
    navItems.push({ label: 'System Access', path: '/users', icon: ShieldCheck });
  }

  const recentCases = [...cases].reverse().slice(0, 8);
  
  let newCasesCount = 0;
  if (cases.length > 0) {
    if (!lastSeenCaseId) {
      newCasesCount = cases.length;
    } else {
      const lastSeenIndex = cases.findIndex(c => c.id === lastSeenCaseId);
      if (lastSeenIndex === -1) {
        newCasesCount = cases.length;
      } else {
        newCasesCount = cases.length - 1 - lastSeenIndex;
      }
    }
  }

  const handleToggleNotifications = () => {
    const newShowState = !showNotifications;
    setShowNotifications(newShowState);
    if (newShowState && cases.length > 0) {
      const latestId = cases[cases.length - 1].id;
      setLastSeenCaseId(latestId);
      localStorage.setItem('sdms_last_seen_case_id', latestId);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
                <ShieldCheck className="text-emerald-600" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter text-emerald-400 uppercase leading-none">SDMS Core</h1>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-bold">ETP NYARUREMA</p>
              </div>
            </div>
            <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="h-px bg-slate-800 w-full mb-6 opacity-50"></div>
        </div>

        <nav className="flex-1 px-4 py-0 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
                location.pathname === item.path 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 mt-auto">
          <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/40 rounded-2xl mb-3">
            <div className="bg-slate-700/50 rounded-xl p-2">
              <UserCircle size={20} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-slate-100">{user.fullName}</p>
              <p className="text-[9px] text-slate-500 truncate uppercase tracking-widest font-black">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center relative print-hidden">
            <div className="flex items-center space-x-4">
              <button onClick={toggleSidebar} className="md:hidden p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600">
                <Menu size={22} />
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">
                  {navItems.find(item => item.path === location.pathname)?.label || 'System Overview'}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  <Calendar size={12} />
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4" ref={notificationRef}>
              <button 
                onClick={handleToggleNotifications}
                className={`p-3 rounded-2xl transition-all relative ${
                  showNotifications ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-white text-slate-500 hover:bg-slate-100 shadow-sm border border-slate-200'
                }`}
              >
                <Bell size={20} className={newCasesCount > 0 ? "animate-bounce" : ""} />
                {newCasesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-black">
                      {newCasesCount}
                    </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-16 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest">Incident Alerts</h3>
                    <span className="text-[10px] bg-rose-500 px-2.5 py-1 rounded-lg font-black uppercase">Live</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
                    {recentCases.length > 0 ? (
                      recentCases.map((c) => {
                        const student = students.find(s => s.id === c.studentId);
                        return (
                          <div key={c.id} className="p-5 hover:bg-slate-50 transition-colors cursor-default">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase border border-rose-100 tracking-widest">
                                -{c.pointsDeducted} Points
                              </span>
                              <div className="flex items-center text-[10px] text-slate-400 font-bold">
                                <Clock size={10} className="mr-1" /> {c.date}
                              </div>
                            </div>
                            <p className="text-sm font-black text-slate-800 truncate">{student?.fullName || 'Removed Student'}</p>
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter mb-1.5">{c.offenseType}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 italic font-medium leading-relaxed">"{c.description}"</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-10 text-center text-slate-400">
                        <ShieldAlert size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">No recent notifications</p>
                      </div>
                    )}
                  </div>
                  <Link 
                    to="/cases" 
                    onClick={() => setShowNotifications(false)}
                    className="block w-full text-center py-4 bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-500 transition-colors border-t border-slate-100 uppercase tracking-widest"
                  >
                    Enter Cases Portal
                  </Link>
                </div>
              )}
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

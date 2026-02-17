
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  User, 
  Student, 
  DisciplineCase, 
  SMSLog, 
  WeekendDismissal, 
  ExitPermission,
  LoginEvent,
  AcademicYear,
  TOTAL_BASE_MARKS 
} from './types';

// Components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Cases from './components/Cases';
import SMSHistory from './components/SMSHistory';
import WeekendDismissals from './components/WeekendDismissals';
import ExitPermissions from './components/ExitPermissions';
import Reports from './components/Reports';
import Login from './components/Login';
import UserManagement from './components/UserManagement';

// Services
import { sendActualSMS } from './services/smsService';
import { db } from './services/db';

const INITIAL_YEAR: AcademicYear = {
  id: 'YEAR-2024',
  label: 'Academic Year 2024',
  status: 'Current',
  startDate: '2024-01-01',
  currentTerm: 1
};

const INITIAL_STUDENTS: Student[] = [
  { id: 'STU-1', regNumber: 'L3/SOD/001', fullName: 'Kwame Mensah', class: 'L3 SOD A', gender: 'Male', parentContact: '+250 781 123 456' },
  { id: 'STU-2', regNumber: 'L4/AUT/012', fullName: 'Zainab Keita', class: 'L4 AUT A', gender: 'Female', parentContact: '+250 782 987 654' },
];

const DEFAULT_USERS: User[] = [
  { id: 'USR-ROOT', fullName: 'System Administrator', email: 'administrator@school.edu', password: 'admin123', role: 'Administrator' },
  { id: 'USR-STAFF', fullName: 'Duty Staff Member', email: 'staff@school.edu', password: 'staff123', role: 'Staff' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [activeYearId, setActiveYearId] = useState<string>('');
  const [activeTerm, setActiveTerm] = useState<number>(1);
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [cases, setCases] = useState<DisciplineCase[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);
  const [weekendDismissals, setWeekendDismissals] = useState<WeekendDismissal[]>([]);
  const [exitPermissions, setExitPermissions] = useState<ExitPermission[]>([]);
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);

  // Initial Load
  useEffect(() => {
    const data = db.loadFullDatabase();
    const users = db.getUsers();

    setYears(data.years.length ? data.years : [INITIAL_YEAR]);
    setActiveYearId(data.activeYearId || (data.years[0]?.id || INITIAL_YEAR.id));
    setActiveTerm(data.activeTerm);
    setSystemUsers(users.length ? users : DEFAULT_USERS);
    setStudents(data.students.length ? data.students : INITIAL_STUDENTS);
    setCases(data.cases);
    setSmsLogs(data.smsLogs);
    setWeekendDismissals(data.weekendDismissals);
    setExitPermissions(data.exitPermissions);
    setLoginEvents(data.loginEvents);
    setUser(data.user);
  }, []);

  // Sync with DB service on changes
  useEffect(() => {
    if (activeYearId) {
      db.saveState({ 
        user, students, cases, smsLogs, years, 
        activeYearId, activeTerm, weekendDismissals, 
        exitPermissions, loginEvents 
      });
    }
  }, [user, students, cases, smsLogs, years, activeYearId, activeTerm, weekendDismissals, exitPermissions, loginEvents]);

  useEffect(() => {
    if (systemUsers.length) db.saveUsers(systemUsers);
  }, [systemUsers]);

  const handleLogin = (u: User) => {
    const timestamp = new Date().toISOString();
    setUser(u);
    setSystemUsers(prev => prev.map(item => item.id === u.id ? { ...item, lastLogin: timestamp } : item));
    const newEvent: LoginEvent = {
      id: `EVT-${Date.now()}`,
      userId: u.id,
      userName: u.fullName,
      userRole: u.role,
      timestamp: timestamp,
      browserInfo: navigator.userAgent
    };
    setLoginEvents(prev => [newEvent, ...prev].slice(0, 100));
  };

  const handleLogout = () => {
    setUser(null);
  };

  const switchTerm = (term: number) => {
    setActiveTerm(term);
    setYears(prev => prev.map(y => y.id === activeYearId ? { ...y, currentTerm: term } : y));
  };

  const endAcademicYear = (newYearLabel: string) => {
    const timestamp = new Date().toISOString();
    const closedYears = years.map(y => y.status === 'Current' ? { ...y, status: 'Closed' as const, endDate: timestamp } : y);
    
    const newYear: AcademicYear = {
      id: `YEAR-${Date.now()}`,
      label: newYearLabel,
      status: 'Current',
      startDate: timestamp,
      currentTerm: 1
    };

    setYears([...closedYears, newYear]);
    setActiveYearId(newYear.id);
    setActiveTerm(1);
  };

  const isPrivileged = user?.role === 'Administrator' || user?.role === 'Admin';
  
  const activeCases = cases.filter(c => c.yearId === activeYearId);
  const activeDismissals = weekendDismissals.filter(d => d.yearId === activeYearId);
  const activeExitPermissions = exitPermissions.filter(p => p.yearId === activeYearId);

  const addStudent = (s: Student) => setStudents(prev => [...prev, s]);
  const updateStudent = (s: Student) => setStudents(prev => prev.map(item => item.id === s.id ? s : item));
  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(item => item.id !== id));
    setCases(prev => prev.filter(c => c.studentId !== id));
  };

  const addCase = async (c: DisciplineCase) => {
    const caseWithContext = { ...c, yearId: activeYearId, term: activeTerm };
    setCases(prev => [...prev, caseWithContext]);
    
    const student = students.find(s => s.id === c.studentId);
    if (student) {
      const smsId = `SMS-${Date.now()}`;
      const messageContent = `Official Notification: ${student.fullName} recorded with ${c.offenseType} in Term ${activeTerm}. Action: ${c.actionTaken}. Marks deducted: ${c.pointsDeducted}.`;
      setSmsLogs(prev => [...prev, { id: smsId, recipientName: student.fullName, phoneNumber: student.parentContact, message: messageContent, timestamp: new Date().toLocaleString(), status: 'Sent' }]);
      sendActualSMS(student.parentContact, messageContent);
      
      if (c.actionTaken === 'Weekend') {
        setWeekendDismissals(prev => [...prev, { 
          id: `WD-${Date.now()}`, 
          studentId: student.id, 
          yearId: activeYearId, 
          term: activeTerm,
          reason: c.description, 
          startDate: new Date().toISOString().split('T')[0], 
          returnDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
          status: 'Active' 
        }]);
      }
    }
  };

  const addExitPermission = async (p: Omit<ExitPermission, 'id' | 'yearId' | 'term' | 'status'>) => {
    const newPermission: ExitPermission = {
      ...p,
      id: `EXIT-${Date.now()}`,
      yearId: activeYearId,
      term: activeTerm,
      status: 'Away'
    };
    setExitPermissions(prev => [...prev, newPermission]);

    const student = students.find(s => s.id === p.studentId);
    if (student) {
      const smsId = `SMS-${Date.now()}`;
      const messageContent = `Departure Log: ${student.fullName} has left ETP Nyarurema for ${p.destination}. Reason: ${p.reason}. Expected back on ${p.expectedReturnDate}.`;
      setSmsLogs(prev => [...prev, { id: smsId, recipientName: student.fullName, phoneNumber: p.parentContact, message: messageContent, timestamp: new Date().toLocaleString(), status: 'Sent' }]);
      sendActualSMS(p.parentContact, messageContent);
    }
  };

  const updateCase = (c: DisciplineCase) => setCases(prev => prev.map(item => item.id === c.id ? c : item));
  const deleteCase = (id: string) => setCases(prev => prev.filter(c => c.id !== id));
  
  const completeDismissal = (id: string) => setWeekendDismissals(prev => prev.map(d => d.id === id ? { ...d, status: 'Completed' } : d));
  
  const completeExitPermission = async (id: string) => {
    const permission = exitPermissions.find(p => p.id === id);
    if (!permission) return;

    setExitPermissions(prev => prev.map(p => p.id === id ? { ...p, status: 'Returned' } : p));
    
    const student = students.find(s => s.id === permission.studentId);
    if (student) {
      const smsId = `SMS-${Date.now()}`;
      const messageContent = `Arrival Confirmation: ${student.fullName} has successfully returned to ETP Nyarurema from ${permission.destination} and is now back in school custody.`;
      setSmsLogs(prev => [...prev, { id: smsId, recipientName: student.fullName, phoneNumber: permission.parentContact, message: messageContent, timestamp: new Date().toLocaleString(), status: 'Sent' }]);
      sendActualSMS(permission.parentContact, messageContent);
    }
  };

  const addUser = (u: User) => setSystemUsers(prev => [...prev, u]);
  const updateUser = (u: User) => setSystemUsers(prev => prev.map(item => item.id === u.id ? u : item));
  const deleteUser = (id: string) => setSystemUsers(prev => prev.filter(item => item.id !== id));

  if (!user) return <Login onLogin={handleLogin} systemUsers={systemUsers} />;

  const currentYearObj = years.find(y => y.id === activeYearId);

  return (
    <HashRouter>
      <Layout user={user} students={students} cases={activeCases} onLogout={handleLogout}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-3 shadow-lg shadow-slate-900/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Session:</span>
              <span className="text-sm font-bold">{currentYearObj?.label}</span>
            </div>
            <div className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center space-x-3 shadow-lg shadow-blue-600/10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Active Term:</span>
              <span className="text-sm font-black">TERM {activeTerm}</span>
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard students={students} cases={activeCases} weekendDismissals={activeDismissals} exitPermissions={activeExitPermissions} currentTerm={activeTerm} />} />
          <Route path="/students" element={<Students students={students} cases={activeCases} onAdd={addStudent} onUpdate={updateStudent} onDelete={deleteStudent} userRole={user.role} />} />
          <Route path="/cases" element={<Cases students={students} cases={activeCases} activeTerm={activeTerm} onAdd={addCase} onUpdate={updateCase} onDelete={deleteCase} userRole={user.role} />} />
          <Route path="/sms-history" element={<SMSHistory logs={smsLogs} />} />
          <Route path="/weekend-dismissals" element={<WeekendDismissals dismissals={activeDismissals} students={students} onComplete={completeDismissal} />} />
          <Route path="/exit-permissions" element={<ExitPermissions permissions={activeExitPermissions} students={students} onAdd={addExitPermission} onComplete={completeExitPermission} />} />
          <Route path="/reports" element={<Reports students={students} cases={activeCases} currentTerm={activeTerm} />} />
          
          {isPrivileged && (
            <Route path="/users" element={
              <UserManagement 
                systemUsers={systemUsers} 
                onAddUser={addUser} 
                onUpdateUser={updateUser} 
                onDeleteUser={deleteUser} 
                currentUser={user} 
                loginEvents={loginEvents} 
                academicYears={years} 
                onEndYear={endAcademicYear} 
                onSwitchTerm={switchTerm}
                activeTerm={activeTerm}
                historicalCases={cases} 
                historicalDismissals={weekendDismissals}
              />
            } />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;


import { AppState, User, Student, DisciplineCase, SMSLog, AcademicYear, WeekendDismissal, ExitPermission, LoginEvent } from '../types';

const STORAGE_KEYS = {
  USER: 'sdms_user',
  USERS: 'sdms_users',
  STUDENTS: 'sdms_students',
  CASES: 'sdms_cases',
  SMS: 'sdms_sms',
  YEARS: 'sdms_years',
  ACTIVE_YEAR: 'sdms_active_year',
  ACTIVE_TERM: 'sdms_active_term',
  DISMISSALS: 'sdms_dismissals',
  EXIT_PERMISSIONS: 'sdms_exit_permissions',
  LOGIN_EVENTS: 'sdms_login_events'
};

export const db = {
  saveState: (state: Partial<AppState>) => {
    if (state.user !== undefined) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
    if (state.students !== undefined) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(state.students));
    if (state.cases !== undefined) localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(state.cases));
    if (state.smsLogs !== undefined) localStorage.setItem(STORAGE_KEYS.SMS, JSON.stringify(state.smsLogs));
    if (state.years !== undefined) localStorage.setItem(STORAGE_KEYS.YEARS, JSON.stringify(state.years));
    if (state.activeYearId !== undefined) localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, state.activeYearId);
    if (state.activeTerm !== undefined) localStorage.setItem(STORAGE_KEYS.ACTIVE_TERM, state.activeTerm.toString());
    if (state.weekendDismissals !== undefined) localStorage.setItem(STORAGE_KEYS.DISMISSALS, JSON.stringify(state.weekendDismissals));
    if (state.exitPermissions !== undefined) localStorage.setItem(STORAGE_KEYS.EXIT_PERMISSIONS, JSON.stringify(state.exitPermissions));
    if (state.loginEvents !== undefined) localStorage.setItem(STORAGE_KEYS.LOGIN_EVENTS, JSON.stringify(state.loginEvents));
  },

  getUsers: (): User[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : [];
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  loadFullDatabase: (): AppState => {
    const getItem = <T>(key: string, defaultValue: T): T => {
      const val = localStorage.getItem(key);
      try {
        return val ? JSON.parse(val) : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    return {
      user: getItem(STORAGE_KEYS.USER, null),
      students: getItem(STORAGE_KEYS.STUDENTS, []),
      cases: getItem(STORAGE_KEYS.CASES, []),
      smsLogs: getItem(STORAGE_KEYS.SMS, []),
      years: getItem(STORAGE_KEYS.YEARS, []),
      activeYearId: localStorage.getItem(STORAGE_KEYS.ACTIVE_YEAR) || '',
      activeTerm: parseInt(localStorage.getItem(STORAGE_KEYS.ACTIVE_TERM) || '1'),
      weekendDismissals: getItem(STORAGE_KEYS.DISMISSALS, []),
      exitPermissions: getItem(STORAGE_KEYS.EXIT_PERMISSIONS, []),
      loginEvents: getItem(STORAGE_KEYS.LOGIN_EVENTS, [])
    };
  },

  exportDatabase: () => {
    const data = db.loadFullDatabase();
    // Also include system users
    const fullData = { ...data, systemUsers: db.getUsers() };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sdms_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  importDatabase: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      if (data.cases) localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(data.cases));
      if (data.smsLogs) localStorage.setItem(STORAGE_KEYS.SMS, JSON.stringify(data.smsLogs));
      if (data.years) localStorage.setItem(STORAGE_KEYS.YEARS, JSON.stringify(data.years));
      if (data.activeYearId) localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, data.activeYearId);
      if (data.activeTerm) localStorage.setItem(STORAGE_KEYS.ACTIVE_TERM, data.activeTerm.toString());
      if (data.weekendDismissals) localStorage.setItem(STORAGE_KEYS.DISMISSALS, JSON.stringify(data.weekendDismissals));
      if (data.exitPermissions) localStorage.setItem(STORAGE_KEYS.EXIT_PERMISSIONS, JSON.stringify(data.exitPermissions));
      if (data.loginEvents) localStorage.setItem(STORAGE_KEYS.LOGIN_EVENTS, JSON.stringify(data.loginEvents));
      if (data.systemUsers) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.systemUsers));
      
      window.location.reload();
    } catch (e) {
      console.error("Failed to import database", e);
      alert("Invalid database file format.");
    }
  }
};

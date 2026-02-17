
export type Role = 'Administrator' | 'Admin' | 'Staff';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  role: Role;
  lastLogin?: string;
}

export interface LoginEvent {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  timestamp: string;
  browserInfo: string;
}

export const TOTAL_BASE_MARKS = 40;

export const ACADEMIC_CLASSES = [
  "L3 SOD A", "L3 SOD B", "L3 AUT A", "L3 AUT B", "L3 BDC A", "ACC S4 A", "ACC S4 B", "ACC S4 C",
  "L4 SOD A", "L4 SOD B", "L4 SOD C", "L4 AUT A", "L4 BDC", "ACC S5 A", "ACC S5 B", "ACC S5 C",
  "L5 SOD A", "L5 SOD B", "L5 AUT", "L5 BDC", "ACC S6 A", "ACC S6 B", "ACC S6 C"
] as const;

export type AcademicClass = typeof ACADEMIC_CLASSES[number];

export interface Student {
  id: string;
  regNumber: string;
  fullName: string;
  class: string;
  gender: 'Male' | 'Female' | 'Other';
  parentContact: string;
}

export type ActionTaken = 'Warning' | 'Weekend' | 'Dismissal' | 'None';

export interface AcademicYear {
  id: string;
  label: string; // e.g., "2024"
  status: 'Current' | 'Closed';
  startDate: string;
  endDate?: string;
  currentTerm: number;
}

export interface DisciplineCase {
  id: string;
  studentId: string;
  yearId: string;
  term: number;
  offenseType: string;
  description: string;
  actionTaken: ActionTaken;
  date: string;
  recordedBy: string;
  pointsDeducted: number;
}

export interface SMSLog {
  id: string;
  recipientName: string;
  phoneNumber: string;
  message: string;
  timestamp: string;
  status: 'Sent' | 'Failed';
}

export interface WeekendDismissal {
  id: string;
  studentId: string;
  yearId: string;
  term: number;
  reason: string;
  startDate: string;
  returnDate: string;
  status: 'Active' | 'Completed';
}

export interface ExitPermission {
  id: string;
  studentId: string;
  yearId: string;
  term: number;
  reason: string;
  destination: string;
  parentContact: string;
  departureDate: string;
  expectedReturnDate: string;
  status: 'Away' | 'Returned';
}

export interface AppState {
  user: User | null;
  students: Student[];
  cases: DisciplineCase[];
  smsLogs: SMSLog[];
  years: AcademicYear[];
  activeYearId: string;
  activeTerm: number;
  weekendDismissals: WeekendDismissal[];
  exitPermissions: ExitPermission[];
  loginEvents: LoginEvent[];
}

// Mock data for Dayflow HRMS

export type UserRole = 'employee' | 'hr';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  position: string;
  joinDate: string;
  phone: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'half-day' | 'leave';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'casual' | 'sick' | 'annual' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  basicPay: number;
  hra: number;
  transportAllowance: number;
  medicalAllowance: number;
  otherAllowances: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
}

// Sample employees
export const employees: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'john.doe@dayflow.com',
    name: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    joinDate: '2023-03-15',
    phone: '+1 234 567 8901',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    email: 'jane.smith@dayflow.com',
    name: 'Jane Smith',
    role: 'employee',
    department: 'Design',
    position: 'UI/UX Designer',
    joinDate: '2022-08-01',
    phone: '+1 234 567 8902',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    email: 'mike.johnson@dayflow.com',
    name: 'Mike Johnson',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2021-11-20',
    phone: '+1 234 567 8903',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    email: 'sarah.williams@dayflow.com',
    name: 'Sarah Williams',
    role: 'employee',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2020-06-10',
    phone: '+1 234 567 8904',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    email: 'david.brown@dayflow.com',
    name: 'David Brown',
    role: 'employee',
    department: 'Sales',
    position: 'Sales Representative',
    joinDate: '2023-01-05',
    phone: '+1 234 567 8905',
  },
  {
    id: '6',
    employeeId: 'HR001',
    email: 'admin@dayflow.com',
    name: 'Emily Chen',
    role: 'hr',
    department: 'Human Resources',
    position: 'HR Manager',
    joinDate: '2019-04-01',
    phone: '+1 234 567 8900',
  },
];

// Generate attendance records for current week
const generateWeeklyAttendance = (employeeId: string): AttendanceRecord[] => {
  const today = new Date();
  const records: AttendanceRecord[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({
        id: `${employeeId}-${dateStr}`,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        status: 'absent',
      });
    } else if (i === 0) {
      // Today - not checked in yet
      records.push({
        id: `${employeeId}-${dateStr}`,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        status: 'absent',
      });
    } else {
      // Random status for past days
      const rand = Math.random();
      if (rand > 0.9) {
        records.push({
          id: `${employeeId}-${dateStr}`,
          date: dateStr,
          checkIn: null,
          checkOut: null,
          status: 'leave',
        });
      } else if (rand > 0.8) {
        records.push({
          id: `${employeeId}-${dateStr}`,
          date: dateStr,
          checkIn: '09:30',
          checkOut: '13:00',
          status: 'half-day',
        });
      } else {
        records.push({
          id: `${employeeId}-${dateStr}`,
          date: dateStr,
          checkIn: `09:0${Math.floor(Math.random() * 10)}`,
          checkOut: `18:0${Math.floor(Math.random() * 10)}`,
          status: 'present',
        });
      }
    }
  }
  
  return records;
};

export const attendanceRecords: Record<string, AttendanceRecord[]> = {
  '1': generateWeeklyAttendance('1'),
  '2': generateWeeklyAttendance('2'),
  '3': generateWeeklyAttendance('3'),
  '4': generateWeeklyAttendance('4'),
  '5': generateWeeklyAttendance('5'),
  '6': generateWeeklyAttendance('6'),
};

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'LR001',
    employeeId: '1',
    employeeName: 'John Doe',
    type: 'annual',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    reason: 'Family vacation',
    status: 'pending',
    appliedOn: '2024-01-10',
  },
  {
    id: 'LR002',
    employeeId: '2',
    employeeName: 'Jane Smith',
    type: 'sick',
    startDate: '2024-01-08',
    endDate: '2024-01-08',
    reason: 'Not feeling well',
    status: 'approved',
    appliedOn: '2024-01-08',
    reviewedBy: 'Emily Chen',
  },
  {
    id: 'LR003',
    employeeId: '3',
    employeeName: 'Mike Johnson',
    type: 'casual',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    reason: 'Personal work',
    status: 'pending',
    appliedOn: '2024-01-12',
  },
  {
    id: 'LR004',
    employeeId: '4',
    employeeName: 'Sarah Williams',
    type: 'annual',
    startDate: '2024-01-02',
    endDate: '2024-01-05',
    reason: 'New year holidays',
    status: 'rejected',
    appliedOn: '2023-12-28',
    reviewedBy: 'Emily Chen',
    reviewComment: 'Critical project deadline',
  },
];

export const payrollRecords: Record<string, PayrollRecord> = {
  '1': {
    id: 'PR001',
    employeeId: '1',
    month: 'January 2024',
    basicPay: 75000,
    hra: 30000,
    transportAllowance: 3000,
    medicalAllowance: 2500,
    otherAllowances: 5000,
    providentFund: 9000,
    professionalTax: 200,
    incomeTax: 12000,
    otherDeductions: 0,
  },
  '2': {
    id: 'PR002',
    employeeId: '2',
    month: 'January 2024',
    basicPay: 65000,
    hra: 26000,
    transportAllowance: 3000,
    medicalAllowance: 2500,
    otherAllowances: 4000,
    providentFund: 7800,
    professionalTax: 200,
    incomeTax: 9500,
    otherDeductions: 0,
  },
  '3': {
    id: 'PR003',
    employeeId: '3',
    month: 'January 2024',
    basicPay: 85000,
    hra: 34000,
    transportAllowance: 3000,
    medicalAllowance: 2500,
    otherAllowances: 6000,
    providentFund: 10200,
    professionalTax: 200,
    incomeTax: 15000,
    otherDeductions: 0,
  },
  '4': {
    id: 'PR004',
    employeeId: '4',
    month: 'January 2024',
    basicPay: 95000,
    hra: 38000,
    transportAllowance: 3000,
    medicalAllowance: 2500,
    otherAllowances: 8000,
    providentFund: 11400,
    professionalTax: 200,
    incomeTax: 18000,
    otherDeductions: 0,
  },
  '5': {
    id: 'PR005',
    employeeId: '5',
    month: 'January 2024',
    basicPay: 55000,
    hra: 22000,
    transportAllowance: 3000,
    medicalAllowance: 2500,
    otherAllowances: 3000,
    providentFund: 6600,
    professionalTax: 200,
    incomeTax: 7000,
    otherDeductions: 0,
  },
  '6': {
    id: 'PR006',
    employeeId: '6',
    month: 'January 2024',
    basicPay: 90000,
    hra: 36000,
    transportAllowance: 3000,
    medicalAllowance: 2500,
    otherAllowances: 7000,
    providentFund: 10800,
    professionalTax: 200,
    incomeTax: 16000,
    otherDeductions: 0,
  },
};

// Helper functions
export const getNetSalary = (payroll: PayrollRecord): number => {
  const gross = payroll.basicPay + payroll.hra + payroll.transportAllowance + 
    payroll.medicalAllowance + payroll.otherAllowances;
  const deductions = payroll.providentFund + payroll.professionalTax + 
    payroll.incomeTax + payroll.otherDeductions;
  return gross - deductions;
};

export const getGrossSalary = (payroll: PayrollRecord): number => {
  return payroll.basicPay + payroll.hra + payroll.transportAllowance + 
    payroll.medicalAllowance + payroll.otherAllowances;
};

export const getTotalDeductions = (payroll: PayrollRecord): number => {
  return payroll.providentFund + payroll.professionalTax + 
    payroll.incomeTax + payroll.otherDeductions;
};

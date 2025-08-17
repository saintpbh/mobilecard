// 직원 정보 타입
export interface Employee {
  employeeId: string;
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  department: string;
  position?: string;
  profileImage?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// 사원증 발행 정보 타입
export interface Pass {
  passId: string;
  employeeId: string;
  platform: 'apple' | 'google';
  serialNumber: string;
  status: 'active' | 'expired' | 'revoked';
  issuedAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  passData?: any;
}

// 외근/연차 신청 타입
export interface Request {
  requestId: string;
  employeeId: string;
  requestType: 'business_trip' | 'annual_leave';
  startDate: string;
  endDate: string;
  location?: string;
  address?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

// 부서 정보 타입
export interface Department {
  departmentId: string;
  name: string;
  managerId?: string;
  description?: string;
  createdAt: Date;
}

// 사원증 발행 폼 타입
export interface EmployeeFormData {
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  department: string;
}

// 사용자 인증 타입
export interface User {
  uid: string;
  email: string;
  role: 'employee' | 'admin' | 'hr' | 'system_admin';
  employeeId?: string;
  profile?: UserProfile;
  adminCompanies?: string[]; // 관리하는 회사 ID 목록
  memberCompanies?: string[]; // 소속된 회사 ID 목록
}

// 사용자 프로필 타입
export interface UserProfile {
  uid: string;
  name: string;
  birthDate: string;
  companyName: string;
  department: string;
  position: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  isProfileComplete: boolean;
}

// 사원증 정보 타입
export interface EmployeeCard {
  uid: string;
  employeeId: string;
  design: any; // CardDesign 타입
  issuedAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'revoked';
}

// 회사 테마 타입
export interface CompanyTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

// 회사 정보 타입
export interface Company {
  companyId: string;
  companyKey: string;
  name: string;
  businessNumber: string;
  ceoName: string;
  address: string;
  phone: string;
  logo?: string;
  theme: CompanyTheme;
  workplace: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive';
  adminId: string; // 회사 생성자/관리자 ID
}

// 회사 멤버 타입
export interface CompanyMember {
  memberId: string;
  companyId: string;
  userId: string;
  role: 'admin' | 'manager' | 'employee';
  employeeId: string;
  department: string;
  position: string;
  joinedAt: Date;
  status: 'active' | 'inactive' | 'pending';
}

// 출퇴근 기록 타입
export interface AttendanceRecord {
  timestamp: Date;
  location?: string;
  method: 'qr' | 'gps' | 'manual';
  note?: string;
}

// 출퇴근 정보 타입
export interface Attendance {
  attendanceId: string;
  companyId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn?: AttendanceRecord;
  checkOut?: AttendanceRecord;
  status: 'present' | 'absent' | 'late' | 'leave';
  location?: string;
  note?: string;
  createdAt: Date;
}

// 회사 초대 타입
export interface CompanyInvite {
  inviteId: string;
  companyId: string;
  inviteKey: string;
  inviteLink: string;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
  maxUses?: number;
  usedCount: number;
  status: 'active' | 'expired' | 'disabled';
}

// 외근/연차 신청 타입
export interface LeaveRequest {
  requestId: string;
  companyId: string;
  userId: string;
  type: 'business_trip' | 'annual_leave' | 'sick_leave' | 'other';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

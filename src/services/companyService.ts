import {
  doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs,
  addDoc, deleteDoc, orderBy, limit, startAfter, writeBatch, increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { Company, CompanyMember, CompanyInvite, Attendance, AttendanceRecord, LeaveRequest } from '../types';

// 고유 키 생성 함수
export const generateCompanyKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 회사 생성
export const createCompany = async (
  companyData: Omit<Company, 'companyId' | 'companyKey' | 'createdAt' | 'updatedAt' | 'status' | 'adminId'>,
  adminId: string
): Promise<Company> => {
  const companyId = `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const companyKey = generateCompanyKey();
  
  const company: Company = {
    ...companyData,
    companyId,
    companyKey,
    adminId,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active'
  };

  await setDoc(doc(db, 'companies', companyId), company);
  
  // 회사 생성자를 관리자로 등록
  const member: CompanyMember = {
    memberId: `${companyId}_${adminId}`,
    companyId,
    userId: adminId,
    role: 'admin',
    employeeId: `EMP${Date.now()}`,
    department: '관리팀',
    position: '관리자',
    joinedAt: new Date(),
    status: 'active'
  };

  await setDoc(doc(db, 'companyMembers', member.memberId), member);
  
  return company;
};

// 회사 정보 조회
export const getCompany = async (companyId: string): Promise<Company | null> => {
  try {
    const docRef = doc(db, 'companies', companyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Company;
    }
    return null;
  } catch (error) {
    console.error('회사 정보 조회 오류:', error);
    return null;
  }
};

// 회사 키로 회사 조회
export const getCompanyByKey = async (companyKey: string): Promise<Company | null> => {
  try {
    const q = query(
      collection(db, 'companies'),
      where('companyKey', '==', companyKey),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Company;
    }
    return null;
  } catch (error) {
    console.error('회사 키로 조회 오류:', error);
    return null;
  }
};

// 회사 가입
export const joinCompany = async (
  companyId: string,
  userId: string,
  userProfile: any
): Promise<CompanyMember> => {
  // 이미 가입되어 있는지 확인
  const existingMember = await getCompanyMember(companyId, userId);
  if (existingMember) {
    throw new Error('이미 가입된 회사입니다.');
  }

  const member: CompanyMember = {
    memberId: `${companyId}_${userId}`,
    companyId,
    userId,
    role: 'employee',
    employeeId: `EMP${Date.now()}`,
    department: userProfile.department || '미지정',
    position: userProfile.position || '직원',
    joinedAt: new Date(),
    status: 'active'
  };

  await setDoc(doc(db, 'companyMembers', member.memberId), member);
  return member;
};

// 회사 멤버 조회
export const getCompanyMember = async (
  companyId: string,
  userId: string
): Promise<CompanyMember | null> => {
  try {
    const docRef = doc(db, 'companyMembers', `${companyId}_${userId}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CompanyMember;
    }
    return null;
  } catch (error) {
    console.error('회사 멤버 조회 오류:', error);
    return null;
  }
};

// 회사 멤버 목록 조회
export const getCompanyMembers = async (
  companyId: string,
  limitCount: number = 50
): Promise<CompanyMember[]> => {
  try {
    const q = query(
      collection(db, 'companyMembers'),
      where('companyId', '==', companyId),
      where('status', '==', 'active'),
      orderBy('joinedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as CompanyMember);
  } catch (error) {
    console.error('회사 멤버 목록 조회 오류:', error);
    return [];
  }
};

// 회사 초대 링크 생성
export const createCompanyInvite = async (
  companyId: string,
  createdBy: string,
  maxUses?: number
): Promise<CompanyInvite> => {
  const inviteKey = generateCompanyKey();
  const inviteLink = `${window.location.origin}/join/${inviteKey}`;
  
  const invite: CompanyInvite = {
    inviteId: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    companyId,
    inviteKey,
    inviteLink,
    createdBy,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후 만료
    maxUses,
    usedCount: 0,
    status: 'active'
  };

  await setDoc(doc(db, 'companyInvites', invite.inviteId), invite);
  return invite;
};

// 초대 링크로 회사 조회
export const getCompanyByInviteKey = async (inviteKey: string): Promise<{ company: Company; invite: CompanyInvite } | null> => {
  try {
    const q = query(
      collection(db, 'companyInvites'),
      where('inviteKey', '==', inviteKey),
      where('status', '==', 'active'),
      where('expiresAt', '>', new Date())
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const invite = querySnapshot.docs[0].data() as CompanyInvite;
      const company = await getCompany(invite.companyId);
      
      if (!company) {
        return null; // 회사 정보가 없음
      }
      
      if (invite.maxUses && invite.usedCount >= invite.maxUses) {
        return null; // 사용 횟수 초과
      }
      
      return { company, invite };
    }
    return null;
  } catch (error) {
    console.error('초대 링크로 회사 조회 오류:', error);
    return null;
  }
};

// 초대 링크 사용 처리
export const markInviteAsUsed = async (inviteId: string): Promise<void> => {
  const inviteRef = doc(db, 'companyInvites', inviteId);
  await updateDoc(inviteRef, {
    usedCount: increment(1)
  });
};

// 출퇴근 기록 생성
export const createAttendance = async (
  companyId: string,
  userId: string,
  date: string,
  checkIn?: AttendanceRecord,
  checkOut?: AttendanceRecord
): Promise<Attendance> => {
  const attendanceId = `attendance_${companyId}_${userId}_${date}`;
  
  const attendance: Attendance = {
    attendanceId,
    companyId,
    userId,
    date,
    checkIn,
    checkOut,
    status: checkIn ? 'present' : 'absent',
    createdAt: new Date()
  };

  await setDoc(doc(db, 'attendance', attendanceId), attendance);
  return attendance;
};

// 출퇴근 기록 조회
export const getAttendance = async (
  companyId: string,
  userId: string,
  date: string
): Promise<Attendance | null> => {
  try {
    const docRef = doc(db, 'attendance', `attendance_${companyId}_${userId}_${date}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Attendance;
    }
    return null;
  } catch (error) {
    console.error('출퇴근 기록 조회 오류:', error);
    return null;
  }
};

// 회사별 출퇴근 현황 조회
export const getCompanyAttendance = async (
  companyId: string,
  date: string,
  limitCount: number = 100
): Promise<Attendance[]> => {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('companyId', '==', companyId),
      where('date', '==', date),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Attendance);
  } catch (error) {
    console.error('회사 출퇴근 현황 조회 오류:', error);
    return [];
  }
};

// 외근/연차 신청
export const createLeaveRequest = async (
  companyId: string,
  userId: string,
  leaveData: Omit<LeaveRequest, 'requestId' | 'companyId' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<LeaveRequest> => {
  const requestId = `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const leaveRequest: LeaveRequest = {
    requestId,
    companyId,
    userId,
    ...leaveData,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await setDoc(doc(db, 'leaveRequests', requestId), leaveRequest);
  return leaveRequest;
};

// 외근/연차 신청 목록 조회
export const getLeaveRequests = async (
  companyId: string,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<LeaveRequest[]> => {
  try {
    let q = query(
      collection(db, 'leaveRequests'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as LeaveRequest);
  } catch (error) {
    console.error('외근/연차 신청 목록 조회 오류:', error);
    return [];
  }
};

// 외근/연차 승인/거절
export const updateLeaveRequest = async (
  requestId: string,
  status: 'approved' | 'rejected',
  approvedBy: string
): Promise<void> => {
  const requestRef = doc(db, 'leaveRequests', requestId);
  await updateDoc(requestRef, {
    status,
    approvedBy,
    approvedAt: new Date(),
    updatedAt: new Date()
  });
};

// 사용자가 관리하는 회사 목록 조회
export const getAdminCompanies = async (userId: string): Promise<Company[]> => {
  try {
    const q = query(
      collection(db, 'companyMembers'),
      where('userId', '==', userId),
      where('role', 'in', ['admin', 'manager'])
    );
    const querySnapshot = await getDocs(q);
    
    const companyIds = querySnapshot.docs.map(doc => doc.data().companyId);
    const companies: Company[] = [];
    
    for (const companyId of companyIds) {
      const company = await getCompany(companyId);
      if (company) {
        companies.push(company);
      }
    }
    
    return companies;
  } catch (error) {
    console.error('관리 회사 목록 조회 오류:', error);
    return [];
  }
};

// 사용자가 소속된 회사 목록 조회
export const getMemberCompanies = async (userId: string): Promise<Company[]> => {
  try {
    const q = query(
      collection(db, 'companyMembers'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    
    const companyIds = querySnapshot.docs.map(doc => doc.data().companyId);
    const companies: Company[] = [];
    
    for (const companyId of companyIds) {
      const company = await getCompany(companyId);
      if (company) {
        companies.push(company);
      }
    }
    
    return companies;
  } catch (error) {
    console.error('소속 회사 목록 조회 오류:', error);
    return [];
  }
};

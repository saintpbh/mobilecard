import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, EmployeeCard } from '../types';
import { CardDesign, DEFAULT_CARD_DESIGN } from '../types/design';

// 사원증 자동 발급
export const issueEmployeeCard = async (uid: string, profile: UserProfile): Promise<EmployeeCard> => {
  try {
    // 사원번호 생성
    const employeeId = await generateEmployeeId(uid);
    
    // 기본 디자인 생성 (사용자 정보 기반)
    const cardDesign = generateCardDesignFromProfile(profile);
    
    // 만료일 계산 (1년 후)
    const issuedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    const employeeCard: EmployeeCard = {
      uid,
      employeeId,
      design: cardDesign,
      issuedAt,
      expiresAt,
      status: 'active'
    };
    
    // Firestore에 저장
    await setDoc(doc(db, 'employeeCards', uid), {
      ...employeeCard,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    });
    
    return employeeCard;
  } catch (error) {
    console.error('사원증 발급 오류:', error);
    throw error;
  }
};

// 사원번호 생성
const generateEmployeeId = async (uid: string): Promise<string> => {
  try {
    const year = new Date().getFullYear();
    const cardsRef = collection(db, 'employeeCards');
    const q = query(cardsRef, where('employeeId', '>=', `EMP${year}0001`), where('employeeId', '<=', `EMP${year}9999`));
    const querySnapshot = await getDocs(q);
    
    const existingIds = querySnapshot.docs.map(doc => doc.data().employeeId).sort();
    let nextNumber = 1;
    
    for (const id of existingIds) {
      const number = parseInt(id.slice(-4));
      if (number >= nextNumber) {
        nextNumber = number + 1;
      }
    }
    
    return `EMP${year}${nextNumber.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error('사원번호 생성 오류:', error);
    // 폴백: 타임스탬프 기반 사원번호
    return `EMP${Date.now()}`;
  }
};

// 프로필 정보 기반 디자인 생성
const generateCardDesignFromProfile = (profile: UserProfile): CardDesign => {
  const design = { ...DEFAULT_CARD_DESIGN };
  
  // 회사명을 배경색에 반영
  const companyHash = hashString(profile.companyName);
  design.backgroundColor = generateColorFromHash(companyHash);
  design.background.value = design.backgroundColor;
  
  // 부서별 색상 조정
  const departmentHash = hashString(profile.department);
  design.accentColor = generateColorFromHash(departmentHash);
  
  // 텍스트 색상 조정 (배경색에 따른 대비)
  design.textColor = getContrastColor(design.backgroundColor);
  
  return design;
};

// 문자열 해시 함수
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  return Math.abs(hash);
};

// 해시값으로 색상 생성
const generateColorFromHash = (hash: number): string => {
  const hue = hash % 360;
  const saturation = 60 + (hash % 20); // 60-80%
  const lightness = 40 + (hash % 20); // 40-60%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// 대비 색상 계산
const getContrastColor = (backgroundColor: string): string => {
  // HSL 색상을 RGB로 변환하여 밝기 계산
  const rgb = hslToRgb(backgroundColor);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

// HSL을 RGB로 변환
const hslToRgb = (hsl: string): { r: number; g: number; b: number } => {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return { r: 0, g: 0, b: 0 };
  
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// 사용자의 사원증 가져오기
export const getEmployeeCard = async (uid: string): Promise<EmployeeCard | null> => {
  try {
    const cardDoc = await getDoc(doc(db, 'employeeCards', uid));
    if (cardDoc.exists()) {
      const data = cardDoc.data();
      return {
        ...data,
        issuedAt: new Date(data.issuedAt),
        expiresAt: new Date(data.expiresAt)
      } as EmployeeCard;
    }
    return null;
  } catch (error) {
    console.error('사원증 가져오기 오류:', error);
    throw error;
  }
};

// 사원증 상태 업데이트
export const updateCardStatus = async (uid: string, status: 'active' | 'expired' | 'revoked'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'employeeCards', uid), {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('사원증 상태 업데이트 오류:', error);
    throw error;
  }
};

// 만료된 사원증 확인
export const checkExpiredCards = async (): Promise<EmployeeCard[]> => {
  try {
    const now = new Date();
    const cardsRef = collection(db, 'employeeCards');
    const q = query(cardsRef, where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    const expiredCards: EmployeeCard[] = [];
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const expiresAt = new Date(data.expiresAt);
      
      if (expiresAt < now) {
        expiredCards.push({
          ...data,
          issuedAt: new Date(data.issuedAt),
          expiresAt
        } as EmployeeCard);
      }
    });
    
    return expiredCards;
  } catch (error) {
    console.error('만료된 사원증 확인 오류:', error);
    throw error;
  }
};


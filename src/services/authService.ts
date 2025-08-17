import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, UserProfile } from '../types';

// Google 로그인 제공자 설정
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Google 로그인
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Firestore에서 사용자 정보 확인
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // 새 사용자 - 기본 정보로 사용자 문서 생성
      const newUser: User = {
        uid: user.uid,
        email: user.email || '',
        role: 'employee'
      };
      
      await setDoc(doc(db, 'users', user.uid), {
        ...newUser,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return newUser;
    } else {
      // 기존 사용자 - 저장된 정보 반환
      return userDoc.data() as User;
    }
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    throw error;
  }
};

// 이메일/비밀번호 회원가입
export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    const newUser: User = {
      uid: user.uid,
      email: user.email || '',
      role: 'employee'
    };
    
    await setDoc(doc(db, 'users', user.uid), {
      ...newUser,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return newUser;
  } catch (error) {
    console.error('이메일 회원가입 오류:', error);
    throw error;
  }
};

// 이메일/비밀번호 로그인
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('이메일 로그인 오류:', error);
    throw error;
  }
};

// 로그아웃
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
};

// 사용자 프로필 저장
export const saveUserProfile = async (uid: string, profile: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt' | 'isProfileComplete'>): Promise<void> => {
  try {
    const userProfile: UserProfile = {
      uid,
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date(),
      isProfileComplete: true
    };
    
    await setDoc(doc(db, 'userProfiles', uid), userProfile);
    
    // 사용자 문서도 업데이트
    await updateDoc(doc(db, 'users', uid), {
      profile: userProfile,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('프로필 저장 오류:', error);
    throw error;
  }
};

// 사용자 프로필 가져오기
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'userProfiles', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('프로필 가져오기 오류:', error);
    throw error;
  }
};

// 사용자 정보 가져오기
export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    throw error;
  }
};

// 인증 상태 변경 감지
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// 사원번호 생성
export const generateEmployeeId = async (): Promise<string> => {
  try {
    const year = new Date().getFullYear();
    const employeesRef = collection(db, 'userProfiles');
    const q = query(employeesRef, where('employeeId', '>=', `EMP${year}0001`), where('employeeId', '<=', `EMP${year}9999`));
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


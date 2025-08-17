import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';
import { getUser } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // 기본 사용자 정보 생성
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      role: 'employee',
      createdAt: new Date()
    });
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  async function fetchUserData(firebaseUser: FirebaseUser): Promise<User> {
    try {
      const userData = await getUser(firebaseUser.uid);
      if (userData) {
        return userData;
      } else {
        // 기본 사용자 정보 생성
        const defaultUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          role: 'employee'
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...defaultUser,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return defaultUser;
      }
    } catch (error) {
      console.error('사용자 데이터 가져오기 오류:', error);
      // 기본 사용자 정보 반환
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        role: 'employee'
      };
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

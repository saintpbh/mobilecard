import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDXt7HgFSxDmE7o46-fLgdmbRrW_DB3W_A",
  authDomain: "mobilecard-8d124.firebaseapp.com",
  projectId: "mobilecard-8d124",
  storageBucket: "mobilecard-8d124.firebasestorage.app",
  messagingSenderId: "589323710140",
  appId: "1:589323710140:web:2b99e9d477065a284eeab9",
  measurementId: "G-BS1M0ZD579"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

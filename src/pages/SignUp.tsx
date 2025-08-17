import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Chrome, User, Building, Phone, Calendar, Briefcase, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, saveUserProfile, generateEmployeeId } from '../services/authService';
import { issueEmployeeCard } from '../services/cardService';
import { UserProfile } from '../types';
import '../styles/SignUp.css';

interface SignUpFormData {
  name: string;
  birthDate: string;
  companyName: string;
  department: string;
  position: string;
  phoneNumber: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SignUpFormData>();

  // 이미 로그인된 사용자 처리
  useEffect(() => {
    if (currentUser) {
      if (currentUser.profile?.isProfileComplete) {
        // 프로필이 완성된 사용자는 대시보드로
        navigate('/dashboard');
      } else {
        // 프로필이 미완성된 사용자는 프로필 완성 페이지로
        setIsProfileComplete(false);
      }
    }
  }, [currentUser, navigate]);

  // 사원번호 생성
  useEffect(() => {
    const generateId = async () => {
      try {
        const id = await generateEmployeeId();
        setEmployeeId(id);
      } catch (error) {
        console.error('사원번호 생성 실패:', error);
      }
    };
    generateId();
  }, []);

  // Google 로그인 처리
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      setCurrentUser(user);
      
      if (user.profile?.isProfileComplete) {
        toast.success('로그인되었습니다!');
        navigate('/dashboard');
      } else {
        toast.success('Google 로그인 성공! 프로필을 완성해주세요.');
        setIsProfileComplete(false);
      }
    } catch (error: any) {
      console.error('Google 로그인 오류:', error);
      toast.error(error.message || 'Google 로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 저장 처리
  const onSubmit = async (data: SignUpFormData) => {
    if (!currentUser) {
      toast.error('먼저 로그인해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await saveUserProfile(currentUser.uid, {
        name: data.name,
        birthDate: data.birthDate,
        companyName: data.companyName,
        department: data.department,
        position: data.position,
        phoneNumber: data.phoneNumber
      });

      // 프로필 정보 생성
      const profile: UserProfile = {
        uid: currentUser.uid,
        name: data.name,
        birthDate: data.birthDate,
        companyName: data.companyName,
        department: data.department,
        position: data.position,
        phoneNumber: data.phoneNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
        isProfileComplete: true
      };

      // 업데이트된 사용자 정보
      const updatedUser = {
        ...currentUser,
        profile
      };
      
      setCurrentUser(updatedUser);
      
      // 자동 사원증 발급
      try {
        const employeeCard = await issueEmployeeCard(currentUser.uid, profile);
        toast.success(`프로필이 저장되었습니다! 사원증이 자동으로 발급되었습니다. (${employeeCard.employeeId})`);
      } catch (error) {
        console.error('사원증 발급 오류:', error);
        toast.success('프로필이 저장되었습니다! (사원증 발급은 나중에 가능합니다)');
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('프로필 저장 오류:', error);
      toast.error(error.message || '프로필 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>회원가입</h1>
          <p>구글 계정으로 간편하게 가입하고 프로필을 완성해주세요</p>
        </div>

        {!currentUser ? (
          // 로그인되지 않은 경우 - Google 로그인 버튼 표시
          <div className="google-signin-section">
            <div className="google-signin-card">
              <h2>구글 계정으로 시작하기</h2>
              <p>구글 계정을 사용하여 간편하게 가입하세요</p>
              
              <button
                type="button"
                className="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome size={20} />
                {isLoading ? '로그인 중...' : 'Google로 로그인'}
              </button>
              
              <div className="signin-benefits">
                <h3>구글 로그인의 장점</h3>
                <ul>
                  <li>✅ 별도 계정 생성 불필요</li>
                  <li>✅ 안전한 인증 시스템</li>
                  <li>✅ 빠른 로그인</li>
                  <li>✅ 자동 프로필 연동</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // 로그인된 경우 - 프로필 완성 폼 표시
          <div className="profile-form-section">
            <div className="profile-form-card">
              <div className="user-info">
                <h2>프로필 완성</h2>
                <p>사원증 발급을 위한 정보를 입력해주세요</p>
                <div className="employee-id">
                  <span>사원번호: {employeeId}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                <div className="form-group">
                  <label>
                    <User size={16} />
                    이름 *
                  </label>
                  <input
                    type="text"
                    {...register('name', { 
                      required: '이름을 입력해주세요.',
                      minLength: { value: 2, message: '이름은 2자 이상이어야 합니다.' }
                    })}
                    placeholder="홍길동"
                  />
                  {errors.name && <span className="error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <Calendar size={16} />
                    생년월일 *
                  </label>
                  <input
                    type="date"
                    {...register('birthDate', { 
                      required: '생년월일을 입력해주세요.' 
                    })}
                  />
                  {errors.birthDate && <span className="error">{errors.birthDate.message}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <Building size={16} />
                    회사명 *
                  </label>
                  <input
                    type="text"
                    {...register('companyName', { 
                      required: '회사명을 입력해주세요.' 
                    })}
                    placeholder="(주)회사명"
                  />
                  {errors.companyName && <span className="error">{errors.companyName.message}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <MapPin size={16} />
                      부서 *
                    </label>
                    <input
                      type="text"
                      {...register('department', { 
                        required: '부서를 입력해주세요.' 
                      })}
                      placeholder="개발팀"
                    />
                    {errors.department && <span className="error">{errors.department.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>
                      <Briefcase size={16} />
                      직책
                    </label>
                    <input
                      type="text"
                      {...register('position')}
                      placeholder="팀원"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={16} />
                    전화번호 *
                  </label>
                  <input
                    type="tel"
                    {...register('phoneNumber', { 
                      required: '전화번호를 입력해주세요.',
                      pattern: {
                        value: /^[0-9-+\s()]+$/,
                        message: '올바른 전화번호 형식을 입력해주세요.'
                      }
                    })}
                    placeholder="010-1234-5678"
                  />
                  {errors.phoneNumber && <span className="error">{errors.phoneNumber.message}</span>}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? '저장 중...' : '프로필 저장'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Building, Key, Users, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCompanyByKey, getCompanyByInviteKey, joinCompany, markInviteAsUsed } from '../services/companyService';
import { Company, CompanyInvite } from '../types';
import '../styles/JoinCompany.css';

interface JoinCompanyFormData {
  department: string;
  position: string;
}

const JoinCompany: React.FC = () => {
  const navigate = useNavigate();
  const { inviteKey } = useParams<{ inviteKey: string }>();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [invite, setInvite] = useState<CompanyInvite | null>(null);
  const [isValidInvite, setIsValidInvite] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<JoinCompanyFormData>();

  useEffect(() => {
    const checkInvite = async () => {
      if (!inviteKey) {
        setIsChecking(false);
        return;
      }

      try {
        // 먼저 초대 링크로 확인
        const inviteResult = await getCompanyByInviteKey(inviteKey);
        if (inviteResult) {
          setCompany(inviteResult.company);
          setInvite(inviteResult.invite);
          setIsValidInvite(true);
        } else {
          // 초대 링크가 없으면 회사 키로 확인
          const companyResult = await getCompanyByKey(inviteKey);
          if (companyResult) {
            setCompany(companyResult);
            setIsValidInvite(true);
          } else {
            setIsValidInvite(false);
          }
        }
      } catch (error) {
        console.error('초대 확인 오류:', error);
        setIsValidInvite(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkInvite();
  }, [inviteKey]);

  const onSubmit = async (data: JoinCompanyFormData) => {
    if (!currentUser || !company) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = {
        department: data.department,
        position: data.position
      };

      await joinCompany(company.companyId, currentUser.uid, userProfile);

      // 초대 링크를 사용한 경우 사용 횟수 증가
      if (invite) {
        await markInviteAsUsed(invite.inviteId);
      }

      toast.success(`${company.name}에 성공적으로 가입되었습니다!`);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('회사 가입 오류:', error);
      toast.error(error.message || '회사 가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="join-company-page">
        <div className="join-company-container">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p>회사 정보를 확인하고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidInvite || !company) {
    return (
      <div className="join-company-page">
        <div className="join-company-container">
          <div className="error-card">
            <AlertCircle className="error-icon" />
            <h2>유효하지 않은 초대</h2>
            <p>초대 링크가 만료되었거나 유효하지 않습니다.</p>
            <div className="error-actions">
              <button
                type="button"
                className="home-btn"
                onClick={() => navigate('/')}
              >
                홈으로 돌아가기
              </button>
              <button
                type="button"
                className="contact-btn"
                onClick={() => navigate('/contact')}
              >
                관리자에게 문의
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-company-page">
      <div className="join-company-container">
        <div className="join-company-header">
          <Building className="header-icon" />
          <h1>회사 가입</h1>
          <p>아래 회사에 가입하여 출퇴근 관리 시스템을 이용하세요</p>
        </div>

        <div className="company-preview">
          <div className="company-info">
            <div className="company-logo">
              {company.logo ? (
                <img src={company.logo} alt={company.name} />
              ) : (
                <Building size={40} />
              )}
            </div>
            <div className="company-details">
              <h2>{company.name}</h2>
              <p className="company-address">
                <MapPin size={16} />
                {company.address}
              </p>
              <p className="company-workplace">
                <MapPin size={16} />
                출근 장소: {company.workplace}
              </p>
            </div>
          </div>

          {invite && (
            <div className="invite-info">
              <CheckCircle className="invite-icon" />
              <div className="invite-details">
                <p>초대 링크로 가입</p>
                <small>
                  만료일: {invite.expiresAt.toLocaleDateString()}
                  {invite.maxUses && ` • 사용 가능: ${invite.maxUses - invite.usedCount}회`}
                </small>
              </div>
            </div>
          )}
        </div>

        {!currentUser ? (
          <div className="login-required">
            <AlertCircle className="alert-icon" />
            <h3>로그인이 필요합니다</h3>
            <p>회사에 가입하려면 먼저 로그인해주세요.</p>
            <div className="login-actions">
              <button
                type="button"
                className="login-btn"
                onClick={() => navigate('/login')}
              >
                로그인하기
              </button>
              <button
                type="button"
                className="signup-btn"
                onClick={() => navigate('/signup')}
              >
                회원가입하기
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="join-company-form">
            <div className="form-section">
              <h3>직원 정보</h3>
              <p>회사에서 사용할 부서와 직책을 입력해주세요.</p>
              
              <div className="form-group">
                <label htmlFor="department">
                  <Users size={20} />
                  부서 *
                </label>
                <input
                  type="text"
                  id="department"
                  {...register('department', { required: '부서를 입력해주세요' })}
                  placeholder="예: 개발팀, 디자인팀, 마케팅팀"
                  className={errors.department ? 'error' : ''}
                />
                {errors.department && <span className="error-message">{errors.department.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="position">
                  <User size={20} />
                  직책 *
                </label>
                <input
                  type="text"
                  id="position"
                  {...register('position', { required: '직책을 입력해주세요' })}
                  placeholder="예: 사원, 대리, 과장, 팀장"
                  className={errors.position ? 'error' : ''}
                />
                {errors.position && <span className="error-message">{errors.position.message}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/')}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className="join-btn"
                disabled={isLoading}
              >
                {isLoading ? '가입 중...' : '회사 가입하기'}
              </button>
            </div>
          </form>
        )}

        <div className="join-instructions">
          <h3>가입 후 이용 가능한 서비스</h3>
          <ul>
            <li>디지털 사원증 발급 및 관리</li>
            <li>QR코드 기반 출퇴근 체크</li>
            <li>외근/연차 신청 및 관리</li>
            <li>개인 출퇴근 기록 조회</li>
            <li>모바일 지갑 연동 (Apple Wallet, Google Wallet)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JoinCompany;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Building, Users, MapPin, Phone, User, Key, Copy, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createCompany } from '../services/companyService';
import { Company, CompanyTheme } from '../types';
import '../styles/CreateCompany.css';

interface CreateCompanyFormData {
  name: string;
  businessNumber: string;
  ceoName: string;
  address: string;
  phone: string;
  workplace: string;
}

const CreateCompany: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [createdCompany, setCreatedCompany] = useState<Company | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateCompanyFormData>();

  const onSubmit = async (data: CreateCompanyFormData) => {
    if (!currentUser) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const defaultTheme: CompanyTheme = {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#F59E0B',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937'
      };

      const companyData = {
        ...data,
        theme: defaultTheme,
        workplace: data.workplace || '연지로30 한국기독교회관'
      };

      const company = await createCompany(companyData, currentUser.uid);
      setCreatedCompany(company);
      toast.success('회사가 성공적으로 생성되었습니다!');
    } catch (error: any) {
      console.error('회사 생성 오류:', error);
      toast.error(error.message || '회사 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('클립보드에 복사되었습니다!');
    }).catch(() => {
      toast.error('복사에 실패했습니다.');
    });
  };

  const shareCompanyKey = () => {
    if (navigator.share && createdCompany) {
      navigator.share({
        title: `${createdCompany.name} 회사 가입`,
        text: `회사 가입 키: ${createdCompany.companyKey}`,
        url: `${window.location.origin}/join/${createdCompany.companyKey}`
      });
    } else {
      copyToClipboard(createdCompany?.companyKey || '');
    }
  };

  if (createdCompany) {
    return (
      <div className="create-company-page">
        <div className="create-company-container">
          <div className="success-card">
            <div className="success-header">
              <Building className="success-icon" />
              <h2>회사 생성 완료!</h2>
              <p>{createdCompany.name}이 성공적으로 생성되었습니다.</p>
            </div>

            <div className="company-info">
              <div className="info-item">
                <label>회사명</label>
                <span>{createdCompany.name}</span>
              </div>
              <div className="info-item">
                <label>회사 키</label>
                <div className="key-display">
                  <span className="key-text">{createdCompany.companyKey}</span>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => copyToClipboard(createdCompany.companyKey)}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="info-item">
                <label>출근 장소</label>
                <span>{createdCompany.workplace}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button
                type="button"
                className="share-btn"
                onClick={shareCompanyKey}
              >
                <Share2 size={20} />
                회사 키 공유하기
              </button>
              <button
                type="button"
                className="dashboard-btn"
                onClick={() => navigate('/admin-dashboard')}
              >
                관리자 대시보드
              </button>
              <button
                type="button"
                className="home-btn"
                onClick={() => navigate('/')}
              >
                홈으로 돌아가기
              </button>
            </div>

            <div className="instructions">
              <h3>다음 단계</h3>
              <ul>
                <li>회사 키를 직원들에게 공유하세요</li>
                <li>직원들은 회사 키를 입력하여 가입할 수 있습니다</li>
                <li>관리자 대시보드에서 직원들을 관리할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-company-page">
      <div className="create-company-container">
        <div className="create-company-header">
          <Building className="header-icon" />
          <h1>새 회사 생성</h1>
          <p>회사를 생성하고 직원들을 관리할 수 있는 플랫폼을 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="create-company-form">
          <div className="form-section">
            <h3>기본 정보</h3>
            
            <div className="form-group">
              <label htmlFor="name">
                <Building size={20} />
                회사명 *
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: '회사명을 입력해주세요' })}
                placeholder="예: (주)테크컴퍼니"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="businessNumber">
                <Key size={20} />
                사업자등록번호 *
              </label>
              <input
                type="text"
                id="businessNumber"
                {...register('businessNumber', { 
                  required: '사업자등록번호를 입력해주세요',
                  pattern: {
                    value: /^\d{3}-\d{2}-\d{5}$/,
                    message: '올바른 사업자등록번호 형식을 입력해주세요 (예: 123-45-67890)'
                  }
                })}
                placeholder="123-45-67890"
                className={errors.businessNumber ? 'error' : ''}
              />
              {errors.businessNumber && <span className="error-message">{errors.businessNumber.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ceoName">
                <User size={20} />
                대표자명 *
              </label>
              <input
                type="text"
                id="ceoName"
                {...register('ceoName', { required: '대표자명을 입력해주세요' })}
                placeholder="홍길동"
                className={errors.ceoName ? 'error' : ''}
              />
              {errors.ceoName && <span className="error-message">{errors.ceoName.message}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>연락처 정보</h3>
            
            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={20} />
                연락처 *
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone', { 
                  required: '연락처를 입력해주세요',
                  pattern: {
                    value: /^[0-9-+()\s]+$/,
                    message: '올바른 전화번호 형식을 입력해주세요'
                  }
                })}
                placeholder="02-1234-5678"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <MapPin size={20} />
                주소 *
              </label>
              <input
                type="text"
                id="address"
                {...register('address', { required: '주소를 입력해주세요' })}
                placeholder="서울특별시 강남구 테헤란로 123"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address.message}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>출근 설정</h3>
            
            <div className="form-group">
              <label htmlFor="workplace">
                <MapPin size={20} />
                출근 장소
              </label>
              <input
                type="text"
                id="workplace"
                {...register('workplace')}
                placeholder="연지로30 한국기독교회관"
                defaultValue="연지로30 한국기독교회관"
              />
              <small>기본 출근 장소를 설정합니다. 나중에 변경할 수 있습니다.</small>
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
              className="create-btn"
              disabled={isLoading}
            >
              {isLoading ? '생성 중...' : '회사 생성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;


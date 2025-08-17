import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CreditCard, Mail, Download, Smartphone, QrCode, AlertTriangle } from 'lucide-react';
import { EmployeeFormData } from '../types';
import { 
  generateEmployeeId, 
  createPassKit, 
  createGoogleWalletJWT, 
  addToAppleWalletDirectly,
  generateAppleWalletQR,
  generateAttendanceQR,
  validatePkpassFile,
  validateGoogleWalletJWT,
  isIOS 
} from '../utils/passUtils';
import { sendEmail } from '../utils/emailUtils';
import '../styles/IssueCard.css';

const IssueCard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedPass, setIssuedPass] = useState<any>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [appleWalletQR, setAppleWalletQR] = useState<string>('');
  const [attendanceQR, setAttendanceQR] = useState<string>('');
  const [fileValidation, setFileValidation] = useState<any>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EmployeeFormData>();

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    
    try {
      // 사원번호 생성
      const employeeId = generateEmployeeId();
      
      // Apple Wallet PassKit 생성
      const applePass = await createPassKit({
        ...data,
        employeeId,
        workplace: '연지로30 한국기독교회관'
      });
      
      // Google Wallet JWT 생성
      const googleWalletJWT = await createGoogleWalletJWT({
        ...data,
        employeeId,
        workplace: '연지로30 한국기독교회관'
      });
      
      // Apple Wallet QR 코드 생성
      const appleQR = await generateAppleWalletQR(applePass, employeeId);
      
      // 출근용 QR 코드 생성
      const attendanceQRCode = await generateAttendanceQR(employeeId);
      
      // 파일 검증
      const blob = new Blob([applePass], { type: 'application/vnd.apple.pkpass' });
      const isValid = validatePkpassFile(blob);
      
      // Google Wallet JWT 검증
      const isGoogleWalletValid = validateGoogleWalletJWT(googleWalletJWT);
      
      setFileValidation({
        appleWallet: {
          isValid,
          size: blob.size,
          type: blob.type
        },
        googleWallet: {
          isValid: isGoogleWalletValid,
          type: 'JWT',
          structure: googleWalletJWT.split('.').length === 3 ? '정상' : '비정상'
        }
      });
      
      // 이메일 발송
      await sendEmail({
        to: data.email,
        name: data.name,
        employeeId,
        applePass,
        googleWalletJWT
      });
      
      setIssuedPass({
        employeeId,
        applePass,
        googleWalletJWT
      });
      
      setAppleWalletQR(appleQR);
      setAttendanceQR(attendanceQRCode);
      
      if (isValid && isGoogleWalletValid) {
        toast.success('사원증이 성공적으로 발행되었습니다!');
      } else {
        toast.error('사원증 파일에 문제가 있습니다. 관리자에게 문의하세요.');
      }
      
      reset();
      
    } catch (error) {
      console.error('사원증 발행 실패:', error);
      toast.error('사원증 발행에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadApplePass = () => {
    if (issuedPass?.applePass) {
      const blob = new Blob([issuedPass.applePass], { type: 'application/vnd.apple.pkpass' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${issuedPass.employeeId}_apple.pkpass`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // 파일 정보 표시
      console.log('다운로드된 파일 정보:', {
        size: blob.size,
        type: blob.type,
        isValid: validatePkpassFile(blob)
      });
    }
  };

  // iPhone에서 바로 Apple Wallet에 추가하는 함수
  const handleAddToAppleWallet = () => {
    if (issuedPass?.applePass) {
      addToAppleWalletDirectly(issuedPass.applePass, issuedPass.employeeId);
      toast.success('Apple Wallet에서 사원증을 추가해주세요!');
    }
  };

  const addToGoogleWallet = () => {
    if (issuedPass?.googleWalletJWT) {
      // Google Wallet에 추가하는 링크 생성
      const walletUrl = `https://pay.google.com/gp/v/save/${issuedPass.googleWalletJWT}`;
      window.open(walletUrl, '_blank');
    }
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <div className="issue-card">
      <div className="container">
        <div className="issue-card-header">
          <h1>사원증 발행</h1>
          <p>Apple Wallet과 Google Wallet을 지원하는 디지털 사원증을 발행합니다.</p>
        </div>

        {!issuedPass ? (
          <form onSubmit={handleSubmit(onSubmit)} className="issue-form">
            <div className="form-section">
              <h3>기본 정보</h3>
              
              <div className="form-group">
                <label htmlFor="name">이름 *</label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: '이름을 입력해주세요.' })}
                  placeholder="홍길동"
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="birthDate">생년월일 *</label>
                <input
                  type="date"
                  id="birthDate"
                  {...register('birthDate', { required: '생년월일을 입력해주세요.' })}
                />
                {errors.birthDate && <span className="error">{errors.birthDate.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">이메일 *</label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: '이메일을 입력해주세요.',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '유효한 이메일 주소를 입력해주세요.'
                    }
                  })}
                  placeholder="hong@company.com"
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">전화번호 *</label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone', { 
                    required: '전화번호를 입력해주세요.',
                    pattern: {
                      value: /^[0-9-+\s()]+$/,
                      message: '유효한 전화번호를 입력해주세요.'
                    }
                  })}
                  placeholder="010-1234-5678"
                />
                {errors.phone && <span className="error">{errors.phone.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="department">부서 *</label>
                <input
                  type="text"
                  id="department"
                  {...register('department', { required: '부서를 입력해주세요.' })}
                  placeholder="예: 개발팀, 디자인팀, 마케팅팀"
                />
                {errors.department && <span className="error">{errors.department.message}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>출근 정보</h3>
              <div className="workplace-info">
                <p><strong>출근 장소:</strong> 연지로30 한국기독교회관</p>
                <p><strong>사원증 유효기간:</strong> 발급일로부터 1년</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={isSubmitting}
            >
              {isSubmitting ? '발행 중...' : '사원증 발행'}
            </button>
          </form>
        ) : (
          <div className="issued-pass">
            <div className="success-message">
              <CreditCard className="success-icon" />
              <h2>사원증 발행 완료!</h2>
              <p>사원번호: <strong>{issuedPass.employeeId}</strong></p>
              <p>이메일로 사원증이 발송되었습니다.</p>
              
              {/* 파일 검증 결과 표시 */}
              {fileValidation && (
                <div className={`file-validation ${fileValidation.appleWallet.isValid ? 'valid' : 'invalid'}`}>
                  <AlertTriangle size={16} />
                  <span>
                    사원증 파일 크기: {fileValidation.appleWallet.size} bytes | 
                    타입: {fileValidation.appleWallet.type} | 
                    상태: {fileValidation.appleWallet.isValid ? '정상' : '비정상'}
                  </span>
                </div>
              )}
              {fileValidation && (
                <div className={`file-validation ${fileValidation.googleWallet.isValid ? 'valid' : 'invalid'}`}>
                  <AlertTriangle size={16} />
                  <span>
                    구글 지갑 JWT 구조: {fileValidation.googleWallet.structure} | 
                    타입: {fileValidation.googleWallet.type} | 
                    상태: {fileValidation.googleWallet.isValid ? '정상' : '비정상'}
                  </span>
                </div>
              )}
            </div>

            <div className="pass-actions">
              <div className="pass-action-card">
                <Smartphone className="action-icon" />
                <h3>Apple Wallet</h3>
                <p>iPhone에서 Apple Wallet에 추가</p>
                {isIOS() ? (
                  <button onClick={handleAddToAppleWallet} className="btn btn-primary">
                    <Smartphone size={16} />
                    Apple Wallet에 바로 추가
                  </button>
                ) : (
                  <button onClick={downloadApplePass} className="btn btn-secondary">
                    <Download size={16} />
                    .pkpass 파일 다운로드
                  </button>
                )}
              </div>

              <div className="pass-action-card">
                <Smartphone className="action-icon" />
                <h3>Google Wallet</h3>
                <p>Android에서 Google Wallet에 추가</p>
                <button onClick={addToGoogleWallet} className="btn btn-secondary">
                  <Mail size={16} />
                  지갑에 추가
                </button>
              </div>

              <div className="pass-action-card">
                <QrCode className="action-icon" />
                <h3>QR 코드로 추가</h3>
                <p>QR 코드를 스캔하여 지갑에 추가</p>
                <button onClick={toggleQRCode} className="btn btn-secondary">
                  <QrCode size={16} />
                  QR 코드 보기
                </button>
              </div>
            </div>

            {showQRCode && (
              <div className="qr-code-section">
                <h3>QR 코드</h3>
                <div className="qr-codes">
                  <div className="qr-code-item">
                    <h4>Apple Wallet 추가용 QR</h4>
                    <p>iPhone 카메라로 스캔하여 Apple Wallet에 추가</p>
                    <img src={appleWalletQR} alt="Apple Wallet QR Code" className="qr-code-image" />
                  </div>
                  <div className="qr-code-item">
                    <h4>출근 체크용 QR</h4>
                    <p>출입구에서 스캔하여 출근 체크</p>
                    <img src={attendanceQR} alt="Attendance QR Code" className="qr-code-image" />
                  </div>
                </div>
              </div>
            )}

            <div className="instructions">
              <h3>설치 방법</h3>
              <div className="instruction-steps">
                <div className="instruction-step">
                  <h4>Apple Wallet (iPhone)</h4>
                  {isIOS() ? (
                    <ol>
                      <li>"Apple Wallet에 바로 추가" 버튼 클릭</li>
                      <li>Apple Wallet 앱에서 "추가" 클릭</li>
                      <li>사원증이 지갑에 추가됩니다</li>
                    </ol>
                  ) : (
                    <ol>
                      <li>다운로드한 .pkpass 파일을 열기</li>
                      <li>Apple Wallet 앱에서 "추가" 클릭</li>
                      <li>사원증이 지갑에 추가됩니다</li>
                    </ol>
                  )}
                </div>
                <div className="instruction-step">
                  <h4>QR 코드로 추가</h4>
                  <ol>
                    <li>"QR 코드 보기" 버튼 클릭</li>
                    <li>iPhone 카메라로 QR 코드 스캔</li>
                    <li>Apple Wallet에서 "추가" 클릭</li>
                    <li>사원증이 지갑에 추가됩니다</li>
                  </ol>
                </div>
                <div className="instruction-step">
                  <h4>Google Wallet</h4>
                  <ol>
                    <li>"지갑에 추가" 버튼 클릭</li>
                    <li>Google Wallet 앱에서 "추가" 클릭</li>
                    <li>사원증이 지갑에 추가됩니다</li>
                  </ol>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIssuedPass(null)} 
              className="btn btn-primary"
            >
              새 사원증 발행
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCard;

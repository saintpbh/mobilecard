import React from 'react';
import { CardDesign } from '../../types/design';
import { generateCardStyle, getFontStyle, getLogoPosition, getQRPosition } from '../../utils/designUtils';
import '../../styles/PreviewCard.css';

interface PreviewCardProps {
  design: CardDesign;
  employeeData?: {
    name: string;
    department: string;
    employeeId: string;
    workplace: string;
  };
  showQR?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  design,
  employeeData = {
    name: '홍길동',
    department: '개발팀',
    employeeId: 'EMP20240001',
    workplace: '연지로30 한국기독교회관'
  },
  showQR = true,
  size = 'medium'
}) => {
  const cardStyle = generateCardStyle(design);
  const isPortrait = design.layout.orientation === 'portrait';

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return isPortrait ? { width: '200px', height: '320px' } : { width: '320px', height: '200px' };
      case 'large':
        return isPortrait ? { width: '300px', height: '480px' } : { width: '480px', height: '300px' };
      default:
        return isPortrait ? { width: '250px', height: '400px' } : { width: '400px', height: '250px' };
    }
  };

  const cardSize = getCardSize();

  return (
    <div className="preview-card-container">
      <div
        className={`preview-card ${isPortrait ? 'portrait' : 'landscape'} ${size}`}
        style={{
          ...cardSize,
          ...cardStyle,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 회사 로고 */}
        {design.companyLogo.url && (
          <div
            className="company-logo"
            style={{
              ...getLogoPosition(design.companyLogo.position),
              width: `${design.companyLogo.size}px`,
              height: `${design.companyLogo.size}px`,
              opacity: design.companyLogo.opacity,
              position: 'absolute',
              zIndex: 2
            }}
          >
            <img
              src={design.companyLogo.url}
              alt="회사 로고"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* 프로필 이미지 */}
        {design.profileImage.url && (
          <div
            className="profile-image"
            style={{
              ...getLogoPosition(design.profileImage.position),
              width: `${design.profileImage.size}px`,
              height: `${design.profileImage.size}px`,
              opacity: design.profileImage.opacity,
              position: 'absolute',
              zIndex: 2
            }}
          >
            <img
              src={design.profileImage.url}
              alt="프로필"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          </div>
        )}

        {/* 카드 내용 */}
        <div className="card-content" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* 이름 */}
          <div
            className="name-section"
            style={{
              ...getFontStyle(design.typography.nameFont),
              marginBottom: '8px',
              color: design.textColor
            }}
          >
            {employeeData.name}
          </div>

          {/* 부서 */}
          <div
            className="department-section"
            style={{
              ...getFontStyle(design.typography.departmentFont),
              marginBottom: '8px',
              color: design.textColor
            }}
          >
            {employeeData.department}
          </div>

          {/* 사원번호 */}
          <div
            className="employee-id-section"
            style={{
              ...getFontStyle(design.typography.employeeIdFont),
              marginBottom: '8px',
              color: design.textColor
            }}
          >
            {employeeData.employeeId}
          </div>

          {/* 출근장소 */}
          <div
            className="workplace-section"
            style={{
              ...getFontStyle(design.typography.workplaceFont),
              color: design.textColor
            }}
          >
            {employeeData.workplace}
          </div>
        </div>

        {/* QR 코드 */}
        {showQR && (
          <div
            className="qr-code"
            style={{
              ...getQRPosition(design.layout.qrPosition),
              width: '60px',
              height: '60px',
              position: 'absolute',
              zIndex: 2,
              backgroundColor: 'white',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${design.accentColor}`
            }}
          >
            <div style={{ fontSize: '8px', textAlign: 'center', color: '#666' }}>
              QR
            </div>
          </div>
        )}

        {/* 강조 효과 */}
        <div
          className="accent-border"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: `3px solid ${design.accentColor}`,
            borderRadius: design.effects.border.radius,
            opacity: 0.3,
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 디자인 정보 */}
      <div className="design-info">
        <div className="info-item">
          <span className="info-label">배경색:</span>
          <span className="info-value">{design.backgroundColor}</span>
        </div>
        <div className="info-item">
          <span className="info-label">텍스트색:</span>
          <span className="info-value">{design.textColor}</span>
        </div>
        <div className="info-item">
          <span className="info-label">강조색:</span>
          <span className="info-value">{design.accentColor}</span>
        </div>
        <div className="info-item">
          <span className="info-label">레이아웃:</span>
          <span className="info-value">{design.layout.orientation}</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;

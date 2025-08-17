import React, { useState, useRef } from 'react';
import { Upload, X, Image, Settings } from 'lucide-react';
import '../../styles/LogoUploader.css';

interface LogoUploaderProps {
  value: {
    url: string;
    position: 'top-left' | 'top-center' | 'top-right';
    size: number;
    opacity: number;
  };
  onChange: (logo: {
    url: string;
    position: 'top-left' | 'top-center' | 'top-right';
    size: number;
    opacity: number;
  }) => void;
  label: string;
  type: 'company' | 'profile';
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  value,
  onChange,
  label,
  type
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      window.alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      window.alert('파일 크기는 2MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange({
        ...value,
        url: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({
      ...value,
      url: ''
    });
  };

  const handlePositionChange = (position: 'top-left' | 'top-center' | 'top-right') => {
    onChange({
      ...value,
      position
    });
  };

  const handleSizeChange = (size: number) => {
    onChange({
      ...value,
      size: Math.max(20, Math.min(200, size))
    });
  };

  const handleOpacityChange = (opacity: number) => {
    onChange({
      ...value,
      opacity: Math.max(0, Math.min(1, opacity))
    });
  };

  const getPositionLabel = (position: string) => {
    const labels = {
      'top-left': '좌측 상단',
      'top-center': '중앙 상단',
      'top-right': '우측 상단'
    };
    return labels[position as keyof typeof labels] || position;
  };

  return (
    <div className="logo-uploader">
      <div className="logo-uploader-header">
        <label className="logo-uploader-label">{label}</label>
        <button
          type="button"
          className="logo-uploader-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Settings size={16} />
          <span>설정</span>
        </button>
      </div>

      {/* 로고 미리보기 */}
      <div className="logo-preview-section">
        {value.url ? (
          <div className="logo-preview">
            <img
              src={value.url}
              alt={label}
              style={{
                width: `${value.size}px`,
                height: `${value.size}px`,
                opacity: value.opacity,
                objectFit: type === 'profile' ? 'cover' : 'contain',
                borderRadius: type === 'profile' ? '50%' : '0'
              }}
            />
            <div className="logo-info">
              <span className="logo-position">{getPositionLabel(value.position)}</span>
              <span className="logo-size">{value.size}px</span>
            </div>
            <button
              type="button"
              className="remove-logo-btn"
              onClick={handleRemoveLogo}
              title="로고 제거"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="logo-upload-placeholder">
            <Image size={32} />
            <span>로고를 업로드하세요</span>
            <button
              type="button"
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              업로드
            </button>
          </div>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* 설정 패널 */}
      {isOpen && (
        <div className="logo-settings-panel">
          {/* 위치 설정 */}
          <div className="setting-section">
            <h4>위치</h4>
            <div className="position-options">
              {(['top-left', 'top-center', 'top-right'] as const).map((position) => (
                <button
                  key={position}
                  type="button"
                  className={`position-btn ${value.position === position ? 'active' : ''}`}
                  onClick={() => handlePositionChange(position)}
                >
                  {getPositionLabel(position)}
                </button>
              ))}
            </div>
          </div>

          {/* 크기 설정 */}
          <div className="setting-section">
            <h4>크기</h4>
            <div className="size-control">
              <input
                type="range"
                min="20"
                max="200"
                value={value.size}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="size-slider"
              />
              <span className="size-value">{value.size}px</span>
            </div>
          </div>

          {/* 투명도 설정 */}
          <div className="setting-section">
            <h4>투명도</h4>
            <div className="opacity-control">
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(value.opacity * 100)}
                onChange={(e) => handleOpacityChange(Number(e.target.value) / 100)}
                className="opacity-slider"
              />
              <span className="opacity-value">{Math.round(value.opacity * 100)}%</span>
            </div>
          </div>

          {/* 업로드 버튼 */}
          {!value.url && (
            <div className="setting-section">
              <button
                type="button"
                className="upload-logo-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                로고 업로드
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoUploader;

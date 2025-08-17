import React, { useState, useRef } from 'react';
import { Upload, Image, Settings, Palette, Sparkles } from 'lucide-react';
import '../../styles/BackgroundUploader.css';

interface BackgroundUploaderProps {
  value: {
    type: 'color' | 'gradient' | 'image' | 'pattern';
    value: string;
    opacity: number;
  };
  onChange: (background: {
    type: 'color' | 'gradient' | 'image' | 'pattern';
    value: string;
    opacity: number;
  }) => void;
}

const BackgroundUploader: React.FC<BackgroundUploaderProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gradients = [
    { name: '파란색 그라데이션', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: '녹색 그라데이션', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: '주황색 그라데이션', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: '보라색 그라데이션', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: '핑크 그라데이션', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: '금색 그라데이션', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
  ];

  const patterns = [
    { name: '점 패턴', value: 'radial-gradient(circle, #000 1px, transparent 1px)', size: '20px 20px' },
    { name: '격자 패턴', value: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', size: '20px 20px' },
    { name: '대각선 패턴', value: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' },
    { name: '물결 패턴', value: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange({
        type: 'image',
        value: result,
        opacity: value.opacity
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTypeChange = (type: 'color' | 'gradient' | 'image' | 'pattern') => {
    let defaultValue = '';
    switch (type) {
      case 'color':
        defaultValue = '#4285f4';
        break;
      case 'gradient':
        defaultValue = gradients[0].value;
        break;
      case 'pattern':
        defaultValue = patterns[0].value;
        break;
      default:
        defaultValue = value.value;
    }
    
    onChange({
      type,
      value: defaultValue,
      opacity: value.opacity
    });
  };

  const handleOpacityChange = (opacity: number) => {
    onChange({
      ...value,
      opacity: Math.max(0, Math.min(1, opacity))
    });
  };

  const getBackgroundStyle = () => {
    switch (value.type) {
      case 'color':
        return { backgroundColor: value.value };
      case 'gradient':
        return { background: value.value };
      case 'image':
        return {
          backgroundImage: `url('${value.value}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      case 'pattern':
        return { backgroundImage: value.value };
      default:
        return {};
    }
  };

  return (
    <div className="background-uploader">
      <div className="background-uploader-header">
        <label className="background-uploader-label">배경</label>
        <button
          type="button"
          className="background-uploader-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Settings size={16} />
          <span>배경 설정</span>
        </button>
      </div>

      {/* 배경 미리보기 */}
      <div className="background-preview-section">
        <div
          className="background-preview"
          style={{
            ...getBackgroundStyle(),
            opacity: value.opacity
          }}
        >
          <div className="preview-overlay">
            <span>배경 미리보기</span>
          </div>
        </div>
        <div className="background-info">
          <span className="background-type">{value.type}</span>
          <span className="background-opacity">{Math.round(value.opacity * 100)}%</span>
        </div>
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
        <div className="background-settings-panel">
          {/* 배경 타입 선택 */}
          <div className="setting-section">
            <h4>배경 타입</h4>
            <div className="background-type-options">
              <button
                type="button"
                className={`type-btn ${value.type === 'color' ? 'active' : ''}`}
                onClick={() => handleTypeChange('color')}
              >
                <Palette size={16} />
                색상
              </button>
              <button
                type="button"
                className={`type-btn ${value.type === 'gradient' ? 'active' : ''}`}
                onClick={() => handleTypeChange('gradient')}
              >
                <Sparkles size={16} />
                그라데이션
              </button>
              <button
                type="button"
                className={`type-btn ${value.type === 'image' ? 'active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image size={16} />
                이미지
              </button>
              <button
                type="button"
                className={`type-btn ${value.type === 'pattern' ? 'active' : ''}`}
                onClick={() => handleTypeChange('pattern')}
              >
                <Sparkles size={16} />
                패턴
              </button>
            </div>
          </div>

          {/* 색상 선택 */}
          {value.type === 'color' && (
            <div className="setting-section">
              <h4>배경 색상</h4>
              <div className="color-input-section">
                <input
                  type="color"
                  value={value.value}
                  onChange={(e) => onChange({ ...value, value: e.target.value })}
                  className="color-input"
                />
                <input
                  type="text"
                  value={value.value}
                  onChange={(e) => onChange({ ...value, value: e.target.value })}
                  placeholder="#000000"
                  className="color-text-input"
                />
              </div>
            </div>
          )}

          {/* 그라데이션 선택 */}
          {value.type === 'gradient' && (
            <div className="setting-section">
              <h4>그라데이션</h4>
              <div className="gradient-options">
                {gradients.map((gradient) => (
                  <button
                    key={gradient.name}
                    type="button"
                    className={`gradient-option ${value.value === gradient.value ? 'active' : ''}`}
                    onClick={() => onChange({ ...value, value: gradient.value })}
                    style={{ background: gradient.value }}
                    title={gradient.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 패턴 선택 */}
          {value.type === 'pattern' && (
            <div className="setting-section">
              <h4>패턴</h4>
              <div className="pattern-options">
                {patterns.map((pattern) => (
                  <button
                    key={pattern.name}
                    type="button"
                    className={`pattern-option ${value.value === pattern.value ? 'active' : ''}`}
                    onClick={() => onChange({ ...value, value: pattern.value })}
                    style={{ backgroundImage: pattern.value }}
                    title={pattern.name}
                  />
                ))}
              </div>
            </div>
          )}

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

          {/* 이미지 업로드 버튼 */}
          {value.type === 'image' && !value.value && (
            <div className="setting-section">
              <button
                type="button"
                className="upload-background-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                배경 이미지 업로드
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundUploader;

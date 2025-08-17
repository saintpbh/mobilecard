import React, { useState } from 'react';
import { Type, ChevronDown } from 'lucide-react';
import { FontConfig, DEFAULT_FONTS } from '../../types/design';
import '../../styles/FontSelector.css';

interface FontSelectorProps {
  value: FontConfig;
  onChange: (font: FontConfig) => void;
  label: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  value,
  onChange,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const fontWeights = [
    { value: 'light', label: 'Light', weight: 300 },
    { value: 'regular', label: 'Regular', weight: 400 },
    { value: 'medium', label: 'Medium', weight: 500 },
    { value: 'bold', label: 'Bold', weight: 700 }
  ];

  const fontStyles = [
    { value: 'normal', label: 'Normal' },
    { value: 'italic', label: 'Italic' }
  ];

  const fontAligns = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ];

  const handleFontFamilyChange = (family: string) => {
    onChange({
      ...value,
      family
    });
  };

  const handleFontSizeChange = (size: number) => {
    onChange({
      ...value,
      size: Math.max(8, Math.min(72, size))
    });
  };

  const handleFontWeightChange = (weight: 'light' | 'regular' | 'medium' | 'bold') => {
    onChange({
      ...value,
      weight
    });
  };

  const handleFontStyleChange = (style: 'normal' | 'italic') => {
    onChange({
      ...value,
      style
    });
  };

  const handleFontAlignChange = (align: 'left' | 'center' | 'right') => {
    onChange({
      ...value,
      align
    });
  };

  const getFontWeight = (weight: string): number => {
    const weights: Record<string, number> = {
      'light': 300,
      'regular': 400,
      'medium': 500,
      'bold': 700
    };
    return weights[weight] || 400;
  };

  return (
    <div className="font-selector">
      <div className="font-selector-header">
        <label className="font-selector-label">{label}</label>
        <button
          type="button"
          className="font-selector-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Type size={16} />
          <span>폰트 설정</span>
          <ChevronDown size={14} className={`chevron ${isOpen ? 'rotated' : ''}`} />
        </button>
      </div>

      {/* 폰트 미리보기 */}
      <div className="font-preview">
        <div
          className="preview-text"
          style={{
            fontFamily: `'${value.family}', sans-serif`,
            fontSize: `${value.size}px`,
            fontWeight: getFontWeight(value.weight),
            fontStyle: value.style,
            textAlign: value.align,
            lineHeight: 1.2
          }}
        >
          {value.family} {value.size}px
        </div>
        <div className="font-info">
          <span className="font-weight">{fontWeights.find(w => w.value === value.weight)?.label}</span>
          <span className="font-style">{fontStyles.find(s => s.value === value.style)?.label}</span>
          <span className="font-align">{fontAligns.find(a => a.value === value.align)?.label}</span>
        </div>
      </div>

      {/* 폰트 설정 패널 */}
      {isOpen && (
        <div className="font-settings-panel">
          {/* 폰트 패밀리 */}
          <div className="setting-section">
            <h4>폰트 패밀리</h4>
            <div className="font-family-selector">
              {DEFAULT_FONTS.map((font) => (
                <button
                  key={font.family}
                  type="button"
                  className={`font-option ${value.family === font.family ? 'active' : ''}`}
                  onClick={() => handleFontFamilyChange(font.family)}
                  style={{ fontFamily: `'${font.family}', sans-serif` }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* 폰트 크기 */}
          <div className="setting-section">
            <h4>폰트 크기</h4>
            <div className="font-size-control">
              <input
                type="range"
                min="8"
                max="72"
                value={value.size}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="font-size-slider"
              />
              <input
                type="number"
                min="8"
                max="72"
                value={value.size}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="font-size-input"
              />
              <span className="font-size-unit">px</span>
            </div>
          </div>

          {/* 폰트 굵기 */}
          <div className="setting-section">
            <h4>폰트 굵기</h4>
            <div className="font-weight-options">
              {fontWeights.map((weight) => (
                <button
                  key={weight.value}
                  type="button"
                  className={`weight-btn ${value.weight === weight.value ? 'active' : ''}`}
                  onClick={() => handleFontWeightChange(weight.value as any)}
                  style={{ fontWeight: weight.weight }}
                >
                  {weight.label}
                </button>
              ))}
            </div>
          </div>

          {/* 폰트 스타일 */}
          <div className="setting-section">
            <h4>폰트 스타일</h4>
            <div className="font-style-options">
              {fontStyles.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  className={`style-btn ${value.style === style.value ? 'active' : ''}`}
                  onClick={() => handleFontStyleChange(style.value as any)}
                  style={{ fontStyle: style.value }}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* 텍스트 정렬 */}
          <div className="setting-section">
            <h4>텍스트 정렬</h4>
            <div className="font-align-options">
              {fontAligns.map((align) => (
                <button
                  key={align.value}
                  type="button"
                  className={`align-btn ${value.align === align.value ? 'active' : ''}`}
                  onClick={() => handleFontAlignChange(align.value as any)}
                >
                  {align.label}
                </button>
              ))}
            </div>
          </div>

          {/* 빠른 크기 설정 */}
          <div className="setting-section">
            <h4>빠른 크기</h4>
            <div className="quick-size-options">
              {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`quick-size-btn ${value.size === size ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange(size)}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;


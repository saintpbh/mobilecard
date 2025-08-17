import React, { useState } from 'react';
import { Sparkles, Settings } from 'lucide-react';
import { ShadowConfig, BorderConfig } from '../../types/design';
import '../../styles/EffectsPanel.css';

interface EffectsPanelProps {
  value: {
    shadow: ShadowConfig;
    border: BorderConfig;
    blur: number;
  };
  onChange: (effects: {
    shadow: ShadowConfig;
    border: BorderConfig;
    blur: number;
  }) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const borderStyles = [
    { value: 'solid', label: '실선' },
    { value: 'dashed', label: '점선' },
    { value: 'dotted', label: '점' }
  ];

  const handleShadowChange = (updates: Partial<ShadowConfig>) => {
    onChange({
      ...value,
      shadow: { ...value.shadow, ...updates }
    });
  };

  const handleBorderChange = (updates: Partial<BorderConfig>) => {
    onChange({
      ...value,
      border: { ...value.border, ...updates }
    });
  };

  const handleBlurChange = (blur: number) => {
    onChange({
      ...value,
      blur: Math.max(0, Math.min(20, blur))
    });
  };

  const getShadowStyle = () => {
    const { shadow } = value;
    return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px rgba(0, 0, 0, ${shadow.opacity})`;
  };

  const getBorderStyle = () => {
    const { border } = value;
    return `${border.width}px ${border.style} ${border.color}`;
  };

  return (
    <div className="effects-panel">
      <div className="effects-panel-header">
        <label className="effects-panel-label">효과</label>
        <button
          type="button"
          className="effects-panel-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Sparkles size={16} />
          <span>효과 설정</span>
        </button>
      </div>

      {/* 효과 미리보기 */}
      <div className="effects-preview">
        <div
          className="preview-box"
          style={{
            boxShadow: getShadowStyle(),
            border: getBorderStyle(),
            borderRadius: `${value.border.radius}px`,
            filter: `blur(${value.blur}px)`
          }}
        >
          <span>효과 미리보기</span>
        </div>
        <div className="effects-info">
          <span className="shadow-info">그림자: {value.shadow.blur}px</span>
          <span className="border-info">테두리: {value.border.width}px</span>
          <span className="blur-info">블러: {value.blur}px</span>
        </div>
      </div>

      {/* 효과 설정 패널 */}
      {isOpen && (
        <div className="effects-settings-panel">
          {/* 그림자 설정 */}
          <div className="setting-section">
            <h4>그림자</h4>
            
            <div className="shadow-controls">
              <div className="control-group">
                <label>색상</label>
                <input
                  type="color"
                  value={value.shadow.color}
                  onChange={(e) => handleShadowChange({ color: e.target.value })}
                  className="shadow-color-input"
                />
              </div>
              
              <div className="control-group">
                <label>투명도</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(value.shadow.opacity * 100)}
                  onChange={(e) => handleShadowChange({ opacity: Number(e.target.value) / 100 })}
                  className="shadow-opacity-slider"
                />
                <span>{Math.round(value.shadow.opacity * 100)}%</span>
              </div>
              
              <div className="control-group">
                <label>블러</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={value.shadow.blur}
                  onChange={(e) => handleShadowChange({ blur: Number(e.target.value) })}
                  className="shadow-blur-slider"
                />
                <span>{value.shadow.blur}px</span>
              </div>
              
              <div className="control-group">
                <label>X 오프셋</label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={value.shadow.offsetX}
                  onChange={(e) => handleShadowChange({ offsetX: Number(e.target.value) })}
                  className="shadow-offset-slider"
                />
                <span>{value.shadow.offsetX}px</span>
              </div>
              
              <div className="control-group">
                <label>Y 오프셋</label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={value.shadow.offsetY}
                  onChange={(e) => handleShadowChange({ offsetY: Number(e.target.value) })}
                  className="shadow-offset-slider"
                />
                <span>{value.shadow.offsetY}px</span>
              </div>
            </div>
          </div>

          {/* 테두리 설정 */}
          <div className="setting-section">
            <h4>테두리</h4>
            
            <div className="border-controls">
              <div className="control-group">
                <label>색상</label>
                <input
                  type="color"
                  value={value.border.color}
                  onChange={(e) => handleBorderChange({ color: e.target.value })}
                  className="border-color-input"
                />
              </div>
              
              <div className="control-group">
                <label>두께</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={value.border.width}
                  onChange={(e) => handleBorderChange({ width: Number(e.target.value) })}
                  className="border-width-slider"
                />
                <span>{value.border.width}px</span>
              </div>
              
              <div className="control-group">
                <label>스타일</label>
                <div className="border-style-options">
                  {borderStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      className={`border-style-btn ${value.border.style === style.value ? 'active' : ''}`}
                      onClick={() => handleBorderChange({ style: style.value as any })}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="control-group">
                <label>모서리 둥글기</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={value.border.radius}
                  onChange={(e) => handleBorderChange({ radius: Number(e.target.value) })}
                  className="border-radius-slider"
                />
                <span>{value.border.radius}px</span>
              </div>
            </div>
          </div>

          {/* 블러 효과 */}
          <div className="setting-section">
            <h4>블러 효과</h4>
            
            <div className="blur-control">
              <input
                type="range"
                min="0"
                max="20"
                value={value.blur}
                onChange={(e) => handleBlurChange(Number(e.target.value))}
                className="blur-slider"
              />
              <span className="blur-value">{value.blur}px</span>
            </div>
          </div>

          {/* 빠른 효과 프리셋 */}
          <div className="setting-section">
            <h4>빠른 효과</h4>
            
            <div className="effect-presets">
              <button
                type="button"
                className="preset-btn"
                onClick={() => onChange({
                  shadow: { color: '#000000', opacity: 0.3, blur: 10, offsetX: 0, offsetY: 5 },
                  border: { color: '#FFFFFF', width: 2, style: 'solid', radius: 12 },
                  blur: 0
                })}
              >
                기본
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => onChange({
                  shadow: { color: '#000000', opacity: 0.5, blur: 15, offsetX: 0, offsetY: 8 },
                  border: { color: '#3b82f6', width: 3, style: 'solid', radius: 8 },
                  blur: 0
                })}
              >
                강조
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => onChange({
                  shadow: { color: '#000000', opacity: 0.1, blur: 5, offsetX: 0, offsetY: 2 },
                  border: { color: '#e5e7eb', width: 1, style: 'solid', radius: 4 },
                  blur: 0
                })}
              >
                미니멀
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => onChange({
                  shadow: { color: '#000000', opacity: 0.2, blur: 8, offsetX: 0, offsetY: 4 },
                  border: { color: '#000000', width: 0, style: 'solid', radius: 0 },
                  blur: 2
                })}
              >
                블러
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EffectsPanel;


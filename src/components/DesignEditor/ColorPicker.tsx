import React, { useState } from 'react';
import { Palette, Pipette } from 'lucide-react';
import { DEFAULT_COLOR_PALETTES } from '../../types/design';
import { getContrastColor, adjustBrightness } from '../../utils/designUtils';
import '../../styles/ColorPicker.css';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  showPalettes?: boolean;
  showBrightness?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  showPalettes = true,
  showBrightness = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorChange = (color: string) => {
    onChange(color);
    setCustomColor(color);
  };

  const handleBrightnessChange = (percent: number) => {
    const adjustedColor = adjustBrightness(value, percent);
    handleColorChange(adjustedColor);
  };

  const getContrastTextColor = () => {
    return getContrastColor(value);
  };

  return (
    <div className="color-picker">
      <div className="color-picker-header">
        <label className="color-picker-label">{label}</label>
        <button
          type="button"
          className="color-picker-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="color-preview"
            style={{ backgroundColor: value }}
          />
          <span className="color-value">{value}</span>
        </button>
      </div>

      {isOpen && (
        <div className="color-picker-panel">
          {/* 기본 색상 팔레트 */}
          {showPalettes && (
            <div className="color-palettes">
              <h4>기본 색상</h4>
              {DEFAULT_COLOR_PALETTES.map((palette) => (
                <div key={palette.id} className="color-palette">
                  <span className="palette-name">{palette.name}</span>
                  <div className="palette-colors">
                    {palette.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`palette-color ${value === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 커스텀 색상 선택기 */}
          <div className="custom-color-section">
            <h4>커스텀 색상</h4>
            <div className="custom-color-inputs">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="color-input"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#000000"
                className="color-text-input"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>

          {/* 밝기 조정 */}
          {showBrightness && (
            <div className="brightness-section">
              <h4>밝기 조정</h4>
              <div className="brightness-controls">
                <button
                  type="button"
                  onClick={() => handleBrightnessChange(-20)}
                  className="brightness-btn"
                >
                  어둡게
                </button>
                <button
                  type="button"
                  onClick={() => handleBrightnessChange(20)}
                  className="brightness-btn"
                >
                  밝게
                </button>
              </div>
            </div>
          )}

          {/* 대비 색상 미리보기 */}
          <div className="contrast-preview">
            <h4>대비 미리보기</h4>
            <div className="contrast-samples">
              <div
                className="contrast-sample"
                style={{
                  backgroundColor: value,
                  color: getContrastTextColor()
                }}
              >
                텍스트 색상
              </div>
            </div>
          </div>

          {/* 빠른 색상 */}
          <div className="quick-colors">
            <h4>빠른 색상</h4>
            <div className="quick-color-grid">
              {[
                '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
                '#008000', '#FFC0CB', '#A52A2A', '#808080', '#C0C0C0'
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`quick-color ${value === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

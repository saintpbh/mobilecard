import React, { useState, useEffect } from 'react';
import { Palette, Type, Image, Sparkles, Save, Download, RotateCcw, Eye } from 'lucide-react';
import { CardDesign, DEFAULT_CARD_DESIGN } from '../../types/design';
import { saveDesign, loadDesign, getSavedDesigns, deleteDesign } from '../../utils/designUtils';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
import LogoUploader from './LogoUploader';
import BackgroundUploader from './BackgroundUploader';
import EffectsPanel from './EffectsPanel';
import PreviewCard from './PreviewCard';
import '../../styles/DesignEditor.css';

interface DesignEditorProps {
  initialDesign?: CardDesign;
  onDesignChange?: (design: CardDesign) => void;
  onSave?: (design: CardDesign) => void;
}

const DesignEditor: React.FC<DesignEditorProps> = ({
  initialDesign = DEFAULT_CARD_DESIGN,
  onDesignChange,
  onSave
}) => {
  const [design, setDesign] = useState<CardDesign>(initialDesign);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'logos' | 'background' | 'effects'>('colors');
  const [savedDesigns, setSavedDesigns] = useState<Record<string, any>>({});
  const [showSavedDesigns, setShowSavedDesigns] = useState(false);
  const [designName, setDesignName] = useState('');
  const [previewSize, setPreviewSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    setSavedDesigns(getSavedDesigns());
  }, []);

  useEffect(() => {
    onDesignChange?.(design);
  }, [design, onDesignChange]);

  const handleDesignChange = (updates: Partial<CardDesign>) => {
    try {
      const newDesign = { ...design, ...updates };
      setDesign(newDesign);
      setError(null);
    } catch (err) {
      console.error('디자인 변경 오류:', err);
      setError('디자인을 업데이트하는 중 오류가 발생했습니다.');
    }
  };

  const handleSaveDesign = () => {
    if (!designName.trim()) {
      window.alert('디자인 이름을 입력해주세요.');
      return;
    }
    
    saveDesign(design, designName);
    setSavedDesigns(getSavedDesigns());
    setDesignName('');
    onSave?.(design);
    window.alert('디자인이 저장되었습니다!');
  };

  const handleLoadDesign = (name: string) => {
    const loadedDesign = loadDesign(name);
    if (loadedDesign) {
      setDesign(loadedDesign);
      setShowSavedDesigns(false);
      window.alert(`${name} 디자인을 불러왔습니다!`);
    }
  };

  const handleDeleteDesign = (name: string) => {
    if (window.confirm(`${name} 디자인을 삭제하시겠습니까?`)) {
      deleteDesign(name);
      setSavedDesigns(getSavedDesigns());
    }
  };

  const handleResetDesign = () => {
    if (window.confirm('모든 디자인을 초기화하시겠습니까?')) {
      setDesign(DEFAULT_CARD_DESIGN);
    }
  };

  const tabs = [
    { id: 'colors', label: '색상', icon: Palette },
    { id: 'fonts', label: '폰트', icon: Type },
    { id: 'logos', label: '로고', icon: Image },
    { id: 'background', label: '배경', icon: Sparkles },
    { id: 'effects', label: '효과', icon: Sparkles }
  ];

  return (
          <div className="design-editor">
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <div className="design-editor-header">
        <h2 className="design-editor-title">사원증 디자인 에디터</h2>
        <div className="design-editor-actions">
          <button
            type="button"
            className="action-btn secondary"
            onClick={() => setShowSavedDesigns(!showSavedDesigns)}
          >
            <Save size={16} />
            저장된 디자인
          </button>
          <button
            type="button"
            className="action-btn secondary"
            onClick={handleResetDesign}
          >
            <RotateCcw size={16} />
            초기화
          </button>
          <button
            type="button"
            className="action-btn primary"
            onClick={handleSaveDesign}
          >
            <Save size={16} />
            디자인 저장
          </button>
        </div>
      </div>

      <div className="design-editor-content">
        {/* 왼쪽: 디자인 컨트롤 */}
        <div className="design-controls">
          {/* 탭 네비게이션 */}
          <div className="design-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`design-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 탭별 컨트롤 패널 */}
          <div className="tab-content">
            {activeTab === 'colors' && (
              <div className="color-controls">
                <ColorPicker
                  value={design.backgroundColor}
                  onChange={(color) => handleDesignChange({ backgroundColor: color })}
                  label="배경 색상"
                />
                <ColorPicker
                  value={design.textColor}
                  onChange={(color) => handleDesignChange({ textColor: color })}
                  label="텍스트 색상"
                />
                <ColorPicker
                  value={design.accentColor}
                  onChange={(color) => handleDesignChange({ accentColor: color })}
                  label="강조 색상"
                />
              </div>
            )}

            {activeTab === 'fonts' && (
              <div className="font-controls">
                <FontSelector
                  value={design.typography.nameFont}
                  onChange={(font) => handleDesignChange({ typography: { ...design.typography, nameFont: font } })}
                  label="이름 폰트"
                />
                <FontSelector
                  value={design.typography.departmentFont}
                  onChange={(font) => handleDesignChange({ typography: { ...design.typography, departmentFont: font } })}
                  label="부서 폰트"
                />
                <FontSelector
                  value={design.typography.employeeIdFont}
                  onChange={(font) => handleDesignChange({ typography: { ...design.typography, employeeIdFont: font } })}
                  label="사원번호 폰트"
                />
              </div>
            )}

            {activeTab === 'logos' && (
              <div className="logo-controls">
                <LogoUploader
                  value={design.companyLogo}
                  onChange={(logo) => handleDesignChange({ companyLogo: logo })}
                  label="회사 로고"
                  type="company"
                />
                <LogoUploader
                  value={design.profileImage}
                  onChange={(image) => handleDesignChange({ profileImage: image })}
                  label="프로필 이미지"
                  type="profile"
                />
              </div>
            )}

            {activeTab === 'background' && (
              <div className="background-controls">
                <BackgroundUploader
                  value={design.background}
                  onChange={(background) => handleDesignChange({ background })}
                />
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="effects-controls">
                <EffectsPanel
                  value={{
                    shadow: design.effects.shadow,
                    border: design.effects.border,
                    blur: design.effects.blur
                  }}
                  onChange={(effects) => handleDesignChange({ 
                    effects: { 
                      ...design.effects, 
                      ...effects 
                    } 
                  })}
                />
              </div>
            )}
          </div>

          {/* 디자인 저장 */}
          <div className="design-save-section">
            <input
              type="text"
              placeholder="디자인 이름을 입력하세요"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="design-name-input"
            />
          </div>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div className="design-preview">
          <div className="preview-header">
            <h3>실시간 미리보기</h3>
            <div className="preview-size-controls">
              <button
                type="button"
                className={`size-btn ${previewSize === 'small' ? 'active' : ''}`}
                onClick={() => setPreviewSize('small')}
              >
                작게
              </button>
              <button
                type="button"
                className={`size-btn ${previewSize === 'medium' ? 'active' : ''}`}
                onClick={() => setPreviewSize('medium')}
              >
                보통
              </button>
              <button
                type="button"
                className={`size-btn ${previewSize === 'large' ? 'active' : ''}`}
                onClick={() => setPreviewSize('large')}
              >
                크게
              </button>
            </div>
          </div>
          
          <div className="preview-container">
            <PreviewCard
              design={design}
              size={previewSize}
              showQR={true}
            />
          </div>
        </div>
      </div>

      {/* 저장된 디자인 모달 */}
      {showSavedDesigns && (
        <div className="saved-designs-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>저장된 디자인</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowSavedDesigns(false)}
              >
                ×
              </button>
            </div>
            
            <div className="saved-designs-list">
              {Object.keys(savedDesigns).length === 0 ? (
                <p className="no-designs">저장된 디자인이 없습니다.</p>
              ) : (
                Object.keys(savedDesigns).map((name) => (
                  <div key={name} className="saved-design-item">
                    <span className="design-name">{name}</span>
                    <div className="design-actions">
                      <button
                        type="button"
                        className="load-btn"
                        onClick={() => handleLoadDesign(name)}
                      >
                        불러오기
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteDesign(name)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignEditor;

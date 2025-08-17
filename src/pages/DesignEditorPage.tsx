import React, { useState } from 'react';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DesignEditor from '../components/DesignEditor/DesignEditor';
import { CardDesign } from '../types/design';
import '../styles/DesignEditorPage.css';

const DesignEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDesign, setCurrentDesign] = useState<CardDesign | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDesignChange = (design: CardDesign) => {
    try {
      setCurrentDesign(design);
      setError(null);
    } catch (err) {
      console.error('디자인 변경 오류:', err);
      setError('디자인을 업데이트하는 중 오류가 발생했습니다.');
    }
  };

  const handleDesignSave = (design: CardDesign) => {
    console.log('디자인 저장됨:', design);
    // 여기서 Firebase에 디자인을 저장하거나 다른 작업을 수행할 수 있습니다
  };

  const handleDownloadDesign = () => {
    if (!currentDesign) {
      window.alert('먼저 디자인을 만들어주세요.');
      return;
    }
    
    // 디자인을 JSON 파일로 다운로드
    const designData = JSON.stringify(currentDesign, null, 2);
    const blob = new Blob([designData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `사원증_디자인_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareDesign = () => {
    if (!currentDesign) {
      window.alert('먼저 디자인을 만들어주세요.');
      return;
    }
    
    // 디자인을 URL 파라미터로 공유 (실제로는 더 안전한 방법 사용)
    const designParam = encodeURIComponent(JSON.stringify(currentDesign));
    const shareUrl = `${window.location.origin}/design?data=${designParam}`;
    
    if (navigator.share) {
      navigator.share({
        title: '내가 만든 사원증 디자인',
        text: '사원증 디자인 에디터로 만든 개인화된 디자인입니다.',
        url: shareUrl
      });
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(shareUrl).then(() => {
        window.alert('디자인 링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        window.alert('링크 복사에 실패했습니다. 수동으로 복사해주세요:\n' + shareUrl);
      });
    }
  };

  return (
    <div className="design-editor-page">
      <div className="page-header">
        <div className="header-content">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            뒤로가기
          </button>
          <h1 className="page-title">사원증 디자인 에디터</h1>
          <div className="header-actions">
            <button
              type="button"
              className="action-btn secondary"
              onClick={handleDownloadDesign}
              disabled={!currentDesign}
            >
              <Download size={16} />
              다운로드
            </button>
            <button
              type="button"
              className="action-btn secondary"
              onClick={handleShareDesign}
              disabled={!currentDesign}
            >
              <Share2 size={16} />
              공유
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="editor-intro">
          <h2>나만의 사원증을 디자인해보세요!</h2>
          <p>
            색상, 폰트, 로고, 배경, 효과를 자유롭게 조합하여 
            개성 넘치는 사원증을 만들어보세요.
          </p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <DesignEditor
          onDesignChange={handleDesignChange}
          onSave={handleDesignSave}
        />

        <div className="design-tips">
          <h3>💡 디자인 팁</h3>
          <div className="tips-grid">
            <div className="tip-item">
              <h4>색상 조합</h4>
              <p>대비가 좋은 색상을 사용하면 가독성이 높아집니다.</p>
            </div>
            <div className="tip-item">
              <h4>폰트 선택</h4>
              <p>명확하고 읽기 쉬운 폰트를 선택하세요.</p>
            </div>
            <div className="tip-item">
              <h4>로고 배치</h4>
              <p>로고는 너무 크지 않게 하여 균형을 맞추세요.</p>
            </div>
            <div className="tip-item">
              <h4>효과 활용</h4>
              <p>적당한 그림자와 테두리로 입체감을 더하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignEditorPage;

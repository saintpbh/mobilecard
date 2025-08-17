import { CardDesign, FontConfig, DEFAULT_CARD_DESIGN } from '../types/design';

// 색상 유틸리티
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const getContrastColor = (backgroundColor: string): string => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export const adjustBrightness = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const adjust = (color: number) => {
    const adjusted = color + (color * percent / 100);
    return Math.max(0, Math.min(255, Math.round(adjusted)));
  };
  
  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
};

// 폰트 유틸리티
export const getFontWeight = (weight: string): number => {
  const weights: Record<string, number> = {
    'light': 300,
    'regular': 400,
    'medium': 500,
    'bold': 700
  };
  return weights[weight] || 400;
};

export const getFontStyle = (font: FontConfig): React.CSSProperties => {
  return {
    fontFamily: `'${font.family}', sans-serif`,
    fontSize: `${font.size}px`,
    fontWeight: getFontWeight(font.weight),
    fontStyle: font.style,
    textAlign: font.align
  };
};

// 디자인 유틸리티
export const generateCardStyle = (design: CardDesign): React.CSSProperties => {
  const {
    backgroundColor,
    textColor,
    effects: { shadow, border, blur },
    background
  } = design;
  
  let backgroundStyle: React.CSSProperties = {};
  
  switch (background.type) {
    case 'color':
      backgroundStyle = { backgroundColor: background.value };
      break;
    case 'gradient':
      backgroundStyle = { background: background.value };
      break;
    case 'image':
      backgroundStyle = {
        backgroundImage: `url('${background.value}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
      break;
    case 'pattern':
      backgroundStyle = { backgroundImage: background.value };
      break;
  }
  
  return {
    ...backgroundStyle,
    color: textColor,
    boxShadow: `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px rgba(0, 0, 0, ${shadow.opacity})`,
    border: `${border.width}px ${border.style} ${border.color}`,
    borderRadius: `${border.radius}px`,
    filter: `blur(${blur}px)`
  };
};

export const getLogoPosition = (position: string): React.CSSProperties => {
  const positions: Record<string, React.CSSProperties> = {
    'top-left': { top: '10px', left: '10px' },
    'top-center': { top: '10px', left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: '10px', right: '10px' }
  };
  return positions[position] || positions['top-center'];
};

export const getQRPosition = (position: string): React.CSSProperties => {
  const positions: Record<string, React.CSSProperties> = {
    'bottom-right': { bottom: '10px', right: '10px' },
    'bottom-left': { bottom: '10px', left: '10px' },
    'center-bottom': { bottom: '10px', left: '50%', transform: 'translateX(-50%)' },
    'right-center': { top: '50%', right: '10px', transform: 'translateY(-50%)' }
  };
  return positions[position] || positions['bottom-right'];
};

// 디자인 저장/불러오기
export const saveDesign = (design: CardDesign, name: string): void => {
  try {
    const designs = JSON.parse(localStorage.getItem('savedDesigns') || '{}');
    designs[name] = {
      ...design,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('savedDesigns', JSON.stringify(designs));
  } catch (error) {
    console.error('디자인 저장 실패:', error);
  }
};

export const loadDesign = (name: string): CardDesign | null => {
  try {
    const designs = JSON.parse(localStorage.getItem('savedDesigns') || '{}');
    return designs[name] || null;
  } catch (error) {
    console.error('디자인 불러오기 실패:', error);
    return null;
  }
};

export const getSavedDesigns = (): Record<string, any> => {
  try {
    return JSON.parse(localStorage.getItem('savedDesigns') || '{}');
  } catch (error) {
    console.error('저장된 디자인 목록 불러오기 실패:', error);
    return {};
  }
};

export const deleteDesign = (name: string): void => {
  try {
    const designs = JSON.parse(localStorage.getItem('savedDesigns') || '{}');
    delete designs[name];
    localStorage.setItem('savedDesigns', JSON.stringify(designs));
  } catch (error) {
    console.error('디자인 삭제 실패:', error);
  }
};

// 디자인 검증
export const validateDesign = (design: CardDesign): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // 색상 검증
  if (!design.backgroundColor || !design.backgroundColor.match(/^#[0-9A-F]{6}$/i)) {
    errors.push('배경색이 유효하지 않습니다.');
  }
  
  if (!design.textColor || !design.textColor.match(/^#[0-9A-F]{6}$/i)) {
    errors.push('텍스트 색상이 유효하지 않습니다.');
  }
  
  // 폰트 검증
  if (!design.typography.nameFont.family) {
    errors.push('이름 폰트가 설정되지 않았습니다.');
  }
  
  if (design.typography.nameFont.size < 12 || design.typography.nameFont.size > 48) {
    errors.push('이름 폰트 크기가 유효하지 않습니다 (12-48px).');
  }
  
  // 로고 검증
  if (design.companyLogo.url && !design.companyLogo.url.startsWith('data:') && !design.companyLogo.url.startsWith('http')) {
    errors.push('회사 로고 URL이 유효하지 않습니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 디자인 리셋
export const resetDesign = (): CardDesign => {
  return { ...DEFAULT_CARD_DESIGN };
};

// 디자인 복사
export const copyDesign = (design: CardDesign): CardDesign => {
  return JSON.parse(JSON.stringify(design));
};

// 디자인 비교
export const compareDesigns = (design1: CardDesign, design2: CardDesign): boolean => {
  return JSON.stringify(design1) === JSON.stringify(design2);
};

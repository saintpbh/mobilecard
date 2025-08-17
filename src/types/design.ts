// 폰트 설정 타입
export interface FontConfig {
  family: string;
  size: number;
  weight: 'light' | 'regular' | 'medium' | 'bold';
  style: 'normal' | 'italic';
  align: 'left' | 'center' | 'right';
}

// 로고 설정 타입
export interface LogoConfig {
  url: string;
  position: 'top-left' | 'top-center' | 'top-right';
  size: number;
  opacity: number;
}

// 레이아웃 설정 타입
export interface LayoutConfig {
  orientation: 'portrait' | 'landscape';
  qrPosition: 'bottom-right' | 'bottom-left' | 'center-bottom' | 'right-center';
}

// 배경 설정 타입
export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image' | 'pattern';
  value: string;
  opacity: number;
}

// 그림자 설정 타입
export interface ShadowConfig {
  color: string;
  opacity: number;
  blur: number;
  offsetX: number;
  offsetY: number;
}

// 테두리 설정 타입
export interface BorderConfig {
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  radius: number;
}

// 효과 설정 타입
export interface EffectsConfig {
  shadow: ShadowConfig;
  border: BorderConfig;
  blur: number;
}

// 사원증 디자인 타입
export interface CardDesign {
  // 색상
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  
  // 로고
  companyLogo: LogoConfig;
  profileImage: LogoConfig;
  
  // 레이아웃
  layout: LayoutConfig;
  
  // 폰트
  typography: {
    nameFont: FontConfig;
    departmentFont: FontConfig;
    employeeIdFont: FontConfig;
    workplaceFont: FontConfig;
  };
  
  // 배경
  background: BackgroundConfig;
  
  // 효과
  effects: EffectsConfig;
}

// 템플릿 타입
export interface DesignTemplate {
  id: string;
  name: string;
  category: 'corporate' | 'modern' | 'creative' | 'classic' | 'tech';
  description: string;
  design: CardDesign;
  preview: string;
}

// 색상 팔레트 타입
export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

// 기본 색상 팔레트
export const DEFAULT_COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'corporate',
    name: '기업형',
    colors: ['#4285f4', '#1a73e8', '#0d47a1', '#1976d2', '#1565c0']
  },
  {
    id: 'modern',
    name: '모던형',
    colors: ['#34a853', '#2e7d32', '#1b5e20', '#388e3c', '#2e7d32']
  },
  {
    id: 'creative',
    name: '크리에이티브형',
    colors: ['#ea4335', '#d32f2f', '#b71c1c', '#f44336', '#d32f2f']
  },
  {
    id: 'classic',
    name: '클래식형',
    colors: ['#9c27b0', '#7b1fa2', '#4a148c', '#8e24aa', '#7b1fa2']
  },
  {
    id: 'tech',
    name: '테크형',
    colors: ['#ff9800', '#f57c00', '#e65100', '#ff8f00', '#f57c00']
  },
  {
    id: 'neutral',
    name: '중성형',
    colors: ['#757575', '#616161', '#424242', '#9e9e9e', '#757575']
  }
];

// 기본 폰트 설정
export const DEFAULT_FONTS = [
  { family: 'Noto Sans KR', name: 'Noto Sans KR' },
  { family: 'Inter', name: 'Inter' },
  { family: 'Open Sans', name: 'Open Sans' },
  { family: 'Montserrat', name: 'Montserrat' },
  { family: 'Poppins', name: 'Poppins' },
  { family: 'Roboto', name: 'Roboto' },
  { family: 'Arial', name: 'Arial' },
  { family: 'Helvetica', name: 'Helvetica' }
];

// 기본 디자인 설정
export const DEFAULT_CARD_DESIGN: CardDesign = {
  backgroundColor: '#4285f4',
  textColor: '#FFFFFF',
  accentColor: '#FFD700',
  
  companyLogo: {
    url: '',
    position: 'top-center',
    size: 60,
    opacity: 1
  },
  
  profileImage: {
    url: '',
    position: 'top-right',
    size: 50,
    opacity: 1
  },
  
  layout: {
    orientation: 'portrait',
    qrPosition: 'bottom-right'
  },
  
  typography: {
    nameFont: {
      family: 'Noto Sans KR',
      size: 24,
      weight: 'bold',
      style: 'normal',
      align: 'center'
    },
    departmentFont: {
      family: 'Noto Sans KR',
      size: 18,
      weight: 'medium',
      style: 'normal',
      align: 'center'
    },
    employeeIdFont: {
      family: 'Noto Sans KR',
      size: 14,
      weight: 'regular',
      style: 'normal',
      align: 'center'
    },
    workplaceFont: {
      family: 'Noto Sans KR',
      size: 12,
      weight: 'light',
      style: 'normal',
      align: 'center'
    }
  },
  
  background: {
    type: 'color',
    value: '#4285f4',
    opacity: 1
  },
  
  effects: {
    shadow: {
      color: '#000000',
      opacity: 0.3,
      blur: 10,
      offsetX: 0,
      offsetY: 5
    },
    border: {
      color: '#FFFFFF',
      width: 2,
      style: 'solid',
      radius: 12
    },
    blur: 0
  }
};


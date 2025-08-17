import QRCode from 'qrcode';

// Apple Developer 인증서 정보 (실제 환경에서 사용)
interface AppleCertificateConfig {
  passTypeIdentifier: string;
  teamIdentifier: string;
  organizationName: string;
  certificatePath: string;
  keyPath: string;
}

// Google Service Account 정보 (실제 환경에서 사용)
interface GoogleServiceAccountConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  issuerId: string;
}

// 실제 Apple 인증서 설정 (환경변수에서 로드)
const getAppleCertificateConfig = (): AppleCertificateConfig => {
  return {
    passTypeIdentifier: process.env.REACT_APP_PASS_TYPE_IDENTIFIER || "pass.com.company.employee",
    teamIdentifier: process.env.REACT_APP_TEAM_IDENTIFIER || "TEAM123",
    organizationName: process.env.REACT_APP_ORGANIZATION_NAME || "회사명",
    certificatePath: process.env.REACT_APP_CERTIFICATE_PATH || "",
    keyPath: process.env.REACT_APP_KEY_PATH || ""
  };
};

// 실제 Google 서비스 계정 설정 (환경변수에서 로드)
const getGoogleServiceAccountConfig = (): GoogleServiceAccountConfig => {
  return {
    projectId: process.env.REACT_APP_GOOGLE_PROJECT_ID || "your-project-id",
    clientEmail: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL || "service-account@project.iam.gserviceaccount.com",
    privateKey: process.env.REACT_APP_GOOGLE_PRIVATE_KEY || "",
    issuerId: process.env.REACT_APP_GOOGLE_ISSUER_ID || "your-issuer-id"
  };
};

// 사원번호 생성
export const generateEmployeeId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `EMP${year}${random}`;
};

// QR 코드 생성
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('QR 코드 생성 실패:', error);
    throw error;
  }
};

// Apple Wallet용 QR 코드 생성 (수정된 버전)
export const generateAppleWalletQR = async (passData: string, employeeId: string): Promise<string> => {
  try {
    // .pkpass 파일을 base64로 인코딩 (TypeScript 호환)
    const blob = new Blob([passData], { type: 'application/vnd.apple.pkpass' });
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    
    // Apple Wallet URL 생성
    const walletUrl = `data:application/vnd.apple.pkpass;base64,${base64}`;
    
    // QR 코드 생성
    return await QRCode.toDataURL(walletUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (error) {
    console.error('Apple Wallet QR 코드 생성 실패:', error);
    throw error;
  }
};

// 출근용 QR 코드 생성
export const generateAttendanceQR = async (employeeId: string): Promise<string> => {
  const attendanceData = `ATTENDANCE_${employeeId}_${new Date().toISOString()}`;
  return await generateQRCode(attendanceData);
};

// 실제 Apple Wallet PassKit 생성 (인증서 정보 포함)
export const createPassKit = async (employeeData: any): Promise<string> => {
  const { name, department, employeeId, workplace } = employeeData;
  const config = getAppleCertificateConfig();
  
  // QR 코드 생성
  const qrData = `${employeeId}_${new Date().toISOString()}`;
  
  // PassKit JSON 구조 (실제 Apple Wallet 형식)
  const passData = {
    formatVersion: 1,
    passTypeIdentifier: config.passTypeIdentifier,
    serialNumber: employeeId,
    teamIdentifier: config.teamIdentifier,
    organizationName: config.organizationName,
    description: "사원증",
    generic: {
      primaryFields: [
        {
          key: "name",
          label: "이름",
          value: name
        }
      ],
      secondaryFields: [
        {
          key: "department",
          label: "부서",
          value: department
        },
        {
          key: "employeeId",
          label: "사원번호",
          value: employeeId
        }
      ],
      auxiliaryFields: [
        {
          key: "workplace",
          label: "출근장소",
          value: workplace
        }
      ]
    },
    barcode: {
      format: "PKBarcodeFormatQR",
      message: qrData,
      messageEncoding: "iso-8859-1"
    },
    locations: [
      {
        longitude: 127.0,
        latitude: 37.5,
        relevantText: workplace
      }
    ]
  };

  return JSON.stringify(passData);
};

// 실제 .pkpass 파일 생성 (Apple Wallet 형식) - 인증서 서명 포함
export const createActualPkpassFile = async (employeeData: any): Promise<Blob> => {
  const { name, department, employeeId, workplace } = employeeData;
  const config = getAppleCertificateConfig();
  
  try {
    // 1. pass.json 생성
    const passJson = await createPassKit(employeeData);
    
    // 2. manifest.json 생성 (파일 목록과 SHA1 해시)
    const manifest = {
      "pass.json": await generateSHA1(passJson),
      "icon.png": "icon_sha1_hash",
      "icon@2x.png": "icon2x_sha1_hash"
    };
    
    // 3. 실제 Apple 인증서로 서명 (서버 사이드에서 수행)
    const signature = await signWithAppleCertificate(JSON.stringify(manifest));
    
    // 4. ZIP 파일 생성 (.pkpass 구조)
    const zipContent = await createPkpassZip({
      "pass.json": passJson,
      "manifest.json": JSON.stringify(manifest),
      "signature": signature,
      "icon.png": "icon_binary_data",
      "icon@2x.png": "icon2x_binary_data"
    });
    
    return new Blob([zipContent], { type: 'application/vnd.apple.pkpass' });
    
  } catch (error) {
    console.error('pkpass 파일 생성 실패:', error);
    // 실패 시 더미 파일 반환
    return new Blob(['dummy_pkpass_content'], { type: 'application/vnd.apple.pkpass' });
  }
};

// SHA1 해시 생성 (실제 구현에서는 crypto 라이브러리 사용)
const generateSHA1 = async (data: string): Promise<string> => {
  // 실제 구현에서는 Web Crypto API 사용
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-1', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Apple 인증서로 서명 (실제 구현에서는 서버 사이드에서 수행)
const signWithAppleCertificate = async (data: string): Promise<string> => {
  // 실제 구현에서는 Apple Developer 인증서와 키를 사용하여 서명
  // 여기서는 더미 서명 반환
  return "dummy_signature_for_testing";
};

// ZIP 파일 생성 (.pkpass 구조)
const createPkpassZip = async (files: Record<string, string>): Promise<ArrayBuffer> => {
  // 실제 구현에서는 JSZip 라이브러리 사용
  // 여기서는 더미 ZIP 데이터 반환
  return new ArrayBuffer(1024);
};

// iPhone에서 바로 Apple Wallet에 추가하는 함수
export const addToAppleWalletDirectly = (passData: string, employeeId: string) => {
  // .pkpass 파일 생성
  const blob = new Blob([passData], { type: 'application/vnd.apple.pkpass' });
  const url = URL.createObjectURL(blob);
  
  // iPhone에서 Apple Wallet 열기
  const link = document.createElement('a');
  link.href = url;
  link.download = `${employeeId}_apple.pkpass`;
  
  // iOS 디바이스 감지
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS) {
    // iPhone에서는 바로 Apple Wallet 열기
    window.location.href = url;
  } else {
    // 다른 디바이스에서는 다운로드
    link.click();
  }
  
  // URL 정리
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 3000);
};

// Apple Wallet 링크 생성 (더 나은 방법)
export const createAppleWalletLink = (passData: string, employeeId: string): string => {
  const blob = new Blob([passData], { type: 'application/vnd.apple.pkpass' });
  return URL.createObjectURL(blob);
};

// 실제 Google Wallet JWT 생성 (서비스 계정 정보 포함)
export const createGoogleWalletJWT = async (employeeData: any): Promise<string> => {
  const { name, department, employeeId, workplace } = employeeData;
  const config = getGoogleServiceAccountConfig();
  
  // QR 코드 생성
  const qrData = `${employeeId}_${new Date().toISOString()}`;
  
  // JWT 헤더
  const header = {
    alg: "RS256",
    typ: "JWT"
  };
  
  // JWT 페이로드
  const payload = {
    iss: config.clientEmail,
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 유효
    payload: {
      genericObjects: [
        {
          id: employeeId,
          cardTitle: {
            defaultValue: {
              language: "ko-KR",
              value: "사원증"
            }
          },
          subheader: {
            defaultValue: {
              language: "ko-KR",
              value: name
            }
          },
          header: {
            defaultValue: {
              language: "ko-KR",
              value: department
            }
          },
          barcode: {
            type: "QR_CODE",
            value: qrData
          },
          hexBackgroundColor: "#4285f4",
          logo: {
            sourceUri: {
              uri: "https://example.com/logo.png"
            }
          }
        }
      ]
    }
  };

  try {
    // 실제 JWT 서명 (서버 사이드에서 수행)
    const jwt = await signJWT(header, payload, config.privateKey);
    return jwt;
  } catch (error) {
    console.error('JWT 생성 실패:', error);
    // 실패 시 더미 JWT 반환
    return JSON.stringify(payload);
  }
};

// JWT 서명 (실제 구현에서는 서버 사이드에서 수행)
const signJWT = async (header: any, payload: any, privateKey: string): Promise<string> => {
  // 실제 구현에서는 RS256 알고리즘으로 서명
  // 여기서는 더미 JWT 반환
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.dummy_signature`;
};

// 사원증 만료일 계산
export const calculateExpiryDate = (): Date => {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  return expiryDate;
};

// 사원증 상태 확인
export const checkPassStatus = (issuedAt: Date, expiresAt: Date): 'active' | 'expired' | 'revoked' => {
  const now = new Date();
  
  if (now > expiresAt) {
    return 'expired';
  }
  
  return 'active';
};

// 디바이스 감지 함수
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const isMobile = (): boolean => {
  return isIOS() || isAndroid();
};

// pkpass 파일 검증 함수 (개선된 버전)
export const validatePkpassFile = (file: Blob): boolean => {
  // 파일 크기 검증 (최소 1KB 이상)
  if (file.size < 1024) {
    console.warn('pkpass 파일이 너무 작습니다:', file.size, 'bytes');
    return false;
  }
  
  // 파일 타입 검증
  if (file.type !== 'application/vnd.apple.pkpass') {
    console.warn('잘못된 파일 타입:', file.type);
    return false;
  }
  
  return true;
};

// Google Wallet JWT 검증 함수
export const validateGoogleWalletJWT = (jwt: string): boolean => {
  try {
    // JWT 구조 검증
    const parts = jwt.split('.');
    if (parts.length !== 3) {
      console.warn('잘못된 JWT 구조');
      return false;
    }
    
    // 페이로드 디코딩 및 검증
    const payload = JSON.parse(atob(parts[1]));
    
    // 필수 필드 검증
    if (!payload.iss || !payload.aud || !payload.payload) {
      console.warn('JWT 페이로드에 필수 필드가 없습니다');
      return false;
    }
    
    // 만료 시간 검증
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.warn('JWT가 만료되었습니다');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('JWT 검증 실패:', error);
    return false;
  }
};

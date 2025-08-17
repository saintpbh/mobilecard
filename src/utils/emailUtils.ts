// 이메일 발송 함수 (Firebase Cloud Functions와 연동)
export const sendEmail = async (emailData: {
  to: string;
  name: string;
  employeeId: string;
  applePass: string;
  googleWalletJWT: string;
}): Promise<void> => {
  const { to, name, employeeId, applePass, googleWalletJWT } = emailData;

  // 실제 구현에서는 Firebase Cloud Functions를 호출
  // 여기서는 콘솔에 로그를 출력하는 것으로 대체
  console.log('이메일 발송 시뮬레이션:', {
    to,
    subject: '[회사명] 사원증이 발급되었습니다',
    employeeId,
    applePass: applePass.substring(0, 100) + '...',
    googleWalletJWT: googleWalletJWT.substring(0, 100) + '...'
  });

  // 실제 구현 예시:
  /*
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      name,
      employeeId,
      applePass,
      googleWalletJWT
    })
  });

  if (!response.ok) {
    throw new Error('이메일 발송에 실패했습니다.');
  }
  */
};

// Apple Wallet용 이메일 템플릿
export const generateAppleWalletEmail = (data: {
  name: string;
  employeeId: string;
  applePass: string;
}): string => {
  const { name, employeeId } = data;
  
  return `
제목: [회사명] 사원증이 발급되었습니다

안녕하세요, ${name}님

회사명 사원증이 발급되었습니다.

사원번호: ${employeeId}
출근장소: 연지로30 한국기독교회관

첨부된 파일을 다운로드하여 Apple Wallet에 추가해주세요.

[첨부파일: ${name}_사원증.pkpass]

설치 방법:
1. 첨부파일을 다운로드
2. Apple Wallet 앱 열기
3. "+" 버튼 클릭
4. "파일에서 추가" 선택
5. 다운로드한 .pkpass 파일 선택

문의사항이 있으시면 인사팀으로 연락주세요.

감사합니다.
회사명 인사팀
  `;
};

// Google Wallet용 이메일 템플릿
export const generateGoogleWalletEmail = (data: {
  name: string;
  employeeId: string;
  googleWalletJWT: string;
}): string => {
  const { name, employeeId, googleWalletJWT } = data;
  
  const walletUrl = `https://pay.google.com/gp/v/save/${googleWalletJWT}`;
  
  return `
제목: [회사명] 사원증이 발급되었습니다

안녕하세요, ${name}님

회사명 사원증이 발급되었습니다.

사원번호: ${employeeId}
출근장소: 연지로30 한국기독교회관

아래 링크를 클릭하여 Google Wallet에 추가해주세요.

[지갑에 추가] ${walletUrl}

설치 방법:
1. 위 링크 클릭
2. Google Wallet 앱에서 "추가" 클릭
3. 사원증이 지갑에 추가됩니다

문의사항이 있으시면 인사팀으로 연락주세요.

감사합니다.
회사명 인사팀
  `;
};

// 통합 이메일 템플릿
export const generateCombinedEmail = (data: {
  name: string;
  employeeId: string;
  applePass: string;
  googleWalletJWT: string;
}): string => {
  const { name, employeeId, googleWalletJWT } = data;
  
  const walletUrl = `https://pay.google.com/gp/v/save/${googleWalletJWT}`;
  
  return `
제목: [회사명] 사원증이 발급되었습니다

안녕하세요, ${name}님

회사명 사원증이 발급되었습니다.

사원번호: ${employeeId}
출근장소: 연지로30 한국기독교회관
유효기간: 발급일로부터 1년

=== Apple Wallet 사용자 ===
첨부된 .pkpass 파일을 다운로드하여 Apple Wallet에 추가해주세요.

설치 방법:
1. 첨부파일을 다운로드
2. Apple Wallet 앱 열기
3. "+" 버튼 클릭
4. "파일에서 추가" 선택
5. 다운로드한 .pkpass 파일 선택

=== Google Wallet 사용자 ===
아래 링크를 클릭하여 Google Wallet에 추가해주세요.

[지갑에 추가] ${walletUrl}

설치 방법:
1. 위 링크 클릭
2. Google Wallet 앱에서 "추가" 클릭
3. 사원증이 지갑에 추가됩니다

=== 주의사항 ===
- 사원증은 개인용으로만 사용해주세요
- 분실 시 즉시 인사팀에 연락해주세요
- 부서 변경 시 새로운 사원증이 발급됩니다

문의사항이 있으시면 인사팀으로 연락주세요.
이메일: hr@company.com
전화: 02-1234-5678

감사합니다.
회사명 인사팀
  `;
};

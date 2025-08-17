# Mobile Card - 디지털 사원증 발행 및 관리 시스템

## 📱 프로젝트 개요

Mobile Card는 Apple Wallet과 Google Wallet을 지원하는 디지털 사원증 발행 및 관리 시스템입니다. 회사별로 독립적인 출퇴근 관리와 사원증 발행이 가능한 통합 플랫폼입니다.

## ✨ 주요 기능

### 🏢 회사 관리 시스템
- **회사 생성**: 고유 키 기반 회사 등록
- **회사 가입**: 키 또는 초대 링크를 통한 직원 가입
- **데이터 분리**: 회사별 독립적인 데이터 관리
- **권한 관리**: 관리자, 매니저, 직원 역할 구분

### 📋 사원증 관리
- **Apple Wallet 지원**: .pkpass 파일 생성 및 발행
- **Google Wallet 지원**: JWT 기반 지갑 연동
- **디자인 에디터**: 커스터마이징 가능한 사원증 디자인
- **QR 코드**: 출퇴근 체크용 QR 코드 생성

### ⏰ 출퇴근 관리
- **QR 코드 체크**: 모바일 지갑의 QR 코드로 출퇴근
- **외근/연차 신청**: 관리자 승인 시스템
- **실시간 현황**: 관리자 대시보드에서 실시간 모니터링
- **통계 및 리포트**: 출퇴근 현황 분석

### 🔐 보안 및 인증
- **Firebase Authentication**: Google 로그인 지원
- **Firestore 보안 규칙**: 회사별 데이터 접근 제어
- **JWT 토큰**: 안전한 인증 시스템

## 🛠 기술 스택

### Frontend
- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안전성 보장
- **React Router DOM**: SPA 라우팅
- **React Hook Form**: 폼 관리
- **React Hot Toast**: 알림 시스템
- **Lucide React**: 아이콘 라이브러리

### Backend & Database
- **Firebase Firestore**: NoSQL 데이터베이스
- **Firebase Authentication**: 사용자 인증
- **Firebase Storage**: 파일 저장소
- **Firebase Hosting**: 웹 호스팅

### 개발 도구
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Firebase CLI**: 배포 및 관리

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone [repository-url]
cd Mobilecard
```

### 2. 의존성 설치
```bash
npm install
```

### 3. Firebase 설정
1. Firebase 프로젝트 생성
2. 웹 앱 등록
3. `src/firebase.ts` 파일에 설정 정보 입력

### 4. 환경 변수 설정
```bash
cp .env.example .env.local
# .env.local 파일에 Firebase 설정 정보 입력
```

### 5. 개발 서버 실행
```bash
npm start
```

### 6. 프로덕션 빌드
```bash
npm run build
```

## 📁 프로젝트 구조

```
Mobilecard/
├── public/                 # 정적 파일
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── DesignEditor/   # 사원증 디자인 에디터
│   │   └── ...
│   ├── contexts/          # React Context
│   ├── pages/             # 페이지 컴포넌트
│   ├── services/          # API 서비스
│   ├── styles/            # CSS 스타일
│   ├── types/             # TypeScript 타입 정의
│   ├── utils/             # 유틸리티 함수
│   └── App.tsx            # 메인 앱 컴포넌트
├── firebase.json          # Firebase 설정
├── firestore.rules        # Firestore 보안 규칙
├── firestore.indexes.json # Firestore 인덱스
└── package.json           # 프로젝트 의존성
```

## 🔧 주요 페이지

### 사용자 페이지
- **홈**: 서비스 소개 및 메인 페이지
- **회원가입**: Google 로그인 기반 회원가입
- **로그인**: 사용자 인증
- **사원증 발행**: 개인 사원증 발행
- **대시보드**: 개인 정보 및 사원증 관리
- **디자인 에디터**: 사원증 디자인 커스터마이징

### 관리자 페이지
- **회사 생성**: 새 회사 등록
- **회사 가입**: 기존 회사에 가입
- **관리자 대시보드**: 회사 및 직원 관리
  - 개요: 전체 현황
  - 직원 관리: 직원 목록 및 권한 관리
  - 출퇴근 현황: 실시간 출퇴근 모니터링
  - 외근/연차: 승인/거절 관리
  - 설정: 회사 정보 및 초대 관리

## 🔐 보안 기능

### Firestore 보안 규칙
- 회사별 데이터 접근 제어
- 역할 기반 권한 관리
- 사용자별 데이터 격리

### 인증 시스템
- Firebase Authentication
- Google OAuth 지원
- JWT 토큰 기반 인증

## 📱 모바일 지갑 지원

### Apple Wallet
- PassKit 형식 지원
- .pkpass 파일 생성
- 자동 지갑 추가

### Google Wallet
- JWT 기반 연동
- Google Pay API 지원
- 안전한 토큰 관리

## 🚀 배포

### Firebase Hosting 배포
```bash
npm run build
firebase deploy --only hosting
```

### 배포 URL
- **프로덕션**: https://mobilecard-8d124.web.app

## 📊 데이터베이스 스키마

### 주요 컬렉션
- `companies`: 회사 정보
- `companyMembers`: 회사 멤버 정보
- `attendance`: 출퇴근 기록
- `leaveRequests`: 외근/연차 신청
- `companyInvites`: 회사 초대 정보
- `users`: 사용자 정보
- `employeeCards`: 사원증 정보

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**개발자**: AI Assistant  
**버전**: 1.0.0  
**최종 업데이트**: 2024년 8월

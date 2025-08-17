import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Smartphone, Mail, Shield } from 'lucide-react';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>디지털 사원증 발행 시스템</h1>
          <p>Apple Wallet과 Google Wallet을 지원하는 스마트 사원증</p>
          <div className="hero-buttons">
            <Link to="/issue" className="btn btn-primary">
              사원증 발행하기
            </Link>
            <Link to="/login" className="btn btn-secondary">
              로그인
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <CreditCard size={200} className="hero-icon" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>주요 기능</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Smartphone className="feature-icon" />
            <h3>모바일 지갑 지원</h3>
            <p>Apple Wallet과 Google Wallet에 사원증을 추가하여 언제든지 사용할 수 있습니다.</p>
          </div>
          
          <div className="feature-card">
            <Mail className="feature-icon" />
            <h3>이메일 발송</h3>
            <p>사원증을 이메일로 발송하여 간편하게 지갑에 추가할 수 있습니다.</p>
          </div>
          
          <div className="feature-card">
            <Shield className="feature-icon" />
            <h3>보안 관리</h3>
            <p>Firebase 기반의 안전한 인증 시스템으로 개인정보를 보호합니다.</p>
          </div>
          
          <div className="feature-card">
            <CreditCard className="feature-icon" />
            <h3>실시간 업데이트</h3>
            <p>부서 변경이나 정보 수정 시 실시간으로 사원증이 업데이트됩니다.</p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works">
        <h2>사용 방법</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>정보 입력</h3>
            <p>이름, 생년월일, 이메일, 전화번호, 부서 정보를 입력합니다.</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>사원증 발행</h3>
            <p>Apple Wallet용 .pkpass 파일과 Google Wallet용 링크를 생성합니다.</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>이메일 수신</h3>
            <p>생성된 사원증이 이메일로 발송됩니다.</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>지갑에 추가</h3>
            <p>이메일의 링크를 클릭하거나 파일을 다운로드하여 지갑에 추가합니다.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>지금 시작하세요</h2>
        <p>디지털 사원증으로 더욱 편리한 출근 관리</p>
        <Link to="/issue" className="btn btn-primary btn-large">
          사원증 발행 시작
        </Link>
      </section>
    </div>
  );
};

export default Home;

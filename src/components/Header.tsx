import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, CreditCard, Palette, Building, BarChart3 } from 'lucide-react'; // Added Building, BarChart3
import '../styles/Header.css';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <CreditCard className="logo-icon" />
          <span>Mobile Card</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            <Home size={20} />
            <span>홈</span>
          </Link>
          <Link to="/issue" className="nav-link">
            <CreditCard size={20} />
            <span>사원증 발행</span>
          </Link>
          <Link to="/design" className="nav-link">
            <Palette size={20} />
            <span>디자인 에디터</span>
          </Link>

          {currentUser ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <User size={20} />
                <span>대시보드</span>
              </Link>
              <Link to="/admin-dashboard" className="nav-link"> {/* New link */}
                <BarChart3 size={20} />
                <span>관리자</span>
              </Link>
              <Link to="/create-company" className="nav-link"> {/* New link */}
                <Building size={20} />
                <span>회사 생성</span>
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                <LogOut size={20} />
                <span>로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-link">
                <User size={20} />
                <span>회원가입</span>
              </Link>
              <Link to="/login" className="nav-link">
                <User size={20} />
                <span>로그인</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

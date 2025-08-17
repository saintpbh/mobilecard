import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Mobile Card</h3>
          <p>Apple/Android Wallet 사원증 발행 시스템</p>
        </div>
        
        <div className="footer-section">
          <h4>연락처</h4>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={16} />
              <span>support@company.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>02-1234-5678</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>연지로30 한국기독교회관</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>빠른 링크</h4>
          <ul className="footer-links">
            <li><a href="/issue">사원증 발행</a></li>
            <li><a href="/login">로그인</a></li>
            <li><a href="/dashboard">대시보드</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Mobile Card. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, User, Settings, Calendar, MapPin } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // 임시 데이터 (실제로는 Firebase에서 가져옴)
  const mockEmployeeData = {
    employeeId: 'EMP2024001',
    name: '홍길동',
    department: '개발팀',
    position: '시니어 개발자',
    email: currentUser?.email || '',
    phone: '010-1234-5678',
    workplace: '연지로30 한국기독교회관',
    status: 'active',
    issuedDate: '2024-01-01',
    expiryDate: '2025-01-01'
  };

  const mockPassHistory = [
    {
      id: 'PASS001',
      platform: 'Apple Wallet',
      issuedAt: '2024-01-01',
      status: 'active'
    },
    {
      id: 'PASS002',
      platform: 'Google Wallet',
      issuedAt: '2024-01-01',
      status: 'active'
    }
  ];

  const mockRequests = [
    {
      id: 'REQ001',
      type: 'business_trip',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      location: '고객사 방문',
      status: 'approved'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>대시보드</h1>
          <p>안녕하세요, {mockEmployeeData.name}님!</p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-sidebar">
            <nav className="dashboard-nav">
              <button
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <CreditCard size={20} />
                <span>개요</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                <span>프로필</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'passes' ? 'active' : ''}`}
                onClick={() => setActiveTab('passes')}
              >
                <CreditCard size={20} />
                <span>사원증</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                <Calendar size={20} />
                <span>신청 내역</span>
              </button>
              <button
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={20} />
                <span>설정</span>
              </button>
            </nav>
          </div>

          <div className="dashboard-main">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="overview-cards">
                  <div className="overview-card">
                    <div className="card-header">
                      <User className="card-icon" />
                      <h3>기본 정보</h3>
                    </div>
                    <div className="card-content">
                      <div className="info-item">
                        <span className="label">사원번호:</span>
                        <span className="value">{mockEmployeeData.employeeId}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">이름:</span>
                        <span className="value">{mockEmployeeData.name}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">부서:</span>
                        <span className="value">{mockEmployeeData.department}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">직급:</span>
                        <span className="value">{mockEmployeeData.position}</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="card-header">
                      <MapPin className="card-icon" />
                      <h3>출근 정보</h3>
                    </div>
                    <div className="card-content">
                      <div className="info-item">
                        <span className="label">출근장소:</span>
                        <span className="value">{mockEmployeeData.workplace}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">상태:</span>
                        <span className={`status ${mockEmployeeData.status}`}>
                          {mockEmployeeData.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="card-header">
                      <CreditCard className="card-icon" />
                      <h3>사원증 정보</h3>
                    </div>
                    <div className="card-content">
                      <div className="info-item">
                        <span className="label">발급일:</span>
                        <span className="value">{mockEmployeeData.issuedDate}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">만료일:</span>
                        <span className="value">{mockEmployeeData.expiryDate}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">발행된 사원증:</span>
                        <span className="value">{mockPassHistory.length}개</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>빠른 작업</h3>
                  <div className="action-buttons">
                    <button className="btn btn-primary">
                      <CreditCard size={16} />
                      새 사원증 발행
                    </button>
                    <button className="btn btn-secondary">
                      <Calendar size={16} />
                      외근 신청
                    </button>
                    <button className="btn btn-secondary">
                      <Calendar size={16} />
                      연차 신청
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="profile-tab">
                <h2>프로필 관리</h2>
                <div className="profile-form">
                  <div className="form-group">
                    <label>이름</label>
                    <input type="text" value={mockEmployeeData.name} readOnly />
                  </div>
                  <div className="form-group">
                    <label>이메일</label>
                    <input type="email" value={mockEmployeeData.email} readOnly />
                  </div>
                  <div className="form-group">
                    <label>전화번호</label>
                    <input type="tel" value={mockEmployeeData.phone} />
                  </div>
                  <div className="form-group">
                    <label>부서</label>
                    <select value={mockEmployeeData.department}>
                      <option value="개발팀">개발팀</option>
                      <option value="디자인팀">디자인팀</option>
                      <option value="마케팅팀">마케팅팀</option>
                    </select>
                  </div>
                  <button className="btn btn-primary">정보 업데이트</button>
                </div>
              </div>
            )}

            {activeTab === 'passes' && (
              <div className="passes-tab">
                <h2>사원증 관리</h2>
                <div className="passes-list">
                  {mockPassHistory.map(pass => (
                    <div key={pass.id} className="pass-item">
                      <div className="pass-info">
                        <h4>{pass.platform}</h4>
                        <p>발급일: {pass.issuedAt}</p>
                        <span className={`status ${pass.status}`}>
                          {pass.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                      <div className="pass-actions">
                        <button className="btn btn-secondary">재발행</button>
                        <button className="btn btn-danger">폐기</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="requests-tab">
                <h2>신청 내역</h2>
                <div className="requests-list">
                  {mockRequests.map(request => (
                    <div key={request.id} className="request-item">
                      <div className="request-info">
                        <h4>
                          {request.type === 'business_trip' ? '외근 신청' : '연차 신청'}
                        </h4>
                        <p>기간: {request.startDate} ~ {request.endDate}</p>
                        <p>장소: {request.location}</p>
                        <span className={`status ${request.status}`}>
                          {request.status === 'approved' ? '승인됨' : '대기중'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h2>설정</h2>
                <div className="settings-section">
                  <h3>알림 설정</h3>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      이메일 알림
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      사원증 만료 알림
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

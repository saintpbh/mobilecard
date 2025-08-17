import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import '../styles/Profile.css';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 임시 프로필 데이터
  const [profileData, setProfileData] = useState({
    name: '홍길동',
    email: currentUser?.email || '',
    phone: '010-1234-5678',
    department: '개발팀',
    position: '시니어 개발자',
    employeeId: 'EMP2024001',
    workplace: '연지로30 한국기독교회관',
    joinDate: '2020-03-01',
    birthDate: '1990-01-01'
  });

  const [editData, setEditData] = useState(profileData);

  const departments = [
    '개발팀',
    '디자인팀',
    '마케팅팀',
    '인사팀',
    '재무팀',
    '영업팀',
    '고객지원팀',
    '기획팀'
  ];

  const positions = [
    '인턴',
    '사원',
    '대리',
    '과장',
    '차장',
    '부장',
    '이사',
    '상무',
    '전무',
    '사장'
  ];

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 실제로는 Firebase에 업데이트
      setProfileData(editData);
      setIsEditing(false);
      // 성공 메시지 표시
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>프로필</h1>
          <p>개인 정보를 관리하고 업데이트하세요.</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <User size={80} />
            </div>

            <div className="profile-info">
              <div className="profile-name">
                <h2>{profileData.name}</h2>
                <p>{profileData.position}</p>
              </div>

              <div className="profile-actions">
                {!isEditing ? (
                  <button onClick={handleEdit} className="btn btn-secondary">
                    <Edit size={16} />
                    편집
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button 
                      onClick={handleSave} 
                      className="btn btn-primary"
                      disabled={isSaving}
                    >
                      <Save size={16} />
                      {isSaving ? '저장 중...' : '저장'}
                    </button>
                    <button onClick={handleCancel} className="btn btn-secondary">
                      <X size={16} />
                      취소
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-section">
              <h3>기본 정보</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <User size={20} />
                  </div>
                  <div className="detail-content">
                    <label>이름</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <span>{profileData.name}</span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Mail size={20} />
                  </div>
                  <div className="detail-content">
                    <label>이메일</label>
                    <span>{profileData.email}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Phone size={20} />
                  </div>
                  <div className="detail-content">
                    <label>전화번호</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <span>{profileData.phone}</span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <label>생년월일</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      />
                    ) : (
                      <span>{profileData.birthDate}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>직장 정보</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <User size={20} />
                  </div>
                  <div className="detail-content">
                    <label>사원번호</label>
                    <span>{profileData.employeeId}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <User size={20} />
                  </div>
                  <div className="detail-content">
                    <label>부서</label>
                    {isEditing ? (
                      <select
                        value={editData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    ) : (
                      <span>{profileData.department}</span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <User size={20} />
                  </div>
                  <div className="detail-content">
                    <label>직급</label>
                    {isEditing ? (
                      <select
                        value={editData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                      >
                        {positions.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    ) : (
                      <span>{profileData.position}</span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <label>입사일</label>
                    <span>{profileData.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>출근 정보</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="detail-content">
                    <label>출근장소</label>
                    <span>{profileData.workplace}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions-section">
            <h3>계정 관리</h3>
            <div className="action-buttons">
              <button className="btn btn-secondary">
                비밀번호 변경
              </button>
              <button className="btn btn-secondary">
                새 사원증 발행
              </button>
              <button className="btn btn-danger">
                계정 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

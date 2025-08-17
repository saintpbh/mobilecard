import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Building, Users, Clock, Calendar, Settings, BarChart3, 
  Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2,
  Copy, Share2, RefreshCw, UserPlus, QrCode, MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAdminCompanies, getCompanyMembers, getCompanyAttendance,
  createCompanyInvite, getLeaveRequests, updateLeaveRequest
} from '../services/companyService';
import { Company, CompanyMember, Attendance, LeaveRequest } from '../types';
import '../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [adminCompanies, setAdminCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'attendance' | 'requests' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    loadAdminCompanies();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (selectedCompany) {
      loadCompanyData();
    }
  }, [selectedCompany]);

  const loadAdminCompanies = async () => {
    if (!currentUser) return;

    try {
      const companies = await getAdminCompanies(currentUser.uid);
      setAdminCompanies(companies);
      
      if (companies.length > 0 && !selectedCompany) {
        setSelectedCompany(companies[0]);
      }
    } catch (error) {
      console.error('관리 회사 목록 로드 오류:', error);
      toast.error('회사 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyData = async () => {
    if (!selectedCompany) return;

    try {
      const [membersData, attendanceData, leaveRequestsData] = await Promise.all([
        getCompanyMembers(selectedCompany.companyId),
        getCompanyAttendance(selectedCompany.companyId, new Date().toISOString().split('T')[0]),
        getLeaveRequests(selectedCompany.companyId)
      ]);

      setMembers(membersData);
      setAttendance(attendanceData);
      setLeaveRequests(leaveRequestsData);
    } catch (error) {
      console.error('회사 데이터 로드 오류:', error);
      toast.error('회사 데이터를 불러오는데 실패했습니다.');
    }
  };

  const createInviteLink = async () => {
    if (!selectedCompany || !currentUser) return;

    try {
      const invite = await createCompanyInvite(selectedCompany.companyId, currentUser.uid, 10);
      toast.success('초대 링크가 생성되었습니다!');
      
      // 링크 복사
      navigator.clipboard.writeText(invite.inviteLink).then(() => {
        toast.success('초대 링크가 클립보드에 복사되었습니다!');
      });
    } catch (error) {
      console.error('초대 링크 생성 오류:', error);
      toast.error('초대 링크 생성에 실패했습니다.');
    }
  };

  const handleLeaveRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    if (!currentUser) return;

    try {
      await updateLeaveRequest(requestId, action, currentUser.uid);
      toast.success(`외근/연차 신청이 ${action === 'approved' ? '승인' : '거절'}되었습니다.`);
      loadCompanyData(); // 데이터 새로고침
    } catch (error) {
      console.error('외근/연차 처리 오류:', error);
      toast.error('처리에 실패했습니다.');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const absentCount = todayAttendance.filter(a => a.status === 'absent').length;
  const lateCount = todayAttendance.filter(a => a.status === 'late').length;
  const leaveCount = todayAttendance.filter(a => a.status === 'leave').length;

  if (isLoading) {
    return (
      <div className="admin-dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>관리자 대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (adminCompanies.length === 0) {
    return (
      <div className="admin-dashboard-page">
        <div className="no-companies-container">
          <Building className="no-companies-icon" />
          <h2>관리할 회사가 없습니다</h2>
          <p>회사를 생성하거나 관리자 권한을 받아야 합니다.</p>
          <div className="no-companies-actions">
            <button
              type="button"
              className="create-company-btn"
              onClick={() => navigate('/create-company')}
            >
              <Plus size={20} />
              새 회사 생성
            </button>
            <button
              type="button"
              className="home-btn"
              onClick={() => navigate('/')}
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        {/* 헤더 */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>관리자 대시보드</h1>
            <p>회사 및 직원 관리를 위한 통합 관리 시스템</p>
          </div>
          <div className="header-right">
            <button
              type="button"
              className="refresh-btn"
              onClick={loadCompanyData}
            >
              <RefreshCw size={20} />
              새로고침
            </button>
            <button
              type="button"
              className="create-company-btn"
              onClick={() => navigate('/create-company')}
            >
              <Plus size={20} />
              새 회사 생성
            </button>
          </div>
        </div>

        {/* 회사 선택 */}
        <div className="company-selector">
          <label>관리할 회사:</label>
          <select
            value={selectedCompany?.companyId || ''}
            onChange={(e) => {
              const company = adminCompanies.find(c => c.companyId === e.target.value);
              setSelectedCompany(company || null);
            }}
          >
            {adminCompanies.map(company => (
              <option key={company.companyId} value={company.companyId}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCompany && (
          <>
            {/* 탭 네비게이션 */}
            <div className="dashboard-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <BarChart3 size={20} />
                개요
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
                onClick={() => setActiveTab('members')}
              >
                <Users size={20} />
                직원 관리
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                <Clock size={20} />
                출퇴근 현황
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                <Calendar size={20} />
                외근/연차
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={20} />
                설정
              </button>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="tab-content">
              {/* 개요 탭 */}
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <Users size={24} />
                      </div>
                      <div className="stat-content">
                        <h3>총 직원 수</h3>
                        <p className="stat-number">{members.length}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <Clock size={24} />
                      </div>
                      <div className="stat-content">
                        <h3>오늘 출근</h3>
                        <p className="stat-number">{presentCount}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <Calendar size={24} />
                      </div>
                      <div className="stat-content">
                        <h3>대기 중인 신청</h3>
                        <p className="stat-number">
                          {leaveRequests.filter(r => r.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">
                        <MapPin size={24} />
                      </div>
                      <div className="stat-content">
                        <h3>출근 장소</h3>
                        <p className="stat-text">{selectedCompany.workplace}</p>
                      </div>
                    </div>
                  </div>

                  <div className="attendance-summary">
                    <h3>오늘 출퇴근 현황</h3>
                    <div className="attendance-stats">
                      <div className="attendance-stat present">
                        <span>출근</span>
                        <strong>{presentCount}</strong>
                      </div>
                      <div className="attendance-stat absent">
                        <span>결근</span>
                        <strong>{absentCount}</strong>
                      </div>
                      <div className="attendance-stat late">
                        <span>지각</span>
                        <strong>{lateCount}</strong>
                      </div>
                      <div className="attendance-stat leave">
                        <span>외근/연차</span>
                        <strong>{leaveCount}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 직원 관리 탭 */}
              {activeTab === 'members' && (
                <div className="members-tab">
                  <div className="members-header">
                    <div className="search-filter">
                      <div className="search-box">
                        <Search size={20} />
                        <input
                          type="text"
                          placeholder="직원 검색..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                      >
                        <option value="all">전체</option>
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                      </select>
                    </div>
                    <div className="members-actions">
                      <button
                        type="button"
                        className="invite-btn"
                        onClick={createInviteLink}
                      >
                        <UserPlus size={20} />
                        초대 링크 생성
                      </button>
                      <button
                        type="button"
                        className="export-btn"
                      >
                        <Download size={20} />
                        내보내기
                      </button>
                    </div>
                  </div>

                  <div className="members-table">
                    <table>
                      <thead>
                        <tr>
                          <th>사원번호</th>
                          <th>부서</th>
                          <th>직책</th>
                          <th>역할</th>
                          <th>가입일</th>
                          <th>상태</th>
                          <th>작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map(member => (
                          <tr key={member.memberId}>
                            <td>{member.employeeId}</td>
                            <td>{member.department}</td>
                            <td>{member.position}</td>
                            <td>
                              <span className={`role-badge ${member.role}`}>
                                {member.role === 'admin' ? '관리자' : 
                                 member.role === 'manager' ? '매니저' : '직원'}
                              </span>
                            </td>
                            <td>{member.joinedAt.toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${member.status}`}>
                                {member.status === 'active' ? '활성' : 
                                 member.status === 'inactive' ? '비활성' : '대기'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button type="button" className="view-btn">
                                  <Eye size={16} />
                                </button>
                                <button type="button" className="edit-btn">
                                  <Edit size={16} />
                                </button>
                                <button type="button" className="delete-btn">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 출퇴근 현황 탭 */}
              {activeTab === 'attendance' && (
                <div className="attendance-tab">
                  <div className="attendance-header">
                    <h3>출퇴근 현황</h3>
                    <div className="date-selector">
                      <input
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          // 날짜 변경 시 출퇴근 데이터 새로 로드
                          // 구현 예정
                        }}
                      />
                    </div>
                  </div>

                  <div className="attendance-table">
                    <table>
                      <thead>
                        <tr>
                          <th>사원번호</th>
                          <th>부서</th>
                          <th>출근 시간</th>
                          <th>퇴근 시간</th>
                          <th>상태</th>
                          <th>위치</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayAttendance.map(record => {
                          const member = members.find(m => m.userId === record.userId);
                          return (
                            <tr key={record.attendanceId}>
                              <td>{member?.employeeId || 'N/A'}</td>
                              <td>{member?.department || 'N/A'}</td>
                              <td>
                                {record.checkIn ? 
                                  record.checkIn.timestamp.toLocaleTimeString() : '-'}
                              </td>
                              <td>
                                {record.checkOut ? 
                                  record.checkOut.timestamp.toLocaleTimeString() : '-'}
                              </td>
                              <td>
                                <span className={`status-badge ${record.status}`}>
                                  {record.status === 'present' ? '출근' :
                                   record.status === 'absent' ? '결근' :
                                   record.status === 'late' ? '지각' : '외근/연차'}
                                </span>
                              </td>
                              <td>{record.location || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 외근/연차 탭 */}
              {activeTab === 'requests' && (
                <div className="requests-tab">
                  <div className="requests-header">
                    <h3>외근/연차 신청</h3>
                    <div className="status-filter">
                      <select
                        onChange={(e) => {
                          // 상태별 필터링 구현 예정
                        }}
                      >
                        <option value="all">전체</option>
                        <option value="pending">대기 중</option>
                        <option value="approved">승인됨</option>
                        <option value="rejected">거절됨</option>
                      </select>
                    </div>
                  </div>

                  <div className="requests-table">
                    <table>
                      <thead>
                        <tr>
                          <th>신청자</th>
                          <th>유형</th>
                          <th>기간</th>
                          <th>사유</th>
                          <th>상태</th>
                          <th>신청일</th>
                          <th>작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveRequests.map(request => {
                          const member = members.find(m => m.userId === request.userId);
                          return (
                            <tr key={request.requestId}>
                              <td>{member?.employeeId || 'N/A'}</td>
                              <td>
                                {request.type === 'business_trip' ? '외근' :
                                 request.type === 'annual_leave' ? '연차' :
                                 request.type === 'sick_leave' ? '병가' : '기타'}
                              </td>
                              <td>
                                {request.startDate.toLocaleDateString()} ~ {request.endDate.toLocaleDateString()}
                              </td>
                              <td>{request.reason}</td>
                              <td>
                                <span className={`status-badge ${request.status}`}>
                                  {request.status === 'pending' ? '대기 중' :
                                   request.status === 'approved' ? '승인됨' : '거절됨'}
                                </span>
                              </td>
                              <td>{request.createdAt.toLocaleDateString()}</td>
                              <td>
                                {request.status === 'pending' && (
                                  <div className="action-buttons">
                                    <button
                                      type="button"
                                      className="approve-btn"
                                      onClick={() => handleLeaveRequestAction(request.requestId, 'approved')}
                                    >
                                      승인
                                    </button>
                                    <button
                                      type="button"
                                      className="reject-btn"
                                      onClick={() => handleLeaveRequestAction(request.requestId, 'rejected')}
                                    >
                                      거절
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 설정 탭 */}
              {activeTab === 'settings' && (
                <div className="settings-tab">
                  <div className="settings-section">
                    <h3>회사 정보</h3>
                    <div className="company-info-display">
                      <div className="info-item">
                        <label>회사명</label>
                        <span>{selectedCompany.name}</span>
                      </div>
                      <div className="info-item">
                        <label>사업자등록번호</label>
                        <span>{selectedCompany.businessNumber}</span>
                      </div>
                      <div className="info-item">
                        <label>대표자명</label>
                        <span>{selectedCompany.ceoName}</span>
                      </div>
                      <div className="info-item">
                        <label>주소</label>
                        <span>{selectedCompany.address}</span>
                      </div>
                      <div className="info-item">
                        <label>연락처</label>
                        <span>{selectedCompany.phone}</span>
                      </div>
                      <div className="info-item">
                        <label>출근 장소</label>
                        <span>{selectedCompany.workplace}</span>
                      </div>
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3>초대 관리</h3>
                    <div className="invite-actions">
                      <button
                        type="button"
                        className="create-invite-btn"
                        onClick={createInviteLink}
                      >
                        <Share2 size={20} />
                        새 초대 링크 생성
                      </button>
                      <button
                        type="button"
                        className="qr-code-btn"
                      >
                        <QrCode size={20} />
                        QR코드 생성
                      </button>
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3>데이터 관리</h3>
                    <div className="data-actions">
                      <button
                        type="button"
                        className="export-data-btn"
                      >
                        <Download size={20} />
                        데이터 내보내기
                      </button>
                      <button
                        type="button"
                        className="import-data-btn"
                      >
                        <Upload size={20} />
                        데이터 가져오기
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


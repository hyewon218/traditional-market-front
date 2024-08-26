/**
 =========================================================
 * Material Dashboard 2 React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// @mui material components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Material Dashboard 2 React components
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import {
getMemberOne,
postCheckAdminPw,
putMemberRole,
deleteMember,
getShopListBySellerNoAdmin,
putIsWarning,
putIsWarningClear,
getReportList,
getReportersList }
from "../../../api/adminApi";
import { getRemainingTime } from "../../../api/memberApi";
import { getOne } from "../../../api/marketApi";

// 페이지 및 요소 스타일
const styles = {
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '300px',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
  message: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  deleteButton: {
      backgroundColor: 'red',
      color: '#f5f5f5',
      '&:hover': {
        backgroundColor: 'darkred',
      },
    },
};

function MemberDetailAdmin() {
  const { state } = useLocation();
  const memberNo = state; // 전달된 memberNo 데이터를 사용

  const [member, setMember] = useState(null); // 회원 정보를 저장할 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState(''); // 초기 상태를 빈 문자열로 설정
  const [isAdmin, setIsAdmin] = useState(false); // 초기 상태를 false로 설정
  const [shops, setShops] = useState([]); // 상점 목록을 저장할 상태
  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 20;

  const [showReportListModal, setShowReportListModal] = useState(false);
  const [showReportersListModal, setShowReportersListModal] = useState(false);
//  const [reportList, setReportList] = useState([]);
//  const [reportersList, setReportersList] = useState([]);
  const [reportList, setReportList] = useState(null);
  const [reportersList, setReportersList] = useState(null);
  const [modalType, setModalType] = useState(''); // 'reportList' 또는 'reportersList'

  const navigate = useNavigate();

    useEffect(() => {
        // 회원 정보 조회
        const fetchMember = async () => {
          try {
            if (!memberNo) {
              console.error("회원 번호가 제공되지 않았습니다.");
              return;
            }

            const memberData = await getMemberOne(memberNo);
            if (memberData) {
              console.log('memberData : ', memberData);
              setMember(memberData);
              setRole(memberData.role);
              setIsAdmin(memberData.role === 'ADMIN');
            } else {
              console.error("회원 정보를 가져오는 데 실패했습니다.");
            }
          } catch (error) {
            console.error('회원 정보 조회 오류:', error);
          }
        };

        // 상점 목록 조회 및 시장 정보 추가
        const fetchShopsWithMarketInfo = async () => {
          try {
            if (memberNo) {
              const pageParam = { page: currentPage - 1, size: shopsPerPage }; // 페이지는 0부터 시작하므로 currentPage - 1
              const shopList = await getShopListBySellerNoAdmin(memberNo, pageParam);
              if (shopList && shopList.content) {
                // 각 상점의 시장 정보 추가
                const shopsWithMarketData = await Promise.all(
                  shopList.content.map(async (shop) => {
                    const marketData = await getOne(shop.marketNo);
                    return {
                      ...shop,
                      marketData, // 시장 정보를 상점 데이터에 추가
                    };
                  })
                );
                setShops(shopsWithMarketData);
                console.log('Fetched shops with market data:', shopsWithMarketData);
              } else {
                setShops([]);
                console.log('No shops found');
              }
            }
          } catch (error) {
            console.error('상점 목록 조회 오류:', error);
          }
        };

        fetchMember();
        fetchShopsWithMarketInfo();
      }, [memberNo, currentPage]);

    const handleNextPage = () => {
          if (currentPage < Math.ceil(shops.length / shopsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
          }
        };

    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      }
    };

    const totalPages = Math.ceil(shops.length / shopsPerPage);
    const endIndex = currentPage * shopsPerPage;
    const startIndex = endIndex - shopsPerPage;
    const currentShops = shops.slice(startIndex, endIndex);

  const handleDeleteWithPassword = (memberNo) => {
    setMemberToDelete(memberNo);
    setShowPasswordModal(true);
  };

  const deleteMemberByNo = async (memberNo) => {
    try {
      if (password.trim() === "") {
        setErrorMessage("비밀번호를 입력하세요.");
        return;
      }

      console.log("삭제하려는 회원의 memberNo : ", memberNo);

      // 비밀번호 검증 요청
      const formData = new FormData();
      formData.append('password', password);

      const verifyResponse = await postCheckAdminPw(formData);

      if (verifyResponse) {
        if (window.confirm("정말 이 회원을 삭제하시겠습니까?")) {
          await deleteMember(memberNo);
          alert("회원 삭제 성공!");
          navigate('/member-list');
        }
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      setErrorMessage("삭제에 실패했습니다.");
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setErrorMessage('');
  };

  const handleBack = () => {
    navigate('/member-manage');
  };

  // 권한 변경
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // 권한 업데이트 함수
    const handleUpdateRole = async () => {
      if (isAdmin) {
        alert("ADMIN 권한은 권한 수정이 불가능합니다.");
        return;
      }

      if (!window.confirm('권한을 수정하시겠습니까?')) {
          return;
      }

      try {
        const formData = { role }; // 변경된 권한을 전송할 데이터로 사용
        await putMemberRole(member.memberNo, formData);
        alert("권한이 성공적으로 수정되었습니다.");

      } catch (error) {
        console.error('권한 수정 실패:', error);
        alert("권한 수정에 실패했습니다.");
      }
    };

  // 제재 실행
    const handleWarning = async () => {
      if (isAdmin) {
        alert("ADMIN 권한은 제재가 불가능합니다.");
        return;
      }

      if (!window.confirm('해당 회원을 제재하시겠습니까? (댓글, 일대일 채팅상담 제한, 문의하기는 가능)')) {
          return;
      }

      try {
        await putIsWarning(member.memberNo);
        alert("제재가 성공적으로 수행되었습니다.");
        window.location.reload();

      } catch (error) {
        console.error('제재 실행 실패:', error);
        alert("제재 실행에 실패했습니다.");
      }
    };

  // 제재 해제
  const handleWarningClear = async () => {
    if (!window.confirm('제재를 해제하시겠습니까?')) {
        return;
    }

    try {
      await putIsWarningClear(member.memberNo);
      alert("제재 해제가 성공적으로 수행되었습니다.");
      window.location.reload();

    } catch (error) {
      console.error('제재 해제 수행 실패:', error);
      alert("제재 해제 수행에 실패했습니다.");
    }
  };

  // 내가 신고한 회원 목록 // alert로 출력
//  const handleGetReportList = async (memberNo) => {
//    try {
//      const reportList = await getReportList(memberNo);
//      console.log(`${member.memberId}가 신고한 회원 목록: `, reportList);
//      alert(`${member.memberId}가 신고한 회원 목록:\n` + reportList);
//    } catch (error) {
//      console.error(`${member.memberId}가 신고한 회원 목록 조회 오류:`, error);
//      alert("회원이 신고한 회원 목록을 불러오는 데 실패했습니다.");
//    }
//  };
//
//  // 나를 신고한 회원 목록 // alert로 출력
//  const handleGetReportersList = async (memberNo) => {
//    try {
//      const reportersList = await getReportersList(memberNo);
//      console.log(`${member.memberId}를 신고한 회원 목록: `, reportersList);
//      alert(`${member.memberId}를 신고한 회원 목록:\n` + reportersList);
//    } catch (error) {
//      console.error(`${member.memberId}를 신고한 회원 목록 조회 오류:`, error);
//      alert("회원을 신고한 회원 목록을 불러오는 데 실패했습니다.");
//    }
//  };

  // 신고 관련 목록 모달
    const renderModalContent = () => {
      if (modalType === 'reportList') {
        return (
          <div style={styles.modalContent}>
            <Typography variant="h6" gutterBottom>
              신고한 회원 목록
            </Typography>
            <Typography variant="body1">
              {reportList ? (
                <Typography>{reportList}</Typography>
              ) : (
                <Typography>신고한 회원이 없습니다.</Typography>
              )}
            </Typography>
            <Button variant="contained" color="error" onClick={() => setShowReportListModal(false)}>
              닫기
            </Button>
          </div>
        );
      }

      if (modalType === 'reportersList') {
        return (
          <div style={styles.modalContent}>
            <Typography variant="h6" gutterBottom>
              나를 신고한 회원 목록
            </Typography>
            <Typography variant="body1">
              {reportersList ? (
                <Typography>{reportersList}</Typography>
              ) : (
                <Typography>나를 신고한 회원이 없습니다.</Typography>
              )}
            </Typography>
            <Button variant="contained" color="error" onClick={() => setShowReportersListModal(false)}>
              닫기
            </Button>
          </div>
        );
      }

      return null;
    };

    // 신고한 회원 목록을 가져오는 함수
    const handleGetReportList = async (memberNo) => {
      try {
        const response = await getReportList(memberNo); // 문자열 반환
        const list = parseList(response);
        console.log('response : ', response);
        console.log('list : ', list);
        setReportList(response);
        setModalType('reportList');
        setShowReportListModal(true);
      } catch (error) {
        console.error('신고한 회원 목록 조회 오류:', error);
        alert("회원이 신고한 회원 목록을 불러오는 데 실패했습니다.");
      }
    };

    // 나를 신고한 회원 목록을 가져오는 함수
    const handleGetReportersList = async (memberNo) => {
      try {
        const response = await getReportersList(memberNo); // 문자열 반환
        const list = parseList(response);
        console.log('response : ', response);
        console.log('list : ', list);
        setReportersList(response);
        setModalType('reportersList');
        setShowReportersListModal(true);
      } catch (error) {
        console.error('나를 신고한 회원 목록 조회 오류:', error);
        alert("나를 신고한 회원 목록을 불러오는 데 실패했습니다.");
      }
    };

    // 문자열을 배열로 변환하는 유틸 함수
    const parseList = (listString) => {
      return listString.split(',').map(item => item.trim());
    };

  // 닉네임 변경까지 남은 시간 구하는 메서드
  const handleGetRemainingTime = async (memberNo) => {
    try {
      const remainingTime = await getRemainingTime(memberNo);
      console.log('memberNo : ', memberNo);
      alert(remainingTime);

    } catch (error) {
      console.error('남은 시간 조회 실패:', error);
      alert('남은 시간 조회에 실패했습니다.');
    }
  };

  // 날짜 형식 변환
  const formatCreateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // 제재 해제일 구하는 메서드 (+30일)
    const calculateExpirationDate = (startDate) => {
      if (!startDate) return null;
      const start = new Date(startDate);
      const expiration = new Date(start.setDate(start.getDate() + 30));
      return formatCreateTime(expiration);
    };

  const handleDetail = (shop) => {
      // 상점 상세 페이지로 이동하는 로직 추가
      navigate('/shop-detail-admin', {state : shop});
    };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {member ? (
          <>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="contained" color="error" onClick={handleBack} startIcon={<KeyboardArrowLeftIcon />}>
                돌아가기
              </Button>
            </Box>
            {/* 회원 기본 정보 */}
            <Card sx={{ p: 3, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  {/* 회원 기본 정보 텍스트 */}
                  <Typography variant="h4" component="div" paragraph>
                      <strong>회원 고유번호</strong> : {member.memberNo}
                    </Typography>
                  <Typography variant="h4" component="div" paragraph>
                    <strong>회원 ID</strong> : {member.memberId}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>이메일</strong> : {member.memberEmail}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>닉네임</strong> : {member.nicknameWithRandomTag}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleGetRemainingTime(member.memberNo)}
                      sx={{ ml: 2 }}
                    >
                      닉네임 변경까지 남은 시간
                    </Button>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>권한</strong> :
                    <select
                      value={role}
                      onChange={handleRoleChange}
                      disabled={isAdmin} // ADMIN 권한일 경우 드롭다운 비활성화
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="SELLER">SELLER</option>
                      <option value="MANAGER">MANAGER</option>
                    </select>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleUpdateRole}
                      disabled={isAdmin} // ADMIN 권한일 경우 수정 버튼 비활성화
                    >
                      권한 수정
                    </Button>
                    {isAdmin && (
                      <Typography style={styles.message}>
                        ADMIN 권한은 권한 수정이 불가능합니다.
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body1" paragraph>
                      <strong>가입 경로</strong> : {member.providerType}
                    </Typography>
                <Typography variant="body1" paragraph>
                    <strong>제재 날짜</strong> :
                    {member.warningStartDate ? formatCreateTime(member.warningStartDate) + " (제재 해제일 : " + calculateExpirationDate(member.warningStartDate) + ")"
                    : "현재 설정되어있지않습니다."}
                  </Typography>
                  <Typography variant="body1" paragraph>
                      <strong>누적 제재 횟수</strong> : {member.countWarning}
                    </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>신고 당한 횟수</strong> : {member.countReport}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleGetReportList(member.memberNo)}
                        sx={{ ml: 2 }}
                      >
                        {member.memberId}가 신고한 회원
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleGetReportersList(member.memberNo)}
                        sx={{ ml: 2 }}
                      >
                        {member.memberId}를 신고한 회원
                      </Button>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>가입일</strong> : {formatCreateTime(member.createTime)}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                       variant="contained"
                       color="error"
                       onClick={() => handleWarning(member.memberNo)}
                       disabled={isAdmin || member.warningStartDate !== null} // ADMIN 권한일 경우 및 제재 날짜가 있는 경우 비활성화
                     >
                       제제 실행
                     </Button>
                     <Button
                       variant="contained"
                       color="error"
                       onClick={() => handleWarningClear(member.memberNo)}
                       disabled={isAdmin || member.warningStartDate === null} // ADMIN 권한일 경우 및 제재 날짜가 없는 경우 비활성화
                     >
                       제재 해제
                     </Button>
                     <Button
                       variant="contained"
                       color="error"
                       onClick={() => handleDeleteWithPassword(member.memberNo)}
                       disabled={isAdmin} // ADMIN 권한일 경우 회원 삭제 버튼 비활성화
                       sx={styles.deleteButton} // 스타일 적용
                     >
                       회원 삭제
                     </Button>
                  </Box>
                </Grid>
              </Grid>
            </Card>
            {/* 상점 목록 */}
            <Card sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" component="div" gutterBottom>
                상점 목록
              </Typography>
              <Grid container spacing={2}>
                {currentShops.length > 0 ? (
                  currentShops.map((shop) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={shop.shopNo}>
                      <Card sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ cursor: 'pointer' }} // 커서 스타일을 포인터로 변경
                          onClick={() => handleDetail(shop)}
                        >
                          {shop.shopName}
                        </Typography>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1">상점이 없습니다.</Typography>
                )}
              </Grid>

              {/* 상점 목록 페이징 네비게이션 */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography variant="body1" sx={{ mx: 2 }}>
                  {currentPage} / {totalPages}
                </Typography>
                <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
            </Card>
          </>
        ) : (
          <Typography variant="h6" component="div" paragraph>
            회원 정보를 불러오는 중입니다...
          </Typography>
        )}

        {/* 비밀번호 확인 모달 */}
        {showPasswordModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <Typography variant="h6" gutterBottom>
                {member?.memberId} 삭제
              </Typography>
              <form onSubmit={(e) => {
                e.preventDefault();
                deleteMemberByNo(memberToDelete);
              }}>
                <label htmlFor="adminPw">관리자 비밀번호 입력</label>
                <input
                  type="password"
                  id="adminPw"
                  name="adminPw"
                  value={password}
                  placeholder="비밀번호를 입력하세요"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errorMessage && <Typography style={styles.errorMessage}>{errorMessage}</Typography>}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="contained" color="error" type="submit">
                    확인
                  </Button>
                  <Button variant="contained" color="error" onClick={handleCloseModal}>
                    취소
                  </Button>
                </Box>
              </form>
            </div>
          </div>
        )}
        <div>
            {renderModalContent()}

            {/* 신고한 회원 목록 모달 */}
            {showReportListModal && (
              <div style={styles.modal}>
                {renderModalContent()}
              </div>
            )}

            {/* 나를 신고한 회원 목록 모달 */}
            {showReportersListModal && (
              <div style={styles.modal}>
                {renderModalContent()}
              </div>
            )}
          </div>
      </Box>
    </DashboardLayout>
  );
}

export default MemberDetailAdmin;
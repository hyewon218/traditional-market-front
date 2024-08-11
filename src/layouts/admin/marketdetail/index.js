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

// Components
import MapComponent from '../../../components/map/MapComponent';
import ParkingModal from '../../../components/common/ParkingModal'; // 주차장 모달
import TransportModal from '../../../components/common/TransportModal'; // 대중교통 모달

// Data
import { deleteMarket } from "../../../api/marketApi";
import { postCheckAdminPw } from "../../../api/adminApi";

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
};

function MarketDetailAdmin() {
  const { state } = useLocation();
  const market = state; // 전달된 market 데이터를 사용

  const [showParkingModal, setShowParkingModal] = useState(false); // 주차장 모달 상태
  const [showTransportModal, setShowTransportModal] = useState(false); // 대중교통 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [marketToDelete, setMarketToDelete] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 20;
  const totalPages = Math.ceil(market.shopList.length / shopsPerPage);

  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const commentsPerPage = 6;
  const totalCommentPages = Math.ceil(market.commentList.length / commentsPerPage);

  const navigate = useNavigate();

  const handleAddShop = (market) => {
      console.log('handleAddShop');
      navigate('/post-shop', {state: market})
  };

  const handleDetail = (shop) => {
    console.log('handleDetail');
    // 새 객체를 생성하여 shop과 marketData를 포함
    const shopWithMarketData = {
      ...shop,
      marketData: market,
    };
    console.log("shopWithMarketData : ", shopWithMarketData);
    navigate('/shop-detail-admin', { state: shopWithMarketData });
  };

  const handleModifyMarket = (market) => {
    console.log('handleModify');
    navigate('/modify-market', { state: market });
  };

  const handleDeleteWithPassword = (marketNo) => {
    setMarketToDelete(marketNo);
    setShowPasswordModal(true);
  };

  const deleteMarketByNo = async (marketNo) => {
    try {
      if (password.trim() === "") {
        setErrorMessage("비밀번호를 입력하세요.");
        return;
      }

      console.log("입력된 비밀번호:", password); // 비밀번호를 콘솔에 로그로 찍음

      // FormData 객체를 생성
      const formData = new FormData();
      formData.append('password', password);

      const verifyResponse = await postCheckAdminPw(formData);
      console.log("verifyResponse :", verifyResponse);

      if (verifyResponse) {
        if (window.confirm("정말 이 시장을 삭제하시겠습니까?")) {
          const response = await deleteMarket(marketNo);
          alert("시장 삭제 성공!");
          navigate('/market-manage');
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

  const openParkingModal = () => setShowParkingModal(true);
  const closeParkingModal = () => setShowParkingModal(false);

  const openTransportModal = () => setShowTransportModal(true);
  const closeTransportModal = () => setShowTransportModal(false);

  const handleBack = () => {
    navigate('/market-manage');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextCommentPage = () => {
    if (currentCommentPage < totalCommentPages) {
      setCurrentCommentPage(currentCommentPage + 1);
    }
  };

  const handlePrevCommentPage = () => {
    if (currentCommentPage > 1) {
      setCurrentCommentPage(currentCommentPage - 1);
    }
  };

  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = market.shopList.slice(indexOfFirstShop, indexOfLastShop);

  const indexOfLastComment = currentCommentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = market.commentList.slice(indexOfFirstComment, indexOfLastComment);

  // 댓글 생성 시간 변환
  const formatDate = (isoDateString) => {
    if (!isoDateString) return "No Date";

    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    // 옵션을 통해 원하는 형식으로 날짜를 포맷합니다
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24시간 형식
    };

    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  return (
    <DashboardLayout>
      {/* 주차장 모달 */}
      {showParkingModal && (
        <ParkingModal open={showParkingModal} onClose={closeParkingModal} marketNo={market.marketNo} />
      )}
      {/* 대중교통 모달 */}
      {showTransportModal && (
        <TransportModal open={showTransportModal} onClose={closeTransportModal} marketNo={market.marketNo} />
      )}

      <Box sx={{ p: 3 }}>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" color="error" onClick={handleBack} startIcon={<KeyboardArrowLeftIcon />}>
              돌아가기
            </Button>
            <Button variant="contained" color="error" onClick={() => handleAddShop(market)}>
              상점 추가
            </Button>
        </Box>

        {/* 시장 기본 정보 */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              {/* 시장 기본 정보 텍스트 */}
              <Typography variant="h4" component="div" paragraph>
                {market.marketName}
              </Typography>
              <Typography variant="body1" paragraph>
                지역 : {market.category}
              </Typography>
              <Typography variant="body1" paragraph>
                주소: {market.marketAddr}
              </Typography>
              <Typography variant="body1" paragraph>
                상세설명 : {market.marketDetail}
              </Typography>
              <Typography variant="body1">
                좋아요: {market.likes} | 조회수: {market.viewCount}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleModifyMarket(market)}
                >
                  시장 수정
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteWithPassword(market.marketNo)}
                >
                  시장 삭제
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              {/* 이미지 갤러리 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                {market.imageList.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={`market-image-${index}`}
                    width="70%" // 카드의 오른쪽에 이미지가 위치하도록 폭을 조정
                    style={{ marginBottom: '10px' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* 댓글 목록 */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            댓글 목록
          </Typography>
          {currentComments.length > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {currentComments.slice(0, 3).map((comment, index) => {
                  console.log("Comment Data:", comment); // 전체 comment 객체 출력
                  console.log("createTime:", comment.createTime); // createTime 값 출력
                  return (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1 }}>
                        {comment.comment}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 0.5 }}>
                        {comment.username}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'gray', flex: 0.5, textAlign: 'right' }}>
                        {formatDate(comment.createTime)}
                      </Typography>
                    </Box>
                  );
                })}
              </Grid>
              <Grid item xs={6}>
                {currentComments.slice(3, 6).map((comment, index) => {
                  console.log("Comment Data:", comment); // 전체 comment 객체 출력
                  console.log("createTime:", comment.createTime); // createTime 값 출력
                  return (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1 }}>
                        {comment.comment}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 0.5 }}>
                        {comment.username}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'gray', flex: 0.5, textAlign: 'right' }}>
                        {formatDate(comment.createTime)}
                      </Typography>
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body1">댓글이 없습니다.</Typography>
          )}

          {/* 댓글 페이징 네비게이션 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <IconButton onClick={handlePrevCommentPage} disabled={currentCommentPage === 1}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <Typography variant="body1" sx={{ mx: 2 }}>
              {currentCommentPage} / {totalCommentPages}
            </Typography>
            <IconButton onClick={handleNextCommentPage} disabled={currentCommentPage === totalCommentPages}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>
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
          {/* 페이징 네비게이션 */}
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

        {/* 주차장 및 대중교통 정보 */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="div" gutterBottom>
                주차장 정보
              </Typography>
              <Typography variant="body1">
                {market.parkingInfo1}
              </Typography>
              <Typography variant="body1">
                {market.parkingInfo2}
              </Typography>
              <Button variant="contained" color="error" onClick={openParkingModal}>
                주차장 정보 보기
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="div" gutterBottom>
                대중교통 정보
              </Typography>
              <Typography variant="body1">
                {market.busInfo} (위도: {market.busLat}, 경도: {market.busLng})
              </Typography>
              <Typography variant="body1">
                {market.subwayInfo} (위도: {market.subwayLat}, 경도: {market.subwayLng})
              </Typography>
              <Button variant="contained" color="error" onClick={openTransportModal}>
                대중교통 정보 보기
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* 지도 */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" component="div" gutterBottom>
            시장 위치
          </Typography>
          <MapComponent marketAddr={market.marketAddr} marketName={market.marketName} />
        </Card>
        {/* 비밀번호 확인 모달 */}
        {showPasswordModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <Typography variant="h6" gutterBottom>
                {market.marketName} 삭제
              </Typography>
              <form onSubmit={(e) => {
                e.preventDefault();
                deleteMarketByNo(marketToDelete);
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
      </Box>
    </DashboardLayout>
  );
}

export default MarketDetailAdmin;

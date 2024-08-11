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
import ShopMapComponent from "../../../components/map/ShopMapComponent"; // 상점 위치 출력

// Data
import { deleteShop } from "../../../api/shopApi";
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

// 카테고리 한글 이름을 반환하는 함수
const getCategoryName = (category) => {
  switch (category) {
    case 'AGRI': return '농산물';
    case 'MARINE': return '수산물';
    case 'LIVESTOCK': return '축산물';
    case 'FRUITS': return '과일';
    case 'PROCESSED': return '가공식품';
    case 'RICE': return '쌀';
    case 'RESTAURANT': return '식당';
    case 'SIDEDISH': return '반찬';
    case 'STUFF': return '잡화';
    case 'ETC': return '기타';
    default: return '기타'; // 기본값
  }
};

function ShopDetailAdmin() {
  const { state } = useLocation();
  const shop = state; // 전달된 shop 데이터를 사용

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(shop.itemList.length / itemsPerPage);

  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const commentsPerPage = 6;
  const totalCommentPages = Math.ceil(shop.shopCommentList.length / commentsPerPage);

  const navigate = useNavigate();

  const handleAddItem = (shop) => {
      console.log('handleAddShop');
      navigate('/post-item', {state: shop})
  };

//  const handleDetail = (item) => {
//    console.log('handleDetail');
//    console.log("item!!!!!!!!!!!" + item);
//    navigate('/item-detail-admin', { state: item });
//  };

  const handleDetail = (item) => {
    console.log('handleDetail');
    console.log("item!!!!!!!!!!!" + item);

   // Create itemWithMarketData by combining item data with shop and market data
   const itemWithMarketData = {
      ...item,
      shopData: {
        shopNo: shop.shopNo,
        shopName: shop.shopName,
        shopLat: shop.shopLat,
        shopLng: shop.shopLng,
        tel: shop.tel,
        shopAddr: shop.shopAddr,
        imageList: shop.imageList,
        itemList: shop.itemList,
        shopCommentList: shop.shopCommentList,
        ...shop.shopData
      },
      marketData: shop.marketData
    };
      console.log("itemWithMarketData : ", itemWithMarketData);
      navigate('/item-detail-admin', { state: itemWithMarketData });
    };

  const handleModifyShop = (shop) => {
    console.log('handleModify');
    navigate('/modify-shop', { state: shop });
  };

  const handleDeleteWithPassword = (shopNo) => {
    setShopToDelete(shopNo);
    setShowPasswordModal(true);
  };

  const deleteShopByNo = async (shopNo) => {
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
        if (window.confirm("정말 이 상점을 삭제하시겠습니까?")) {
          const response = await deleteShop(shopNo);
          alert("상점 삭제 성공!");
          navigate('/shop-manage');
        }
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      setErrorMessage("삭제에 실패했습니다.");
    }
  };

  // 상점 위치 정보 (위도, 경도) 배열
  const locations = [
      {
          latitude: shop.shopLat, // 상점의 위도
          longitude: shop.shopLng, // 상점의 경도
          info: shop.shopName, // 상점 이름
          tel: shop.tel // 상점 전화번호
      }
  ];

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setErrorMessage('');
  };

  // 뒤로 가기
  const handleBack = () => {
    navigate('/shop-manage');
  };

  // 소속 시장 상세 페이지로 이동
  const handleMarketDetail = (market) => {
    console.log('시장 상세페이지로 이동 :', market);
    navigate('/market-detail-admin', { state: market });
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shop.itemList.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastComment = currentCommentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = shop.shopCommentList.slice(indexOfFirstComment, indexOfLastComment);

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
      <Box sx={{ p: 3 }}>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" color="error" onClick={handleBack} startIcon={<KeyboardArrowLeftIcon />}>
              돌아가기
            </Button>
            <Button variant="contained" color="error" onClick={() => handleAddItem(shop)}>
              상품 추가
            </Button>
        </Box>
        {/* 상점 기본 정보 */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              {/* 상점 기본 정보 텍스트 */}
              <Typography variant="h4" component="div" paragraph>
                {shop.shopName}
              </Typography>
              <Typography variant="body1" paragraph>
                소속 시장 :
                <Button onClick={() => handleMarketDetail(shop.marketData)}>
                  {shop.marketData.marketName}
                </Button>
              </Typography>
              <Typography variant="body1" paragraph>
                분류 : {getCategoryName(shop.category)}
              </Typography>
              <Typography variant="body1" paragraph>
                전화번호 : {shop.tel}
              </Typography>
              <Typography variant="body1" paragraph>
                판매자 : {shop.sellerName}
              </Typography>
              <Typography variant="body1" paragraph>
                주소 : {shop.shopAddr}
              </Typography>
              <Typography variant="body1" paragraph>
                위도 : {shop.shopLat} | 경도 : {shop.shopLng}
              </Typography>
              <Typography variant="body1">
                좋아요 : {shop.likes} | 조회수 : {shop.viewCount}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleModifyShop(shop)}
                >
                  상점 수정
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteWithPassword(shop.shopNo)}
                >
                  상점 삭제
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              {/* 이미지 갤러리 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                {shop.imageList.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={`shop-image-${index}`}
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

        {/* 상품 목록 */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            상품 목록
          </Typography>
          <Grid container spacing={2}>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.itemNo}>
                  <Card sx={{ p: 2 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ cursor: 'pointer' }} // 커서 스타일을 포인터로 변경
                      onClick={() => handleDetail(item)}
                    >
                      {item.itemName}
                    </Typography>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">상품이 없습니다.</Typography>
            )}
          </Grid>

          {/* 상품 페이징 네비게이션 */}
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

        {/* 지도 */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" component="div" gutterBottom>
            상점 위치
          </Typography>
          <ShopMapComponent
              containerId="shop-map" // 지도 컨테이너 ID
              locations={locations} // 위치 데이터
              title={shop.shopName} // 지도 제목
          />
        </Card>

        {/* 비밀번호 확인 모달 */}
        {showPasswordModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <Typography variant="h6" gutterBottom>
                {shop.shopName} 삭제
              </Typography>
              <form onSubmit={(e) => {
                e.preventDefault();
                deleteShopByNo(shopToDelete);
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

export default ShopDetailAdmin;

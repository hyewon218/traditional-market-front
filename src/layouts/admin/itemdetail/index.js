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

// shopData에 marketData 추가
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
import ShopMapComponent from "../../../components/map/ShopMapComponent"; // 상점 위치 출력

// Data
import { deleteItem } from "../../../api/itemApi";
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

function ItemDetailAdmin() {
  const { state } = useLocation();
  const item = state; // 전달된 item 데이터를 사용

  // shopData에 marketData를 합침(관리자 상품 상세 페이지에서 상점을 타고 해당 상점의 소속 시장을 타기 위해. 합치지 않을 경우 여기서 넘겨주는 shopData엔 marketData가 없어서 오류 발생)
  const itemWithMarketData = {
    ...item,
    shopData: {
      ...item.shopData,
      marketData: item.marketData // Add marketData to shopData
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const commentsPerPage = 6;
  const totalCommentPages = Math.ceil(item.itemCommentList.length / commentsPerPage);

  const navigate = useNavigate();

  const handleModifyItem = (item) => {
    console.log('handleModify');
    navigate('/modify-item', { state: item });
  };

  const handleDeleteWithPassword = (itemNo) => {
    setItemToDelete(itemNo);
    setShowPasswordModal(true);
  };

  const deleteItemByNo = async (itemNo) => {
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
        if (window.confirm("정말 이 상품을 삭제하시겠습니까?")) {
          const response = await deleteItem(itemNo);
          alert("상품 삭제 성공!");
          navigate('/item-manage');
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

  // 뒤로 가기
  const handleBack = () => {
    navigate('/item-manage');
  };

  // 소속 시장 상세 페이지로 이동
  const handleMarketDetail = (market) => {
    console.log('시장 상세페이지로 이동 :', market);
    navigate('/market-detail-admin', { state: market });
  };

  // 소속 상점 상세 페이지로 이동
  const handleShopDetail = (shop) => {
    console.log('상점 상세페이지로 이동 :', shop);
    navigate('/shop-detail-admin', { state: shop });
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

  const indexOfLastComment = currentCommentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = item.itemCommentList.slice(indexOfFirstComment, indexOfLastComment);

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
        </Box>
        {/* 상품 기본 정보 */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              {/* 상품 기본 정보 텍스트 */}
              <Typography variant="h4" component="div" paragraph>
                {item.itemName}
              </Typography>
              <Typography variant="body1" paragraph>
                소속 시장 :
                <Button onClick={() => handleMarketDetail(itemWithMarketData.marketData)}>
                  {item.marketData.marketName}
                </Button>
              </Typography>
              <Typography variant="body1" paragraph>
                소속 상점 :
                <Button onClick={() => handleShopDetail(itemWithMarketData.shopData)}>
                  {item.shopData.shopName}
                </Button>
              </Typography>
              <Typography variant="body1" paragraph>
                가격 : {item.price}
              </Typography>
              <Typography variant="body1" paragraph>
                재고 : {item.stockNumber}
              </Typography>
              <Typography variant="body1" paragraph>
                상세 : {item.itemDetail}
              </Typography>
              <Typography variant="body1">
                좋아요 : {item.likes} | 조회수 : {item.viewCount}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleModifyItem(item)}
                >
                  상품 수정
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteWithPassword(item.itemNo)}
                >
                  상품 삭제
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              {/* 이미지 갤러리 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                {item.imageList.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={`item-image-${index}`}
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

        {/* 비밀번호 확인 모달 */}
        {showPasswordModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <Typography variant="h6" gutterBottom>
                {item.itemName} 삭제
              </Typography>
              <form onSubmit={(e) => {
                e.preventDefault();
                deleteItemByNo(itemToDelete);
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

export default ItemDetailAdmin;

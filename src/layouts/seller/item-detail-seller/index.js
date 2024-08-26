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

function ItemDetailSeller() {
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

  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const commentsPerPage = 6;
  const totalCommentPages = Math.ceil(item.itemCommentList.length / commentsPerPage);

  const navigate = useNavigate();

  const handleModifyItem = (item) => {
    console.log('handleModify');
    navigate('/modify-item-seller', { state: item });
  };

  // 뒤로 가기
  const handleBack = (shop) => {
    navigate('/shop-detail-seller', { state: shop });
  };

  // 소속 시장 상세 페이지로 이동
  const handleMarketDetail = (market) => {
    console.log('시장 상세페이지로 이동 :', market);
    navigate('/market-detail', { state: market });
  };

  // 소속 상점 상세 페이지로 이동
  const handleShopDetail = (shop) => {
    console.log('상점 상세페이지로 이동 :', shop);
    navigate('/shop-detail-seller', { state: shop });
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
            <Button variant="contained" color="error" onClick={() => handleBack(itemWithMarketData.shopData)} startIcon={<KeyboardArrowLeftIcon />}>
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
              <Typography variant="body1" paragraph>
                판매량 : {item.countSales}
              </Typography>
                <Typography variant="body1" paragraph>
                  총 매출액 : {item.totalSalesPrice}
                </Typography>
              <Typography variant="body1">
                좋아요 : {item.likes}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleModifyItem(item)}
                >
                  상품 수정
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
      </Box>
    </DashboardLayout>
  );
}

export default ItemDetailSeller;

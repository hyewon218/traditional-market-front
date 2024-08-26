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

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// Data
import { deleteOrder } from "../../api/orderApi";
import { getItemOne } from "../../api/itemApi";
import { getShopOne } from "../../api/shopApi";
import { getOne } from "../../api/marketApi";

function OrderDetail() {
  const { state } = useLocation();
  const order = state; // 전달된 order 데이터를 사용
  console.log('order : ', order);
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemDetails, setItemDetails] = useState([]); // 각 아이템의 상세 정보 저장
  const navigate = useNavigate();

  const aggregateOrderItems = (orderItems) => {
    const groupedItems = orderItems.reduce((acc, item) => {
      if (!acc[item.itemName]) {
        acc[item.itemName] = { itemName: item.itemName, itemNo: item.itemNo, totalPrice: 0, count: 0, images: [] };
      }
      acc[item.itemName].totalPrice += item.orderPrice * item.count;
      acc[item.itemName].count += item.count;
      acc[item.itemName].images = [...acc[item.itemName].images, ...item.imageList];
      return acc;
    }, {});

    const itemList = Object.values(groupedItems);
    const totalPrice = itemList.reduce((sum, item) => sum + item.totalPrice, 0);

    return { itemList, totalPrice };
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (Array.isArray(order.orderItemList)) {
        const { itemList, totalPrice } = aggregateOrderItems(order.orderItemList);
        setTotalPrice(totalPrice);

        const detailedItems = await Promise.all(
          itemList.map(async (item) => {
            try {
              const itemData = await getItemOne(item.itemNo);
              const shopData = await getShopOne(itemData.shopNo);
              const marketData = await getOne(shopData.marketNo);

              return {
                ...item,
                shopData: shopData,
                marketData: marketData,
              };
            } catch (error) {
              console.error('Failed to fetch item details:', error);
              return { ...item, shopName: 'Unknown', marketName: 'Unknown' }; // 기본값 설정
            }
          })
        );

        setItemDetails(detailedItems);
      }
    };

    fetchItemDetails();
  }, [order.orderItemList]);

  const handleDetailItem = async (itemNo) => {
    try {
      const item = await getItemOne(itemNo);
      console.log('item : ', item);
      navigate('/item-detail', { state: item });
    } catch (error) {
      console.error('상품 정보를 불러오는 데 실패했습니다.', error);
      alert('상품 정보를 불러오는 데 실패했습니다.');
    }
  };

  const handleDetailShop = async (shop) => {
      console.log('shop : ', shop);
      navigate('/shop-detail', { state: shop });
  };

  const handleDetailMarket = async (market) => {
      console.log('market : ', market);
      navigate('/market-detail', { state: market });
  };

  const handleDeleteOrder = async (orderNo) => {
    if (!window.confirm('주문내역을 삭제하시겠습니까?')) return;

    try {
      await deleteOrder(orderNo);
      console.log('삭제 실행, 주문 목록으로 이동');
      navigate('/order-list');
    } catch (error) {
      alert('삭제 실패:', error);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="contained" color="error" onClick={handleBack} startIcon={<KeyboardArrowLeftIcon />}>
            돌아가기
          </Button>
        </Box>

        {/* 주문 상품 정보 */}
        {itemDetails.length > 0 && (
          <Card sx={{ p: 3, mt: 2, position: 'relative' }}>
            {order.orderStatus === 'PURCHASECONFIRM' && (
              <Button
                variant="contained"
                color="error"
                size="medium"
                onClick={() => handleDeleteOrder(order.orderNo)}
                sx={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#ff3333',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#ff7777',
                  },
                }}
              >
                삭제
              </Button>
            )}
            <Typography variant="h5" gutterBottom>
              주문 상품
            </Typography>
            <Grid container spacing={2}>
              {itemDetails.map((item, index) => {
                return (
                  <Grid item xs={12} sm={6} md={6} key={index}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography
                          variant="body1"
                          onClick={() => handleDetailMarket(item.marketData)}
                          style={{ cursor: 'pointer' }}
                        >
                          <strong>소속 시장</strong> : {item.marketData.marketName}
                        </Typography>
                        <Typography
                          variant="body1"
                          onClick={() => handleDetailShop(item.shopData)}
                          style={{ cursor: 'pointer' }}
                        >
                          <strong>소속 상점</strong> : {item.shopData.shopName}
                        </Typography>
                        <Typography
                          variant="body1"
                          onClick={() => handleDetailShop(item.shopData)}
                          style={{ cursor: 'pointer' }}
                        >
                          <strong>전화번호</strong> : {item.shopData.tel}
                        </Typography>
                        <Typography
                          variant="body1"
                          onClick={() => handleDetailItem(item.itemNo)}
                          style={{ cursor: 'pointer' }}
                        >
                          <strong>상품명</strong> : {item.itemName}
                        </Typography>
                        <Typography variant="body1">
                          <strong>수량</strong> : {item.count}개
                        </Typography>
                        <Typography variant="body1">
                          <strong>결제 금액</strong> : {item.totalPrice}원
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        {Array.isArray(item.images) && item.images.map((img, imgIndex) => {
                          return (
                            <img
                              key={imgIndex}
                              src={img.imageUrl}
                              alt={`item-image-${imgIndex}`}
                              onClick={() => handleDetailItem(item.itemNo)}
                              style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'contain',
                                marginBottom: '10px',
                                cursor: 'pointer',
                              }}
                            />
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Card>
        )}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            {/* 주문 기본 정보 또는 환불 정보 */}
            {order.orderStatus === 'RETURN' || order.orderStatus === 'RETURNCOMPLETE' || order.orderStatus === 'CANCEL' ? (
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {order.orderStatus === 'RETURN' ? '주문 정보' : '환불 정보'}
                </Typography>
                {(order.orderStatus === 'RETURNCOMPLETE' || order.orderStatus === 'CANCEL') && (
                  <Typography fontWeight="bold" sx={{ fontSize: '1rem', color: 'blue', mb: 1 }} variant="body2">
                    ※ 카드 결제의 경우 취소 후 3~5영업일 이내 카드 결제 취소 예정입니다. <br/> 정확한 취소 일정은 카드사에 직접 문의해주세요.
                  </Typography>
                )}
                <Typography variant="body1" paragraph>
                  <strong>주문 번호</strong> : {order.randomOrderNo}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>결제 상태</strong> : {order.orderStatusDisplayName}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>주문 날짜</strong> : {order.orderDate}
                </Typography>
                {order.orderStatus === 'RETURN' || order.orderStatus === 'RETURNCOMPLETE' && (
                  <>
                    <Typography variant="body1" paragraph>
                      <strong>반품 신청일</strong> : {order.returnDate}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>반품 사유</strong> : {order.returnMessage}
                    </Typography>
                    {order.returnCompleteDate && (
                      <Typography variant="body1" paragraph>
                        <strong>반품 완료일</strong> : {order.returnCompleteDate}
                      </Typography>
                    )}
                  </>
                )}
                {order.orderStatus === 'CANCEL' && (
                   <>
                      <Typography variant="body1" paragraph>
                        <strong>주문 취소일</strong> : {order.orderCancelDate}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        <strong>주문 취소 사유</strong> : {order.returnMessage}
                      </Typography>
                   </>
                )}
                <Typography variant="body1" paragraph>
                  <strong>환불 예정 금액</strong> : {totalPrice}원
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>환불 수단</strong> : {order.paymentMethod}
                </Typography>
              </Card>
            ) : (
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  주문 기본 정보
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>주문 번호</strong> : {order.randomOrderNo}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>결제 상태</strong> : {order.orderStatusDisplayName}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>주문 날짜</strong> : {order.orderDate}
                </Typography>
                {order.finishDate && (
                  <Typography variant="body1" paragraph>
                    <strong>배송 완료일</strong> : {order.finishDate}
                  </Typography>
                )}
                {order.purchaseCompleteDate && (
                  <Typography variant="body1" paragraph>
                    <strong>구매 확정일</strong> : {order.purchaseCompleteDate}
                  </Typography>
                )}
                <Typography variant="body1" paragraph>
                  <strong>결제 금액</strong> : {totalPrice}원
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>결제 수단</strong> : {order.paymentMethod}
                </Typography>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {/* 받는 사람 정보 */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                받는 사람 정보
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>이름</strong> : {order.receiver}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>연락처</strong> : {order.phone}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>주소</strong> : {order.deliveryAddr}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>배송 메시지</strong> : {order.deliveryMessage}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default OrderDetail;


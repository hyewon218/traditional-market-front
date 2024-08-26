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
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';

// Data
import { getItemOne } from "../../../api/itemApi";
import { getShopOne } from "../../../api/shopApi";
import { getOne } from "../../../api/marketApi";
import { getMember } from "../../../api/memberApi";

function OrderDetailSeller() {
  const { state } = useLocation();
  const order = state; // 전달된 order 데이터를 사용
  console.log('order : ', order);
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemDetails, setItemDetails] = useState([]); // 각 아이템의 상세 정보 저장
  const [currentMemberNo, setCurrentMemberNo] = useState(null); // 현재 로그인 사용자 번호
  const navigate = useNavigate();

  const aggregateOrderItems = (orderItems) => {
    const groupedItems = orderItems.reduce((acc, item) => {
      if (!acc[item.itemNo]) {
        acc[item.itemNo] = {
          itemName: item.itemName,
          itemNo: item.itemNo,
          totalPrice: 0,
          count: 0,
          images: new Set() // 중복을 방지하기 위해 Set 사용
        };
      }
      acc[item.itemNo].totalPrice += item.orderPrice * item.count;
      acc[item.itemNo].count += item.count;
      // Set을 사용하여 중복된 이미지를 제거합니다
      item.imageList?.forEach(img => acc[item.itemNo].images.add(img.imageUrl));
      return acc;
    }, {});

    const itemList = Object.values(groupedItems);
    const totalPrice = itemList.reduce((sum, item) => sum + item.totalPrice, 0);

    // Set을 Array로 변환
    itemList.forEach(item => {
      item.images = Array.from(item.images).map(url => ({ imageUrl: url }));
    });

    return { itemList, totalPrice };
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        // 현재 로그인 중인 사용자 정보를 가져옵니다
        const memberData = await getMember();
        setCurrentMemberNo(memberData.memberNo);

        if (Array.isArray(order.orderItemList)) {
          // 아이템 정보를 집계합니다
          const { itemList, totalPrice } = aggregateOrderItems(order.orderItemList);
          setTotalPrice(totalPrice);

          // 현재 로그인 사용자가 판매하는 상품만 필터링합니다
          const filteredItems = await Promise.all(
            itemList.map(async (item) => {
              try {
                const itemData = await getItemOne(item.itemNo);
                const shopData = await getShopOne(itemData.shopNo);
                const marketData = await getOne(shopData.marketNo);

                if (shopData.sellerNo === memberData.memberNo) {
                  return {
                    ...item,
                    shopData: shopData,
                    marketData: marketData,
                  };
                }
                return null; // 필터링 조건에 맞지 않는 경우 null 반환
              } catch (error) {
                console.error('Failed to fetch item details:', error);
                return { ...item, shopName: 'Unknown', marketName: 'Unknown' }; // 기본값 설정
              }
            })
          );

          // null 값을 제거하여 필터링된 결과만 유지
          const validItems = filteredItems.filter(item => item !== null);

          setItemDetails(validItems);
        }
      } catch (error) {
        console.error('Failed to fetch member data:', error);
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
            <Typography variant="h5" gutterBottom>
              주문 상품
            </Typography>
            <Grid container spacing={2}>
              {itemDetails.map((item, index) => (
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
                      <Typography variant="body1">
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
                        <strong>결제 금액</strong> : {item.totalPrice}원
                      </Typography>
                      <Typography variant="body1">
                        <strong>수량</strong> : {item.count}개
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      {Array.isArray(item.images) && item.images.map((img, imgIndex) => (
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
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              ))}
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
                {order.orderStatus === 'RETURN' && (
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

export default OrderDetailSeller;

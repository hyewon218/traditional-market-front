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
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';

// Data
import {deleteOrder} from "../../api/orderApi";
import {getItemOne} from "../../api/itemApi";
import {getShopOne} from "../../api/shopApi";
import {getOne} from "../../api/marketApi";
import MDTypography from "../../components/MD/MDTypography";
import MDBox from "../../components/MD/MDBox";
import MDButton from "../../components/MD/MDButton";
import {useMediaQuery} from "@mui/material";

function OrderDetail() {
    const {state} = useLocation();
    const order = state; // 전달된 order 데이터를 사용
    //console.log('order : ', order);
    const [totalPrice, setTotalPrice] = useState(0);
    const [itemDetails, setItemDetails] = useState([]); // 각 아이템의 상세 정보 저장
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const aggregateOrderItems = (orderItems) => {
        const groupedItems = orderItems.reduce((acc, item) => {
            if (!acc[item.itemName]) {
                acc[item.itemName] = {
                    itemName: item.itemName,
                    itemNo: item.itemNo,
                    totalPrice: 0,
                    count: 0,
                    images: []
                };
            }
            acc[item.itemName].totalPrice += item.orderPrice * item.count;
            acc[item.itemName].count += item.count;
            acc[item.itemName].images = [...acc[item.itemName].images,
                ...item.imageList];
            return acc;
        }, {});

        const itemList = Object.values(groupedItems);
        const totalPrice = itemList.reduce((sum, item) => sum + item.totalPrice,
            0);

        return {itemList, totalPrice};
    };

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (Array.isArray(order.orderItemList)) {
                const {itemList, totalPrice} = aggregateOrderItems(
                    order.orderItemList);
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
                            console.error('Failed to fetch item details:',
                                error);
                            return {
                                ...item,
                                shopName: 'Unknown',
                                marketName: 'Unknown'
                            }; // 기본값 설정
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
            navigate('/item-detail', {state: item});
        } catch (error) {
            console.error('상품 정보를 불러오는 데 실패했습니다.', error);
            alert('상품 정보를 불러오는 데 실패했습니다.');
        }
    };

    const handleDetailShop = async (shop) => {
        console.log('shop : ', shop);
        navigate('/shop-detail', {state: shop});
    };

    const handleDetailMarket = async (market) => {
        console.log('market : ', market);
        navigate('/market-detail', {state: market});
    };

    const handleDeleteOrder = async (orderNo) => {
        if (!window.confirm('주문내역을 삭제하시겠습니까?')) {
            return;
        }

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
            <Grid container>
                <Grid item xs={6} lg={4}>
                    <MDTypography fontWeight="bold"
                                  sx={{
                                      ml: isSmallScreen ? 2 : 4,
                                      mt: isSmallScreen ? 0 : 3,
                                      fontSize: isSmallScreen ? '1.2rem'
                                          : '2rem'
                                  }}
                                  variant="body2">
                        주문 내역 상세
                    </MDTypography>
                </Grid>
                <Grid item xs={6} lg={8}>
                    <MDBox sx={{
                        pr: isSmallScreen ? 2 : 3,
                        width: '100%',
                        mt: isSmallScreen ? 0 : 4,
                        display: 'flex',
                        justifyContent: 'right',
                    }}>
                        <MDButton
                            sx={{
                                fontFamily: 'JalnanGothic',
                                fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
                                minWidth: 'auto',
                                width: isSmallScreen ? '100px' : 'auto', // 가로 너비를 줄임
                                padding: isSmallScreen
                                    ? '1px 2px'
                                    : '4px 8px',
                                lineHeight: isSmallScreen ? 2.5 : 2,  // 줄 간격을 줄여 높이를 감소시킴
                                minHeight: 'auto' // 기본적으로 적용되는 높이를 없앰
                            }}
                            variant="contained"
                            color="white"
                            onClick={handleBack}
                            startIcon={<KeyboardArrowLeftIcon/>}
                        >
                            돌아가기
                        </MDButton>
                    </MDBox>
                </Grid>
            </Grid>

            <MDBox pt={1} pb={2}>
                {/* 주문 상품 정보 */}
                <MDBox px={isSmallScreen ? 1 : 3}>
                    {itemDetails.length > 0 && (
                        <Card>
                            {order.orderStatus === 'PURCHASECONFIRM' && (
                                <MDButton
                                    variant="contained"
                                    color="error"
                                    size="medium"
                                    onClick={() => handleDeleteOrder(
                                        order.orderNo)}
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
                                </MDButton>
                            )}

                            <MDBox pt={2} pb={isSmallScreen ? 2 : 0} px={isSmallScreen ? 2 : 3}>
                                <MDTypography
                                    sx={{ fontSize: isSmallScreen ? '1rem':'1.5rem' }}
                                    variant="h5" gutterBottom>
                                    주문 상품
                                </MDTypography>

                                    {itemDetails.map((item, index) => {
                                        return (
                                            <Grid container>
                                                <Grid item xs={8} lg={8} key={index}>
                                                    <MDTypography
                                                        sx={{ fontSize: isSmallScreen ? '0.7rem':'1rem' }}
                                                        variant="body1"
                                                        onClick={() => handleDetailMarket(
                                                            item.marketData)}
                                                        style={{cursor: 'pointer'}}
                                                        paragraph
                                                    >소속 시장 : {item.marketData.marketName}
                                                    </MDTypography>
                                                    <MDTypography
                                                        sx={{ fontSize: isSmallScreen ? '0.7rem':'1rem' }}
                                                        variant="body1"
                                                        onClick={() => handleDetailShop(
                                                            item.shopData)}
                                                        style={{cursor: 'pointer'}}
                                                        paragraph
                                                    >소속 상점 : {item.shopData.shopName}
                                                    </MDTypography>
                                                    <MDTypography
                                                        sx={{ fontSize: isSmallScreen ? '0.7rem':'1rem' }}
                                                        variant="body1"
                                                        onClick={() => handleDetailShop(
                                                            item.shopData)}
                                                        style={{cursor: 'pointer'}}
                                                        paragraph
                                                    >전화번호 : {item.shopData.tel}
                                                    </MDTypography>
                                                    <MDTypography
                                                        sx={{ fontSize: isSmallScreen ? '0.7rem':'1rem' }}
                                                        variant="body1"
                                                        onClick={() => handleDetailItem(
                                                            item.itemNo)}
                                                        style={{cursor: 'pointer'}}
                                                        paragraph
                                                    >상품명 : {item.itemName}
                                                    </MDTypography>
                                                    <MDTypography
                                                        sx={{ fontSize: isSmallScreen ? '0.7rem':'1rem' }}
                                                        variant="body1"
                                                        paragraph
                                                    >수량 : {item.count}개
                                                    </MDTypography>
                                                    <MDTypography
                                                        sx={{ fontSize: isSmallScreen ? '0.7rem':'1rem' }}
                                                        variant="body1"
                                                    >결제 금액 : {item.totalPrice}원
                                                    </MDTypography>
                                                </Grid>

                                                <Grid item xs={4} lg={4}>
                                                    {Array.isArray(
                                                            item.images)
                                                        && item.images.map(
                                                            (img,
                                                                imgIndex) => {
                                                                return (
                                                                    <img
                                                                        key={imgIndex}
                                                                        src={img.imageUrl}
                                                                        alt={`item-image-${imgIndex}`}
                                                                        onClick={() => handleDetailItem(
                                                                            item.itemNo)}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '50%',
                                                                            objectFit: 'contain',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                            </MDBox>
                        </Card>
                    )}
                </MDBox>


                <Grid container spacing={isSmallScreen ? 1 : 0} sx={{mt: isSmallScreen ? 1 : 2}}>
                    <Grid item xs={12} lg={6}>
                        {/* 주문 기본 정보 또는 환불 정보 */}
                        {order.orderStatus === 'RETURN' || order.orderStatus
                        === 'RETURNCOMPLETE' || order.orderStatus === 'CANCEL'
                            ? (
                                <MDBox px={isSmallScreen ? 1 : 3}>
                                    <Card>
                                        <MDBox pt={2} pb={2} px={isSmallScreen ? 2 : 3}>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '1rem' : '1.5rem'
                                                }}
                                                variant="h5" gutterBottom>
                                                {order.orderStatus === 'RETURN'
                                                    ? '주문 정보' : '환불 정보'}
                                            </MDTypography>

                                            {(order.orderStatus
                                                    === 'RETURNCOMPLETE'
                                                    || order.orderStatus
                                                    === 'CANCEL')
                                                && (
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        sx={{
                                                            fontSize: isSmallScreen
                                                                ? '0.7rem'
                                                                : '1rem',
                                                            color: 'blue',
                                                            mb: 1
                                                        }} variant="body2">
                                                        ※ 카드 결제의 경우 취소 후 3~5영업일
                                                        이내
                                                        카드 결제 취소
                                                        예정입니다. <br/> 정확한 취소 일정은
                                                        카드사에
                                                        직접
                                                        문의해주세요.
                                                    </MDTypography>
                                                )}
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1" paragraph>
                                                주문 번호 : {order.randomOrderNo}
                                            </MDTypography>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1" paragraph>
                                                결제 상태
                                                : {order.orderStatusDisplayName}
                                            </MDTypography>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1" paragraph>
                                                주문 날짜 : {order.orderDate}
                                            </MDTypography>
                                            {order.orderStatus === 'RETURN'
                                                || order.orderStatus
                                                === 'RETURNCOMPLETE' && (
                                                    <>
                                                        <MDTypography
                                                            sx={{
                                                                fontSize: isSmallScreen
                                                                    ? '0.7rem'
                                                                    : '1rem'
                                                            }}
                                                            variant="body1"
                                                            paragraph>
                                                            반품 신청일
                                                            : {order.returnDate}
                                                        </MDTypography>
                                                        <MDTypography
                                                            sx={{
                                                                fontSize: isSmallScreen
                                                                    ? '0.7rem'
                                                                    : '1rem'
                                                            }}
                                                            variant="body1"
                                                            paragraph>
                                                            반품 사유
                                                            : {order.returnMessage}
                                                        </MDTypography>
                                                        {order.returnCompleteDate
                                                            && (
                                                                <MDTypography
                                                                    sx={{
                                                                        fontSize: isSmallScreen
                                                                            ? '0.7rem'
                                                                            : '1rem'
                                                                    }}
                                                                    variant="body1"
                                                                    paragraph>
                                                                    반품 완료일
                                                                    : {order.returnCompleteDate}
                                                                </MDTypography>
                                                            )}
                                                    </>
                                                )}
                                            {order.orderStatus === 'CANCEL' && (
                                                <>
                                                    <MDTypography
                                                        sx={{
                                                            fontSize: isSmallScreen
                                                                ? '0.7rem'
                                                                : '1rem'
                                                        }}
                                                        variant="body1"
                                                        paragraph>
                                                        주문 취소일
                                                        : {order.orderCancelDate}
                                                    </MDTypography>
                                                    <MDTypography
                                                        sx={{
                                                            fontSize: isSmallScreen
                                                                ? '0.7rem'
                                                                : '1rem'
                                                        }}
                                                        variant="body1"
                                                        paragraph>
                                                        주문 취소 사유
                                                        : {order.returnMessage}
                                                    </MDTypography>
                                                </>
                                            )}
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1" paragraph>
                                                환불 예정 금액 : {totalPrice}원
                                            </MDTypography>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1" paragraph>
                                                환불 수단 : {order.paymentMethod}
                                            </MDTypography>
                                        </MDBox>
                                    </Card>
                                </MDBox>
                            ) : (
                                <MDBox px={isSmallScreen ? 1 : 3}>
                                    <Card>
                                        <MDBox pt={2} pb={1} px={isSmallScreen ? 2 : 3}>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '1rem' : '1.5rem'
                                                }}
                                                variant="h5" gutterBottom>주문 기본 정보
                                            </MDTypography>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1"
                                                paragraph>
                                                주문 번호 : {order.randomOrderNo}
                                            </MDTypography>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1"
                                                paragraph>
                                                결제 상태
                                                : {order.orderStatusDisplayName}
                                            </MDTypography>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1"
                                                paragraph>
                                                주문 날짜 : {order.orderDate}
                                            </MDTypography>
                                            {order.finishDate && (
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen
                                                            ? '0.7rem' : '1rem'
                                                    }}
                                                    variant="body1"
                                                    paragraph>
                                                    배송 완료일 : {order.finishDate}
                                                </MDTypography>
                                            )}
                                            {order.purchaseCompleteDate && (
                                                <MDTypography
                                                    sx={{
                                                        fontSize: isSmallScreen
                                                            ? '0.7rem' : '1rem'
                                                    }}
                                                    variant="body1"
                                                    paragraph>
                                                    구매 확정일
                                                    : {order.purchaseCompleteDate}
                                                </MDTypography>
                                            )}
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1"
                                                paragraph>
                                                결제 금액 : {totalPrice}원
                                            </MDTypography>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen
                                                        ? '0.7rem' : '1rem'
                                                }}
                                                variant="body1"
                                                paragraph>
                                                결제 수단 : {order.paymentMethod}
                                            </MDTypography>
                                        </MDBox>
                                    </Card>
                                </MDBox>
                            )}
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        {/* 받는 사람 정보 */}
                        <MDBox px={isSmallScreen ? 1 : 3}>
                            <Card>
                                <MDBox pt={2} pb={isSmallScreen ? 0 : 6} px={isSmallScreen ? 2 : 3}>
                                    <MDTypography
                                        sx={{
                                            fontSize: isSmallScreen
                                                ? '1rem' : '1.5rem'
                                        }}
                                        variant="h5" gutterBottom>
                                        받는 사람 정보
                                    </MDTypography>
                                    <MDTypography
                                        sx={{
                                            fontSize: isSmallScreen
                                                ? '0.7rem' : '1rem'
                                        }}
                                        variant="body1" paragraph>
                                        이름 : {order.receiver}
                                    </MDTypography>
                                    <MDTypography
                                        sx={{
                                            fontSize: isSmallScreen
                                                ? '0.7rem' : '1rem'
                                        }}
                                        variant="body1" paragraph>
                                      연락처 : {order.phone}
                                    </MDTypography>
                                    <MDTypography
                                        sx={{
                                            fontSize: isSmallScreen
                                                ? '0.7rem' : '1rem'
                                        }}
                                        variant="body1" paragraph>
                                        주소 : {order.deliveryAddr}
                                    </MDTypography>
                                    <MDTypography
                                        sx={{
                                            fontSize: isSmallScreen
                                                ? '0.7rem' : '1rem'
                                        }}
                                        variant="body1" paragraph>
                                        배송 메시지 : {order.deliveryMessage}
                                    </MDTypography>
                                </MDBox>
                            </Card>
                        </MDBox>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default OrderDetail;


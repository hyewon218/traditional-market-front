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
import {useEffect, useMemo, useState} from 'react';

// @mui material components
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from '../../components/MD/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import MDTypography from "../MD/MDTypography";
import {getOrder} from "../../api/orderApi";
import Grid from "@mui/material/Grid";
import {useMediaQuery} from "@mui/material";

const initState = {
    orderNo: '',
    orderStatus: '',
    orderStatusDisplayName: '',
    orderDate: '',
    deliveryAddr: '',
    deliverMessage: '',
    total: '',
    orderItemList: []
}

function OrderCompleteComponent() {

    const [order, setOrder] = useState(initState);

    const total = useMemo(() => {
        let total = 0
        for (const orderItem of order.orderItemList) {
            //console.log("orderItem :", orderItem); // 디버깅 로그 추가
            total += orderItem.orderPrice * orderItem.count;
            //console.log("total : "+total);
        }
        return total
    },);

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleGetOrder = () => {
        console.log('handleGetOrderItems');
        getOrder().then(data => {
            setOrder(data);
            console.log('data : ', data);
        }).catch(error => {
            console.error("주문 상품 목록 조회에 실패했습니다.", error);
        });
    };

    useEffect(() => {
        handleGetOrder();
    }, []);

    return (
        <DashboardLayout>
            <MDTypography fontWeight="bold"
                          sx={{
                              ml: isSmallScreen ? 2 : 4,
                              mt: isSmallScreen ? 0 : 3,
                              fontSize: isSmallScreen ? '1.2rem' : '2rem'
                          }}
                          variant="body2">
                주문 정보
            </MDTypography>
            <MDBox pb={2}>
                <MDBox pt={isSmallScreen ? 1 : 1} pb={2}
                       px={isSmallScreen ? 1 : 3}>
                    <Card>
                        <MDBox pt={3} pb={3} px={3}>
                            <MDBox component="form" role="form">
                                <MDBox mb={isSmallScreen? 1:2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        주문 번호 : {order.orderNo}
                                    </MDTypography>
                                </MDBox>
                                <MDBox mb={isSmallScreen? 1:2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        결제 상태 : {order.orderStatusDisplayName}
                                    </MDTypography>
                                </MDBox>
                                <MDBox mb={isSmallScreen? 1:2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        주문 날짜 : {order.orderDate}
                                    </MDTypography>
                                </MDBox>
                                <MDBox mb={isSmallScreen? 1:2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        받는 사람 : {order.receiver}
                                    </MDTypography>
                                </MDBox>
                                <MDBox mb={isSmallScreen? 1:2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        연락처 : {order.phone}
                                    </MDTypography>
                                </MDBox>
                                <MDBox mb={isSmallScreen? 1:2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        배송지 정보 : {order.deliveryAddr}
                                    </MDTypography>
                                </MDBox>
                                <MDBox mb={isSmallScreen? 1:2}>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        배송 메시지 : {order.deliveryMessage}
                                    </MDTypography>
                                </MDBox>
                                <MDBox>
                                    <MDTypography fontWeight="bold"
                                                  variant="body2">
                                        총 가격 : {total}
                                    </MDTypography>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                    </Card>
                </MDBox>

                <MDTypography
                    sx={{
                        ml: isSmallScreen ? 2 : 4,
                        mt: isSmallScreen ? 0 : 3,
                        fontSize: isSmallScreen ? '1.2rem' : '2rem'
                    }}
                    fontWeight="bold"
                    variant="body2"
                    fontSize="25px"
                >
                    주문 상품
                </MDTypography>
                <MDBox pt={isSmallScreen ? 1 : 1} pb={10} px={isSmallScreen ? 1 : 3}>
                    <Card>
                        <ul>
                            {/*cartItems 가 배열인 경우에만 map 함수를 실행*/}
                            {Array.isArray(
                                    order.orderItemList)
                                && order.orderItemList.map(
                                    orderItem =>
                                        <li key={orderItem.orderItemNo}>
                                            <MDBox pt={1} px={2}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={5} lg={3}>
                                                        <div
                                                            style={{
                                                                position: 'relative',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}>
                                                            {orderItem.imageList.map(
                                                                (imageUrl,
                                                                    index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={imageUrl.imageUrl}
                                                                        alt={orderItem.itemName}
                                                                        style={{
                                                                            width: isSmallScreen
                                                                                ? '100px'
                                                                                : '200px', // 이미지 너비
                                                                            height: isSmallScreen
                                                                                ? '100px'
                                                                                : '200px', // 이미지 높이
                                                                            objectFit: 'contain', // 비율 유지
                                                                        }}/>
                                                                ))}
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={7} lg={9} sx={{mt: isSmallScreen? 2:4}}>
                                                        <MDTypography
                                                            fontWeight="bold"
                                                            sx={{
                                                                fontSize: isSmallScreen
                                                                    ? '1.0rem'
                                                                    : '1.5rem'
                                                            }}
                                                            variant="body2">
                                                            {orderItem.itemName}
                                                        </MDTypography>
                                                        <MDTypography
                                                            fontWeight="bold"
                                                            sx={{
                                                                fontSize: isSmallScreen
                                                                    ? '1.0rem'
                                                                    : '1.5rem'
                                                            }}
                                                            variant="body2">
                                                            {orderItem.orderPrice
                                                                * orderItem.count}원
                                                        </MDTypography>
                                                        <MDTypography
                                                            sx={{
                                                                fontSize: isSmallScreen
                                                                    ? '1.0rem'
                                                                    : '1.5rem'
                                                            }}
                                                            fontWeight="bold"
                                                            variant="body2"> 수량
                                                            :{orderItem.count}개
                                                        </MDTypography>
                                                    </Grid>
                                                </Grid>
                                            </MDBox>
                                        </li>
                                )}
                        </ul>
                    </Card>
                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default OrderCompleteComponent;

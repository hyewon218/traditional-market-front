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

const initState = {
    orderNo: '',
    orderStatus: '',
    orderStatusDisplayName: '',
    orderDate: '',
    deliveryAddr: '',
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

    const handleGetOrder = () => {
        console.log('handleGetOrderItems');
        getOrder().then(data => {
            setOrder(data);
        }).catch(error => {
            console.error("주문 상품 목록 조회에 실패했습니다.", error);
        });
    };

    useEffect(() => {
        handleGetOrder();
    }, []);

    return (
        <DashboardLayout>
            <MDBox pt={6} pb={3}>
                <Card>
                    <MDBox pt={4} pb={3} px={3}>
                        <MDBox component="form" role="form">
                            <MDBox mb={2}>
                                <MDTypography fontWeight="bold"
                                              variant="body2">
                                    주문 번호 : {order.orderNo}
                                </MDTypography>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDTypography fontWeight="bold"
                                              variant="body2">
                                    결제 상태 : {order.orderStatusDisplayName}
                                </MDTypography>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDTypography fontWeight="bold"
                                              variant="body2">
                                    주문 날짜 : {order.orderDate}
                                </MDTypography>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDTypography fontWeight="bold"
                                              variant="body2">
                                    배송지 정보 : {order.deliveryAddr}
                                </MDTypography>
                            </MDBox>
                            <MDBox mb={2}>
                                <MDTypography fontWeight="bold"
                                              variant="body2">
                                    총 가격 : {total}
                                </MDTypography>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
            </MDBox>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MDTypography
                        fontWeight="bold"
                        variant="body2"
                        fontSize="25px"
                    >
                        주문상품
                    </MDTypography>
                    <Grid container spacing={4}>
                        <Grid item xs={7}>
                            <MDBox pb={3}>
                                <Card>
                                    <MDBox pt={2}>
                                        <div>
                                            <ul>
                                                 {/*cartItems 가 배열인 경우에만 map 함수를 실행*/}
                                                {Array.isArray(
                                                        order.orderItemList)
                                                    && order.orderItemList.map(
                                                        orderItem =>
                                                            <li key={orderItem.orderItemNo}
                                                                style={{marginBottom: '16px'}}>
                                                                <MDBox
                                                                    pt={2}
                                                                    px={2}>
                                                                    <Grid
                                                                        container
                                                                        spacing={2}>
                                                                        <Grid
                                                                            item
                                                                            xs={12}>
                                                                            <MDTypography
                                                                                fontWeight="bold"
                                                                                variant="body2">

                                                                            </MDTypography>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Grid
                                                                        container
                                                                        spacing={2}>
                                                                        <Grid
                                                                            item
                                                                            xs={7}>
                                                                            <div
                                                                                className=" m-1 p-1 ">
                                                                                {orderItem.imageList.map(
                                                                                    (imageUrl,
                                                                                        index) => (
                                                                                        <img
                                                                                            key={index}
                                                                                            src={imageUrl.imageUrl}
                                                                                            alt={orderItem.itemName}/>
                                                                                    ))}
                                                                            </div>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={5}
                                                                            sx={{mt: 3}}>
                                                                            <MDTypography
                                                                                fontWeight="bold"
                                                                                sx={{fontSize: '2.5rem'}}
                                                                                variant="body2">
                                                                                {orderItem.itemName}
                                                                            </MDTypography>
                                                                            <MDTypography
                                                                                fontWeight="bold"
                                                                                sx={{fontSize: '3rem'}}
                                                                                variant="body2">
                                                                                {orderItem.orderPrice
                                                                                    * orderItem.count}원
                                                                            </MDTypography>
                                                                            <Grid
                                                                                container
                                                                                sx={{mt: 3}}>

                                                                                <Grid
                                                                                    item
                                                                                    xs={3}
                                                                                    sx={{mt: 1}}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        variant="body2"> 수량
                                                                                        :
                                                                                        {orderItem.count}개
                                                                                    </MDTypography>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={2}>

                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </MDBox>
                                                            </li>
                                                    )}
                                            </ul>
                                        </div>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}

export default OrderCompleteComponent;

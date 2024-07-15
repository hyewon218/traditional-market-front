import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../MD/MDBox";
import MDTypography from "../MD/MDTypography";
import MDButton from "../MD/MDButton";
import {getOrderItemList} from "../../api/orderApi";

const OrderComponent = () => {

    const {isLogin} = useCustomLogin()
    const [orderItems, setOrderItems] = useState([]);

    const total = useMemo(() => {
        let total = 0
        //console.log("Calculating total for cartItems :", cartItems); // 디버깅 로그 추가
        for (const orderItem of orderItems) {
            //console.log("item :", item); // 디버깅 로그 추가
            total += orderItem.orderPrice * orderItem.count;
        }
        return total
    }, []);

    const handleGetOrderItems = () => {
        console.log('handleGetOrderItems');
        getOrderItemList().then(data => {
            console.error("data : ", data);
            setOrderItems(data);
        }).catch(error => {
            console.error("주문 상품 목록 조회에 실패했습니다.", error);
        });
    };

    const handleClickPay = () => { // 결제하기

    }

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '2rem',
        fontFamily: 'JalnanGothic',
        padding: '20px 40px',
        width: '660px',
    };

    useEffect(() => {
        handleGetOrderItems();
    }, []);


    return (
        <DashboardLayout>

            {isLogin ? (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MDBox pt={3} pb={3}>
                                <Card>
                                    <MDBox pt={2} pb={3} px={3}>
                                        <Grid container>
                                            <Grid item xs={10}>
                                                <MDTypography
                                                    fontWeight="bold"
                                                    variant="body2">
                                                    결제
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <MDBox pb={3}>
                                <Card>
                                    <MDBox pt={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={7}>
                                                <div>
                                                    <ul>
                                                        {/* cartItems 가 배열인 경우에만 map 함수를 실행 */}
                                                        {Array.isArray(
                                                                orderItems)
                                                            && orderItems.map(
                                                                orderItem =>
                                                                    <li key={orderItem.orderItemNo}
                                                                        className="border-2 rounded-2"
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
                                                                                        {orderItem.imageList.map((imageUrl, index) => (
                                                                                            <img key={index} src={imageUrl.imageUrl} alt={orderItem.itemName} />
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
                                                                                                variant="body2"> 수량 :
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
                                            </Grid>
                                            <Grid item xs={5} sx={{ paddingRight: '26px' }}>

                                                <MDButton onClick={handleClickPay}
                                                          variant="gradient"
                                                          size="large"
                                                          sx={buttonStyle}

                                                >{total}원 결제하기
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        </Grid>
                    </Grid>
                </>
            ) : null}
        </DashboardLayout>
    );
}

export default OrderComponent;
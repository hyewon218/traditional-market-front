import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../MD/MDBox";
import MDTypography from "../MD/MDTypography";
import MDButton from "../MD/MDButton";
import {getPrimaryDelivery} from "../../api/deliveryApi";
import {getOrderItemList, putSelectedDelivery} from "../../api/orderApi";
import {postPay} from "../../api/payApi";
import DeliveryListModal from "../delivery/DeliveryListModal";

const OrderComponent = () => {

    const {isLogin} = useCustomLogin()
    const [orderItems, setOrderItems] = useState([]);
    const [primaryDelivery, setPrimaryDelivery] = useState([]);
    const [result, setResult] = useState(null)
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const total = useMemo(() => {
        let total = 0
        //console.log("Calculating total for orderItems :", orderItems); // 디버깅 로그 추가
        for (const orderItem of orderItems) {
            //console.log("orderItem :", orderItem); // 디버깅 로그 추가
            total += orderItem.orderPrice * orderItem.count;
            //console.log("total : "+total);
        }
        return total
    },);

    const handleGetOrderItems = () => {
        console.log('handleGetOrderItems');
        getOrderItemList().then(data => {
            setOrderItems(data);
        }).catch(error => {
            console.error("주문 상품 목록 조회에 실패했습니다.", error);
        });
    };

    const handleGetPrimaryDelivery = () => {
        console.log('handleGetPrimaryDelivery');
        getPrimaryDelivery().then(data => {
            setPrimaryDelivery(data);
        }).catch(error => {
            console.error("기본 배송지 조회에 실패했습니다.", error);
        });
    };

    /*모달창*/
    const handleDeliveryModal = () => { // 주문 페이지 내 배송지 추가 버튼
        console.log('handleDeliveryModal');
        setResult(true);
    };

    const deliveryListModal = (selectedDelivery) => {
        setResult(false) // 모달창 닫기
        if (selectedDelivery) {
            setSelectedDelivery(selectedDelivery);
        } else {
            handleGetPrimaryDelivery(); // 모달 창 닫히고 기본 배송지 조회
        }
    }

    const handleClickPay = (DeliveryAddr) => { // 결제하기
        postPay().then(data => {
            console.log('결제 요청!!!');
            // 결제 요청 성공 시 선택된 배송지를 서버에 저장
            handleSaveDelivery(DeliveryAddr);
            console.log(data);
            window.location.href = data.next_redirect_pc_url;
        }).catch(error => {
            console.error("결제 요청에 실패했습니다.", error);
        });
    }

    const handleSaveDelivery = (DeliveryAddr) => {
        putSelectedDelivery(DeliveryAddr).then(data => {
            console.log('선택된 배송지 저장!!!');
            console.log(data);
        }).catch(error => {
            console.error("배송지 저장에 실패했습니다.", error);
        });
    }

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '2rem',
        fontFamily: 'JalnanGothic',
        padding: '20px 40px',
        width: '660px',
    };

    const getDeliveryAddressTitle = () => {
        const receiver = selectedDelivery?.receiver || primaryDelivery.receiver || '';
        const title = selectedDelivery?.title || primaryDelivery.title || '';
        const formattedTitle = title ? ` (${title})` : ""
        const addressTitle = `${receiver}${formattedTitle}`
        return addressTitle || null ;
    };

    const deliveryAddressTitle = getDeliveryAddressTitle();
    const deliveryAddressTitleMessage = deliveryAddressTitle ? deliveryAddressTitle : '배송지를 등록해주세요';

/*    const getDeliveryAddress = () => {
        const address = selectedDelivery
            ? `${selectedDelivery.roadAddr || ''} ${selectedDelivery.detailAddr || ''} (${selectedDelivery.postCode || ''})`
            : primaryDelivery
                ? `${primaryDelivery.roadAddr || ''} ${primaryDelivery.detailAddr || ''} (${primaryDelivery.postCode || ''})`
                : null;
        return address && address.trim() === '()' ? null : address;
    }*/

    const getDeliveryAddress = () => {
        const roadAddr = selectedDelivery?.roadAddr || primaryDelivery?.roadAddr || '';
        const detailAddr = selectedDelivery?.detailAddr || primaryDelivery?.detailAddr || '';
        const postCode = selectedDelivery?.postCode || primaryDelivery?.postCode || '';

        // Construct the address string with conditional parentheses for the post code
        const formattedAddress = `${roadAddr} ${detailAddr}${postCode ? ` (${postCode})` : ''}`.trim();

        return formattedAddress || null;
    };

    const deliveryAddress = getDeliveryAddress();

    const buttonText = primaryDelivery
        ? '변경'
        : '배송지 추가';

    useEffect(() => {
        handleGetOrderItems();
        handleGetPrimaryDelivery();
    }, []);

    return (
        <DashboardLayout>
            {result ?
                <DeliveryListModal
                    callbackFn={deliveryListModal}
                />
                : <></>
            }

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
                            <MDTypography
                                fontWeight="bold"
                                variant="body2"
                                fontSize="25px"
                            >
                                배송지
                            </MDTypography>
                            <Grid container spacing={4}>
                                <Grid item xs={7}>
                                    <MDBox pb={3}>
                                        <Card>
                                            <MDBox pt={2}>
                                                <div>
                                                    <MDBox
                                                        pt={2}
                                                        px={2}>
                                                        <Grid
                                                            container
                                                            sx={{ml: 1, mb: 2}}
                                                            spacing={2}>
                                                            <Grid
                                                                container
                                                                spacing={2}>
                                                                <Grid
                                                                    item
                                                                    xs={10}
                                                                >
                                                                    <MDTypography
                                                                        fontWeight="bold"
                                                                        sx={{fontSize: '1.5rem'}}
                                                                        variant="body2">
                                                                        {deliveryAddressTitleMessage}
                                                                    </MDTypography>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={2}
                                                                    sx={{mt: 1}}>
                                                                    <MDButton
                                                                        onClick={handleDeliveryModal}
                                                                        variant="gradient"
                                                                        color="light">
                                                                        {buttonText}
                                                                    </MDButton>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                container>
                                                                <Grid
                                                                    item
                                                                    xs={5}
                                                                    sx={{mt: 1}}>
                                                                    <MDTypography
                                                                        fontWeight="bold"
                                                                        variant="body2">
                                                                        {selectedDelivery?.phone
                                                                            || primaryDelivery.phone}
                                                                    </MDTypography>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                container>
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sx={{mt: 1}}>
                                                                    <MDTypography
                                                                        fontWeight="bold"
                                                                        variant="body2">
                                                                        {deliveryAddress}
                                                                    </MDTypography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </MDBox>
                                                </div>
                                            </MDBox>
                                        </Card>
                                    </MDBox>
                                </Grid>
                                <Grid item xs={5} sx={{paddingRight: '26px'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <MDButton onClick={() => handleClickPay(
                                            getDeliveryAddress)}
                                                  variant="gradient"
                                                  size="large"
                                                  sx={buttonStyle}
                                                  disabled={!getDeliveryAddress}
                                        >{total}원 결제하기
                                        </MDButton>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
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
                                                        {/* cartItems 가 배열인 경우에만 map 함수를 실행 */}
                                                        {Array.isArray(
                                                                orderItems)
                                                            && orderItems.map(
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
                </>
            ) : null}
        </DashboardLayout>
    );
}

export default OrderComponent;
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
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
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DeliveryMessageModal from '../../components/deliverymessage/DeliveryMessageModal'; // 배송메시지 모달

const OrderComponent = () => {

    const [orderItems, setOrderItems] = useState([]);
    const [primaryDelivery, setPrimaryDelivery] = useState([]);
    const [result, setResult] = useState(null)
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('KakaoPay'); // Default payment method
    const [selectedMessage, setSelectedMessage] = useState(null); // 선택된 메시지 상태

    const [currentImageIndexes, setCurrentImageIndexes] = useState({}); // State for image index

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

    const handleClickPay = () => { // 결제하기
        const DeliveryAddr = getDeliveryAddress();
        const receiver = selectedDelivery?.receiver || primaryDelivery.receiver || '';
        const phone = selectedDelivery?.phone || primaryDelivery.phone || '';
        console.log('receiver : ', receiver);
        console.log('phone : ', phone);
        postPay().then(data => {
            console.log('결제 요청!!!');
            // 결제 요청 성공 시 선택된 배송지를 서버에 저장
            handleSaveDelivery(DeliveryAddr, selectedMessage, receiver, phone);
            console.log(data);
            window.location.href = data.next_redirect_pc_url;
        }).catch(error => {
            console.error("결제 요청에 실패했습니다.", error);
        });
    }

    // 배송메시지 함께 저장
    const handleSaveDelivery = (DeliveryAddr, selectedMessage, receiver, phone) => {
        console.log('DeliveryAddr : ', DeliveryAddr);
        console.log('selectedMessage : ', selectedMessage);
        console.log('receiver : ', receiver);
        console.log('phone : ', phone);
        putSelectedDelivery(DeliveryAddr, selectedMessage, receiver, phone).then(data => {
            console.log('선택된 배송지 저장!!!');
            console.log('data : ', data);
        }).catch(error => {
            console.error("배송지 저장에 실패했습니다.", error);
        });
    }

    const getDeliveryAddressTitle = () => {
        const receiver = selectedDelivery?.receiver || primaryDelivery.receiver || '';
        const title = selectedDelivery?.title || primaryDelivery.title || '';
        const formattedTitle = title ? `(${title})` : '';
        const addressTitle = `${receiver}${formattedTitle}`;
        return addressTitle || null;
    };

    const deliveryAddressTitle = getDeliveryAddressTitle();
    const deliveryAddressTitleMessage = deliveryAddressTitle
        ? deliveryAddressTitle : '배송지를 등록해주세요';

    const getDeliveryAddress = () => {
        const roadAddr = selectedDelivery?.roadAddr || primaryDelivery?.roadAddr || '';
        const detailAddr = selectedDelivery?.detailAddr || primaryDelivery?.detailAddr || '';
        const postCode = selectedDelivery?.postCode || primaryDelivery?.postCode || '';

        const formattedAddress = `${roadAddr} ${detailAddr}${postCode ? ` (${postCode})` : ''}`.trim();
        console.log(formattedAddress);

        return formattedAddress || null;
    };

    const deliveryAddress = getDeliveryAddress();

    const buttonText = primaryDelivery
        ? '변경'
        : '배송지 추가';


    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '2rem',
        fontFamily: 'JalnanGothic',
        padding: '20px 40px',
        width: '660px',
    };

    const handlePreviousImage = (orderItemNo) => {
        setCurrentImageIndexes(prev => {
            const currentIndex = prev[orderItemNo] || 0;
            const imageListLength = orderItems.find(
                    item => item.orderItemNo === orderItemNo)?.imageList.length
                || 0;
            return {
                ...prev,
                [orderItemNo]: (currentIndex - 1 + imageListLength)
                % imageListLength
            };
        });
    };

    const handleNextImage = (orderItemNo) => {
        setCurrentImageIndexes(prev => {
            const currentIndex = prev[orderItemNo] || 0;
            const imageListLength = orderItems.find(
                    item => item.orderItemNo === orderItemNo)?.imageList.length
                || 0;
            return {
                ...prev,
                [orderItemNo]: (currentIndex + 1) % imageListLength
            };
        });
    };

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
                                    <MDBox>
                                        <div>
                                            <MDBox
                                                pb={2}
                                                pt={2}
                                                px={2}>
                                                <Grid item xs={12} container alignItems="center">
                                                    <Grid item xs={9}>
                                                        <MDTypography
                                                            fontWeight="bold"
                                                            sx={{ fontSize: '1.3rem' }}
                                                            variant="body2"
                                                        >
                                                            {deliveryAddressTitleMessage}
                                                        </MDTypography>
                                                    </Grid>
                                                    <Grid item xs={3} container justifyContent="flex-end">
                                                        <MDButton
                                                            onClick={handleDeliveryModal}
                                                            variant="gradient"
                                                            color="success"
                                                            sx={{
                                                                backgroundColor: '#50bcdf',
                                                                color: '#ffffff',
                                                                fontFamily: 'JalnanGothic',
                                                                width: '80px',
                                                                height: '40px', // Adjust height as needed
                                                                fontSize: '0.875rem', // Adjust font size as needed
                                                            }}
                                                        >
                                                            {buttonText}
                                                        </MDButton>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                    >
                                                        {selectedDelivery?.phone || primaryDelivery.phone}
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        variant="body2"
                                                    >
                                                        {deliveryAddress}
                                                    </MDTypography>
                                                </Grid>
                                                <DeliveryMessageModal
                                                    open={result} // 모달 열기 상태
                                                    onClose={() => setResult(false)} // 모달 닫기
                                                    onSelectMessage={setSelectedMessage} // 선택된 메시지를 상태로 저장
                                                />
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
                                <MDButton onClick={() => handleClickPay ()}
                                          variant="gradient"
                                          size="large"
                                          sx={buttonStyle}
                                          disabled={!deliveryAddress}
                                >{total}원 결제하기
                                </MDButton>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MDTypography fontWeight="bold" variant="body2"
                                  fontSize="25px">
                        주문상품
                    </MDTypography>
                    <Grid container spacing={4}>
                        <Grid item xs={7}>
                            <MDBox pb={3}>
                                <Card>
                                    <MDBox pt={1}>
                                        <ul>
                                            {Array.isArray(orderItems)
                                                && orderItems.map(orderItem => {
                                                    const currentImageIndex = currentImageIndexes[orderItem.orderItemNo] || 0;
                                                    const imageList = orderItem.imageList || [];
                                                    const hasImages = imageList.length > 1;
                                                    return (
                                                        <li key={orderItem.orderItemNo}
                                                            style={{ marginBottom: '16px' }}>
                                                            <MDBox px={2}>
                                                                <Grid container
                                                                      spacing={2}>
                                                                    <Grid item
                                                                          xs={7}>
                                                                        {/* Image Navigation */}
                                                                        <div
                                                                            style={{
                                                                                position: 'relative',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                width: '300px',  // Adjust the width as needed
                                                                                height: '150px', // Adjust the height as needed
                                                                                margin: '0 auto' // Center the entire image container
                                                                            }}
                                                                        >
                                                                            {hasImages && (
                                                                                <IconButton
                                                                                    onClick={() => handlePreviousImage(orderItem.orderItemNo)}
                                                                                    style={{
                                                                                        position: 'absolute',
                                                                                        left: '-30px',  // Adjusted to align with the image's new position
                                                                                        top: '50%',
                                                                                        transform: 'translateY(-50%)',
                                                                                        zIndex: 1  // Ensure the button is on top of the image
                                                                                    }}
                                                                                >
                                                                                    <KeyboardArrowLeftIcon />
                                                                                </IconButton>
                                                                            )}

                                                                            <img
                                                                                src={imageList[currentImageIndex]?.imageUrl}
                                                                                alt={orderItem.itemName}
                                                                                style={{
                                                                                    maxWidth: '100%', // Scale the image to fit the container
                                                                                    maxHeight: '100%',
                                                                                    objectFit: 'contain', // Ensure the image maintains its aspect ratio
                                                                                    marginRight: '50px'  // Adjust this to move the image slightly to the left
                                                                                }}
                                                                            />

                                                                            {hasImages && (
                                                                                <IconButton
                                                                                    onClick={() => handleNextImage(orderItem.orderItemNo)}
                                                                                    style={{
                                                                                        position: 'absolute',
                                                                                        right: '10px', // Align this with the image's new position
                                                                                        top: '50%',
                                                                                        transform: 'translateY(-50%)',
                                                                                        zIndex: 1 // Ensure the button is on top of the image
                                                                                    }}
                                                                                >
                                                                                    <KeyboardArrowRightIcon />
                                                                                </IconButton>
                                                                            )}
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item
                                                                          xs={4}  sx={{ mt: 3 }}>
                                                                        <MDTypography
                                                                            fontWeight="bold"
                                                                            sx={{ fontSize: '1.5rem' }}
                                                                            variant="body2">
                                                                            {orderItem.itemName}
                                                                        </MDTypography>
                                                                        <MDTypography
                                                                            fontWeight="bold"
                                                                            sx={{ fontSize: '1.5rem' }}
                                                                            variant="body2">
                                                                            {orderItem.orderPrice * orderItem.count}원
                                                                        </MDTypography>
                                                                        <Grid
                                                                            container
                                                                           >
                                                                            <Grid
                                                                                item
                                                                                xs={7}
                                                                                sx={{ mt: 1 }}>
                                                                                <MDTypography
                                                                                    fontWeight="bold"
                                                                                    variant="body2">
                                                                                    수량 : {orderItem.count}개
                                                                                </MDTypography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </MDBox>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    </MDBox>
                                </Card>
                            </MDBox>
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
                        결제수단
                    </MDTypography>
                    <Grid container spacing={4}>
                        <Grid item xs={7}>
                            <MDBox pb={3}>
                                <Card>
                                    <MDBox pt={2} px={2} pb={2}>
                                        <FormControl component="fieldset">

                                            <RadioGroup
                                                aria-label="payment method"
                                                name="paymentMethod"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(
                                                    e.target.value)}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <FormControlLabel
                                                    value="KakaoPay"
                                                    control={<Radio/>}
                                                    label={
                                                        <Typography style={{
                                                            fontFamily: 'JalnanGothic',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            카카오페이
                                                        </Typography>
                                                    }
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',  // Align items vertically centered
                                                    }}
                                                />
                                                <FormControlLabel
                                                    value="Other"
                                                    control={
                                                        <Radio/>}
                                                    label={
                                                        <Typography style={{
                                                            fontFamily: 'JalnanGothic',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            기타 결제수단
                                                        </Typography>
                                                    }
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center'  // Align items vertically centered
                                                    }}
                                                />
                                            </RadioGroup>
                                        </FormControl>
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

export default OrderComponent;
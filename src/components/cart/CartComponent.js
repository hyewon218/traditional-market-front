import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../MD/MDBox";
import MDTypography from "../MD/MDTypography";
import {deleteCartItem, postCartOrder} from "../../api/cartApi";
import MDButton from "../MD/MDButton";
import {useNavigate} from "react-router";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {useMediaQuery} from "@mui/material";

const CartComponent = () => {
    const navigate = useNavigate();
    const {isAuthorization, userId} = useCustomLogin()
    const {refreshCart, cartItems, changeCart} = useCustomCart()
    const [counts, setCounts] = useState({}); // 각 장바구니 항목의 수량을 관리하기 위해
    const [currentImageIndexes, setCurrentImageIndexes] = useState({}); // State for image index

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const total = useMemo(() => {
        let total = 0
        //console.log("Calculating total for cartItems :", cartItems); // 디버깅 로그 추가
        for (const item of cartItems) {
            //console.log("item :", item); // 디버깅 로그 추가
            total += item.price * (counts[item.cartItemNo]
                || item.initialCount);
        }
        return total
    }, [cartItems, counts]);

    const handleClickQty = (cartItemNo, amount, itemNo) => {
        const newCount = (counts[cartItemNo] || 0) + amount;
        if (newCount < 1) {
            return;
        } // 수량이 1보다 작아지지 않도록 방지
        //setCounts(newCount); // 로컬 상태 업데이트
        setCounts(prevCounts => ({
            ...prevCounts,
            [cartItemNo]: newCount
        }));
        changeCart({cartItemNo, itemNo, count: newCount})
    }

    const handleDeleteCartItem = (cartItemNo) => {
        console.log('handleDeleteCartItem');
        const userConfirmed = window.confirm("장바구니 상품을 삭제하시겠습니까?");
        if (userConfirmed) {
            deleteCartItem(cartItemNo).then(data => {
                refreshCart(); // Refresh the cart after deletion
            }).catch(error => {
                console.error("장바구니 상품 삭제에 실패했습니다.", error);
            });
        } else {
            console.log('Deletion canceled by user.');
        }
    }

    const handleClickOrder = () => {
        const cartOrderDtoList = cartItems.map(cartItem => ({
            cartItemNo: cartItem.cartItemNo
        }));
        postCartOrder(cartOrderDtoList).then(data => {
            console.log('상품 주문 성공!!!');
            console.log(data);
            navigate('/order');
        }).catch(error => {
            console.error("상품 주문에 실패했습니다.", error);
        });
    };

    const handlePreviousImage = (cartItemNo) => {
        setCurrentImageIndexes(prev => {
            const currentIndex = prev[cartItemNo] || 0;
            const imageListLength = cartItems.find(
                item => item.cartItemNo === cartItemNo).imageList.length;
            return {
                ...prev,
                [cartItemNo]: (currentIndex - 1 + imageListLength)
                % imageListLength // Wrap around
            };
        });
    };

    const handleNextImage = (cartItemNo) => {
        setCurrentImageIndexes(prev => {
            const currentIndex = prev[cartItemNo] || 0;
            const imageListLength = cartItems.find(
                item => item.cartItemNo === cartItemNo).imageList.length;
            return {
                ...prev,
                [cartItemNo]: (currentIndex + 1) % imageListLength // Wrap around
            };
        });
    };

    useEffect(() => {
        if (isAuthorization) {
            refreshCart();
        }
    }, []);

    useEffect(() => { // 장바구니 상품 초기 갯수 설정
        const initialCounts = cartItems.reduce((acc, cartItem) => {
            acc[cartItem.cartItemNo] = cartItem.initialCount;
            return acc;
        }, {});
        setCounts(initialCounts);
    }, [cartItems]);

    return (
        <DashboardLayout>
            <MDBox
                sx={{
                    mt: {xs:-3, sm:-3, md:1, lg:1},
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <MDBox pb={isSmallScreen ? 2 : 3}>
                            <Card>
                                <MDBox pt={isSmallScreen ? 1 : 2} pb={isSmallScreen ? 1 : 2} px={3}>
                                    <Grid container alignItems="center">
                                        <Grid item xs={10}>
                                            <MDTypography
                                                sx={{ fontSize: isSmallScreen ? '0.9rem':'1.2rem' }}
                                                fontWeight="bold"
                                                variant="body2">
                                                {userId}님의 장바구니
                                            </MDTypography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <MDTypography
                                                sx={{
                                                    fontSize: isSmallScreen ? '0.7rem':'1.2rem',
                                            }}
                                                variant="body2"
                                                textAlign="right">
                                                <div
                                                    className="bg-orange-600 text-center text-white font-bold rounded-full m-1">
                                                    {cartItems.length}
                                                </div>
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                            </Card>
                        </MDBox>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 20 }}>
                        {cartItems.length > 0 && (
                            <MDBox pb={3}>
                                <Card>
                                    <MDBox pt={2}>
                                        <Grid container spacing={isSmallScreen ? 0 : 2}>
                                            <Grid item xs={12} sm={12} md={7} lg={7}>
                                                <ul>
                                                    {cartItems.map(cartItem => {
                                                        const currentImageIndex = currentImageIndexes[cartItem.cartItemNo]
                                                            || 0;
                                                        return (
                                                            <li key={cartItem.cartItemNo}
                                                                className="border-2 rounded-2"
                                                                style={{
                                                                    marginBottom: '16px',
                                                                    marginLeft: isSmallScreen ? '-15px' :'-10px',
                                                                    marginRight: isSmallScreen ? '18px' :'0px',
                                                                }}>
                                                                <MDBox pt={2}
                                                                       px={2}
                                                                       pb={2}
                                                                >
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={1.5}>
                                                                            <MDTypography
                                                                                fontWeight="bold"
                                                                                variant="body2">
                                                                                <button
                                                                                    style={{
                                                                                        padding: '2px 4px',
                                                                                        fontSize: isSmallScreen ? '0.7rem' :'0.875rem',
                                                                                        color: 'white',
                                                                                        backgroundColor: '#f56565', // Red color
                                                                                        width: isSmallScreen ? '18px' :'24px',  // Smaller width
                                                                                        height: isSmallScreen ? '18px' :'24px', // Smaller height
                                                                                        borderRadius: '0.5rem', // Rounded corners
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',

                                                                                    }}
                                                                                    onClick={() => handleDeleteCartItem(
                                                                                        cartItem.cartItemNo)}
                                                                                >
                                                                                    X
                                                                                </button>
                                                                            </MDTypography>
                                                                        </Grid>
                                                                        <Grid item xs={5.5}>
                                                                            <div
                                                                                style={{
                                                                                    position: 'relative',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center'
                                                                                }}>
                                                                                {cartItem.imageList.length
                                                                                    > 1
                                                                                    && (
                                                                                        <IconButton
                                                                                            onClick={() => handlePreviousImage(
                                                                                                cartItem.cartItemNo)}
                                                                                            style={{
                                                                                                position: 'absolute',
                                                                                                left: isSmallScreen ? '0px':'50px'
                                                                                            }}
                                                                                            disabled={cartItem.imageList.length
                                                                                                <= 1}
                                                                                        >
                                                                                            <KeyboardArrowLeftIcon/>
                                                                                        </IconButton>
                                                                                    )}
                                                                                <img
                                                                                    alt="product"
                                                                                    src={cartItem.imageList[currentImageIndex].imageUrl}
                                                                                    style={{
                                                                                        maxWidth: '100%',
                                                                                        maxHeight: '150px'
                                                                                    }}
                                                                                />
                                                                                {cartItem.imageList.length
                                                                                    > 1
                                                                                    && (
                                                                                        <IconButton
                                                                                            onClick={() => handleNextImage(
                                                                                                cartItem.cartItemNo)}
                                                                                            style={{
                                                                                                position: 'absolute',
                                                                                                right: isSmallScreen ? '0px':'50px'
                                                                                            }}
                                                                                            disabled={cartItem.imageList.length
                                                                                                <= 1}
                                                                                        >
                                                                                            <KeyboardArrowRightIcon/>
                                                                                        </IconButton>
                                                                                    )}
                                                                            </div>
                                                                        </Grid>
                                                                        <Grid item xs={5}>
                                                                            <MDTypography
                                                                                fontWeight="bold"
                                                                                sx={{fontSize: isSmallScreen ? '1.2rem' : '1.5rem'}}
                                                                                variant="body2">
                                                                                {cartItem.itemName}
                                                                            </MDTypography>
                                                                            <MDTypography
                                                                                fontWeight="bold"
                                                                                sx={{fontSize: isSmallScreen ? '1rem' :'2rem'}}
                                                                                variant="body2">
                                                                                {cartItem.price
                                                                                    * (counts[cartItem.cartItemNo]
                                                                                        || cartItem.initialCount)}원
                                                                            </MDTypography>
                                                                            <Grid
                                                                                container
                                                                                sx={{mt: 2}}>
                                                                                <Grid
                                                                                    item
                                                                                    xs={isSmallScreen ? 4 : 2}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        variant="body2">
                                                                                        <button
                                                                                            className="m-1 p-0.5 text-sm bg-purple-200 text-purple-700 w-6 rounded-lg"
                                                                                            onClick={() => handleClickQty(
                                                                                                cartItem.cartItemNo,
                                                                                                -1,
                                                                                                cartItem.itemNo)}
                                                                                        >
                                                                                            -
                                                                                        </button>
                                                                                    </MDTypography>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={1}
                                                                                    sx={{mt: 0.5}}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        variant="body2">
                                                                                        {counts[cartItem.cartItemNo]
                                                                                            || cartItem.initialCount}
                                                                                    </MDTypography>
                                                                                </Grid>
                                                                                <Grid
                                                                                    item
                                                                                    xs={isSmallScreen ? 3 : 2}>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        variant="body2">
                                                                                        <button
                                                                                            className="m-1 p-0.5 text-sm bg-purple-200 text-purple-700 w-6 rounded-lg"
                                                                                            onClick={() => handleClickQty(
                                                                                                cartItem.cartItemNo,
                                                                                                +1,
                                                                                                cartItem.itemNo)}
                                                                                        >
                                                                                            +
                                                                                        </button>
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
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={5} lg={5}
                                                  sx={{
                                                      paddingRight: isSmallScreen ? '0px' : '26px'
                                                  }}>
                                                <div className="w-full"
                                                     style={{marginBottom: isSmallScreen ? '15px': '30px'}}>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        sx={{
                                                            fontSize: isSmallScreen ? '1.3rem':'2rem',
                                                            paddingTop: '9px',
                                                            paddingLeft: isSmallScreen ? '23px' : '13px'
                                                        }}
                                                        variant="body2">
                                                        총 가격 : {total}
                                                    </MDTypography>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}>
                                                    <MDButton
                                                        onClick={handleClickOrder}
                                                        variant="gradient"
                                                        size="large"
                                                        sx={{
                                                            backgroundColor: '#50bcdf',
                                                            color: '#ffffff',
                                                            fontSize: isSmallScreen ? '1.3rem' : '2rem',
                                                            fontFamily: 'JalnanGothic',
                                                            padding: isSmallScreen ? '10px 20px' : '10px 20px',
                                                            width: '100%',
                                                            lineHeight: isSmallScreen ? 2 : 2,
                                                            minHeight: 'auto'
                                                        }}
                                                    >
                                                        주문하기
                                                    </MDButton>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        )}
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default CartComponent;
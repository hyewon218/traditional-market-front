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

const CartComponent = () => {
    const navigate = useNavigate();
    const {isAuthorization, userId} = useCustomLogin()
    const {refreshCart, cartItems, changeCart} = useCustomCart()
    const [counts, setCounts] = useState({}); // 각 장바구니 항목의 수량을 관리하기 위해

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

    const buttonStyle = {
        backgroundColor: '#50bcdf',
        color: '#ffffff',
        fontSize: '2rem',
        fontFamily: 'JalnanGothic',
        padding: '20px 40px',
        width: '660px',
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
                                            {userId}님의 장바구니
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <MDTypography
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
                <Grid item xs={12}>
                    {cartItems.length > 0 && (
                        <>
                            <MDBox pb={3}>
                                <Card>
                                    <MDBox pt={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={7}>
                                                <div>
                                                    <ul>
                                                        {/* cartItems 가 배열인 경우에만 map 함수를 실행 */}
                                                        {Array.isArray(
                                                                cartItems)
                                                            && cartItems.map(
                                                                cartItem =>
                                                                    <li key={cartItem.cartItemNo}
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
                                                                                        <button
                                                                                            className="m-1 p-1 text-xl text-white bg-red-500 w-8 rounded-lg"
                                                                                            onClick={() => handleDeleteCartItem(
                                                                                                cartItem.cartItemNo)}
                                                                                        >
                                                                                            X
                                                                                        </button>
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
                                                                                        className="m-1 p-1">
                                                                                        {cartItem.imageList.map(
                                                                                            (cartItem,
                                                                                                i) =>
                                                                                                <img
                                                                                                    alt="product"
                                                                                                    key={i}
                                                                                                    /* className="p-4 w-1/2"*/
                                                                                                    src={`${cartItem.imageUrl}`}/>
                                                                                        )}
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
                                                                                        {cartItem.itemName}
                                                                                    </MDTypography>
                                                                                    <MDTypography
                                                                                        fontWeight="bold"
                                                                                        sx={{fontSize: '3rem'}}
                                                                                        variant="body2">
                                                                                        {cartItem.price
                                                                                            * (counts[cartItem.cartItemNo]
                                                                                                || cartItem.initialCount)}원
                                                                                    </MDTypography>
                                                                                    <Grid
                                                                                        container
                                                                                        sx={{mt: 3}}>
                                                                                        <Grid
                                                                                            item
                                                                                            xs={2}>
                                                                                            <MDTypography
                                                                                                fontWeight="bold"
                                                                                                variant="body2">
                                                                                                <button
                                                                                                    className="m-1 p-1 text-1xl bg-orange-500 w-8 rounded-lg"
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
                                                                                            sx={{mt: 1}}>
                                                                                            <MDTypography
                                                                                                fontWeight="bold"
                                                                                                variant="body2">
                                                                                                {counts[cartItem.cartItemNo]
                                                                                                    || cartItem.initialCount}
                                                                                            </MDTypography>
                                                                                        </Grid>
                                                                                        <Grid
                                                                                            item
                                                                                            xs={2}>
                                                                                            <MDTypography
                                                                                                fontWeight="bold"
                                                                                                variant="body2">
                                                                                                <button
                                                                                                    className="m-1 p-1 text-1xl bg-orange-500 w-8 rounded-lg"
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
                                                            )}
                                                    </ul>
                                                </div>
                                            </Grid>
                                            <Grid item xs={5}
                                                  sx={{paddingRight: '26px'}}>
                                                <div
                                                    className="w-full"
                                                    style={{marginBottom: '20px'}}>
                                                    <MDTypography
                                                        fontWeight="bold"
                                                        sx={{
                                                            fontSize: '2rem',
                                                            paddingTop: '9px',
                                                            paddingLeft: '13px'
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
                                                        sx={buttonStyle}
                                                    >주문하기
                                                    </MDButton>
                                                </div>

                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </MDBox>
                        </>
                    )}
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}

export default CartComponent;
import * as React from "react";
import {useEffect, useMemo} from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "../MD/MDBox";
import MDTypography from "../MD/MDTypography";
import CartItemComponent from "./CartItemComponent";

const CartComponent = () => {

    const {isLogin, loginState} = useCustomLogin()
    const {refreshCart, cartItems, changeCart} = useCustomCart()

    const total = useMemo(() => {
        let total = 0
        //console.log("Calculating total for cartItems :", cartItems); // 디버깅 로그 추가
        for (const item of cartItems) {
            //console.log("item :", item); // 디버깅 로그 추가
            total += item.price * item.initialCount
        }
        return total
    }, [cartItems])


    useEffect(() => {
        if (isLogin) {
            refreshCart();
        }
    }, [isLogin, cartItems]); /*TODO : cartItems 주의!!*/

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
                                                    {loginState.memberId}님의
                                                    장바구니
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
                            <MDBox pb={3}>
                                <Card>
                                    <MDBox pt={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={7}>
                                                <div>
                                                    <ul>
                                                        {/* cartItems 가 배열인 경우에만 map 함수를 실행 */}
                                                        {Array.isArray(cartItems)
                                                            && cartItems.map(
                                                                item =>
                                                                    <CartItemComponent {...item}
                                                                                       key={item.cartItemNo}
                                                                                       changeCart={changeCart}
                                                                                       memberId={loginState.memberId}/>
                                                            )}
                                                    </ul>
                                                </div>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <div
                                                    className="w-full border-2 rounded-2">
                                                    <div className=" m-1 p-1 ">
                                                        TOTAL: {total}
                                                    </div>
                                                </div>
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

export default CartComponent;
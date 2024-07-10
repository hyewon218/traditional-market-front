import * as React from "react";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import MDTypography from "../MD/MDTypography";
import MDBox from "../MD/MDBox";
import {deleteCartItem} from "../../api/cartApi";

const CartItemComponent = ({
    cartItemNo,
    itemNo,
    itemName,
    price,
    initialCount,
    imageUrl,
    changeCart,
    memberId
}) => {
    const [count, setCount] = useState(initialCount);

    const handleClickQty = (amount) => {
        const newCount = count + amount;
        if (newCount < 1) return; // Prevent count from going below 1
        setCount(newCount); // 로컬 상태 업데이트
        changeCart({ memberId, cartItemNo, itemNo, count: newCount })
    }

    const handleDeleteCartItem = (cino) => {
        console.log('handleDeleteCartItem');
        deleteCartItem(cino).then(data => {
            window.confirm("장바구니 상품이 삭제되었습니다.")
        }).catch(error => {
            console.error("카트상품 삭제에 실패했습니다.", error);
        });
    }

    return (
        <li key={cartItemNo} className="border-2 rounded-2"
            style={{marginBottom: '16px'}}>
            <MDBox pt={2} px={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MDTypography fontWeight="bold"
                                      variant="body2">
                            <button
                                className="m-1 p-1 text-xl text-white bg-red-500 w-8 rounded-lg"
                                onClick={() => handleDeleteCartItem(cartItemNo)}
                            >
                                X
                            </button>
                        </MDTypography>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <div className=" m-1 p-1 ">
                            <img src={`${imageUrl}`}/>
                        </div>
                    </Grid>
                    <Grid item xs={5} sx={{mt: 3}}>
                        <MDTypography fontWeight="bold"
                                      sx={{fontSize: '2.5rem'}}
                                      variant="body2">
                            {itemName}
                        </MDTypography>
                        <MDTypography fontWeight="bold"
                                      sx={{fontSize: '3rem'}}
                                      variant="body2">
                            {count * price}원
                        </MDTypography>
                        <Grid container sx={{mt: 3}}>
                            <Grid item xs={2}>
                                <MDTypography fontWeight="bold"
                                              variant="body2">
                                    <button
                                        className="m-1 p-1 text-1xl bg-orange-500 w-8 rounded-lg"
                                        onClick={() => handleClickQty(-1)}
                                    >
                                        -
                                    </button>
                                </MDTypography>
                            </Grid>
                            <Grid item xs={1} sx={{mt: 1}}>
                                <MDTypography fontWeight="bold"
                                              variant="body2">
                                    {count}
                                </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <MDTypography fontWeight="bold"
                                              variant="body2">
                                    <button
                                        className="m-1 p-1 text-1xl bg-orange-500 w-8 rounded-lg"
                                        onClick={() => handleClickQty(1)}
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
}

export default CartItemComponent;

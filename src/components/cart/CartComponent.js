import {useEffect, useMemo} from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";
import CartItemComponent from "../cart/CartItemComponent";

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
            refreshCart()
        }
    }, [isLogin, cartItems])

    return (
        <div className="w-full">
            {isLogin ?

                <div className="flex flex-col">

                    <div className="w-full flex">
                        <div className="font-extrabold text-2xl w-4/5">
                            {loginState.memberId}'s Cart
                        </div>
                        <div
                            className="bg-orange-600 text-center text-white font-bold w-1/5 rounded-full m-1">
                            {cartItems.length}
                        </div>
                    </div>

                    <div>
                        <ul>
                            {Array.isArray(cartItems) && cartItems.map(item =>
                                <CartItemComponent {...item}
                                                   key={item.cartItemNo}
                                                   changeCart={changeCart}
                                                   memberId={loginState.memberId}/>
                            )}
                        </ul>
                    </div>

                    <div>
                        <div className="text-2xl text-right font-extrabold">
                            TOTAL: {total}
                        </div>
                    </div>


                </div>
                :
                <></>
            }

        </div>
    );
}

export default CartComponent;
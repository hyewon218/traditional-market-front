import CartComponent from "../../components/cart/CartComponent";
import useCustomLogin from "../../hooks/useCustomLogin";

function Cart() {

    const {moveToLoginReturn, isAuthorization} = useCustomLogin() // 로그인이 필요한 페이지

    if(!isAuthorization){
        return moveToLoginReturn()
    }

    return (
        <CartComponent/>
    )
}

export default Cart;

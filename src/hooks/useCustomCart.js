import { useDispatch, useSelector } from "react-redux"
import {
    addCartAsync,
    getCartItemsAsync,
    patchChangeCartAsync
} from "../slices/cartSlice"

const useCustomCart = () => {

    const cartItems = useSelector(state => state.cartSlice)

    const dispatch = useDispatch()

    const refreshCart = () => {
        dispatch(getCartItemsAsync())
    }

    const changeCart = (param) => {
        dispatch(patchChangeCartAsync(param))
    }

    const addCart = (param) => {
        dispatch(addCartAsync(param))
    }

    return  {cartItems, refreshCart, changeCart, addCart}
}

export default useCustomCart
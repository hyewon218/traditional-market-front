import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"

const host = `${API_SERVER_HOST}/api`

export const getCartItems = async () => {
    const res = await axios.get(`${host}/cartitems`)
    //console.log("카트 아이템 조회 : " + res.data)
    return res.data
}

export const patchChangeCart = async (cartItem) => {
    const data = {
        itemNo: cartItem.itemNo,
        count: cartItem.count
    }
    const res = await axios.patch(`${host}/cartitems/${cartItem.cartItemNo}`,
        data)
    console.log("카트 아이템 수정 : " + res.data)
    return res.data
}

export const addCart = async (cartItem) => {
    const data = {
        itemNo: cartItem.itemNo,
        count: cartItem.count
    }
    const res = await axios.post(`${host}/carts`, data)
    console.log("아이템 카트에 추가 : " + res.data)
    return res.data
}

export const deleteCartItem = async (cino) => {
    const res = await axios.delete(`${host}/cartitems/${cino}`)
    return res.data
}

export const postCartOrder = async (cartOrderDtoList) => { // 장바구니 상품 주문
    const res = await axios.post(`${host}/carts/order`, cartOrderDtoList);
    console.log("주문 : " + res.data);
    return res.data;
};
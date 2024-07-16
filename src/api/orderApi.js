import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/orders`
const orderItemPrefix = `${API_SERVER_HOST}/api/orderitems`

export const postOrder = async (orderItem) => { // 단품 주문
    const data = {
        itemNo: orderItem.itemNo,
        count: orderItem.count
    }
    const res = await axios.post(`${prefix}`, data)
    console.log("주문 : " + res.data)
    return res.data
}

export const getOrderList = async (ono, pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const getOrderItemList = async () => { // 가장 최근 주문의 상품 목록
    const res = await axios.get(`${orderItemPrefix}`)
    return res.data
}

export const cancelOrder = async (ono) => {
    const res = await axios.delete(`${prefix}/${ono}`)
    return res.data
}


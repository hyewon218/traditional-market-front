import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/orders`
const orderItemPrefix = `${API_SERVER_HOST}/api/orderitems`

export const postOrder = async (orderItem) => { // 단품 주문
    const header = {headers: {"Content-Type": "application/json"}}
    const data = {
        itemNo: orderItem.itemNo,
        count: 1
    }
    const res = await axios.post(`${prefix}`, data, header)
    console.log("주문 : " + res.data)
    return res.data
}

export const putSelectedDelivery = async (selectedDelivery) => { // 주문 시 배송지 저장
    const header = {headers: {"Content-Type": "application/json"}}
    const data = {
        deliveryAddr: selectedDelivery
    }
    const res = await axios.put(`${prefix}/delivery`, data, header)
    return res.data
}

export const getOrder = async (ono) => {
    const res = await axios.get(`${prefix}`)
    return res.data
}

export const getOrderList = async (ono, pageParam) => { // 내정보 전체 주문 목록
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const getOrderItemList = async () => { // 가장 최근 주문의 상품 목록(주문페이지)
    const res = await axios.get(`${orderItemPrefix}`)
    return res.data
}

export const cancelOrder = async (ono) => {
    const res = await axios.delete(`${prefix}/${ono}`)
    return res.data
}



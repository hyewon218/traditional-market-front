import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefix = `${API_SERVER_HOST}/api/orders`
const prefixApi = `${API_SERVER_HOST}/api`
const orderItemPrefix = `${API_SERVER_HOST}/api/orderitems`

//export const postOrder = async (orderItem) => { // 단품 주문
//    const header = {headers: {"Content-Type": "application/json"}}
//    const data = {
//        itemNo: orderItem.itemNo,
//        count: 1
//    }
//    const res = await axios.post(`${prefix}`, data, header)
//    console.log("주문 : " + res.data)
//    return res.data
//}

// API 호출을 위한 단품 주문 함수
export const postOrder = async (orderItem) => {
    const header = { headers: { "Content-Type": "application/json" } }
    const data = {
        itemNo: orderItem.itemNo,
        count: orderItem.count // 수량을 동적으로 처리
    }
    const res = await axios.post(`${prefix}`, data, header)
    console.log("주문 : " + res.data)
    return res.data
}

export const putSelectedDelivery = async (deliveryAddr, deliveryMessage, receiver, phone) => { // 주문 시 배송지 저장
    const header = {headers: {"Content-Type": "application/json"}}
    const data = {
        receiver: receiver,
        phone: phone,
        deliveryAddr: deliveryAddr,
        deliveryMessage: deliveryMessage
    }
    const res = await axios.put(`${prefix}/delivery`, data, header)
    console.log('저장된 배송지 Data : ', res);
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

export const cancelOrder = async (ono, orderStatus, returnMessage) => { // 주문 취소 (카카오 결제 승인 취소 X, 상품 판매량, 총판매액 및 재고만 증가)
    const res = await axios.post(`${prefix}/${ono}/cancel`, null, {
        params: {
            orderStatus, returnMessage
        }
    })
    return res.data
}

export const cancelOrderKakao = async (ono, orderStatus, returnMessage) => { // 주문 취소 (카카오 결제 승인 취소, 환불 + 상품 판매량, 총판매액 및 재고 증가)
    const res = await axios.post(`${prefixApi}/payment/cancel/${ono}`, null, {
        params: {
            orderStatus, returnMessage
        }
    });
    return res.data
}

export const getCompleteOrderList = async (pageParam) => { // CANCEL 제외한 본인의 모든 주문 목록
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}-page`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const getCancelOrderList = async (pageParam) => { // 본인의 CANCEL 주문 목록 조회
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}-page/cancel`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const deleteOrder = async (ono) => { // 주문 삭제
    const res = await axios.delete(`${prefix}/${ono}`)
    return res.data
}

export const getOrderListSeller = async (pageParam) => { // CANCEL 제외한 판매자가 자신이 소유한 상점의 상품들에 대한 주문 목록 조회 (판매자만 가능)
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}-page-seller`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const getOrderStatusListSeller = async (orderstatus, pageParam) => { // 판매자가 자신이 소유한 상점의 상품들에 대한 주문 상태별 조회 (판매자만 가능)
    const {page, size, sort} = pageParam
    const res = await axios.get(`${prefix}-page-seller/status`, {
        params:
            {page: page, size: size, orderStatus: orderstatus, sort: sort}
    })
    return res.data
}

export const getOrderListSearchSeller = async (pageParam, searchQuery, searchType) => { // 주문 검색 (판매자의 상점에 속한 상품들이 포함된 주문만 조회)
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/orders/search/seller`, {
        params:
            {page: page, size: size, keyword: searchQuery, type: searchType}
    })
    return res.data
}
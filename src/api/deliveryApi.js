import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/deliveries`

export const postDelivery = async (deliveryData) => { // 배송지 추가
    const header = {headers: {"Content-Type": "application/json"}}
    const res = await axios.post(`${prefix}`, JSON.stringify(deliveryData), header)
    return res.data
}

export const getDeliveryList = async () => { // 배송지 목록 조회
    const res = await axios.get(`${prefix}`)
    return res.data
}

export const putDeliveryPrimary = async (dno) => { // 기본 배송지 설정
    const res = await axios.put(`${prefix}/primary/${dno}`)
    return res.data
}
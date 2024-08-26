import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/deliveries`

export const postDelivery = async (formData) => { // 배송지 추가
    const header = {headers: {"Content-Type": "application/json"}}
    const res = await axios.post(`${prefix}`, formData, header)
    return res.data
}

export const getDeliveryList = async (pageParam) => { // 배송지 목록 조회
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const putDelivery = async (dno, formData) => { // 배송지 수정
    const header = {headers: {"Content-Type": "application/json"}}
    const res = await axios.put(`${prefix}/${dno}`, formData, header)
    return res.data
}

export const deleteDelivery = async (dno) => { // 배송지 삭제
    const res = await axios.delete(`${prefix}/${dno}`)
    return res.data
}

export const getPrimaryDelivery = async () => { // 기본 배송지 조회
    const res = await axios.get(`${prefix}/primary`)
    return res.data
}

export const putDeliveryPrimary = async (dno) => { // 기본 배송지 설정
    const res = await axios.put(`${prefix}/primary/${dno}`)
    return res.data
}

export const putDeliveryDelPrimary = async () => { // 기본 배송지 해제
    const res = await axios.put(`${prefix}/delprimary`)
    return res.data
}

import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/deliverymessage`

export const postDeliveryMessage = async (formData) => { // 배송메시지 추가
    const header = {headers: {"Content-Type": "application/json"}}
    const res = await axios.post(`${prefix}`, formData, header)
    return res.data
}

export const getDeliveryMessage = async () => { // 배송메시지 목록 조회
    const res = await axios.get(`${prefix}`)
    return res.data
}

export const deleteDeliveryMessage = async (dno) => { // 배송지 삭제
    const res = await axios.delete(`${prefix}/${dno}`)
    return res.data
}

import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/payment`

export const postPay = async () => { // 결제 요청
    const res = await axios.post(`${prefix}/ready`)
    console.log("결제 : " + res.data)
    return res.data
}
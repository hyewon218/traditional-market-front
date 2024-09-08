import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefix = `${API_SERVER_HOST}/api/payment`

export const postPay = async () => { // 결제 요청
    const res = await axios.post(`${prefix}/ready`)
    console.log("결제 : " + res.data)
    return res.data
}
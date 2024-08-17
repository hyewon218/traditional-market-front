import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefixApi = `${API_SERVER_HOST}/api/notifications`


export const getNotificationList = async () => { // 알람 목록 조회
    const res = await axios.get(`${prefixApi}`, {
    })
    return res.data
}

export const getNotificationCount = async () => { // 알람 수 조회
    const res = await axios.get(`${prefixApi}/count`, {
    })
    return res.data
}
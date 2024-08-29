import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefixApi = `${API_SERVER_HOST}/api/notifications`


export const getNotificationList = async (pageParam) => { // 알람 목록 조회
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}`, {
        params:
            {page: page, size: size}
    });
    return res.data
}

export const getNotificationCount = async () => { // 읽지 않은 알람 수 조회
    const res = await axios.get(`${prefixApi}/count`, {
    })
    return res.data
}

/*알람 읽음 상태로 변경*/
export const putIsRead = async (nno) => {
    const res = await axios.put(`${prefixApi}/${nno}/read`)
    return res.data
}

/*알람 읽음 여부 조회*/
export const getIsRead = async (nno) => {
    const res = await axios.get(`${prefixApi}/${nno}/read`)
    return res.data
}
import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefixApi = `${API_SERVER_HOST}/api/members`

axios.defaults.withCredentials = true; // withCredentials 전역 설정 (쿠키 공유를 허락)

export const loginPost = async (loginParam) => {
    const header = {headers: {"Content-Type": "application/json"}}
    let data = {
        memberId: loginParam.memberId,
        memberPw: loginParam.memberPw
    }
    const res = await axios.post(`${prefixApi}/login`, JSON.stringify(data), header)
    console.log(JSON.stringify(data))
    return res.data
}

export const logoutPost = async () => {
    const res = await axios.post(`${prefixApi}/logout`)
    return res.data
}

export const getMemberList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}`, {
        params:
            {page: page, size: size}
    })
    return res.data
}


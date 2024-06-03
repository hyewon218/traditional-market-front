import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"

const host = `${API_SERVER_HOST}/api/members`

export const loginPost = async (loginParam) => {

    const header = {headers: {"Content-Type": "application/json"}}

    let data = {
        memberId: loginParam.memberId,
        memberPw: loginParam.memberPw
    }

    const res = await axios.post(`${host}/login`, JSON.stringify(data), header)

    return res.data

}
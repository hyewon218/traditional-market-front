import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefixApi = `${API_SERVER_HOST}/api/inquiryanswer`

export const postInquiryAnswer = async (iqno, formData) => { // 특정 문의사항에 대한 답변 생성
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.post(`${prefixApi}/${iqno}`, formData, header)
    return res.data
}

export const getInquiryAnswer = async (iqno) => { // 특정 문의사항에 대한 답변 조회
    const res = await axios.get(`${prefixApi}/${iqno}`)
    return res.data
}
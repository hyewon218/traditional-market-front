import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefixApi = `${API_SERVER_HOST}/api/inquiries`

export const postInquiry = async (formData) => { // 문의사항 생성
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.post(`${prefixApi}`, formData, header)
    return res.data
}

export const getAllMyInquiries = async (pageParam) => { // 본인의 문의사항 목록 조회(본인만)
    const {page, size, sort} = pageParam
    const res = await axios.get(`${prefixApi}/m`, {
        params:
            {page: page, size: size, sort: sort}
    });
    return res.data
}

export const getInquiryOne = async (iqno) => { // 특정 문의사항 조회
    const res = await axios.get(`${prefixApi}/${iqno}`)
    return res.data
}

export const deleteInquiry = async (iqno) => { // 문의사항 삭제
    const res = await axios.delete(`${prefixApi}/${iqno}`)
    return res.data
}


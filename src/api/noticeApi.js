import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefixApi = `${API_SERVER_HOST}/api/notices`

export const postNotice = async (formData) => { // 공지사항 생성
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.post(`${prefixApi}`, formData, header)
    return res.data
}

export const getAllNotice = async (pageParam) => { // 전체 공지사항 목록 조회
    const {page, size, sort} = pageParam
    const res = await axios.get(`${prefixApi}`, {
        params:
            {page: page, size: size, sort: sort}
    });
    return res.data
}

export const getNoticeListSearch = async (pageParam, searchQuery) => { // 공지사항 검색
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/search`, {
        params:
            {page: page, size: size, keyword: searchQuery}
    })
    return res.data
}

export const getNotice = async (nno) => { // 특정 공지사항 조회
    const res = await axios.get(`${prefixApi}/${nno}`)
    return res.data
}

export const putNotice = async (nno, formData) => { // 공지사항 수정
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.put(`${prefixApi}/${nno}`, formData, header)
    return res.data
}

export const deleteNotice = async (nno) => { // 공지사항 삭제
    const res = await axios.delete(`${prefixApi}/${nno}`)
    return res.data
}

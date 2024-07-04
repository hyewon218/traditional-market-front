import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/markets`

export const postMarket = async (formData) => {
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.post(`${prefix}`, formData, header)
    return res.data
}

export const getOne = async (mno) => {
    const res = await axios.get(`${prefix}/${mno}`)
    return res.data
}

export const getList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const putMarket = async (formData) => {
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const mno = formData.get('marketNo'); // Get the marketNo from FormData
    const res = await axios.put(`${prefix}/${mno}`, formData, header)
    return res.data
}

export const deleteMarket = async (mno) => {
    const res = await axios.delete(`${prefix}/${mno}`)
    return res.data
}

// 댓글
export const postMarketComment = async (data) => {
    const res = await axios.post(`${prefix}/comments`, data)
    return res.data
}

export const getMarketComments = async (mno, pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/${mno}/comments`,{
        params:
        {page: page, size: size}
    })
    return res.data
}

export const postMarketLike = async (mno) => {
    const res = await axios.post(`${prefix}/${mno}/likes`)
    return res.data
}
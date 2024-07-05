import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/shops`
const prefixApi = `${API_SERVER_HOST}/api`

export const postShop = async (formData) => {
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.post(`${prefix}`, formData, header)
    return res.data
}

export const getShopOne = async (sno) => {
    const res = await axios.get(`${prefix}/${sno}`)
    return res.data
}

export const getShopList = async (sno, pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/${sno}/shops`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const putShop = async (sno, market) => {
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.put(`${prefix}/${sno}`, market, header)
    return res.data
}

export const deleteShop = async (sno) => {
    const res = await axios.delete(`${prefix}/${sno}`)
    return res.data
}

export const postShopComment = async (data) => {
    const res = await axios.post(`${prefix}/comments`, data)
    return res.data
}

export const getShopComments = async (sno, pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/${sno}/comments`,{
        params:
        {page: page, size: size}
    })
    return res.data
}

export const postShopLike = async (sno) => {
    const res = await axios.post(`${prefix}/${sno}/likes`)
    return res.data
}
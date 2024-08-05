import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/items`
const prefixApi = `${API_SERVER_HOST}/api`

export const postItem = async (formData) => {
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.post(`${prefix}`, formData, header)
    return res.data
}

export const getItemOne = async (ino) => {
    const res = await axios.get(`${prefix}/${ino}`)
    return res.data
}

export const getItemList = async (sno, pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/${sno}/items`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const getListCategory = async (mno, category) => {
    const res = await axios.get(`${prefixApi}/${mno}/items/category`, {
        params:
            {category: category}
    })
    return res.data
}

export const getListTopFiveItem = async (mno, itemName) => {
    const res = await axios.get(`${prefixApi}/${mno}/items/rank`, {
        params:
            {itemName: itemName}
    })
    return res.data
}

export const putItem = async (ino, formData) => {
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.put(`${prefix}/${ino}`, formData, header)
    return res.data
}

export const deleteItem = async (ino) => {
    const res = await axios.delete(`${prefix}/${ino}`)
    return res.data
}

/*댓글*/
export const postItemComment = async (data) => {
    const res = await axios.post(`${prefix}/comments`, data)
    return res.data
}

export const getItemComments = async (ino, pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/${ino}/comments`,{
        params:
        {page: page, size: size}
    })
    return res.data
}

/*좋아요*/
export const postItemLike = async (ino) => {
    const res = await axios.post(`${prefix}/${ino}/likes`)
    return res.data
}

export const getItemLike = async (ino) => { // 좋아요 여부 확인
    const res = await axios.get(`${prefix}/${ino}/likes`)
    return res.data
}

export const cancelItemLike = async (ino) => { // 좋아요 취소
    const res = await axios.delete(`${prefix}/${ino}/likes`)
    return res.data
}
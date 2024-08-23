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

export const getListCategoryByShop = async (sno, pageParam, category) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/${sno}/items/category-by-shop`, {
        params:
            {page: page, size: size, category: category}
    })
    return res.data
}

export const getListCategoryByMarket = async (mno, category) => {
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
    const res = await axios.get(`${prefix}/${ino}/comments`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const putItemComment = async (cno, updatedComment) => {
    const header = {headers: {"Content-Type": "application/json"}}
    const data = {
        comment: updatedComment
    }
    const res = await axios.put(`${prefix}/comments/${cno}`,
        JSON.stringify(data), header)
    return res.data
}

export const deleteItemComment = async (cno) => {
    const res = await axios.delete(`${prefix}/comments/${cno}`)
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

export const getItemLikeCount = async (ino) => { // 좋아요 수 조회
    const res = await axios.get(`${prefix}/${ino}/likes-count`)
    return res.data
}
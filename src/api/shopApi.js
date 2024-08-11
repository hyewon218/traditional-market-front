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

export const getShopList = async (mno, pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/${mno}/shops`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

export const getListCategory = async (mno, pageParam, category) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefixApi}/${mno}/shops/category`, {
        params:
            {category: category, page: page, size: size}
    })
    return res.data
}

export const putShop = async (sno, formData) => {
    const header = {headers: {"Content-Type": "multipart/form-data"}}
    const res = await axios.put(`${prefix}/${sno}`, formData, header)
    return res.data
}

export const deleteShop = async (sno) => {
    const res = await axios.delete(`${prefix}/${sno}`)
    return res.data
}

/*댓글*/
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

export const putShopComment = async (cno, updatedComment) => {
    const header = {headers: {"Content-Type": "application/json"}}
    const data = {
        comment: updatedComment
    }
    const res = await axios.put(`${prefix}/comments/${cno}`,JSON.stringify(data), header)
    return res.data
}

export const deleteShopComment = async (cno) => {
    const res = await axios.delete(`${prefix}/comments/${cno}`)
    return res.data
}

/*좋아요*/
export const postShopLike = async (sno) => {
    const res = await axios.post(`${prefix}/${sno}/likes`)
    return res.data
}

export const getShopLike = async (sno) => { // 좋아요 여부 확인
    const res = await axios.get(`${prefix}/${sno}/likes`)
    return res.data
}

export const cancelShopLike = async (sno) => { // 좋아요 취소
    const res = await axios.delete(`${prefix}/${sno}/likes`)
    return res.data
}

export const getShopLikeCount = async () => { // 좋아요 갯수 조회
    const res = await axios.get(`${prefix}/likes`)
    return res.data
}
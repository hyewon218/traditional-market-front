import axios from "axios"
//export const API_SERVER_HOST = `http://localhost:8080`
//export const API_SERVER_HOST = `http://3.36.96.0:8080`
//export const API_SERVER_HOST = `http://tmarket.store:8080`
export const API_SERVER_HOST = `https://tmarket.store`
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

export const getListSearch = async (pageParam, searchQuery) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/search`, {
        params:
            {page: page, size: size, keyword: searchQuery} // Include the search query parameter
    })
    return res.data
}

export const getListCategory = async (pageParam, category) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/category`, {
        params:
            {category: category, page: page, size: size}
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

/*댓글*/
export const postMarketComment = async (data) => {
    const res = await axios.post(`${prefix}/comments`, data)
    return res.data
}

export const getMarketComments = async (mno, pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/${mno}/comments`, {
        params:
            {page: page, size: size}
    })
    return res.data
}

/*좋아요*/
export const postMarketLike = async (mno) => { // 좋아요 생성
    const res = await axios.post(`${prefix}/${mno}/likes`)
    return res.data
}

export const getMarketLike = async (mno) => { // 좋아요 여부 확인
    const res = await axios.get(`${prefix}/${mno}/likes`)
    return res.data
}

export const cancelMarketLike = async (mno) => { // 좋아요 취소
    const res = await axios.delete(`${prefix}/${mno}/likes`)
    return res.data
}

export const getMarketLikeCount = async (mno) => { // 좋아요 갯수 조회
    const res = await axios.get(`${prefix}/${mno}/likes-count`)
    return res.data
}

export const getMarketName = async (mno) => { // 시장 이름 가져오기, 결제된 주문 상세정보에서 사용
    const res = await axios.get(`${prefix}/name/${mno}`)
    return res.data
}
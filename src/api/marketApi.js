import axios from "axios"

export const API_SERVER_HOST = `http://localhost:8080`
const prefix = `${API_SERVER_HOST}/api/markets`
export const getOne = async (mno) => {
    const res = await axios.get(`${prefix}/${mno}`)
    return res.data
}
export const getList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}/list`, {
        params:
            {page: page, size: size}
    })
    return res.data
}
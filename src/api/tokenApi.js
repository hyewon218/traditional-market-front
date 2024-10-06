import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefixApi = `${API_SERVER_HOST}/api`

// 액세스 토큰 가져오기
export const getAccessToken = async () => {
    try {
        const res = await axios.get(`${prefixApi}/acc-token`, { withCredentials: true });
        return res.data; // 액세스토큰 반환
    } catch (error) {
        console.error("액세스토큰 가져오기 오류 :", error);
        throw error;
    }
};

// 리프레시 토큰 가져오기
export const getRefreshToken = async () => {
    try {
        const res = await axios.get(`${prefixApi}/ref-token`, { withCredentials: true });
        return res.data; // 리프레시토큰 반환
    } catch (error) {
        console.error("리프레시토큰 가져오기 오류 :", error);
        throw error;
    }
};
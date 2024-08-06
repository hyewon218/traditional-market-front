import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"

const prefix = `${API_SERVER_HOST}/api/chatrooms`
const myPrefix = `${API_SERVER_HOST}/api/mychatrooms`

axios.defaults.withCredentials = true; // withCredentials 전역 설정 (쿠키 공유를 허락)

export const postChatRoom = async () => {
    const res = await axios.post(`${prefix}`);
    return res.data;
};

export const getChatRooms = async () => { // 전체 채팅방
    const res = await axios.get(`${prefix}`);
    return res.data;
};

export const getMyChatRooms = async () => {
    const res = await axios.get(`${myPrefix}`);
    return res.data;
};

export const getChatDetails = async (rno) => {
    const res = await axios.get(`${prefix}/chat/${rno}`);
    return res.data;
};

export const deleteChatRoom = async (rno) => {
    return await axios.delete(`${prefix}/${rno}`);
};
import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"

const prefix = `${API_SERVER_HOST}/api/chatrooms`
const myPrefix = `${API_SERVER_HOST}/api/mychatrooms`

axios.defaults.withCredentials = true; // withCredentials 전역 설정 (쿠키 공유를 허락)

export const postChatRoom = async () => {
    const res = await axios.post(`${prefix}`);
    return res.data;
};

export const getChatRooms = async (pageParam) => { // 전체 채팅방(관리자)
    const {page, size} = pageParam
    const res = await axios.get(`${prefix}`, {
        params:
            {page: page, size: size}
    });
    return res.data;
};

export const getMyChatRooms = async (pageParam) => { // 나의 채팅방
    const {page, size} = pageParam
    const res = await axios.get(`${myPrefix}`, {
        params:
            {page: page, size: size}
    });
    return res.data;
};

export const getChatDetails = async (rno) => { // 채팅방 내 채팅목록 조회
    const res = await axios.get(`${prefix}/chat/${rno}`);
    return res.data;
};

export const deleteChatRoom = async (rno) => {
    return await axios.delete(`${prefix}/${rno}`);
};

/*채팅방 읽음 상태로 변경*/
export const putIsRead = async (rno) => {
    const res = await axios.put(`${prefix}/${rno}/read`)
    return res.data
}

/*채팅방 읾음 여부 조회*/
export const getIsRead = async (rno) => {
    const res = await axios.get(`${prefix}/${rno}/read`)
    return res.data
}
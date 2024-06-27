import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
import {getCookie} from "../util/cookieUtil";

axios.defaults.withCredentials = true; // withCredentials 전역 설정 (쿠키 공유를 허락)

const host = `${API_SERVER_HOST}/api/chatrooms`

const accessToken = getCookie('Authorization')

export const createChatRoom = async () => {
    try {
        const res = await axios.post(
            `${host}`,
            {
                headers: {
                    Authorization: `${accessToken}`,
                },
            },
        );
        return res.data.data;
    } catch (error) {
        console.error('방 생성 에러:', error);
    }
};

export const getChatRooms = async () => {
    try {
        const res = await axios.get(
            `${host}`,
            {
                headers: {
                    Authorization: `${accessToken}`,
                },
            });
        return res.data;
    } catch (error) {
        console.error('방 리스트 불러오기 에러:', error);
    }
};

export const getChatDetails = async (rno) => {
    try {
        const res = await axios.get(
            `${host}/chat/${rno}`,
        );
        return res.data;
    } catch (error) {
        console.error('채팅 내역 조회 에러', error);
    }
};

export const deleteChatRoom = async (rno) => {

    return await axios.delete(
        `${host}/${rno}`,
        {
            headers: {
                Authorization: `${accessToken}`,
            },
        });
};
import axios from "axios"
import {API_SERVER_HOST} from "./marketApi"
const prefix = `${API_SERVER_HOST}/api`
const prefixApi = `${API_SERVER_HOST}/api/members`

axios.defaults.withCredentials = true; // withCredentials 전역 설정 (쿠키 공유를 허락)

// 회원 가입
export const postMember = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}}
    const res = await axios.post(`${prefixApi}/signup`, formData, header)
    return res.data
}

export const loginPost = async (loginParam) => {
    const header = {headers: {"Content-Type": "application/json"}}
    let data = {
        memberId: loginParam.memberId,
        memberPw: loginParam.memberPw
    }
    const res = await axios.post(`${prefixApi}/login`, JSON.stringify(data), header)
    console.log(JSON.stringify(data))
    return res.data
}

export const logoutPost = async () => {
    const res = await axios.post(`${prefixApi}/logout`)
    return res.data
}

export const getMemberList = async (pageParam) => {
    const {page, size, sort} = pageParam
    const res = await axios.get(`${prefixApi}`, {
        params:
            {page: page, size: size, sort: sort}
    })
    return res.data
}

// 내 정보 조회
export const getMember = async () => {
    const res = await axios.get(`${prefixApi}/myinfo`)
    return res.data
}

// 내 정보 조회 시 내 비밀번호 확인
export const postCheckPw = async (formData) => {
    const res = await axios.post(`${prefixApi}/myinfo/check`, formData);
    return res.data;
};

// 닉네임 수정
export const putNickname = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.put(`${prefixApi}`, formData, header)
    return res.data
}

// 비밀번호 변경
export const putPassword = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.put(`${prefixApi}/changepw`, formData, header)
    return res.data
}

// 회원 탈퇴
export const deleteMember = async () => {
    const res = await axios.delete(`${prefixApi}`)
    return res.data
}

// 이메일로 인증번호 전송
export const postSendEmailCode = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.post(`${prefix}/send-mail/email`, formData, header)
    return res.data
}

// 전송된 인증번호 일치 확인
export const postVerifyCode = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.post(`${prefixApi}/verifycode`, formData, header)
    return res.data
}

// 닉네임 변경까지 남은 시간
export const getRemainingTime = async (mno) => {
    const res = await axios.get(`${prefixApi}/change-nickname-time/${mno}`)
    return res.data
}

// 이메일 중복 확인
export const getEmailCheck = async (memberEmail) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.get(`${prefixApi}/checkemail`, {
        params: {memberEmail: memberEmail},
            ...header,
    });
    return res.data
}

// 아이디 중복 확인
export const getIdCheck = async (memberId) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.get(`${prefixApi}/checkid`, {
        params: {memberId: memberId},
            ...header,
    });
    return res.data
}

// 아이디 찾기 시 인증번호 전송하기 전, 입력한 이메일에 해당하는 회원 있는지 검증 후 있으면 인증번호 전송
export const postSendFindIdCode = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.post(`${prefix}/send-mail/email/findid`, formData, header)
    return res.data
}

// 아이디 찾기 버튼 누르고 입력한 이메일과 인증번호 모두 일치하면 해당 이메일에 해당하는 아이디 반환
export const postFindId = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.post(`${prefixApi}/findid`, formData, header)
    return res.data
}

// 임시비밀번호 발급 시 임시비밀번호 발급 전, 입력한 아이디와 이메일에 해당하는 회원 있는지 검증 후 있으면 임시비밀번호 발급
export const postSendTempPw = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.post(`${prefix}/send-mail/email/temppw`, formData, header)
    return res.data
}

// OAuth2.0 최초 로그인 시 추가정보 입력
export const putOAuthInfo = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}}
    const res = await axios.put(`${prefixApi}/addinfo`, formData, header)
    return res.data
}

// 신고하기 (다른 회원의 댓글 신고)
export const postReport = async (formData) => {
    const header = {headers: {"Content-Type": "application/json"}} // 안붙여도 되는지 테스트해보기
    const res = await axios.post(`${prefixApi}/report`, formData, header)
    return res.data
}


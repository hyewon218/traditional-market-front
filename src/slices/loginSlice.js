import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loginPost, logoutPost} from "../api/memberApi";

// 초기 상태는 로그인되지 않은 상태로 가정
const initState = {
    memberId: ''
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
    return loginPost(param)
})

export const logoutPostAsync = createAsyncThunk('logoutAsync',  () => {
    return logoutPost();
})

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: initState,

    reducers: {
        login: (state, action) => {
            console.log("login.....")
            //{memberId, memberPw로 구성}
            const data = action.payload
            //새로운 상태
            return {memberId: data.memberId}
        },
        logout: () => {
            console.log("logout....")
            return {...initState}
        }
    },

    extraReducers: (builder) => {
        builder.addCase(loginPostAsync.fulfilled, (state, action) => {
            console.log("fulfilled")
            return action.payload;
        })
        .addCase(loginPostAsync.pending, () => {
            console.log("pending")
        })
        .addCase(loginPostAsync.rejected, () => {
            console.log("rejected")
        })
        .addCase(logoutPostAsync.fulfilled, () => {
            console.log("logout fulfilled")
            return { ...initState };
        })
        .addCase(logoutPostAsync.pending, () => {
            console.log("logout pending")
        })
        .addCase(logoutPostAsync.rejected, () => {
            console.log("logout rejected")
        })
    }
})

export const {login, logout} = loginSlice.actions

export default loginSlice.reducer

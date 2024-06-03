import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loginPost} from "../api/memberApi";

const initState = {
    memberId: ''
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {

    return loginPost(param)

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
        logout: (state, action) => {
            console.log("logout....")
            return {...initState}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginPostAsync.fulfilled, (state, action) => {
            console.log("fulfilled")
            const payload = action.payload
            return payload;
        })
        .addCase(loginPostAsync.pending, (state, action) => {
            console.log("pending")
        })
        .addCase(loginPostAsync.rejected, (state, action) => {
            console.log("rejected")
        })
    }
})

export const {login, logout} = loginSlice.actions

export default loginSlice.reducer

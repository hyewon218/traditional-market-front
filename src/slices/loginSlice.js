//import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
//import {loginPost, logoutPost} from "../api/memberApi";
//
//// 초기 상태는 로그인되지 않은 상태로 가정
//const initState = {
//    memberId: ''
//}
//
//export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
//    return loginPost(param)
//})
//
//export const logoutPostAsync = createAsyncThunk('logoutAsync',  () => {
//    return logoutPost();
//})
//
//const loginSlice = createSlice({
//    name: 'loginSlice',
//    initialState: initState,
//
//    reducers: {
//        login: (state, action) => {
//            console.log("login.....")
//            //{memberId, memberPw로 구성}
//            const data = action.payload
//            //새로운 상태
//            return {memberId: data.memberId}
//        },
//        logout: () => {
//            console.log("logout....")
//            return {...initState}
//        }
//    },
//
//    extraReducers: (builder) => {
//        builder.addCase(loginPostAsync.fulfilled, (state, action) => {
//            console.log("fulfilled")
//            return action.payload;
//        })
//        .addCase(loginPostAsync.pending, () => {
//            console.log("pending")
//        })
//        .addCase(loginPostAsync.rejected, () => {
//            console.log("rejected")
//        })
//        .addCase(logoutPostAsync.fulfilled, () => {
//            console.log("logout fulfilled")
//            return { ...initState };
//        })
//        .addCase(logoutPostAsync.pending, () => {
//            console.log("logout pending")
//        })
//        .addCase(logoutPostAsync.rejected, () => {
//            console.log("logout rejected")
//        })
//    }
//})
//
//export const {login, logout} = loginSlice.actions
//
//export default loginSlice.reducer



// 액세스토큰 전역적으로 관리하는 코드 추가
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost, logoutPost } from "../api/memberApi";
import { getAccessToken } from '../api/tokenApi';

// 초기 상태 설정
const initState = {
    memberId: '',
    isAuthorization: null, // 추가된 상태
}

// 로그인 비동기 액션
export const loginPostAsync = createAsyncThunk('loginPostAsync', async (param) => {
    return loginPost(param);
});

// 로그아웃 비동기 액션
export const logoutPostAsync = createAsyncThunk('logoutAsync', async () => {
    return logoutPost();
});

// 액세스 토큰 가져오는 비동기 액션
export const fetchAccessTokenAsync = createAsyncThunk('fetchAccessTokenAsync', async () => {
    return getAccessToken();
});

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: initState,

    reducers: {
        login: (state, action) => {
            console.log("login.....");
            const data = action.payload;
            state.memberId = data.memberId;
        },
        logout: (state) => {
            console.log("logout....");
            return { ...initState };
        },
        setAuthorization: (state, action) => {
            state.isAuthorization = action.payload;
        },
        clearAuthorization: (state) => {
            state.isAuthorization = null;
        }
    },

    extraReducers: (builder) => {
        // 로그인 비동기 처리
        builder.addCase(loginPostAsync.fulfilled, (state, action) => {
            console.log("login fulfilled");
            state.memberId = action.payload.memberId; // 로그인 시 memberId 업데이트
        })
        .addCase(loginPostAsync.pending, () => {
            console.log("login pending");
        })
        .addCase(loginPostAsync.rejected, () => {
            console.log("login rejected");
        })

        // 로그아웃 비동기 처리
        .addCase(logoutPostAsync.fulfilled, (state) => {
            console.log("logout fulfilled");
            return { ...initState };
        })
        .addCase(logoutPostAsync.pending, () => {
            console.log("logout pending");
        })
        .addCase(logoutPostAsync.rejected, () => {
            console.log("logout rejected");
        })

        // 액세스 토큰 가져오기 비동기 처리
        .addCase(fetchAccessTokenAsync.fulfilled, (state, action) => {
            console.log("access token fulfilled");
            state.isAuthorization = action.payload; // 액세스 토큰 저장
        })
        .addCase(fetchAccessTokenAsync.rejected, () => {
            console.log("access token rejected");
        });
    }
});

export const { login, logout, setAuthorization, clearAuthorization } = loginSlice.actions;

export default loginSlice.reducer;

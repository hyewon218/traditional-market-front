import {createSlice} from "@reduxjs/toolkit";

const initState = {
    email: ''
}

const loginSlice = createSlice({
    name: 'LoginSlice',
    initialState: initState,
    reducers: {
        login: (state, action) => {
            console.log("login.....")
            //{email, pw로 구성 }
            const data = action.payload
            //새로운 상태
            return {email: data.email}

        },
        logout: (state, action) => {
            console.log("logout....")

        }
    }
})

export const {login, logout} = loginSlice.actions

export default loginSlice.reducer

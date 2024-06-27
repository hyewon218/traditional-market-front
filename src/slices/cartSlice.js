import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {addCart, getCartItems, patchChangeCart} from "../api/cartApi";

export const getCartItemsAsync = createAsyncThunk('getCartItemsAsync', () => {
    return getCartItems()
})

export const patchChangeCartAsync = createAsyncThunk('patchCartItemsAsync', (param) => {
    return patchChangeCart(param)
})

export const addCartAsync = createAsyncThunk('addCartAsync', (param) => {
    return addCart(param)
})

const initState = []

const cartSlice = createSlice({
    name: 'cartSlice',
    initialState: initState,

    extraReducers: (builder) => {
        builder.addCase(
            getCartItemsAsync.fulfilled, (state, action) => {
                console.log("getCartItemsAsync fulfilled")

                //return action.payload
                return Array.isArray(action.payload) ? action.payload : state;
            }
        )
        .addCase(
            patchChangeCartAsync.fulfilled, (state, action) => {
                console.log("patchCartItemsAsync fulfilled")

                //return action.payload
                // 상태 업데이트 로직 수정
                const updatedCartItem = action.payload;
                const index = state.findIndex(item => item.cartItemNo === updatedCartItem.cartItemNo);
                if (index !== -1) {
                    state[index] = updatedCartItem;
                }
            }
        )
        .addCase(
            addCartAsync.fulfilled, (state, action) => {
                console.log("addCartAsync fulfilled")

                return Array.isArray(action.payload) ? action.payload : state;
            }
        )
    }
})

export default cartSlice.reducer

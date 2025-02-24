import { createSlice } from "@reduxjs/toolkit";

const initialState = {}
const userslice = createSlice({
    name: "User",
    initialState,
    reducers:{
        loginUser:(state,action)=>action.payload,
        logoutUser:(_) => initialState
    }

});

export const {loginUser} = userslice.actions;
export const {logoutUser} = userslice.actions;
export default userslice.reducer;
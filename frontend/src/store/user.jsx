import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/usersclice.jsx";

export const userStore = configureStore({
    devTools:false
    ,reducer:{
        User:userReducer
    }
});
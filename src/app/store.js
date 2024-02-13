"use client";
import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "./slice/MenuSlice"
import toolboxReducer from "./slice/toolboxSlice";

 const store = configureStore({
    reducer:{
        menu:MenuReducer,
        toolbox :toolboxReducer
    }
})

export default store
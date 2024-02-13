
 import { createSlice } from "@reduxjs/toolkit";
import { MENU_ITEMS } from "../constant";

 const initialState ={
    activeMenuItem : MENU_ITEMS.PENCIL,
    actionMenuItem :null
 }

 export const menuslice = createSlice({
    name:"menu",
    initialState,
    reducers:{
        menuItemClick:(state,action) =>{
            state.activeMenuItem = action.payload
        },
        actionItemClick :(state,action) =>{
            state.actionMenuItem = action.payload

        }
 
    }
 })


 export const {menuItemClick,actionItemClick} = menuslice.actions
 export default menuslice.reducer
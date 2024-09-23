import { createSlice } from "@reduxjs/toolkit"

const initialState = []
const CartSlice = createSlice({
    name:"CartSlice",
    initialState,
    reducers:{
        add(state,action){
            const existingItem = state.find((item) => item._id === action.payload._id);
            if (existingItem) {existingItem.quantity += 1;}
            else {state = state.push(action.payload);}
        },
        remove(state,action){return state.filter((item)=>item._id!==action.payload)},
        increment(state,action){
            const existingItem = state.find((item) => item._id === action.payload._id);
            if (existingItem) {existingItem.quantity += 1;}
            else {existingItem.quantity= existingItem.quantity}
        },
        decrement(state,action){
            const existingItem = state.find((item) => item._id === action.payload._id);
            if (existingItem && existingItem.quantity>1) {existingItem.quantity -= 1;}
            else {existingItem.quantity= existingItem.quantity}
        },
        clear(state){
            return state=[]
        }

    }
})

export const {add,remove,increment,decrement,clear} = CartSlice.actions

export default CartSlice.reducer
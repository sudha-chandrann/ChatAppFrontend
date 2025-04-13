import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    _id:'',
    username:'',
    email:'',
    fullName:'',
    bio:'',
    profilePicture:'',
    anychange:false
};

const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authlogin: (state, action) => {
            state.fullName = action.payload.fullName;
            state.username = action.payload.username;
            state._id = action.payload._id;
            state.email = action.payload.email;
            state.profilePicture = action.payload.profilePicture;
            state.bio = action.payload.bio;
        },
        authlogout: (state) => {
            state.fullName = '';
            state.username = '';
            state.email = '';
            state.profilePicture = '';
            state.bio = '';
            state._id=''
        },
        change:(state)=>{
            state.anychange=!state.anychange;
        }
       
    },
});

export const { authlogin, authlogout,change } = authSlice.actions;
export default authSlice.reducer;

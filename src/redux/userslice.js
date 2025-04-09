import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    _id:'',
    username:'',
    email:'',
    fullName:'',
    bio:'',
    profilePicture:''
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
       
    },
});

export const { authlogin, authlogout } = authSlice.actions;
export default authSlice.reducer;

import {configureStore} from '@reduxjs/toolkit';
import AuthSlice from "./userslice"
const store =configureStore(
    {
        reducer:{
            user:AuthSlice,
          
        },
    }
)

export default store;



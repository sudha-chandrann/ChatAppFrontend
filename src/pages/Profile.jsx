import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'
import { RiLogoutBoxFill } from 'react-icons/ri'

function Profile() {
    const logoutfunction=async()=>{
        try{
           const response= await axios.get('/api/v1/users/logout');
           console.log(" the response is ",response);
            toast.success('Logged out successfully');
        }
        catch(error){
            console.log("the error during logout ",error)
            toast.error("failed to logout")
        }
    }
  return (
    <div className='flex items-center justify-center'>
      <RiLogoutBoxFill className='h-20 w-20 ' onClick={logoutfunction}/>
    </div>
  )
}

export default Profile

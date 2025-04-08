const url=`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`


const uploadfile=async(file)=>{
    try{
        const formData=new FormData()
        formData.append('file',file)
        formData.append('upload_preset','chattie')
    
        const response= await fetch(url,{
            method:'POST',
            body:formData
        })
        const data=await response.json()
        return data.url
    }
    catch(error){
        return error.message||error
    }

}

export default uploadfile
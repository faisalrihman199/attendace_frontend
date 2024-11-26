import React, { useEffect, useState } from 'react'
import "../../../Components/ChildAdmin/ChildAdmin.css"
import Dummy from "../../../assets/images/Dummy/Profile.png"
import EditProfile from '../../../Components/ChildAdmin/Profile/EditProfile'
import { useAPI } from '../../../contexts/Apicontext'

const Profile = () => {
  const {userProfile}=useAPI();
  const [UserProfile,setProfile]=useState({})
  const [photo,setPhoto]=useState(Dummy);
  const [bussinesName,setName]=useState('User 123');
  let server = import.meta.env.VITE_APP_API_URL;
  server=server.replace('/api','')
  useEffect(()=>{
    userProfile()
    .then((res)=>{
        setProfile(res.data);
        if(res.data.businessPhoto){
          const src=server+"/"+res.data.businessPhoto;
          setPhoto(src);
        }
        if(res.data.businessName){
            setName(res.data.businessName);
        }
        
    })
    .catch((err)=>{
        console.log("Error :", err);
        
    })
},[])
  return (
    <div className="container p-4">
        <div className='mt-3'>
            <h1 className='top_heading poppins-medium color_bao'>PROFILE</h1>
        </div>
        <div className='d-flex flex-column align-items-center my-2'>
            <img src={photo} height={250} className='rounded' style={{width:'500px', maxWidth:'90%'}}  alt="" />
            <h5 className='my-2 Josefin-Sans' style={{fontWeight:'600', fontSize:'28px'}}>{bussinesName}</h5>
        </div>
        <div className="my3">
          {
            UserProfile &&
            <EditProfile profile={UserProfile} />
          }
        </div>
    </div>
  )
}

export default Profile
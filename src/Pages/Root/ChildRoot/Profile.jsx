import React, { useState } from 'react'
import EditProfile from '../../../Components/ChildAdmin/Profile/EditProfile'
import Dummy from "../../../assets/images/Dummy/Profile.png"
import { useEffect } from 'react'
import { useAPI } from '../../../contexts/Apicontext'
import { useLocation } from 'react-router-dom';


const Profile = () => {
    const [UserProfile,setProfile]=useState({})
    const {userProfile}=useAPI();

    const [photo,setPhoto]=useState(Dummy);
    const [bussinesName,setName]=useState('User 123');
    const location = useLocation();
    const isRoot = location.pathname.includes('root');
    let server = import.meta.env.VITE_APP_API_URL;

    useEffect(()=>{
        userProfile(isRoot)
        .then((res)=>{
            console.log("Response is :", res);
            setProfile(res.data);
            setName(`${res.data.firstName} ${res.data.lastName}`)
            server = server.replace('/api', '');
            if(res.data.businessPhoto){

                setPhoto(`${server}${res.data.businessPhoto}`)
            }
            
        })
        .catch((err)=>{
            console.log("Error :", err);
            
        })
    },[])
    return (
        <div className="container p-4">
            <div className="d-flex justify-content-center">
                <div style={{width:'100%', maxWidth:'900px'}}>

                <div className='my-4'>
                    <h1 className=' text-center top_heading poppins-bold color_bao' style={{fontSize:'44px'}}>PROFILE</h1>
                </div>
                <div className='d-flex flex-column align-items-center my-2'>
                    <img className='rounded-circle' src={photo} height={144} width={144} alt="" />
                    <h5 className='my-2 Josefin-Sans' style={{ fontWeight: '600', fontSize: '28px' }}>{bussinesName}</h5>
                </div>
                <div className="my3">
                {UserProfile &&
                <EditProfile profile={UserProfile} />
                }
                </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
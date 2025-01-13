import React, { useState }  from 'react'
import { ToggleOff, ToggleOn } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FaTrash } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAPI } from '../../contexts/Apicontext';
import { toast } from 'react-toastify';
import Loading from '../Loading';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const BusinessCard = ({business,setChange}) => {
    const [emailToggled, setEmailToggle] = useState(business?.status==='active'?true:false);
    const {deleteBussiness,updateBussinessStatus}=useAPI();
    const navigate=useNavigate();
    const [loading,setLoading]=useState(0);
    const handleEmailToggle = () => {
        setLoading(2);
        
        updateBussinessStatus(business.id).
        then((res)=>{
            if(res.success){
                toast.success(res.message);
                setEmailToggle(prevState => !prevState);
            }
            else{
                toast.error(res.message);
                
            }
        })
        .catch((err)=>{
            console.log("Error :", err);
            toast.error(err.message);
        })
        .finally(()=>{
            setLoading(0);
        })
        
    };
    const handleEdit=()=>{
        sessionStorage.setItem('currentBussiness',business.userId);
        navigate('/admin/dashboard');
    }
    const confirmDelete = () => {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this business?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: handleDelete
                },
                {
                    label: 'No',
                    onClick: () => console.log("Deletion cancelled")
                }
            ]
        });
    };
    const handleDelete=()=>{
        
        console.log("Please Delete Bussines :", business.id);
        setLoading(1);
        deleteBussiness(business.id)
        .then((res)=>{
            if(res.success){
                setChange(prev=>!prev);
                toast.success(res.message);
                window.location.reload();
            }
            else{
                toast.error(res.message);
                
            }
        })
        .catch((err)=>{
            toast.error(err.message);
            console.log("Error while Delete :", err);
            
        })
        .finally(()=>{
            setLoading(0);
        })
    }
    return (
        
        <div className="col-md-6 col-sm-12 p-1 my-2">
            <div className=" bg_dede p-3 py-4 " style={{ borderRadius: '15px' }}>
                <h3 className='poppins-medium my-1' style={{ fontSize: '28p' }} >
                    {business.name}
                </h3>
                <p className='my-1 poppins-regular' style={{ fontSize: '16px' }}>
                    <strong>Owner:</strong> {business.ownerName}
                </p>
                <div className="d-flex align-items-center">
                    <p className='poppins-regular my-2' style={{ fontSize: '16px' }}><strong>Active</strong> </p>
                    {
                        loading===2?
                        <Loading />
                        :
                        <IconButton onClick={handleEmailToggle} style={{ color: emailToggled?'#247BA0':'white' }}>
                            {emailToggled ? <ToggleOn fontSize="large" /> : <ToggleOff fontSize="large" />}
                        </IconButton>

                    }
                </div>
                <div className="d-flex my-2 align-items-center justify-content-end">
                <span className='mx-2 cursor-pointer' style={{height:'25px'}}>
                        <i 
                            className="bi-pencil mx-2 cursor-pointer" 
                            style={{ cursor: 'pointer', fontSize:'25px' }} 
                            onClick={handleEdit}
                        ></i>
                    </span>
                    <span className='mx-2 cursor-pointer' style={{height:'25px'}}>
                        {
                            loading===1?
                            <Loading />
                            :
                            <i 
                            className="bi-trash mx-2" 
                            style={{ cursor: 'pointer', fontSize:'25px' }} 
                            onClick={confirmDelete}
                            ></i>                        
                        }
                    </span>
                </div>
            </div>

        </div>
    )
}

export default BusinessCard
import React, { useState, useRef, useEffect } from 'react';
import { ToggleOff, ToggleOn } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Upload from '../../../Components/ChildAdmin/Setting/Icons/Upload';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAPI } from '../../../contexts/Apicontext';
import Loading from '../../../Components/Loading';

const Settings = () => {
    const [emailToggled, setEmailToggle] = useState(false);
    const [imageSrc, setImageSrc] = useState(null); // State to hold image source
    const fileInputRef = useRef(null); // Create a ref for the file input
    const { register, handleSubmit, getValues, setValue } = useForm();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(0);
    const { addBussiness, allBussineses, getReporting, updateReporting } = useAPI();
    let localData=JSON.parse(localStorage.getItem('user'))
    let server = import.meta.env.VITE_APP_API_URL;

    const handleEmailToggle = () => {
        setEmailToggle(prevState => !prevState);
    };
    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        let userId = null;
        if (localUser.role === 'superAdmin') {
            userId = sessionStorage.getItem('currentBussiness');
        }
        setLoading(3);
        allBussineses(1, userId)
            .then((res) => {
                console.log("Bussiness here :", res.data);
                setValue('name', res.data[0].name);
                setValue('message', res.data[0].message);
                setValue('pinLength', res.data[0].pinLength);
                server = server.replace('/api', '');
                setImageSrc(`${server}/${res.data[0].photoPath}`);
                // Ensure athlete.photoPath is valid before setting imageSrc
            const photoPath = athlete.photoPath ? `${server}/${res.data[0].photoPath}` : null;
            console.log("Photo to be uploaded is:", photoPath);
            setImageSrc(photoPath);
    
            // Only convert to file if photoPath is valid
            if (photoPath) {
                fetch(photoPath)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob(); // Get the image as a Blob
                    })
                    .then(blob => {
                        const file = new File([blob], 'uploaded_image.jpg', { type: blob.type });
                        console.log("SRC Converted to file is:", file);
                        setPhoto(file);
                    })
                    .catch(error => {
                        console.error('Error fetching image:', error);
                    });
            }
            })
            .catch((err) => {
                console.log("Error :", err);

            })
            .finally(() => {
                setLoading(0)
            })
    }, [])
    useEffect(() => {
        getReporting()
            .then((res) => {
                setValue('duration', res.data.duration);
                setValue('email', res.data.email);
                setEmailToggle(res.data.reportingEmails);

            })
            .catch((err) => {
                console.log("Error :", err);
            })

    }, [])

    const handleUploadClick = () => {
        fileInputRef.current.click(); // Trigger the file input click
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setPhoto(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result); // Set the image source to display
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const hanldeBussiness = () => {
        const pn=getValues('pinLength')

        if(pn<3 || pn>7){
            toast.error("Please Enter PIN Length between 3 and 7");
            return
        }
        let fd = new FormData();
        if (!getValues('name') || !getValues('message')) {
            toast.error("Pleasde fill all the Bussiness fields");
            return;
        }
        fd.append('photo', photo);
        fd.append('name', getValues('name'))
        fd.append('message', getValues('message'))
        fd.append('pinLength', getValues('pinLength'))
        console.log("Add Bussiness :", Object.fromEntries(fd));
        setLoading(1);

        addBussiness(fd)
            .then((res) => {
                if (res.success) {
                    if(localData.role!=='superAdmin' && !localData.business){
                        localData.business=res.data.id;
                        localStorage.setItem('user', JSON.stringify(localData));
                    }
                    toast.success(res.message);

                }
                else {
                    toast.error(res.message);

                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error(err.message)
            })
            .finally(() => {
                setLoading(0);
            })

    }
    const handleReporting = () => {
        const data = {
            reportingEmails: emailToggled,
            email: getValues('email'),
            duration: getValues('duration')
        }
        setLoading(2)
        updateReporting(data)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                }
                else {
                    toast.error(res.message);

                }
            })
            .catch((err) => {
                console.log("Error :", err);

                toast.error("Updating Report Information Failed");
            })
            .finally(() => {
                setLoading(0)
            })

    }

    return (
        loading===3?
        <Loading />
        :
        <div className="container p-4 poppins-regular">
            

            <div className='mt-3'>
                <h1 className='top_heading poppins-medium color_bao'>SETTING</h1>
                {/* <h1 className='font-20 poppins-medium my-2'>Email Configurations</h1>
                <div className="d-flex my-2 justify-content-between align-items-center">
                    <p className='poppins-light my-2' style={{ fontSize: '20px' }}>Reporting Emails</p>
                    <IconButton onClick={handleEmailToggle} style={{ color: emailToggled ? '#247BA0' : 'gray' }} >
                        {emailToggled ? <ToggleOn fontSize="large" /> : <ToggleOff fontSize="large" />}
                    </IconButton>
                </div>
                <div className="d-flex my-3 justify-content-between align-items-center">
                    <p className='poppins-light my-2' style={{ fontSize: '20px' }}>Duration</p>
                    <select name="duration" className='form-control poppins-regular w-25 bg_dede' {...register('duration')}>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="form-group">
                            <label htmlFor="" className='font-20 ms-1' style={{ fontSize: '18px' }}>Email Address</label>
                            <input
                                type="email"
                                className="form-control my-2 p-2 bg_dede"
                                placeholder='Email Address'
                                {...register('email')}
                            />
                        </div>
                    </div>
                </div>
                <div className="my-2 d-flex justify-content-end">
                    {
                        loading===2 ?
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                            :
                            <button className="btn mx-2 btns poppins-medium" onClick={handleReporting} style={{ width: '150px', }}>
                                Save
                            </button>

                    }
                </div> */}


                <div className="my-2">
                    <h1 className='font-20 poppins-medium my-2'>Business Details</h1>
                    
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control p-2 bg_dede"
                            placeholder='Business Name'
                            {...register('name')}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <textarea
                            name="message"
                            placeholder='Custom Message'
                            className='form-control p-2 bg_dede'
                            rows={5}
                            style={{ resize: 'none' }}
                            {...register('message')}
                        ></textarea>
                    </div>
                    <p htmlFor="" className='font-20 ms-1' style={{ fontSize: '18px' }}>Athlete ID PIN Length</p>
                    <div className="my-3">
                        <input
                            type="number"
                            min="3"
                            max="7"
                            className="form-control p-2 bg_dede"
                            placeholder='PIN Length any number'
                            {...register('pinLength')}
                        />
                    </div>
                    <div className="mb-3">
                        <p htmlFor="" className='font-20 ms-1' style={{ fontSize: '18px' }}>Upload Logo</p>
                        <div className="row">
                            <div className="col-sm-12">
                                <div onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                                    {imageSrc ? (
                                        <img src={imageSrc} alt="Uploaded Logo" style={{ width: '400px', maxWidth:'100%', height: '300px', objectFit: 'cover' }} /> // Display the selected image
                                    ) : (
                                        <Upload />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="my-2 d-flex justify-content-end">
                        {
                            loading === 1 ?
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                                :
                                <button className="btn mx-2 btns poppins-medium" style={{ width: '150px', }} onClick={hanldeBussiness} >
                                    Save
                                </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;

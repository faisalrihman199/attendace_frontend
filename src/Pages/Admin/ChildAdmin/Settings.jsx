import React, { useState, useRef, useEffect } from 'react';
import { ToggleOff, ToggleOn } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Upload from '../../../Components/ChildAdmin/Setting/Icons/Upload';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAPI } from '../../../contexts/Apicontext';
import Loading from '../../../Components/Loading';
import TimezoneSelect from 'react-timezone-select';

const Settings = () => {
    const [emailToggled, setEmailToggle] = useState(false);
    const [imageSrc, setImageSrc] = useState(null); // State to hold image source
    const fileInputRef = useRef(null); // Create a ref for the file input
    const { register, handleSubmit,watch, getValues, setValue } = useForm();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(0);
    const { addBussiness, allBussineses, getReporting, updateReporting } = useAPI();
    let localData = JSON.parse(localStorage.getItem('user'));
    let server = import.meta.env.VITE_APP_API_URL;

    const handleEmailToggle = () => {
        setEmailToggle(prevState => !prevState);
    };
    const timeZone=watch('timezone') || null;
    console.log("Time Zone :", timeZone);
    
    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        let userId = null;
        if (localUser.role === 'superAdmin') {
            userId = sessionStorage.getItem('currentBussiness');
        }
        setLoading(3);
        allBussineses(1, userId)
            .then((res) => {
                setValue('name', res.data[0].name);
                setValue('message', res.data[0].message);
                setValue('pinLength', res.data[0].pinLength);
                setValue('timezone', res.data[0].timezone); // Set existing time zone value
                server = server.replace('/api', '');
                setImageSrc(`${server}/${res.data[0].photoPath}`);
            })
            .catch((err) => {
                console.log("Error :", err);
            })
            .finally(() => {
                setLoading(0);
            });
    }, []);

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
        const pn = getValues('pinLength');

        if (pn < 3 || pn > 7) {
            toast.error("Please Enter PIN Length between 3 and 7");
            return;
        }
        let fd = new FormData();
        if (!getValues('name') || !getValues('timezone')) {
            toast.error("Please fill all the Business fields");
            return;
        }
        fd.append('photo', photo);
        fd.append('name', getValues('name'));
        fd.append('message', getValues('message'));
        fd.append('pinLength', getValues('pinLength'));
        fd.append('timezone', getValues('timezone')); // Add time zone
        console.log("Add Business :", Object.fromEntries(fd));
        
        setLoading(1);

        addBussiness(fd)
            .then((res) => {
                if (res.success) {
                    if (localData.role !== 'superAdmin' && !localData.business) {
                        localData.business = res.data.id;
                        localStorage.setItem('user', JSON.stringify(localData));
                    }
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error(err.response.data.message || "Failed to Add Business");
            })
            .finally(() => {
                setLoading(0);
            });
    };

    return (
        loading === 3 ?
            <Loading />
            :
            <div className="container p-4 poppins-regular">
                <div className='mt-3'>
                    <h1 className='top_heading poppins-medium color_bao'>SETTING</h1>

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
                        <p className='font-20 ms-1' style={{ fontSize: '18px' }}>Athlete ID PIN Length</p>
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

                        <p className='font-20 ms-1' style={{ fontSize: '18px' }}>Select a Time Zone</p>
                        <div className="my-3">
                            <TimezoneSelect
                                value={timeZone}
                                onChange={(timezone) => setValue('timezone', timezone.value)}
                                placeholder="Select Time Zone"
                                className="form-control p-2 bg_dede"
                                styles={{backgroundColor:'transparent'}}
                            />
                        </div>

                        <div className="mb-3">
                            <p className='font-20 ms-1' style={{ fontSize: '18px' }}>Upload Logo</p>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                                        {imageSrc ? (
                                            <img src={imageSrc} alt="Uploaded Logo" style={{ width: '400px', maxWidth: '100%', height: '300px', objectFit: 'cover' }} />
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
                                    <button className="btn mx-2 btns poppins-medium" style={{ width: '150px', }} onClick={hanldeBussiness}>
                                        Save
                                    </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Settings;

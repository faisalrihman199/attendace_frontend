import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToggleOff, ToggleOn } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Upload from '../../../Components/ChildAdmin/Setting/Icons/Upload';
import { useAPI } from '../../../contexts/Apicontext';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { RxCrossCircled } from 'react-icons/rx';
import { SiTicktick } from 'react-icons/si';

const AddAthlete = () => {
    const { register, handleSubmit, getValues, setValue, reset, watch, formState: { errors } } = useForm();
    const [imageSrc, setImageSrc] = useState(null); // State to hold image source
    const fileInputRef = useRef(null); // Create a ref for the file input
    const [emailToggled, setEmailToggle] = useState(true);
    const [selectedValue, setSelectedValue] = useState('team');
    const [selectedTeamClass, setSelectedTeamClass] = useState(''); // State for the selected dropdown value
    const [teams, setTeams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const { allTeams, generatePin, addStudent, checkPin } = useAPI(); // Destructure both functions from context
    const [pinLength, setLength] = useState(0);
    let server = import.meta.env.VITE_APP_API_URL || '';
    const navigate = useNavigate();
    const location = useLocation();

    const { athlete } = location.state || {};
    const pinValue = watch('pin') || 0;
    const [isOkay, setOkay] = useState(false);

    useEffect(() => {
        if (pinValue && pinValue.length === pinLength) {
            console.log("PIN reached the required length:", pinValue);
            checkPin(pinValue)
            .then((res)=>{
                if(res.success){
                    setOkay(true);
                }
                else{
                    toast.error(res.message)
                }
                
            })
            .catch((err)=>{
                console.log("Error ");
            })
        }
        if(pinValue.length < pinLength || pinValue.length < pinLength ){
            setOkay(false);
        }
    }, [pinValue, pinLength]);

    useEffect(() => {
        allTeams()
            .then((res) => {
                console.log("Teams Data:", res);
                setTeams(res.data.teams);
                setClasses(res.data.classes);
                setLength(Number(res.pinLength));
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    }, [allTeams]);

    useEffect(() => {
        if (athlete) {
            server = server.replace('/api', '');
            const formattedDateOfBirth = athlete.dateOfBirth
                ? new Date(athlete.dateOfBirth).toLocaleDateString('en-GB') // Convert date to dd/mm/yyyy
                : '';

            reset({
                pin: athlete.pin || '',
                name: athlete.name || '',
                email: athlete.email || '',
                dateOfBirth: formattedDateOfBirth,
                description: athlete.description || '',

            });


            setSelectedTeamClass(athlete.athleteGroupId || '');
            setEmailToggle(athlete.active);

            // Ensure athlete.photoPath is valid before setting imageSrc
            const photoPath = athlete.photoPath ? `${server}${athlete.photoPath}` : null;
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
        }
    }, []);
    const resetForm = () => {
        photo(null);
        imageSrc(null);
        reset();

    }

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
        setSelectedTeamClass(''); // Clear selection when toggling between team and class
    };

    const handleEmailToggle = () => {
        setEmailToggle((prevState) => !prevState);
    };

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

    const handlePin = () => {
        generatePin()
            .then((res) => {
                setValue('pin', res.data.pin); // Set the generated PIN using react-hook-form's setValue
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    };


    const onSubmit = (data) => {
        if (!selectedTeamClass) {
            toast.error("Please Select a team or Class");
            return;
        }
        
        setLoading(true);
        data.athleteGroupId = selectedTeamClass;
        data.active = emailToggled;
        const formData = new FormData();

        // Loop through the form data object and append each key-value pair to formData
        for (const key in data) {
            formData.append(key, data[key]);
        }
        if(photo){
            formData.append('photo', photo);
        }
        console.log("Form Data:", Object.fromEntries(formData));
        addStudent(formData)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    navigate('/admin/athletes')

                }
                else {
                    toast.error(res.message);

                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error("Failed to add Athelete");

            })
            .finally(() => {
                setLoading(false);
            })
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='poppins-regular'>
            <div className='d-flex align-items-center bg_dede mb-3 password_fields rounded pe-3'>
                <input
                    type='number'
                    placeholder='Student ID / PIN'

                    className="form-control p-2"
                    {...register('pin', {
                        required: 'Student PIN is required', minLength: {
                            value: pinLength,
                            message: `Athlete PIN must be exactly ${pinLength} digits`,
                        },
                        maxLength: {
                            value: pinLength,
                            message: `Athlete PIN must be exactly ${pinLength} digits`,
                        }
                    })}
                    style={{ backgroundColor: 'transparent', border: 'none' }}
                />
                {
                    !athlete &&
                    <span className='cursor-pointer poppins-thin d-flex align-items-center' onClick={handlePin}> 
                    {
                        isOkay?
                        <SiTicktick  className='mx-2' color='green'  />

                        :
                        <RxCrossCircled className='mx-2' color='red' />

                    }
                    
                    Generate
                    </span>
                }

            </div>
            {errors.pin && <span className="text-danger ms-3">{errors.pin.message}</span>}

            <div className="row mb-3">
                <div className="col-sm-12">
                    <input
                        type="text"
                        className="form-control p-2 bg_dede"
                        placeholder='Student Name'
                        {...register('name', { required: 'Student Name is required' })}
                    />
                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12">
                    <input
                        type="email"
                        className="form-control p-2 bg_dede"
                        placeholder='Student Email'
                        {...register('email', { required: 'Student Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                    />
                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                </div>
            </div>

            <div className="row">
                <div className="col-md-12 col-sm-12 mb-3">
                    <input
                        type="text"
                        className="form-control p-2 bg_dede"
                        placeholder="Date of Birth"
                        onFocus={(e) => {
                            e.target.type = 'date';
                        }}
                        onBlur={(e) => {
                            if (!e.target.value) {
                                e.target.type = 'text';
                            }
                        }}
                        {...register('dateOfBirth', { required: 'Date of Birth is required' })}
                    />
                    {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12">
                    <input
                        type="text"
                        className="form-control p-2 bg_dede"
                        placeholder='Description'
                        {...register('description')}
                    />
                </div>
            </div>

            <div className="d-flex mb-3 justify-content-between align-items-center">
                <p className='poppins-regular ms-2 my-2' style={{ fontSize: '20px' }}>Active</p>
                <IconButton onClick={handleEmailToggle} style={{ color: emailToggled ? '#247BA0' : 'gray' }}>
                    {emailToggled ? <ToggleOn fontSize="large" /> : <ToggleOff fontSize="large" />}
                </IconButton>
            </div>

            <div className="my-3">
                <div className='d-flex'>
                    <div className="form-check mx-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="teamClassRadio"
                            id="teamRadio"
                            value="team"
                            checked={selectedValue === 'team'}
                            onChange={handleRadioChange}
                        />
                        <label className="form-check-label" htmlFor="teamRadio" style={{ color: 'black' }}>
                            Team
                        </label>
                    </div>

                    <div className="form-check mx-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="teamClassRadio"
                            id="classRadio"
                            value="class"
                            checked={selectedValue === 'class'}
                            onChange={handleRadioChange}

                        />
                        <label className="form-check-label" htmlFor="classRadio" style={{ color: 'black' }}>
                            Class
                        </label>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12">
                    <select
                        className="form-select p-2 bg_dede"
                        value={selectedTeamClass}
                        onChange={(e) => setSelectedTeamClass(e.target.value)}

                    >
                        <option value="">Select {selectedValue === 'team' ? 'Team' : 'Class'} Name</option>
                        {selectedValue === 'team'
                            ? teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.groupName}
                                </option>
                            ))
                            : classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.groupName}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <p className='font-20 ms-1' style={{ fontSize: '18px' }}>Upload Photo</p>
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

            <div className="d-flex my-2 justify-content-end">
                <button className="btn rounded color_bao poppins-medium" style={{ borderColor: '#247BA0', width: '180px' }} onClick={resetForm} >
                    Cancel
                </button>
                {
                    loading ?
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Adding ...
                        </>
                        :
                        <button type="submit" className="btn mx-2 rounded btns poppins-medium" style={{ width: '180px' }}>
                            Add
                        </button>

                }
            </div>
        </form>
    );
};

export default AddAthlete;

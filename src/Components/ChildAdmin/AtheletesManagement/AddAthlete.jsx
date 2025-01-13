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
import { showToastNotification } from '../../Utilities/toastNotification';

const AddAthlete = () => {
    const { register, handleSubmit, getValues, setValue, reset, watch, formState: { errors } } = useForm();
    const [imageSrc, setImageSrc] = useState(null); // State to hold image source
    const fileInputRef = useRef(null); // Create a ref for the file input
    const [emailToggled, setEmailToggle] = useState(true);
    const [selectedValue, setSelectedValue] = useState('team');
    const [selectedGroups,setSelectedGroups]=useState([])
    const [selectedTeamClass, setSelectedTeamClass] = useState(''); // State for the selected dropdown value
    const [teams, setTeams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const { allTeams, generatePin, addStudent, checkPin,oneAthlete } = useAPI(); // Destructure both functions from context
    const [pinLength, setLength] = useState(0);
    let server = import.meta.env.VITE_APP_API_URL || '';
    const navigate = useNavigate();
    const location = useLocation();

    const availableTeams = teams.filter((team) => !selectedGroups.includes(team));

    const { athlete } = location.state || {};
    const pinValue = watch('pin') || 0;
    const [isOkay, setOkay] = useState(false);
    console.log("Athlete is :", athlete);
    
    useEffect(() => {
        if (pinValue && pinValue.length === pinLength && !athlete) {
            console.log("PIN reached the required length:", pinValue);
            checkPin(pinValue)
                .then((res) => {
                    if (res.success) {
                        setOkay(true);
                    }
                    else {

                        toast.error(res.message)
                    }

                })
                .catch((err) => {
                    console.log("Error ");
                })
        }
        if (pinValue.length < pinLength || pinValue.length < pinLength) {
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
    
    const selectedIds = selectedGroups.map(team => team.id);
    const filteredTeams = teams.filter(team => !selectedIds.includes(team.id));
    const filteredClasses = classes.filter(clas => !selectedIds.includes(clas.id));

    useEffect(() => {
        if (athlete) {
            server = server.replace('/api', '');
            const formattedDateOfBirth = athlete.dateOfBirth
                ? new Date(athlete.dateOfBirth).toLocaleDateString('en-GB') // Convert date to dd/mm/yyyy
                : '';
            oneAthlete(athlete.id)
            .then((res)=>{
                console.log("Response :", res);
                setSelectedGroups(res?.data?.athleteGroups);
                
            })
            .catch((err)=>{
                console.error("Error:", err);
            })
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
        if (selectedGroups.length<1) {
            toast.error("Please Select a team or Class");
            return;
        }
        setLoading(true);
        data.athleteGroupIds = selectedIds;
        data.active = emailToggled;
        const formData = new FormData();

        // Loop through the form data object and append each key-value pair to formData
        for (const key in data) {
            formData.append(key, data[key]);
        }
        if (photo) {
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
    const handleGroupSelect = (val) => {
        const selection = JSON.parse(val && val)
        console.log("Selection is :", selection);
        setSelectedGroups((prevGroups) => [...prevGroups, selection]);
        console.log("Selected Groups :", selectedGroups);
    }
    const handleRemoveGroup=(group)=>{
        const id=group.id;
        setSelectedGroups((prevSelectedGroups) =>
            prevSelectedGroups.filter(group => group.id !== id)
        );
    }
    
    const retrunToAthletesManage = async () => {
        // Defined nav functions
        const functionsMap = {
            navigateAway: () => navigate('/admin/athletes'),
            stayOnPage: () => console.log('Staying on the page...'),
        };
        try {

            // Default input object
            const inputValues = {
                athleteGroups: selectedGroups,
                dateOfBirth: '',
                description: '',
                email: '',
                name: '',
                pin: '',
            };

            // Dynamic element value fetch
            Object.keys(inputValues).forEach(key => {
                const element = document.getElementById(key);
                if (element) inputValues[key] = element.value || '';
            });
            
            // Defined input keys
            const keysToCheck = ['athleteGroups', 'dateOfBirth', 'description', 'email', 'name', 'pin'];

            // Navigation logic
            // Verify if changes have been made or not
            const shouldNavigateAway = !athlete
                ? keysToCheck.every(key => {
                    const inputValue = inputValues[key];
                    const condition = Array.isArray(inputValue)
                        ? inputValue.every((group, index) => group.groupName === (athlete?.[key]?.[index]?.groupName || ''))
                        : inputValue === '';
                    // console.log(`Key: ${key}, Input Value: ${JSON.stringify(inputValue)}, Condition: ${condition}`);
                    return condition;
                })
                : keysToCheck.every(key => {
                    const inputValue = inputValues[key];
                    const athleteValue = athlete[key];
                    const condition = key === 'athleteGroups'
                        ? inputValue.every((group, index) => group.groupName === (athleteValue?.[index]?.groupName || ''))
                        : key === 'dateOfBirth'
                            ? new Date(athleteValue).toLocaleDateString('en-GB') === inputValue
                            : athleteValue === inputValue;
            
                    // console.log(`Key: ${key}, Athlete Value: ${JSON.stringify(athleteValue)}, Input Value: ${JSON.stringify(inputValue)}, Condition: ${condition}`);
                    return condition;
                });
            
            // Navigate if true, else throw warning notification                                    
            if (shouldNavigateAway) {
                navigate('/admin/athletes')
            } else {
                showToastNotification({
                    message: 'You have unsaved changes. Are you sure you want to cancel?',
                    confirmText: 'Confirm',
                    confirmFunction: 'navigateAway',
                    cancelText: 'Cancel',
                    cancelFunction: 'stayOnPage',
                    functionsMap
                });
            }
        } catch (err) {
            console.log("Error :", err);
            toast.error(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='poppins-regular'>
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="pin" className="form-label">
                        Student ID / PIN
                    </label>
                    <span className="tooltip-text-right">Input a Student PIN or click generate to auto populate</span>
                </div>
                <div className="d-flex align-items-center bg_dede mb-3 password_fields rounded pe-3">
                    <input
                    type="number"
                    inputMode="numeric" 
                    pattern="[0-9]*"
                    readOnly={athlete}
                    placeholder='Student ID / PIN (Required)'
                    id="pin"
                    className="form-control p-2"
                    {...register('pin',
                        !athlete &&
                        {
                            required: 'Student ID / PIN (Required)',

                            minLength: {
                                value: pinLength,
                                message: `Athlete PIN must be exactly ${pinLength} digits`,
                            },
                            maxLength: {
                                value: pinLength,
                                message: `Athlete PIN must be exactly ${pinLength} digits`,
                            }
                        }
                    )}
                    style={{ backgroundColor: 'transparent', border: 'none' }}
                />
                {
                    !athlete &&
                    <span className='cursor-pointer poppins-thin d-flex align-items-center' onClick={handlePin}>
                        {
                            isOkay ?
                                <SiTicktick className='mx-2' color='green' />

                                :
                                <RxCrossCircled className='mx-2' color='red' />

                        }

                        Generate
                    </span>
                }
            </div>
            {errors.pin && <span className="text-danger ms-3">{errors.pin.message}</span>}

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="name" className="form-label">
                        Student/Athlete Name
                    </label>
                    <span className="tooltip-text-right">Input the name of the athlete</span>
                    <input
                        type="text"
                        id="name"
                        className="form-control p-2 bg_dede"
                        placeholder='Student Name (Required)'
                        {...register('name', { required: 'Student Name (Required)' })}
                    />
                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <span className="tooltip-text-right">Input the email for the athlete or athlete's parent/guardian</span>
                    <input
                        type="email"
                        id="email"
                        className="form-control p-2 bg_dede"
                        placeholder='Student Email'
                        {...register('email')}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="dateOfBirth" className="form-label">
                        Date of Birth
                    </label>
                    <span className="tooltip-text-right">Input the athlete's date of birth</span>
                    <input
                        type="text"
                        id="dateOfBirth"
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
                        {...register('dateOfBirth')}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <span className="tooltip-text-right">Add additional comments or description to this athlete record</span>
                    <input
                        type="text"
                        id="description"
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
                        onChange={(e) => handleGroupSelect(e.target.value)}
                    >
                        <option value="">Select {selectedValue === 'team' ? 'Team' : 'Class'} Name</option>
                        {selectedValue === 'team' 
                            ? filteredTeams.map((team) => (
                                <option key={team.id} value={JSON.stringify(team)}>
                                    {team.groupName}
                                </option>
                            ))
                            : filteredClasses.map((cls) => (
                                <option key={cls.id} value={JSON.stringify(cls)}>
                                    {cls.groupName}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {selectedGroups &&
                selectedGroups.map((group, index) => (
                    <div
                        key={index}
                        className="d-inline-flex flex-wrap mx-2 align-items-center bg-light border rounded-pill px-2 py-1 my-2"
                    >
                        <span className="me-2 text-sm">{group.groupName}</span>
                        <button
                            type="button"
                            className="btn-close text-danger btn-xs"
                            aria-label="Close"
                            onClick={() => handleRemoveGroup(group)}
                        ></button>
                    </div>
                ))}


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
                <button type="button" className="btn rounded color_bao poppins-medium" style={{ borderColor: '#247BA0', width: '180px' }} onClick={retrunToAthletesManage} >
                    Cancel
                </button>
                {
                    loading ?
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            { athlete ? 'Saving...' : 'Adding...' }
                        </>
                        :
                        <button type="submit" className="btn mx-2 rounded btns poppins-medium" style={{ width: '180px' }}>
                            {athlete?'Update':'Add'}
                        </button>

                }
            </div>
        </form>
    );
};

export default AddAthlete;

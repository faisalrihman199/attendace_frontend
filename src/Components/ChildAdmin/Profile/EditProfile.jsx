import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAPI } from '../../../contexts/Apicontext';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToastNotification } from '../../Utilities/toastNotification';

const EditProfile = ({ profile }) => {
    console.log("Profile is :", profile);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updateProfile } = useAPI();

    const navigate = useNavigate();
    const location = useLocation();
    const isRoot = location.pathname.includes('root');
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };
    useEffect(()=>{
        setValue('firstName', profile.firstName || '');
        setValue('lastName', profile.lastName || '');
        setValue('email', profile.email || '');
    },[profile])


    const onSubmit = (data) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Confirm Password doesn't Match");
            return;
        }
        delete data.confirmPassword;
        setLoading(true);
        console.log(data);
        updateProfile(data, isRoot)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    

                }
                else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                toast.error("Update Profile Failed");
            })
            .finally(() => {
                setLoading(false);
            })
    };

    const returnToBusinesses = async () => {
        // Defined nav functions
        const functionsMap = {
            navigateAway: () => navigate('/root/businesses'),
            stayOnPage: () => console.log('Staying on the page...'),
        };
        try {

            // Default input object
            const inputValues = {
                firstName: '',
                lastName: '',
                email: '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            };

            // Dynamic element value fetch
            Object.keys(inputValues).forEach(key => {
                const element = document.getElementById(key);
                if (element) inputValues[key] = element.value || '';
            });
            
            // Navigation logic
            // Verify if changes have been made or not
            const shouldNavigateAway = !profile 
                ? Object.values(inputValues).every(value => value.trim() === '') // If profile doesn't exist, check if all fields are empty
                : (
                    // If profile exists, ensure no changes and passwords are blank
                    ['firstName', 'lastName', 'email'].every(key => inputValues[key] === profile[key]) &&
                    ['oldPassword', 'newPassword', 'confirmPassword'].every(key => inputValues[key].trim() === '')
                );
            
            // console.log(shouldNavigateAway ? 'shouldNavigateAway: yes' : 'shouldNavigateAway: nah');
                    
            // Navigate if true, else throw warning notification                                    
            if (shouldNavigateAway) {
                navigate('/root/businesses')
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
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container form-group">
                    <label htmlFor="firstName" className="form-label">
                        First Name
                    </label>
                    <span className="tooltip-text-right">Input your first name.</span>
                    <input
                        type="text"
                        id="firstName"
                        className="form-control"
                        placeholder='First Name (Required)'
                        {...register('firstName', { required: 'First Name (Required)' })}
                    />
                    {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                </div>
            </div>
            
            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container form-group">
                    <label htmlFor="lastName" className="form-label">
                        Last Name
                    </label>
                    <span className="tooltip-text-right">Input your last name.</span>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        placeholder='Last Name (Required)'
                        {...register('lastName', { required: 'Last Name (Required)' })}
                    />
                    {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container form-group">
                    <label htmlFor="email" className="form-label">
                        Email Address
                    </label>
                    <span className="tooltip-text-right">Input your email address.</span>
                    <input
                        type="email"
                        readOnly={isRoot}
                        className="form-control"
                        id="email"
                        placeholder='Email Address (Required)'
                        {...register('email', { required: 'Email Address (Required)', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' } })}
                    />
                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container form-group">
                    <label htmlFor="oldPassword" className="form-label">
                        Old Password
                    </label>
                    <span className="tooltip-text-right">Enter your old / current password.</span>
                    <div className='d-flex align-items-center password_fields rounded pe-3' style={{ border: '1px solid #D1D1D1' }}>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder='Enter Old Password'
                            className="form-control"
                            id="oldPassword"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            {...register('oldPassword')}
                        />
                        <i
                            onClick={togglePasswordVisibility}
                            className={`bi ${passwordVisible ? 'bi-eye' : 'bi-eye-slash'}`}
                            style={{ cursor: 'pointer' }}
                        ></i>
                    </div>
                    {errors.oldPassword && <span className="text-danger">{errors.oldPassword.message}</span>}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container form-group">
                    <label htmlFor="newPassword1" className="form-label">
                    New Password
                    </label>
                    <span className="tooltip-text-right">Input a new password.</span>
                    <div className='d-flex align-items-center password_fields rounded pe-3' style={{ border: '1px solid #D1D1D1' }}>
                        <input
                            type={newPasswordVisible ? 'text' : 'password'}
                            placeholder='Enter New Password'
                            className="form-control"
                            id="newPassword"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            {...register('newPassword')}
                        />
                        <i
                            onClick={toggleNewPasswordVisibility}
                            className={`bi ${newPasswordVisible ? 'bi-eye' : 'bi-eye-slash'}`}
                            style={{ cursor: 'pointer' }}
                        ></i>
                    </div>
                    {errors.newPassword && <span className="text-danger">{errors.newPassword.message}</span>}
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-sm-12 tooltip-container form-group">
                    <label htmlFor="newPassword2" className="form-label">
                        Confirm New Password
                    </label>
                    <span className="tooltip-text-right">Re-enter your new password. Ensure it matches the field above.</span>
                    <div className='d-flex align-items-center password_fields rounded pe-3' style={{ border: '1px solid #D1D1D1' }}>
                        <input
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            placeholder='Confirm New Password'
                            className="form-control"
                            id="confirmPassword"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            {...register('confirmPassword')}
                        />
                        <i
                            onClick={toggleConfirmPasswordVisibility}
                            className={`bi ${confirmPasswordVisible ? 'bi-eye' : 'bi-eye-slash'}`}
                            style={{ cursor: 'pointer' }}
                        ></i>
                    </div>
                    {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
                </div>
            </div>

            {/* Submit Button */}
            <div className="d-flex my-2 justify-content-end">
                {
                    isRoot ? 
                        <button type='button' className="btn rounded color_bao poppins-medium " onClick={returnToBusinesses} style={{ borderColor: '#247BA0', width: '180px' }}>
                            Cancel
                        </button>
                    :
                    <></>
                }
                
                {
                    loading ?
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating...
                        </>
                        :

                        <button type="submit" className="btn mx-2 rounded btns poppins-medium" style={{ width: '180px' }}>
                            {
                                profile ?
                                    'Save' :
                                    'Create Account'
                            }

                        </button>
                }
            </div>
        </form>
    );
}

export default EditProfile;

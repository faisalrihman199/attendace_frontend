import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAPI } from '../../contexts/Apicontext';
import { toast } from 'react-toastify';
import { showToastNotification } from '../Utilities/toastNotification';

const SignupForm = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const { signup,createUser } = useAPI(); 
    
    
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state

    const isRootUrl = location.pathname.includes('/root');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
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
                password: '',
                confirmPassword: '',
            };

            // Dynamic element value fetch
            Object.keys(inputValues).forEach(key => {
                const element = document.getElementById(key);
                if (element) inputValues[key] = element.value || '';
            });
            
            // Navigation logic
            // Verify if changes have been made or not
            const shouldNavigateAway = Object.values(inputValues).every(value => value.trim() === '');
            
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

    // Handle form submission and print data
    const onSubmit = async (data) => {
        const { confirmPassword, ...formDataWithoutConfirmPassword } = data;
    
        setLoading(true); // Start loading
        try {
            // Call the signup or createUser API function based on the isRootUrl condition
            const response = await (isRootUrl
                ? createUser(formDataWithoutConfirmPassword)
                : signup(formDataWithoutConfirmPassword));
    
            if (response.success) {
                // Handling successful responses for both conditions
                if (!isRootUrl) {
                    sessionStorage.setItem('otpEmail', data.email);
                    sessionStorage.setItem('userData', JSON.stringify(formDataWithoutConfirmPassword));
                    toast.success(response.message);
                    navigate('/otpVerify');
                } else {
                    toast.success(response.message);
                    sessionStorage.setItem("currentBussiness",response.data.id);
                    navigate('/admin/settings');
                }
            } else {
                // Handle unsuccessful response
                toast.error(response.message);
            }
        } catch (error) {
            // Specific handling if a 409 status is encountered during a root URL request
            console.error("Signup Error:", error);

            if (isRootUrl && error.status === 409) {
                toast.success('User already added. Please add business.');
                sessionStorage.setItem("currentBussiness",error.response.data.userId);
                navigate('/admin/settings');
            } else {
                console.error("Signup Error:", error);
                toast.error(error.response.data.message );
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };
    

    
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                    <div className="col-md-6 col-sm-12 mb-1 tooltip-container">
                        <label htmlFor="firstName" className="form-label" style={{float: 'left'}}>
                            First Name
                        </label>
                        <span className="tooltip-text-right">Input a first name.</span>
                        <input 
                            type="text" 
                            id="firstName"
                            className="form-control p-2 bg_dede" 
                            placeholder='First Name' 
                            {...register('firstName', { required: 'First Name is required' })}
                        />
                        {errors.firstName && <p className="text-danger">{errors.firstName.message}</p>}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-1 tooltip-container">
                        <label htmlFor="lastName" className="form-label" style={{float: 'left'}}>
                            Last Name
                        </label>
                        <span className="tooltip-text-right">Input a last name.</span>
                        <input 
                            type="text" 
                            id="lastName"
                            className="form-control p-2 bg_dede" 
                            placeholder='Last Name' 
                            {...register('lastName', { required: 'Last Name is required' })}
                        />
                        {errors.lastName && <p className="text-danger">{errors.lastName.message}</p>}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-12 tooltip-container">
                        <label htmlFor="email" className="form-label" style={{float: 'left'}}>
                            Email
                        </label>
                        <span className="tooltip-text-right">Input an email address.</span>
                        <input 
                            type="email" 
                            id="email"
                            className="form-control p-2 bg_dede" 
                            placeholder='Email Address' 
                            {...register('email', { 
                                required: 'Email is required', 
                                pattern: { 
                                    value: /^\S+@\S+$/i, 
                                    message: 'Invalid email address' 
                                } 
                            })}
                        />
                        {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>
                </div>
                {/* Password Field */}
                <div className="row mb-3">
                    <div className="col-sm-12 tooltip-container form-group">
                        <div className="d-grid" style={{ gridTemplateColumns: '1fr', rowGap: '0.25rem' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <label htmlFor="password" className="form-label">
                            Password
                            </label>
                            <span className="tooltip-text-right">Input the password.</span>
                        </div>
                        <div className="d-flex align-items-center bg_dede password_fields rounded pe-3">
                            <input
                            type={passwordVisible ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter Password"
                            className="form-control p-2"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            {...register('password', { required: 'Password is required' })}
                            />
                            <i
                            onClick={togglePasswordVisibility}
                            className={`bi ${passwordVisible ? 'bi-eye' : 'bi-eye-slash'}`}
                            style={{ cursor: 'pointer', margin: '-4px 0px 0px 0px' }}
                            ></i>
                        </div>
                        </div>
                        {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>
                </div>
                {/* Confirm Password Field */}
                <div className="row mb-3">
                    <div className="col-sm-12 tooltip-container form-group">
                        <div className="d-grid" style={{ gridTemplateColumns: '1fr', rowGap: '0.25rem' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                            </label>
                            <span className="tooltip-text-right">
                            Input the password again, matching case sensitivity and special characters.
                            </span>
                        </div>
                        <div className="d-flex align-items-center bg_dede password_fields rounded pe-3">
                            <input
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            className="form-control p-2"
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) => value === getValues('password') || "Passwords do not match"
                            })}
                            />
                            <i
                            onClick={toggleConfirmPasswordVisibility}
                            className={`bi ${confirmPasswordVisible ? 'bi-eye' : 'bi-eye-slash'}`}
                            style={{ cursor: 'pointer', margin: '-4px 0px 0px 0px' }}
                            ></i>
                        </div>
                        </div>
                        {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                    </div>
                </div>
                <div className="row">
                    { isRootUrl 
                            ? 
                            <div className="col-sm-6">
                                <button className="btn btns w-100 d-flex justify-content-center align-items-center" type="button" onClick={returnToBusinesses}>
                                    Cancel
                                </button>
                            </div>
                            :
                            <></>
                        }
                    <div className={isRootUrl ? 'col-sm-6' : 'col-sm-12'}>
                        <button className="btn btns w-100 d-flex justify-content-center align-items-center" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creating Account...
                                </>
                            ) : (
                                isRootUrl ? 'Add Business' : 'Create Account'
                            )}
                        </button>
                    </div>
                </div>
                <div 
                className="row align-center justify-center terms-of-service-section" 
                >
                { !isRootUrl 
                    ? 
                    <>
                        <div className='mt-3 col-sm-12'>
                        <p className='poppins-light' style={{fontSize:'16px'}}>
                            By creating an account, you are agreeing to our terms of service.
                        </p>
                        </div>
                        <div className="col-sm-12">
                        <a href="https://attendace.net/terms-of-service/" target="_blank" rel="noopener noreferrer">
                            Terms of Service
                        </a>
                        </div>
                    </>
                    :
                    <></>
                }
                </div>
            </form>
        </>
    );
}

export default SignupForm;

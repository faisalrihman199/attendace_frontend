import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAPI } from '../../contexts/Apicontext';
import { toast } from 'react-toastify';

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
                <div className="row">
                    <div className="col-md-6 col-sm-12 mb-3">
                        <input 
                            type="text" 
                            className="form-control p-2 bg_dede" 
                            placeholder='First Name' 
                            {...register('firstName', { required: 'First Name is required' })}
                        />
                        {errors.firstName && <p className="text-danger">{errors.firstName.message}</p>}
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                        <input 
                            type="text" 
                            className="form-control p-2 bg_dede" 
                            placeholder='Last Name' 
                            {...register('lastName', { required: 'Last Name is required' })}
                        />
                        {errors.lastName && <p className="text-danger">{errors.lastName.message}</p>}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-12">
                        <input 
                            type="email" 
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
                    <div className="col-sm-12">
                        <div className='d-flex align-items-center bg_dede  password_fields rounded pe-3'>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder='Enter Password'
                                className="form-control p-2"
                                style={{ backgroundColor: 'transparent', border: 'none' }}
                                {...register('password', { required: 'Password is required' })}
                            />
                            <i
                                onClick={togglePasswordVisibility}
                                className={`bi ${passwordVisible ? 'bi-eye' : 'bi-eye-slash'}`}
                                style={{ cursor: 'pointer' }}
                            ></i>
                        </div>
                        {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>
                </div>
                {/* Confirm Password Field */}
                <div className="row mb-3">
                    <div className="col-sm-12">
                        <div className='d-flex align-items-center bg_dede password_fields rounded pe-3'>
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                placeholder='Confirm Password'
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
                                style={{ cursor: 'pointer' }}
                            ></i>
                        </div>
                        {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
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
            </form>
        </>
    );
}

export default SignupForm;

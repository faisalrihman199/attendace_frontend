import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import "../../assets/CSS/OTP_Verification.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAPI } from '../../contexts/Apicontext';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const ResetPassword = () => {
    const { register, formState: { errors }, getValues } = useForm();
    const navigate = useNavigate();
    const { sendOtp } = useAPI();
    const [isHovered, setIsHovered] = useState(false);


    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };


    // Inline style for the button
    const buttonStyle = {
        fontSize: '24px',
        color: '#50514F',
        borderRadius: '20px',
        backgroundColor: isHovered ? '#D1DEDE' : '#D1DEDE',
        transition: 'background-color 0.3s ease',
    };

    // Media query to override styles for mobile (max-width: 767px)
    const mediaQueryStyle = `
        @media only screen and (max-width: 767px) {
            input {
                width: 2em !important;
                height: 2em !important;
            }
        }
    `;
    const handleSubmit = () => {
        console.log("Inside Function");

        if (getValues('password') !== getValues('confirmPassword')) {
            toast.error("Password don't matched")
            return
        }
        const data = {
            email:getValues('email'),
            password: getValues('password')
        }
        setLoading(true)
        sendOtp({email:data.email})
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    sessionStorage.setItem("forgotEmail", data.email);
                    navigate('/otpVerify',{state:data})
                }
                else {
                    toast.error(res.message);

                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error(res.message);

            })
            .finally(() => {
                setLoading(false)
            })


    }






    return (
        <>
            <style>{mediaQueryStyle}</style>
            <div className="auth bg_dede p-3 p-md-5">
                <div className="row p-4 upper_frame">
                    <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center">
                        <h1 className='poppins-semibold color_bao main_heading'>
                            <span>Chnage Your Password </span>
                        </h1>
                        <div className="row mb-3 w-100">
                            <div className="col-sm-12 w-100">
                                <div className='d-flex w-100 align-items-center bg_dede  password_fields rounded pe-3'>
                                    <input
                                        type='email' 
                                        placeholder='Enter Your Emaill'
                                        className="form-control p-2"
                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                    
                                </div>
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="row mb-3 w-100">
                            <div className="col-sm-12 w-100">
                                <div className='d-flex w-100 align-items-center bg_dede  password_fields rounded pe-3'>
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
                        <div className="row mb-3 w-100">
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


                        <button
                            className='btn w-100 mx-3 text-white my-4 p-3 px-5 poppins-medium d-flex justify-content-center align-items-center'

                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleSubmit}
                            style={{ backgroundColor: '#247BA0' }}
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Changing Password
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;

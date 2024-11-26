import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../../assets/CSS/Auth.css";
import signup from "../../assets/images/Auth/signup.png";
import { Link, useNavigate } from 'react-router-dom';
import { useAPI } from '../../contexts/Apicontext';
import { toast } from 'react-toastify';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // New loading state


    const { login } = useAPI()

    sessionStorage.removeItem("forgotEmail");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    /**
     * Handles the forgot password click event.
     * 
     * If the email input field is empty, logs a message to the console.
     * Otherwise, sets the "forgotEmail" key in session storage to the value of the email input field.
     * The user is not navigated to the OTP verification page for now.
     */
    const handleForgot = () => {
        const email = getValues('email')
        if (!email) {
            alert('Enter Email to Forgott');
            return
        }
        sessionStorage.setItem("forgotEmail", email);

        navigate("/otpVerify");
    };

    const handleLogin = async (data) => {
        setLoading(true);
        try {
            const res = await login(data);

            if (res.success && res.data) {
                localStorage.setItem("user", JSON.stringify(res.data));
                if (res.data.role === "admin") {
                    if(res.data.subscriptionStatus!=='active'){
                        navigate('/subscription')
                    }
                    else if(!res.data.business){
                        
                        navigate('/admin/settings')
                    }
                    else{
                        navigate("/admin/dashboard");
                    }
                } else if(res.data.role === "superAdmin") {
                    navigate("/root/businesses");
                }
            } else {
                console.error("Login failed:", res);
                toast.error(res.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error(error.message);

        }
        finally{
            setLoading(false);
        }
    };


    return (
        <div className="auth bg_dede p-3 p-md-5">
            <div className="row p-4 upper_frame">
                <div className="col-md-6 no_mobile">
                    <img className='w-100 col_1' src={signup} alt="signup" />
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="d-flex h-100 col_2 justify-content-center">
                        <h1 className='poppins-semibold color_bao main_heading'>LOGIN</h1>
                        <p className='sub_para'>
                            Don’t have an Account? <Link className='color_bao poppins-medium' to='/signup'>SignUp</Link>
                        </p>
                        <form onSubmit={handleSubmit(handleLogin)}>
                            {/* Email Field */}
                            <div className="row mb-3">
                                <div className="col-sm-12">
                                    <input
                                        type="email"
                                        className="form-control p-2 bg_dede"
                                        placeholder='Email Address'
                                        {...register('email', { required: 'Email is required' })}
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
                                            id="password"
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

                            <p onClick={handleForgot} className='sub_para color_bao mb-3 cursor-pointer'>
                                Forgot Password?
                            </p>

                            <div className="row">
                                <div className="col-sm-12">
                                    {loading ? (
                                        <div className='text-center'>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Logging in...
                                        </div>
                                    ) :
                                        <button type="submit" className="btn btns w-100">
                                            Login
                                        </button>
                                    }
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

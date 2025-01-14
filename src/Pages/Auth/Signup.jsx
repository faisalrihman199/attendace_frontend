import React, { useState } from 'react';
import "../../assets/CSS/Auth.css";
import logo from "../../assets/Logo.png";
import { Link } from 'react-router-dom';
import SignupForm from '../../Components/Signup/SignupForm';

const Signup = () => {
    
    return (
        <div 
        className="auth bg_dede p-3 p-md-5 d-flex justify-content-center align-items-center"
        style={{ textAlign: 'center' }}
        >
            <div className="row p-4 upper_frame w-100">
                <div className="col-md-6 col-sm-12 mx-auto" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="d-flex flex-column h-100 justify-content-center align-items-center" >
                        <div className="row">
                            <img 
                                src={logo} 
                                alt="signup" 
                                style={{ 
                                    maxWidth: '100%', 
                                    height: 'auto', 
                                    width: '100%', 
                                    objectFit: 'contain' 
                                }} 
                            />
                        </div>

                        <h1 className="poppins-semibold color_bao main_heading">CREATE AN ACCOUNT</h1>
                        <p className="sub_para">
                        Already have an account? <Link className="color_bao poppins-medium" to="/login">Sign In</Link>
                        </p>
                        <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

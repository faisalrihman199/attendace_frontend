import React, { useState } from 'react';
import "../../assets/CSS/Auth.css";
import signup from "../../assets/images/Auth/signup.png";
import { Link } from 'react-router-dom';
import SignupForm from '../../Components/Signup/SignupForm';

const Signup = () => {
    
    return (
        <div className="auth bg_dede p-3 p-md-5">
            <div className="row p-4 upper_frame">
                <div className="col-md-6 no_mobile">
                    <img className='w-100 col_1' src={signup} alt="signup" />
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="d-flex h-100 col_2 justify-content-center">
                        <h1 className='poppins-semibold color_bao main_heading'>CREATE AN ACCOUNT</h1>
                        <p className='sub_para'>
                            Already have an account? <Link className='color_bao poppins-medium' to='/login'>SignIn</Link>
                        </p>
                       <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../../Components/Navbar';
import Footer from '../../../Components/Footer';
import { useLocation } from 'react-router-dom';
import { useAPI } from '../../../contexts/Apicontext';
import { toast } from 'react-toastify';

const Contact = () => {
    const user = localStorage.getItem("user");
    const { register, handleSubmit } = useForm();
    const location = useLocation();
    const isAdmin = location.pathname.includes('/admin');
    const { contact } = useAPI();
    const [loading, setLoading] = useState(false);
    const onSubmit = (data) => {
        console.log("Form Data: ", data);
        setLoading(true);
        contact(data)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message)
                }
                else {
                    toast.error(res.message)

                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error("Contact Send failed")

            })
            .finally(() => {
                setLoading(false);
            })

    };

    return (
        <>
            {!isAdmin && <Navbar />}
            <div className="container p-4 poppins-regular">
                <div className='mt-3'>
                    <h1 className='top_heading poppins-medium color_bao'>Contact Us</h1>
                    <p className='poppins-light my-2' style={{ fontSize: '16px' }}>Here is some information about us.</p>
                </div>

                <div className="my-2">
                    <h1 className='font-20 poppins-medium my-2'>Our Phone No.</h1>
                    <p className='poppins-light my-2' style={{ fontSize: '16px' }}>
                        <a href="tel:4843742300" style={{ textDecoration: 'none', color: 'blue' }}>
                            484 374 2300
                        </a>
                    </p>
                </div>
                <div className="my-2">
                    <h1 className='font-20 poppins-medium my-2'>Our Email Address</h1>
                    <p className='poppins-light my-2' style={{ fontSize: '16px' }}>
                        <a href="mailto:Info@attendance.net" style={{ textDecoration: 'none', color: 'blue' }}>
                            Info@attendance.net
                        </a>
                    </p>
                </div>

                <div className="my-3">
                    <p className='poppins-light my-2' style={{ fontSize: '20px' }}>Or you can email us your queries.</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="my-2">
                        <div className="row">
                            <div className="col-md-6 col-sm-12 mb-1">
                                <input
                                    type="text"
                                    className="form-control p-2 bg_dede"
                                    placeholder='First Name'
                                    {...register('firstName', { required: true })}
                                />
                            </div>
                            <div className="col-md-6 col-sm-12 mb-1">
                                <input
                                    type="text"
                                    className="form-control p-2 bg_dede"
                                    placeholder='Last Name'
                                    {...register('lastName', { required: true })}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-sm-12">
                                <input
                                    type="text"
                                    className="form-control my-2 p-2 bg_dede"
                                    placeholder='Business Name'
                                    {...register('businessName')}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-sm-12">
                                <input
                                    type="text"
                                    className="form-control my-2 p-2 bg_dede"
                                    placeholder='Phone No.'
                                    {...register('phoneNumber')}
                                />
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-sm-12">
                                <input
                                    type="email"
                                    className="form-control my-2 p-2 bg_dede"
                                    placeholder='Email Address'
                                    {...register('email', { required: true })}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <textarea
                                placeholder='Message'
                                className='form-control p-2 bg_dede'
                                rows={5}
                                style={{ resize: 'none' }}
                                {...register('message', { required: true })}
                            ></textarea>
                        </div>
                        <div className="my-2">
                            {
                                loading ?
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Sending...
                                    </>
                                    :
                                    <button
                                        type="submit"
                                        className="btn mx-2 btns poppins-medium"
                                        style={{ width: '150px' }}
                                    >
                                        Send
                                    </button>

                            }
                        </div>
                    </div>
                </form>
            </div>
            {!isAdmin && <Footer />}
        </>
    );
};

export default Contact;

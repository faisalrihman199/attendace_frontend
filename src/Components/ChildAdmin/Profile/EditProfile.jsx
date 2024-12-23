import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAPI } from '../../../contexts/Apicontext';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const EditProfile = ({ profile }) => {
    console.log("Profile is :", profile);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updateProfile } = useAPI();

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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                {/* First Name Field */}
                <div className="col-md-12 col-sm-12 mb-3">
                    <div className="form-group">
                        <label className="poppins-regular font-20 ms-1 prfile_label" htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder='First Name'
                            {...register('firstName', { required: 'First Name is required' })}
                        />
                        {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                    </div>
                </div>

                {/* Last Name Field */}
                <div className="col-md-12 col-sm-12 mb-3">
                    <div className="form-group">
                        <label className="poppins-regular font-20 ms-1 prfile_label" htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder='Last Name'
                            {...register('lastName', { required: 'Last Name is required' })}
                        />
                        {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
                    </div>
                </div>
            </div>

            {/* Email Field */}
            <div className="row mb-3">
                <div className="col-sm-12">
                    <div className="form-group">
                        <label className="poppins-regular font-20 ms-1 prfile_label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            readOnly={isRoot}
                            className="form-control"
                            id="email"
                            placeholder='Email Address'
                            {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' } })}
                        />
                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                    </div>
                </div>
            </div>

            {/* Old Password Field */}
            <div className="row mb-3">
                <div className="col-sm-12">
                    <div className="form-group">
                        <label className="poppins-regular font-20 ms-1 prfile_label" htmlFor="oldPassword">Old Password</label>
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
            </div>

            {/* New Password Field */}
            <div className="row mb-3">
                <div className="col-sm-12">
                    <div className="form-group">
                        <label className="poppins-regular font-20 ms-1 prfile_label" htmlFor="newPassword">New Password</label>
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
            </div>

            {/* Confirm Password Field */}
            <div className="row mb-3">
                <div className="col-sm-12">
                    <div className="form-group">
                        <label className="poppins-regular font-20 ms-1 prfile_label" htmlFor="confirmPassword">Confirm New Password</label>
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
            </div>

            {/* Submit Button */}
            <div className="d-flex my-2 justify-content-end">
                <button type="button" className="btn rounded color_bao poppins-medium" style={{ borderColor: '#247BA0', width: '180px' }}>
                    Cancel
                </button>
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

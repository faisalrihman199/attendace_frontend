import React, { useState } from 'react';
import { ToggleOff, ToggleOn } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAPI } from '../../contexts/Apicontext';
import { toast } from 'react-toastify';
import Loading from '../Loading';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const BusinessCard = ({ business, setChange }) => {
    const [emailToggled, setEmailToggle] = useState(business?.status === 'active');
    const [paidToggled, setPaidToggled] = useState(business?.trialPaid);
    const { deleteBussiness, updateBussinessStatus, updateTrialPaid } = useAPI();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(0);

    const handleEmailToggle = () => {
        setLoading(2);
        updateBussinessStatus(business.id)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    setEmailToggle(prev => !prev);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error(err.message);
            })
            .finally(() => {
                setLoading(0);
            });
    };

    const handlePaidToggle = () => {
        setLoading(3);
        updateTrialPaid(business.id)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    setPaidToggled(prev => !prev);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                console.log("Error :", err);
                toast.error(err.message);
            })
            .finally(() => {
                setLoading(0);
            });
    };

    const handleEdit = () => {
        sessionStorage.setItem('currentBussiness', business.userId);
        navigate('/admin/dashboard');
    };

    const confirmDelete = (fromCancelRequest = false) => {
        confirmAlert({
            title: 'Confirm Action',
            message: fromCancelRequest
                ? 'Approve cancel subscription request and delete this business?'
                : 'Are you sure you want to delete this business?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: handleDelete
                },
                {
                    label: 'No',
                    onClick: () => console.log("Action cancelled")
                }
            ]
        });
    };

    const handleDelete = () => {
        setLoading(1);
        deleteBussiness(business.id)
            .then((res) => {
                if (res.success) {
                    setChange(prev => !prev);
                    toast.success(res.message);
                    window.location.reload();
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                toast.error(err.message);
                console.log("Error while Delete:", err);
            })
            .finally(() => {
                setLoading(0);
            });
    };

    const handleCancelReject = () => {
        toast.info("Cancel request not approved");
        // Optional: call an API here to mark cancelRequested as false if needed
    };

    return (
        <div className="col-md-6 col-sm-12 p-1 my-2">
            <div className="bg_dede p-3 py-4" style={{ borderRadius: '15px' }}>
                <h3 className="poppins-medium my-1" style={{ fontSize: '28px' }}>
                    {business.name}
                </h3>
                <p className="my-1 poppins-regular" style={{ fontSize: '16px' }}>
                    <strong>Owner:</strong> {business.ownerName}
                </p>

                {/* Cancel Subscription Request Section */}
                {
                    business?.cancelRequested && (
                        <div className="alert alert-warning my-3 p-3 d-flex justify-content-between align-items-center" style={{ borderRadius: '10px' }}>
                            <div>
                                <p className="mb-1 poppins-medium">
                                    <strong>Cancel Subscription Request</strong>
                                </p>
                                <p className="mb-0 small text-muted">The user has requested to cancel their subscription.</p>
                            </div>
                            <div className="d-flex align-items-center">
                                {
                                    loading === 1 ? (
                                        <Loading />
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-danger btn-sm me-2"
                                                onClick={() => confirmDelete(true)}
                                            >
                                                <i className="bi bi-check-circle-fill me-1"></i> Approve
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={handleCancelReject}
                                                title="Don't Approve"
                                            >
                                                <i className="bi bi-x-circle-fill"></i>
                                            </button>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    )
                }

                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <p className="poppins-regular my-2" style={{ fontSize: '16px' }}><strong>Active</strong></p>
                        {
                            loading === 2 ? <Loading /> :
                                <IconButton onClick={handleEmailToggle} style={{ color: emailToggled ? '#247BA0' : 'white' }}>
                                    {emailToggled ? <ToggleOn fontSize="large" /> : <ToggleOff fontSize="large" />}
                                </IconButton>
                        }
                    </div>
                    <div className="d-flex align-items-center">
                        <p className="poppins-regular my-2" style={{ fontSize: '16px' }}><strong>Trial Paid</strong></p>
                        {
                            loading === 3 ? <Loading /> :
                                <IconButton onClick={handlePaidToggle} style={{ color: paidToggled ? '#247BA0' : 'white' }}>
                                    {paidToggled ? <ToggleOn fontSize="large" /> : <ToggleOff fontSize="large" />}
                                </IconButton>
                        }
                    </div>
                </div>

                <div className="d-flex my-2 align-items-center justify-content-end">
                    <span className="mx-2 cursor-pointer" style={{ height: '25px' }}>
                        <i
                            className="bi bi-pencil mx-2"
                            style={{ cursor: 'pointer', fontSize: '25px' }}
                            onClick={handleEdit}
                        ></i>
                    </span>
                    <span className="mx-2 cursor-pointer" style={{ height: '25px' }}>
                        {
                            loading === 1 ? <Loading /> :
                                <i
                                    className="bi bi-trash mx-2"
                                    style={{ cursor: 'pointer', fontSize: '25px' }}
                                    onClick={() => confirmDelete(false)}
                                ></i>
                        }
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BusinessCard;

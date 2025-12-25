import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Logo from "../../assets/Logo.png";
import Bussiness from "../../assets/images/Dummy/bussiness_dummy.png";
import person from "../../assets/images/Dummy/Profile.png";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAPI } from '../../contexts/Apicontext';
import Loading from '../../Components/Loading';
import CryptoJS from "crypto-js";

const CheckIn = () => {
    const [checked, setChecked] = useState(false);
    const [showWaiverModal, setShowWaiverModal] = useState(false);
    const [waiverFormData, setWaiverFormData] = useState({
        athleteName: '',
        parentGuardianName: '',
        email: '',
        phone: '',
        agreeToTerms: false
    });
    const [submittingWaiver, setSubmittingWaiver] = useState(false);
    const { register, setValue, formState: { errors }, getValues } = useForm();
    const { name } = useParams();
    const businessId = name?.split('@')[name?.split('@').length - 1];
    const [athleteName, setAthlete] = useState(null);
    const [athleteMessage, setMessage] = useState(null);
    const [pic, setPic] = useState(person);
    const [scanResult, setScanResult] = useState(null);
    const [manualSerialNumber, setManualSerialNumber] = useState('');
    const [showScanner, setShowScanner] = useState(false); // State to toggle scanner visibility
    const { checkIn, getBussiness } = useAPI();
    const [loading, setLoading] = useState(false);
    const [business, setBusiness] = useState(null);
    const [photo, setPhoto] = useState(Bussiness);
    const [startLoading, setStart] = useState(false);
    const secretKey = import.meta.env.VITE_APP_SECRET_KEY;



    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 5,
            });

            let isScanning = true;

            scanner.render(success, error);

            function success(result) {
                if (isScanning) {
                    scanner.clear();
                    setScanResult(result);
                    isScanning = false;
                    setShowScanner(false);
                    setValue('pin', result);
                    handleCheckIn(result);
                }
            }

            function error(err) {
                console.warn(err);
            }

            return () => {
                scanner.clear();
            };
        }
    }, [showScanner]);

    let server = import.meta.env.VITE_APP_API_URL;
    useEffect(() => {
        setStart(true);
        if (name) {
            getBussiness({ name: name.split('@').slice(0, -1).join('@') })
                .then((res) => {
                    console.log("Response is :", res);
                    setBusiness(res.data)

                    server = server.replace('/api', '');
                    if (res.data.photo) {

                        setPhoto(`${server}/${res.data.photo}`);
                    }
                })
                .catch((err) => {
                    console.log("Error :", err);
                })
                .finally(() => {
                    setStart(false);
                })
        }
    }, [])

    function decryptBusinessId(encrypted) {
        if (!encrypted.startsWith('RG') || !encrypted.includes('W')) {
            throw new Error("Invalid encrypted format.");
        }

        // Extract the number part from the encrypted string
        const numberPart = encrypted.slice(2, encrypted.indexOf('W'));
        const encryptedNum = parseInt(numberPart, 10);
        const plusTwo = parseInt(encrypted.slice(encrypted.indexOf('W') + 1), 10);

        // Perform the decryption: Subtract 2 from the number
        if (isNaN(encryptedNum) || isNaN(plusTwo)) throw new Error("Invalid encrypted data.");

        const decrypted = plusTwo - 2;

        return decrypted;
    }

    const handleCheckIn = (pin) => {
        if (!getValues('pin') && !pin) {
            toast.error("Please Enter PIN or Scan QR Code");
            return;
        }
        const data = {
            pin: getValues('pin'),
            businessId: decryptBusinessId(businessId)
        };

        console.log("Data to be submit is :", data);


        setLoading(true);
        checkIn(data)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    setAthlete(res.data.athleteName);
                    setMessage(res.data.athleteMessage);
                    if (res.data.photoPath) {
                        setPic(`${server.split('/api')[0]}${res.data.photoPath}`)
                    }
                    setChecked(true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                console.log("Error :", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const handleWaiverSubmit = async (e) => {
        e.preventDefault();

        if (!waiverFormData.athleteName || !waiverFormData.parentGuardianName || 
            !waiverFormData.email || !waiverFormData.phone || !waiverFormData.agreeToTerms) {
            toast.error("Please fill all fields and agree to the terms");
            return;
        }

        setSubmittingWaiver(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/business/submitWaiver`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    businessId: decryptBusinessId(businessId),
                    ...waiverFormData
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Waiver submitted successfully! Confirmation emails have been sent.");
                setShowWaiverModal(false);
                setWaiverFormData({
                    athleteName: '',
                    parentGuardianName: '',
                    email: '',
                    phone: '',
                    agreeToTerms: false
                });
            } else {
                toast.error(result.message || "Failed to submit waiver");
            }
        } catch (error) {
            console.error("Error submitting waiver:", error);
            toast.error("An error occurred while submitting the waiver");
        } finally {
            setSubmittingWaiver(false);
        }
    };

    const handleWaiverInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWaiverFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    return (

        startLoading ?
            <Loading />
            :
            <div className='container poppins-regular' style={{ height: '100%', minHeight: '100vh' }}>
                <div className="d-flex flex-column h-100 justify-content-center">
                    <div className='d-flex w-100 justify-content-center'>
                        <img src={Logo} alt="" style={{ width: '100%', maxWidth: '500px', height: '150px' }} />
                    </div>
                    <div className="my-2 d-flex justify-content-center">
                        <img className='rounded' src={photo} height={250} style={{ width: '500px', maxWidth: '90%' }} alt="" />
                    </div>
                    <div className="my-2">
                        <h6 className='text-center Josefin-Sans' style={{ fontSize: '28px', fontWeight: '600' }}>{name?.split('@')[0]}</h6>
                    </div>
                    <div className="my-2">
                        <p className='text-center poppins-regular'>{business?.message}</p>
                    </div>
                    {
                        checked ?
                            <div className='d-flex justify-content-center'>
                                <div className='my-4' style={{ width: '100%', maxWidth: '700px' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className='poppins-thin' style={{ fontSize: '28px' }}>
                                            THANK YOU <b>{athleteName.toUpperCase()}</b> FOR CHECKING IN. YOUR TIME HAS BEEN RECORDED AND SENT TO YOUR EMAIL.
                                        </p>
                                        <div className='mx-3'>
                                            <img src={pic} className='rounded-circle' alt="" height={144} width={144} />
                                        </div>
                                    </div>
                                    {
                                        athleteMessage &&
                                        <div className='text-danger text-center' > <p className='poppins-thin' style={{ fontSize: '28px' }}>
                                            <i className='fw-bold' >{athleteMessage?.toUpperCase()}</i>
                                        </p> </div>
                                    }
                                </div>
                            </div>
                            :
                            <div>
                                <div className="my-3">
                                    <h1 className='poppins-bold color_bao' style={{ fontSize: '36px' }}>ATHLETE CHECK IN</h1>
                                </div>
                                <div className="my-3">
                                    <p className='poppins-regular font-20 mb-2 ms-1'>Enter PIN to Check-In</p>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className="form-control p-2 bg_dede mb-2"
                                        placeholder="PIN"
                                        autoComplete="new-password"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleCheckIn();
                                            }
                                        }}
                                        {...register('pin')}
                                    />


                                    <div className="d-flex justify-content-center">
                                        {
                                            loading ?
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Checking in ..
                                                </>
                                                :
                                                <button className="btn btns" onClick={handleCheckIn} >
                                                    Check In
                                                </button>
                                        }
                                    </div>
                                </div>
                                <div className="my-4">
                                    <p className='text-center poppins-regular'>Check In with QR Code</p>
                                    <div className="d-flex justify-content-center">
                                        <button className="btn btns" onClick={() => setShowScanner(true)}>
                                            Scan QR Code
                                        </button>
                                    </div>
                                </div>

                                {business?.waiverActive && (
                                    <div className="my-4">
                                        <div className="d-flex justify-content-center">
                                            <button 
                                                className="btn btns" 
                                                
                                                onClick={() => setShowWaiverModal(true)}
                                            >
                                                Liability Waiver
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                    }
                </div>

                {/* Modal for QR Code Scanner */}
                {showScanner && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Scan QR Code</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowScanner(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div id="reader" style={{ width: '100%' }}></div>
                                    {scanResult && (
                                        <div className="mt-3">
                                            <p>Success: <a href={scanResult}>{scanResult}</a></p>
                                            <p>Serial Number: {scanResult.slice(-16)}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowScanner(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for Liability Waiver */}
                {showWaiverModal && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header" style={{ backgroundColor: '#247BA0', color: 'white' }}>
                                    <h5 className="modal-title poppins-medium">Liability Waiver Form</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close btn-close-white" 
                                        aria-label="Close" 
                                        onClick={() => setShowWaiverModal(false)}
                                    ></button>
                                </div>
                                <form onSubmit={handleWaiverSubmit}>
                                    <div className="modal-body poppins-regular">
                                        <div className="mb-3">
                                            <label htmlFor="athleteName" className="form-label">
                                                Athlete Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="athleteName"
                                                name="athleteName"
                                                value={waiverFormData.athleteName}
                                                onChange={handleWaiverInputChange}
                                                placeholder="Enter athlete name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="parentGuardianName" className="form-label">
                                                Parent/Guardian Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="parentGuardianName"
                                                name="parentGuardianName"
                                                value={waiverFormData.parentGuardianName}
                                                onChange={handleWaiverInputChange}
                                                placeholder="Enter parent/guardian name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={waiverFormData.email}
                                                onChange={handleWaiverInputChange}
                                                placeholder="Enter email address"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">
                                                Phone <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phone"
                                                name="phone"
                                                value={waiverFormData.phone}
                                                onChange={handleWaiverInputChange}
                                                placeholder="Enter phone number"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3 p-3" style={{ backgroundColor: '#f5f5f5', borderLeft: '4px solid #2c5aa0', maxHeight: '300px', overflowY: 'auto' }}>
                                            <h6 className="poppins-medium mb-2">Liability Waiver:</h6>
                                            <p style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                                                {business?.waiverText}
                                            </p>
                                        </div>

                                        <div className="form-check mb-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="agreeToTerms"
                                                name="agreeToTerms"
                                                checked={waiverFormData.agreeToTerms}
                                                onChange={handleWaiverInputChange}
                                                required
                                            />
                                            <label className="form-check-label" htmlFor="agreeToTerms">
                                                I agree with the terms and conditions above <span className="text-danger">*</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => setShowWaiverModal(false)}
                                            disabled={submittingWaiver}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btns"
                                            disabled={submittingWaiver}
                                        >
                                            {submittingWaiver ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Waiver'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default CheckIn;

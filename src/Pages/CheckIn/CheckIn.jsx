import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Logo from "../../assets/Logo.png";
import Bussiness from "../../assets/images/Dummy/Bussiness.png";
import person from "../../assets/images/Dummy/Profile.png";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAPI } from '../../contexts/Apicontext';
import Loading from '../../Components/Loading';

const CheckIn = () => {
    const [checked, setChecked] = useState(false);
    const { register, setValue, formState: { errors }, getValues } = useForm();
    const { name } = useParams();
    const businessId = name?.split('@')[name?.split('@').length - 1];
    const [athleteName, setAthlete] = useState(null);
    const [pic, setPic] = useState(person);
    const [scanResult, setScanResult] = useState(null);
    const [manualSerialNumber, setManualSerialNumber] = useState('');
    const [showScanner, setShowScanner] = useState(false); // State to toggle scanner visibility
    const { checkIn, getBussiness } = useAPI();
    const [loading, setLoading] = useState(false);
    const [business, setBusiness] = useState(null);
    const [photo, setPhoto] = useState(Bussiness);
    const [startLoading, setStart] = useState(false);


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
                    setPhoto(`${server}/${res.data.photo}`);
                })
                .catch((err) => {
                    console.log("Error :", err);
                })
                .finally(() => {
                    setStart(false);
                })
        }
    }, [])

    function handleManualSerialNumberChange(event) {
        setManualSerialNumber(event.target.value);
    }
    const handleCheckIn = (pin) => {
        if (!getValues('pin') && !pin) {
            toast.error("Please Enter PIN or Scan QR Code");
            return;
        }
        const data = {
            pin: getValues('pin'),
            businessId
        };

        console.log("Data to be submit is :", data);


        setLoading(true);
        checkIn(data)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    setAthlete(res.data.athleteName);
                    setPic(`${server.split('/api')[0]}${res.data.photoPath}`)
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
                                            THANK YOU <b>{athleteName.toUpperCase()}</b> FOR CHECKING IN. YOUR TIME HAS BEEN RECORDED
                                        </p>
                                        <div className='mx-3'>
                                            <img src={pic} className='rounded-circle' alt="" height={144} width={144} />
                                        </div>
                                    </div>
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
                                        type="text"
                                        className="form-control p-2 bg_dede mb-2"
                                        placeholder="PIN"
                                        autoComplete="new-password" 
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
            </div>
    );
};

export default CheckIn;

import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import "../../assets/CSS/OTP_Verification.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAPI } from '../../contexts/Apicontext';
import { toast } from 'react-toastify';

const OTP_Verification = () => {
    const email = sessionStorage.getItem("forgotEmail");
    const send_otp = sessionStorage.getItem("otpEmail");
    const location=useLocation();
    let forgotData=location.state;
    const [otp, setOtp] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const navigate = useNavigate();
    const {verifyForgotOTP ,verifyOtp,signup,resetPassword } = useAPI();

    // Default input style for desktop and tablets (3em)
    const inputStyle = {
        width: '3em',
        height: '3em',
        backgroundColor: '#D1DEDE',
        border: '1px solid #D1DEDE',
        borderRadius: '10px',
        fontSize: '20px',
        textAlign: 'center',
    };
    
    const resendOTP = async() => {
        setLoading(true);
        const email_otp = email ? email : send_otp;

        if(send_otp){
            try{
                const data=JSON.parse(sessionStorage.getItem('userData'))
                console.log("Data to be submit :", data);
                
                const response = await signup(data);
                if(response.success){
                    toast.success(response.message);
                }
                else{
                    toast.error(response.message);
                }
            }
            catch(error){
                toast.error(error.message);
            }
            finally{
                setLoading(false);
            }
        }
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

    const handleSubmitSendOtp = async () => {
        setLoading(true);
        console.log("Submit this otp for send_otp:", otp);
        
        const data = {
            email: send_otp,
            otp,
        };
        console.log("Data for verification is :", data);
        

        try {
            const res = await verifyOtp(data);
            if(res.success){
                toast.success(res.message) ;
                sessionStorage.removeItem("otpEmail");
                navigate('/login');
            }
            else{
                toast.error(res.message);
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.message);

        } finally {
            setLoading(false);
        }
    };

    const handleSubmitForgotEmail = async () => {
        setLoading(true);
        forgotData.otp=otp;

        try {
            const res = await resetPassword(forgotData);
            if(res.success){
                toast.success(res.message) ;
                sessionStorage.removeItem("forgotEmail");
                navigate('/login');
            }
            else{
                toast.error(res.message);
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error(err.message);

        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (send_otp) {
            handleSubmitSendOtp(); // Call the specific function for send_otp
        } else if (email) {
            handleSubmitForgotEmail(); // Call the specific function for forgotEmail
        }
    };

    return (
        <>
            <style>{mediaQueryStyle}</style>
            <div className="auth bg_dede p-3 p-md-5">
                <div className="row p-4 upper_frame">
                    <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center">
                        <h1 className='poppins-semibold color_bao main_heading'>
                            {email ? <span>ENTER YOUR CODE</span> : <span>OTP VERIFICATION</span>}
                        </h1>
                        <p className='sub_para mx-1'>
                            <span>We sent a code to <span className='poppins-medium'>{email ? email : send_otp}</span></span>
                        </p>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span className='mx-2'> </span>}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    style={inputStyle}
                                />
                            )}
                        />
                        <p className='sub_para mx-1'>
                            <span>Didn’t receive the email? <span className='poppins-medium text-decoration-underline cursor-pointer' onClick={resendOTP}>
                                {
                                    loading?
                                    'Resending OTP':
                                    'Click to resend'
                                }
                                
                                </span></span>
                        </p>
                        <button
                            className='btn bg_dede my-4 p-3 px-5 poppins-medium d-flex justify-content-center align-items-center'
                            style={buttonStyle}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleSubmit} // Call handleSubmit on button click
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OTP_Verification;

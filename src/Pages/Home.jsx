import React from 'react';
import Navbar from '../Components/Navbar';
import hero from "../assets/images/Home/hero.jpg";
import '../assets/CSS/Home.css';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate=useNavigate();
    return (
        <div className='home'>
            <Navbar />
            <div className="hero">
                <div className="overlay"></div>
                <div className="hero-content">
                    <div style={{ maxWidth: '900px' }}>
                        <h1 className='barlow-semibold ' style={{ color: '#D1DEDE', fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                            ATTENDANCE TRACKING  MADE EASY
                        </h1>
                        <p className='barlow-thin' style={{ fontSize: '32px' }}> Track attendance automatically with real-time reporting</p>
                        <button onClick={()=>{navigate("/login")}} className='btn bg_dede bg_dede_btn  p-3 px-4 barlow-medium'>GET STARTED</button>
                    </div>
                </div>
            </div>
            <div className="features container my-5">
                <h1 className="color_bao text-center barlow-semibold" style={{ fontSize: '80px' }}>
                    FEATURES
                </h1>

                <div className="row my-2">
                    <div className="col-lg-4 col-md-6 col-sm-12 p-3">
                        <div className="rounded bg_dede p-3  d-flex flex-column justify-content-center align-items-center" style={{ height: '300px' }}>
                            <h5 className='text-center barlow-semibold' style={{ fontSize: '24px' }}>
                                Attendance Tracking
                            </h5>
                            <p className='text-center my-2' style={{ fontSize: '20px', fontWeight: '300px', wordSpacing: '10px', }}>
                                Keep track of users <br /> attendance using a simple <br /> web application
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 p-3">
                        <div className="rounded bg_dede p-3  d-flex flex-column justify-content-center align-items-center" style={{ height: '300px' }}>
                            <h5 className='text-center barlow-semibold' style={{ fontSize: '24px' }}>
                                Easy Reporting
                            </h5>
                            <p className='text-center my-2' style={{ fontSize: '20px', fontWeight: '300px', wordSpacing: '10px', }}>
                                View real-time attendance reports and custom analytics to maximize  efficiency
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 p-3">
                        <div className="rounded bg_dede p-3  d-flex flex-column justify-content-center align-items-center" style={{ height: '300px' }}>
                            <h5 className='text-center barlow-semibold' style={{ fontSize: '24px' }}>
                                Customizable Experience
                            </h5>
                            <p className='text-center my-2' style={{ fontSize: '20px', fontWeight: '300px', wordSpacing: '10px', }}>
                                Customize your users <br /> experience with your brands <br /> logos and  messaging
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hero1">
                <div className="overlay"></div>
                <div className="hero-content">
                    <div className="container " style={{fontSize:'28px', textAlign:'justify'}}>
                    Attend|Ace provides a comprehensive online attendance tracking system designed  specifically for youth sports programs. The platform streamlines attendance  management, helping coaches and administrators easily track participant attendance,  monitor trends, and improve overall program efficiency. With real-time updates and  automated reports, the system reduces manual paperwork and errors, ensuring accurate  record-keeping. Key features include attendance tracking, customizable reports, and  participant management. Our solution enhances organization, and accountability,  allowing coaches to focus more on training and less on administration. Ideal for  sports clubs, teams, camps, and leagues.
                    </div>
                </div>
            </div>
            <div className="pricing container my-5">
                <h1 className="color_bao text-center barlow-semibold" style={{ fontSize: '80px' }}>
                    PRICING
                </h1>

                <div className="row d-flex justify-content-center my-2">
                    <div className="col-lg-4 col-md-6 col-sm-12 p-3">
                        <div className="rounded bg_dede p-3  d-flex flex-column justify-content-center align-items-center" style={{ height: '350px' }}>
                            <h6 className='text-center barlow-semibold' style={{ fontSize: '18px' }} >
                                Subscribe for
                            </h6>
                            <h5 className='text-center barlow-semibold' style={{ fontSize: '24px' }}>
                                $45/month USD
                            </h5>
                            <h6 className='text-center barlow-semibold color_bao' style={{ fontSize: '20px' }} >
                                What’s included:
                            </h6>
                            <p className=' d-flex justify-content-center my-2' style={{ fontSize: '20px', fontWeight: '300px' }}>
                                <ul >
                                    <li className='justify-content-center' >Full access to attendance tracking system  </li>
                                    <li >Detailed reports and analytics </li>
                                    <li >Unlimited users </li>
                                    <li >No hidden fees  </li>
                                    <li >Cancel any time</li>

                                </ul>
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 p-3">
                        <div className="rounded bg_dede p-3  d-flex flex-column justify-content-center align-items-center" style={{ height: '350px' }}>
                            <h6 className='text-center barlow-semibold' style={{ fontSize: '18px' }} >
                                Subscribe for
                            </h6>
                            <h5 className='text-center barlow-semibold' style={{ fontSize: '24px' }}>
                                $30/month USD
                            </h5>
                            <h6 className='text-center barlow-semibold color_bao' style={{ fontSize: '20px' }} >
                                What’s included:
                            </h6>
                            <p className=' d-flex justify-content-center my-2' style={{ fontSize: '20px', fontWeight: '300px' }}>
                                <ul >
                                    <li className='justify-content-center' >Full access to attendance tracking system  </li>
                                    <li >Detailed reports only </li>
                                    <li >100 users </li>
                                    <li >No hidden fees  </li>
                                    <li >Cancel any time</li>

                                </ul>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <div className="pricing  py-5 " style={{ backgroundColor: ' #D1DEDE' }}>
                <h1 className="color_bao text-center barlow-semibold" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                    WHY CHOOSE US?
                </h1>
                <div className='d-flex justify-content-center my-5' >
                    <div style={{ maxWidth: '900px', width: '100%' }}>

                        <iframe src="https://www.youtube.com/embed/ccbpcvGquFg?si=HWJjzQRs3OEvY936" height={400} width={"100%"} frameborder="0"></iframe>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}

export default Home;

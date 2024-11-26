import React, { useEffect, useState } from 'react'
import AthleteIcon from '../../../Components/ChildAdmin/Dashboard/Icons/AthleteIcon'
import ClassIcon from '../../../Components/ChildAdmin/Dashboard/Icons/ClassIcon'
import { Link } from 'react-router-dom'
import RecentLabel from '../../../Components/ChildAdmin/Dashboard/RecentLabel'
import DashboardChart from "../../../assets/images/Dummy/DashboardChart.png"
import BasicLineChart from '../../../Components/Graph/BasicLineChart'
import { useAPI } from '../../../contexts/Apicontext'
import Loading from "../../../Components/Loading"
const Dashboard = () => {
    const {businessDashboard}=useAPI();
    const [loading,setLoading]=useState(false);
    const [totalStudent, setStudents]=useState(0);
    const [totalGroups, setGroups]=useState(0);
    const [chartData,setData]=useState([]);
    const [lastLogins,setLogins]=useState([]);
    const [businessName, setBusiness]=useState('');
    const server = import.meta.env.VITE_APP_URL;
    const localUser=JSON.parse(localStorage.getItem('user'));
    


    useEffect(()=>{
        setLoading(true);
        businessDashboard()
        .then((res)=>{
            console.log("Response Data :", res.data);
            setStudents(res.data.totalAthletes);
            setGroups(res.data.totalAthleteGroups);
            setData(res.data.athleteGroups);
            setLogins(res.data.last3Logins);
            setBusiness(res.data.businessName);
        })
        .catch((err)=>{
            console.log("Error :", err);
            
        })
        .finally(()=>{
            setLoading(false);
        })

    },[])
    return (
        loading ?
        <Loading />
        :
        <div className="container p-4 poppins-regular">
            <div className='mt-3'>
                <h1 className='top_heading poppins-medium color_bao'>DASHBOARD</h1>
            </div>
            <div className="my-3">
                <div className="row m-3 ms-0">
                    <div className="col-md-6 col-sm-12 p-2">
                        <div className=" bg_dede p-3 py-4" style={{ borderRadius: '15px' }}>
                            <div className="d-flex">
                                <div className='mx-2'>
                                    <span >
                                        <AthleteIcon />
                                    </span>

                                </div>
                                <div>
                                    <h6 className='poppins-medium mb-0' style={{fontSize:'28px'}} >
                                        {totalStudent}
                                    </h6>
                                    <p className='poppins-medium mb-0' style={{fontSize:'16px'}} >Active Students</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-6 col-sm-12 p-2">
                        <div className=" bg_dede p-3 py-4" style={{ borderRadius: '15px' }}>
                            <div className="d-flex">
                                <div className='mx-2 mt-1'>
                                    <span >
                                        <ClassIcon />
                                    </span>

                                </div>
                                <div className='mx-1'>
                                    <h6 className='poppins-medium mb-0' style={{fontSize:'28px'}} >
                                        {totalGroups}
                                    </h6>
                                    <p className='poppins-medium mb-0' style={{fontSize:'16px'}} >Teams / Classes</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    
                </div>
            </div>
            <div className='mt-3'>
                <h1 className='top_heading poppins-medium color_bao'>Athlete Check In</h1>
            </div>
            
            <div className='mt-3'>
                <p className='top_heading poppins-regular  font-20'> Check In now to record attendance</p>
            </div>
            <div className="my-3">
                <Link to={`/check-in/${businessName}@${localUser?.role==='superAdmin'?sessionStorage.getItem('currentBussiness'):localUser.business}`} className='font-20' style={{color:'#003CFF'}} >
                {server}/check-in/{businessName}@{localUser?.role==='superAdmin'?sessionStorage.getItem('currentBussiness'):localUser.business}
                </Link>
            </div>
            <div className='mb-3'>
                <p className='top_heading poppins-medium  font-20'> Recent Logins</p>
            </div>
            <div className="my-3">
                {
                    lastLogins && lastLogins.map(data=>
                          <RecentLabel data={data} />
                    )
                }
            </div>
            <div className='my-3'>
                <p className='top_heading poppins-medium  font-20'>Attendance</p>
            </div>
            <div className="my-3">
                {chartData && 
                    <BasicLineChart rawData={chartData} />
                
                }
            </div>
        </div>
    )
}

export default Dashboard
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RecentLabel from '../../../Components/ChildAdmin/Dashboard/RecentLabel'
import BasicLineChart from '../../../Components/Graph/BasicLineChart'
import { useAPI } from '../../../contexts/Apicontext'
import Loading from "../../../Components/Loading"
import { AiOutlineTeam, AiOutlineUser } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { businessDashboard } = useAPI();
    const [loading, setLoading] = useState(false);
    const [totalStudent, setStudents] = useState(0);
    const [totalGroups, setGroups] = useState(0);
    const [chartData, setData] = useState([]);
    const [lastLogins, setLogins] = useState([]);
    const [businessName, setBusiness] = useState('');
    const [businessId, setBusinessId] = useState(null);
    const navigate = useNavigate();
    const server = import.meta.env.VITE_APP_URL;
    const secretKey = import.meta.env.VITE_APP_SECRET_KEY;
    function encryptBusinessId(num) {
        // Convert the number to a string
        const number = parseInt(num, 10);
        if (isNaN(number)) throw new Error("Input must be a valid number.");

        // Perform the encryption: "RG" + number + "W" + 2
        const encrypted = `RG${number}W${number + 2}`;

        return encrypted;
    }


    function processAthleteGroups(data, option, month = null) {
        if (!data || typeof data !== "object" || !option) {
            throw new Error("Invalid input parameters.");
        }
        if (option === "all" || option==='weekly') {
            // Process the data to sum values for each group
            return Object.entries(data).map(([groupName, groupData]) => {
                const totalValue = groupData.reduce((sum, item) => sum + (item.value || 0), 0);
                return {
                    value: groupName,
                    name: totalValue
                };
            });
        } else if (option === "monthly") {
            if (month) {
                // Process the data to get the value for the specified month for each group
                return Object.entries(data).map(([groupName, groupData]) => {
                    const monthData = groupData.find(item => item.name === month);
                    return {
                        value: groupName,
                        name: monthData ? monthData.value : 0
                    };
                });
            } else {
                // Process the data to sum values for each month
                const monthlySums = {};

                Object.values(data).forEach(groupData => {
                    groupData.forEach(({ name, value }) => {
                        monthlySums[name] = (monthlySums[name] || 0) + (value || 0);
                    });
                });

                return Object.entries(monthlySums).map(([month, value]) => ({ name: month, value }));
            }
        } else {
            throw new Error("Invalid option. Use 'all' or 'monthly'.");
        }
    }
    const months = [
        { short: "Jan", full: "January" },
        { short: "Feb", full: "February" },
        { short: "Mar", full: "March" },
        { short: "Apr", full: "April" },
        { short: "May", full: "May" },
        { short: "Jun", full: "June" },
        { short: "Jul", full: "July" },
        { short: "Aug", full: "August" },
        { short: "Sep", full: "September" },
        { short: "Oct", full: "October" },
        { short: "Nov", full: "November" },
        { short: "Dec", full: "December" },
    ]
    const [month, setMonth] = useState('Jan');
    const weekdays = [
        { short: "Sun", full: "Sunday" },
        { short: "Mon", full: "Monday" },
        { short: "Tue", full: "Tuesday" },
        { short: "Wed", full: "Wednesday" },
        { short: "Thu", full: "Thursday" },
        { short: "Fri", full: "Friday" },
        { short: "Sat", full: "Saturday" },
    ];
    
    const [weekday, setWeekday] = useState('Sun');
    
    const [option, setOption] = useState('all');
    const [originalData, setOriginalData]=useState([])

    useEffect(() => {
        
        
            setLoading(true);
            businessDashboard(option)
                .then((res) => {
                    console.log("Response Data :", res.data);
                    setStudents(res.data.totalAthletes);
                    setGroups(res.data.totalAthleteGroups);
                    if (res?.data?.athleteGroups) {
                        console.log("Data to be process is :", res.data.athleteGroups);
                        setOriginalData(res?.data?.athleteGroups);
                        
                    }
                    setLogins(res.data.last3Logins);
                    setBusiness(res.data.businessName);
                    setBusinessId(encryptBusinessId(res.data.businessId));
                })
                .catch((err) => {
                    console.log("Error :", err);
                })
                .finally(() => {
                    setLoading(false);
                })
        

    }, [option])
    useEffect(()=>{
            let param=option==='monthly'?month:weekday;
            const processedData = processAthleteGroups(originalData, option, param );
            setData(processedData);
        
    },[option, month,originalData,weekday])
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
                        <div className="col-md-6 col-sm-12 p-2  cursor-pointer" onClick={() => navigate('/admin/athletes')}>
                            <div className=" bg_dede p-3 py-4" style={{ borderRadius: '15px' }}>
                                <div className="d-flex">
                                    <div className='mx-2'>
                                        <span >
                                            <AiOutlineUser size={50} />
                                        </span>
                                    </div>
                                    <div>
                                        <h6 className='poppins-medium mb-0' style={{ fontSize: '28px' }} >
                                            {totalStudent}
                                        </h6>
                                        <p className='poppins-medium mb-0' style={{ fontSize: '16px' }} >Active Athletes</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="col-md-6 col-sm-12 p-2 cursor-pointer" onClick={() => navigate('/admin/teams')}>
                            <div className=" bg_dede p-3 py-4" style={{ borderRadius: '15px' }}>
                                <div className="d-flex">
                                    <div className='mx-2 mt-1'>
                                        <span >
                                            <AiOutlineTeam size={50} />
                                        </span>

                                    </div>
                                    <div className='mx-1'>
                                        <h6 className='poppins-medium mb-0' style={{ fontSize: '28px' }} >
                                            {totalGroups}
                                        </h6>
                                        <p className='poppins-medium mb-0' style={{ fontSize: '16px' }} >Teams / Classes</p>
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
                    <Link to={`/check-in/${businessName}@${businessId}`} className='font-20' style={{ color: '#003CFF' }} >
                        {server}/check-in/{businessName}@{businessId}
                    </Link>
                </div>
                <div className='mb-3'>
                    <p className='top_heading poppins-medium  font-20'> Recent Logins</p>
                </div>
                <div className="my-3">
                    {
                        lastLogins && lastLogins.map(data =>
                            <RecentLabel data={data} />
                        )
                    }
                </div>
                <div className='my-3'>
                    <p className='top_heading poppins-medium  font-20'>Attendance</p>
                </div>
                <div className="my-3 d-flex justify-content-between align-items-center">
                    <div className="col-md-3 col-sm-12 my-2">
                        <select
                            className="form-control bg_dede"
                            value={option}
                            onChange={(e) => setOption(e.target.value)}
                        >
                            <option value="all">Yearly</option>
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>
                    {
                        option==="monthly" ?
                        <div className="col-md-3 col-sm-12 my-2">
                            <select
                                className="form-control bg_dede"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {months.map((monthData) => (
                                    <option key={monthData.short} value={monthData.short}>
                                        {monthData.full}
                                    </option>
                                ))}
                            </select>
                        </div>
                         : option==="weekly" && 
                        <div className="col-md-3 col-sm-12 my-2">
                            <select
                                className="form-control bg_dede"
                                value={weekday}
                                onChange={(e) => setWeekday(e.target.value)}
                            >
                                {weekdays.map((monthData) => (
                                    <option key={monthData.short} value={monthData.short}>
                                        {monthData.full}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                </div>
                <div className="my-3" >
                    {chartData &&
                        <BasicLineChart rawData={chartData} />

                    }
                </div>
            </div>
    )
}
export default Dashboard
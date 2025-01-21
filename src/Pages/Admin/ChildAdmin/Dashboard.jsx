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
    
    function sortMonth(month, groupData) {
        // Define the mapping of month names to their index
        const monthMap = {
            "Jan": 0,
            "Feb": 1,
            "Mar": 2,
            "Apr": 3,
            "May": 4,
            "Jun": 5,
            "Jul": 6,
            "Aug": 7,
            "Sep": 8,
            "Oct": 9,
            "Nov": 10,
            "Dec": 11
        };
        // Get the index of the provided month
        const monthIndex = monthMap[month];
    
        // Create the result array with the group name and login value for the specified month
        const result = groupData.map(group => {
            const loginValue = group.monthlyLogins[monthIndex][month]; // Get login value for the given month
            return {
                name: group.groupName,
                value: loginValue
            };
        });
    
        return result;
    }
    
    
    const [option, setOption] = useState('year');
    const [originalData, setOriginalData]=useState([]);
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
    const [month,setMonth]=useState('Jan');

    useEffect(()=>{
        setData(sortMonth(month,originalData));
    },[month]);
    function sortDaily(day, data) {
        return data.map(group => {
            const value = group.dailyLogins.find(entry => Object.keys(entry)[0] === day)?.[day] || 0;
            return { name: group.groupName, value };
        });
    }
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [currentDay,setCurrentDay]=useState("Sunday");
    function sortWeek(weekRange, groupData) {
        // Create the result array
        const result = groupData.map(group => {
            // Find the weekly login value for the given week range
            const weekLogin = group.weeklyLogins.find(week => Object.keys(week)[0] === weekRange);
            const value = weekLogin ? Object.values(weekLogin)[0] : 0;
            
            return {
                name: group.groupName,
                value: value
            };
        });
        
        return result;
    }
    function getAllWeekRanges(groupData) {
        // Collect all week ranges from the weeklyLogins of each group
        const weekRanges = groupData.flatMap(group => group.weeklyLogins.map(week => Object.keys(week)[0]));
        
        // Remove duplicates (if any)
        return [...new Set(weekRanges)];
    }
    const [currentWeek, setCurrentWeek]=useState(null)
    const [weeks,setWeeks]=useState([])
    useEffect(() => {
            setLoading(true);
            businessDashboard(option)
                .then((res) => {
                    console.log("Response Data  for Business is :", res.data);
                    setStudents(res.data.totalAthletes);
                    setGroups(res.data.totalAthleteGroups);
                    if (res?.data?.groupData) {
                        console.log("Data to be process is :", res.data.groupData);
                        setOriginalData(res?.data?.groupData);
                        option==='year' && setData(res?.data?.groupData)
                        option==='monthly' && setData(sortMonth(month,res?.data?.groupData))
                        option==='daily' && setData(sortDaily(currentDay,res?.data?.groupData))
                        if (option==='weekly'){
                            const weekRanges = getAllWeekRanges(res?.data?.groupData);
                            setWeeks(weekRanges);
                            weekRanges.length>0 && setCurrentWeek(weekRanges[0])
                            weekRanges.length>0 && setData(sortWeek(weekRanges[0],res?.data?.groupData))
                        } 
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
        setData(sortWeek(currentWeek,originalData));
    },[currentWeek])
    useEffect(()=>{
        setData(sortDaily(currentDay,originalData));
    },[currentDay])

   
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
                            <option value="year">Yearly</option>
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="daily">Daily</option>
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
                         : option==="daily" ?
                        <div className="col-md-3 col-sm-12 my-2">
                            <select
                                className="form-control bg_dede"
                                value={currentDay}
                                onChange={(e) => setCurrentDay(e.target.value)}
                            >
                                {weekdays.map((day) => (
                                    <option value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>
                         : option==="weekly" && 
                        <div className="col-md-3 col-sm-12 my-2">
                            <select
                                className="form-control bg_dede"
                                value={currentWeek}
                                onChange={(e) => setCurrentWeek(e.target.value)}
                            >
                                {weeks.map((week) => (
                                    <option value={week}>
                                        {week}
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
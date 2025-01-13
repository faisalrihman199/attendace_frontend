import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

const APIContext = createContext();

const APIProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  console.log(import.meta.env);
  const server = import.meta.env.VITE_APP_API_URL;
  
  console.log("Server is :", server);



  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const getConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`,

      }
    };
  };
  const forAdmin = (url) => {
    if (user.role === 'superAdmin') {
      url += `?userId=${sessionStorage.getItem('currentBussiness')}`
    }
    return url;
  }

  const login = async (data) => {
    const response = await axios.post(`${server}/user/login`, data);
    setUser(response.data.data);
    return response.data;
  };

  const verifyOtp = async (data) => {
    const response = await axios.post(`${server}/user/verifyOtp`, data);
    return response.data;
  };
  const sendOtp = async (data) => {
    const response = await axios.post(`${server}/user/resetPassword`, data);
    return response.data;
  };
  const signup = async (data) => {
    const response = await axios.post(`${server}/user/sendOtp`, data);
    return response.data;
  };
  const verifyForgotOTP = async (data) => {
    const response = await axios.post(`${server}/user/verifyPasswordReset`, data);
    return response.data;
  };
  const resetPassword = async (data) => {
    const response = await axios.post(`${server}/user/newPassword`, data);
    return response.data;
  };




  const userProfile = async (isRoot) => {
    let url = `${server}/user/getOne`
    if (!isRoot) {
      console.log("It is not super Admin");

      url = forAdmin(url);
    }
    const response = await axios.get(url, getConfig());
    return response.data;
  };
  const updateProfile = async (data, isRoot) => {
    console.log("is Root :", isRoot)
    let url = `${server}/user/update`
    if (!isRoot) {
      url = forAdmin(url);
      console.log("Url is :", url);
    }
    const response = await axios.put(url, data, getConfig());
    return response.data;
  };

  const allBussineses = async (page, id, query) => {
    console.log("Page is :", page);

    let url = `${server}/business/getAll?page=${page}`
    if (id) {
      url += `&userId=${id}`;
    }
    if (query) {
      url += `&search=${query}`;
    }
    const response = await axios.get(url, getConfig());
    return response.data;
  };
  const deleteBussiness = async (id) => {
    const response = await axios.delete(`${server}/business/delete/${id}`, getConfig());
    return response.data;
  };
  const updateBussinessStatus = async (id) => {
    const response = await axios.get(`${server}/business/updateBusinessStatus/${id}`, getConfig());
    return response.data;
  };
  const allTemplates = async () => {
    const response = await axios.get(`${server}/user/getMailTemplates`, getConfig());
    return response.data;
  };
  const saveTemplete = async (data) => {
    let url = `${server}/user/addMailTemplate`
    const response = await axios.post(url, data, getConfig());
    return response.data;
  };
  const addBussiness = async (data) => {
    let url = `${server}/business/createBusiness`
    const response = await axios.post(forAdmin(url), data, getConfig());
    return response.data;
  };
  const createUser = async (data) => {
    const response = await axios.post(`${server}/business/adminCreateUser`, data, getConfig());
    return response.data;
  };


  const addTeam = async (data, id) => {
    let url = `${server}/business/createAtheleteGroup`
    url = forAdmin(url);
    if (id && url.includes('?')) {
      url += `&id=${id}`
    }
    else if (id) {
      url += `?id=${id}`
    }

    const response = await axios.post(url, data, getConfig());
    return response.data;
  };
  const allTeams = async () => {
    let url = `${server}/business/getAtheleteGroups`
    const response = await axios.get(forAdmin(url), getConfig());
    return response.data;
  };
  const allGroups = async (page, qry) => {
    let url = `${server}/business/AtheleteGroups`

    const response = await axios.get(pageWithAdmin(url, page, qry), getConfig());
    return response.data;
  };
  const deleteGroup = async (id) => {
    let url = `${server}/business/deleteAtheleteGroup/${id}`
    const response = await axios.delete(url, getConfig());
    return response.data;
  };
  const generatePin = async () => {
    let url = `${server}/athelete/getPin`
    const response = await axios.get(forAdmin(url), getConfig());
    return response.data;
  };

  const addStudent = async (data) => {
    let url = `${server}/athelete/addAthelete`
    const response = await axios.post(forAdmin(url), data, getConfig());
    return response.data;
  };
  const oneAthlete = async (id) => {
    let url = `${server}/athelete/getOne`
    url = forAdmin(url);
    if (id && url.includes('?')) {
      url += `&id=${id}`
    }
    else if (id) {
      url += `?id=${id}`
    }
    const response = await axios.get(url,getConfig());
    return response.data;
  };
  const uploadAthletesCSV = async (data) => {
    console.log("Data to be submit is :", Object.fromEntries(data));

    let url = `${server}/athelete/fileUpload`
    const response = await axios.post(forAdmin(url), data, getConfig());
    return response.data;
  };
  const pageWithAdmin = (url, page, qry) => {
    url = forAdmin(url);
    if (page) {

      url = url.includes('?') ? `${url}&page=${page}` : `${url}?page=${page}`;
    }
    if (qry && !qry.includes('null')) {
      url = url.includes('?') ? `${url}&${qry}` : `${url}?${qry}`;
    }
    return url;
  };
  const allStudents = async (page, qry) => {
    let url = `${server}/athelete/atheletes`
    const response = await axios.get(pageWithAdmin(url, page, qry), getConfig());
    return response.data;
  };
  const deleteStudent = async (id) => {
    let url = `${server}/athelete/delete/${id}`
    const response = await axios.delete(url, getConfig());
    return response.data;
  };
  const contact = async (data) => {
    let url = `${server}/user/contactUs`
    const response = await axios.post(url, data);
    return response.data;
  };
  const getReporting = async () => {
    let url = `${server}/business/reporting`
    const response = await axios.get(forAdmin(url), getConfig());
    return response.data;
  };
  const updateReporting = async (data) => {
    let url = `${server}/business/updateReporting`;
    const response = await axios.put(forAdmin(url), data, getConfig());
    return response.data;
  };
  const checkIn = async (data) => {
    let url = `${server}/athelete/checkIn`
    const response = await axios.post(url, data);
    return response.data;
  };
  const checkPin = async (pin) => {
    let url = `${server}/athelete/checkPin`
    url = forAdmin(url);
    if (url.includes('?')) {
      url += `&pin=${pin}`
    }
    else {
      url += `?pin=${pin}`
    }

    const response = await axios.get(url, getConfig());
    return response.data;
  };
  const getBussiness = async (data) => {
    let url = `${server}/business/detail`
    const response = await axios.post(url, data);
    return response.data;
  };

  const businessDashboard = async () => {
    let url = `${server}/business/stats`
    const response = await axios.get(forAdmin(url), getConfig());
    return response.data;
  };
  const billingDashboard = async () => {
    let url = `${server}/user/getCards`
    const response = await axios.get(forAdmin(url), getConfig());
    return response.data;
  };
  const paymentHistory = async (page) => {
    let url = `${server}/user/paymentHistory`
    const response = await axios.get(pageWithAdmin(url, page), getConfig());
    return response.data;
  };
  const changePLan = async (qry) => {
    let url = `${server}/user/changeSub`
    const response = await axios.get(pageWithAdmin(url, null, qry), getConfig());
    return response.data;
  };
  const checkIndata = async (page, qry) => {
    let url = pageWithAdmin(`${server}/athelete/getAttendence`, page)
    if (qry) {
      url += `&${qry}`
    }
    const response = await axios.get(url, getConfig());
    return response.data;
  };
  const reportPDF = async (qry) => {
    let url = `${server}/athelete/getAttendencePdf`;
    url = forAdmin(url);

    // Append query parameters
    if (qry) {
      url += url.includes('?') ? '&' : '?';
      url += qry;
    }

    try {
      // Set responseType to 'blob' for PDF download
      const response = await axios.get(url, {
        ...getConfig(),
        responseType: 'blob' // Important for PDF
      });

      return response; // Return the entire response for further handling
    } catch (error) {
      console.error("Error fetching the PDF:", error);
      throw error; // Re-throw the error to be handled later
    }
  };

  const provider = {
    login, signup, sendOtp, verifyForgotOTP, resetPassword,//auth
    userProfile, createUser, contact, updateProfile,   //user
    allBussineses, deleteBussiness, updateBussinessStatus, addBussiness, getBussiness, businessDashboard, allTemplates, saveTemplete,          //bussinesses
    addTeam, allTeams, generatePin, allGroups, deleteGroup, checkPin,                         //Team/Class
    addStudent,oneAthlete, allStudents, deleteStudent, checkIn, checkIndata, uploadAthletesCSV,                                         //Athelete
    getReporting, updateReporting, billingDashboard, paymentHistory, reportPDF, changePLan,                      //Reporting
    getConfig,
    verifyOtp
  };

  return (
    <APIContext.Provider value={provider}>
      {children}
    </APIContext.Provider>
  );
};

const useAPI = () => useContext(APIContext);

export { APIProvider, useAPI };

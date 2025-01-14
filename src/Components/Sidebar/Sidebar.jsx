import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import Logo from "../../assets/Logo.png";
import Home from "./Icons/Home";
import Atheletes from "./Icons/Atheletes";
import { Teams } from "./Icons/Teams";
import Reports from "./Icons/Reports";
import Billing from "./Icons/Billing";
import Contact from "./Icons/Contact";
import Setting from "./Icons/Setting";
import Help from "./Icons/Help";
import Profile from "./Icons/Profile";
import Logout from "./Icons/Logout";
import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation(); // Get current location
  const user = JSON.parse(localStorage.getItem('user'));

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  }
  return (
    <div className="wrapper">
      <aside id="sidebar" className={`${isExpanded ? "expand" : ""} py-3`}>
        <div className="d-flex align-items-center">
          <button className="toggle-btn mt-2" type="button" onClick={toggleSidebar}>
            <i className="lni lni-grid-alt"></i>
          </button>

          <div className="sidebar-logo cursor-pointer">
            <Link to={user.role === 'superAdmin' ? '/root/businesses' : '#'} className="cursor-pointer" >
              <img src={Logo} alt="Attend | Ace" height={40} width={120} />
            </Link>
          </div>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-item my-2">
            <Link to="/admin/dashboard" className={`sidebar-link d-flex mx-2 ${isActive('dashboard') ? 'active_link' : ''}`}>
              <div><Home /></div>
              <span className="mx-2 mt-1">Dashboard</span>
            </Link>
          </li>
          <li className="sidebar-item my-2">
            <Link to="/admin/teams" className={`sidebar-link d-flex mx-2 ${isActive('teams') ? 'active_link' : ''}`}>
              <div><AiOutlineTeam size={24} /></div>
              <span className="mx-2 mt-1">Manage Teams</span>
            </Link>
          </li>
          <li className="sidebar-item my-2">
            <Link to="/admin/athletes" className={`sidebar-link d-flex mx-2 ${isActive('athletes') ? 'active_link' : ''}`}>
            <div><AiOutlineUser size={24} /></div>
            <span className="mx-2 mt-1">Manage Athletes</span>
            </Link>
          </li>
          
          <li className="sidebar-item my-2">
            <Link to="/admin/reports" className={`sidebar-link d-flex mx-2 ${isActive('reports') ? 'active_link' : ''}`}>
              <div><Reports /></div>
              <span className="mx-2 mt-1">Reports</span>
            </Link>
          </li>
          <li className="sidebar-item my-2">
            <Link to="/admin/billing" className={`sidebar-link d-flex mx-2 ${isActive('billing') ? 'active_link' : ''}`}>
              <div><Billing /></div>
              <span className="mx-2 mt-1">Billing</span>
            </Link>
          </li>
          
          <li className="sidebar-item my-2">
            <Link to="/admin/settings" className={`sidebar-link d-flex mx-2 ${isActive('settings') ? 'active_link' : ''}`}>
              <div><Setting /></div>
              <span className="mx-2 mt-1">Settings</span>
            </Link>
          </li>
          <li className="sidebar-item my-2">
            <Link to="/admin/help" className={`sidebar-link d-flex mx-2 ${isActive('help') ? 'active_link' : ''}`}>
              <div><Help /></div>
              <span className="mx-2 mt-1">Help</span>
            </Link>
          </li>
          {/* <li className="sidebar-item my-2">
            <Link to="/admin/contact" className={`sidebar-link d-flex mx-2 ${isActive('contact') ? 'active_link' : ''}`}>
              <div><Contact /></div>
              <span className="mx-2 mt-1">Contact Us</span>
            </Link>
          </li> */}
        </ul>
        <div className="sidebar-footer">
          <Link to="/admin/profile" className={`sidebar-link mx-2 ${isActive('profile') ? 'active_link' : ''}`}>
            <Profile />
            <span className="mt-1 mx-2">Profile</span>
          </Link>
          <Link to={"/"} onClick={handleLogout} className="sidebar-link mx-2">
            <Logout />
            <span className="mt-1 mx-2">Logout</span>
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

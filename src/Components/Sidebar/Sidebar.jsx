import React, { useEffect, useState } from "react";
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
  const [trialInfo, setTrialInfo] = useState({
    hasTrial: false,
    expiresAt: null,
    daysLeft: null,
    expired: false,
  });

  // NEW: modal state (only for modern alert)
  const [showTrialExpired, setShowTrialExpired] = useState(false);
  const [expiryFmt, setExpiryFmt] = useState("");
  const [seconds, setSeconds] = useState(6);

  const location = useLocation();
  const navigate = useNavigate();

  // Read user safely from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const toggleSidebar = () => setIsExpanded((e) => !e);
  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Trial calculation + (modern) redirect if expired
  useEffect(() => {
    const rawTrial = user?.trial;

    // trial can be false / "false" / null / undefined
    if (!rawTrial || rawTrial === "false") {
      setTrialInfo({ hasTrial: false, expiresAt: null, daysLeft: null, expired: false });
      return;
    }

    const exp = new Date(rawTrial);
    if (isNaN(exp.getTime())) {
      // Invalid date string; treat as no trial
      setTrialInfo({ hasTrial: false, expiresAt: null, daysLeft: null, expired: false });
      return;
    }

    const now = new Date();
    const msLeft = exp.getTime() - now.getTime();
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    const expired = msLeft <= 0;

    setTrialInfo({
      hasTrial: true,
      expiresAt: exp,
      daysLeft: Math.max(daysLeft, 0),
      expired,
    });

    if (expired) {
      // MODERN MODAL (replaces classic alert)
      setExpiryFmt(exp.toLocaleString());
      setShowTrialExpired(true);
    }
  }, [user?.trial, navigate]);

  // Modal countdown + auto-redirect
  useEffect(() => {
    if (!showTrialExpired) return;
    setSeconds(6);
    const tick = setInterval(() => setSeconds((s) => s - 1), 1000);
    const timeout = setTimeout(() => {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }, 6000);
    return () => {
      clearInterval(tick);
      clearTimeout(timeout);
    };
  }, [showTrialExpired, navigate]);

  const formattedTrialDate =
    trialInfo.expiresAt &&
    trialInfo.expiresAt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="wrapper">
      <aside id="sidebar" className={`${isExpanded ? "expand" : ""} py-3`}>
        <div className="d-flex align-items-start">
          <button className="toggle-btn mt-2" type="button" onClick={toggleSidebar}>
            <i className="lni lni-grid-alt"></i>
          </button>

          <div className="sidebar-logo cursor-pointer">
            <Link to={user.role === 'superAdmin' ? '/root/businesses' : '#'} className="cursor-pointer" >
              <img src={Logo} alt="Attend | Ace" height={40} width={120} />
            </Link>

            {trialInfo.hasTrial && !trialInfo.expired && (
              <div className="trial-chip" style={{ color: "#247BA0" }}>
                <strong>Trial</strong>&nbsp;
                <span>
                  Expiring on {formattedTrialDate} · {trialInfo.daysLeft} day{trialInfo.daysLeft !== 1 ? "s" : ""} left
                </span>
              </div>
            )}
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

      {/* MODERN ALERT (modal) */}
      {showTrialExpired && (
        <div className="trial-modal-backdrop" role="dialog" aria-modal="true">
          <div className="trial-modal">
            <div className="trial-modal-header">Trial expired</div>
            <div className="trial-modal-body">
              Your trial ended on <b>{expiryFmt}</b>. Please log in to continue.
            </div>
            <div className="trial-modal-actions">
              <button
                className="trial-btn-primary"
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login", { replace: true });
                }}
              >
                Go to Login
              </button>
              <button
                className="trial-btn-ghost"
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login", { replace: true });
                }}
              >
                Dismiss · {seconds}s
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

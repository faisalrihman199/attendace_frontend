import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import person from "../assets/images/Dummy/Profile.png";
import { LucideMessageCircle } from 'lucide-react';

const NavbarComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null); // Reference for dropdown

  // Check if "root" is part of the current URL
  const isRootUrl = location.pathname.includes('/root');

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false); // Close dropdown when clicking outside
      }
    };

    // Add event listener to the document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-light ${isRootUrl ? 'bg_dede' : 'bg-white'}`} style={{ height: '100px', zIndex: 3 }}>
      <div className={`container py-2 ${isRootUrl ? 'bg_dede' : 'bg-white'}`}>
        {/* Logo */}
        <Link to={isRootUrl ? '/root/businesses' : '/'} className="navbar-brand">
          <img src={Logo} alt="Attend | Ace" height={66} width={200} />
        </Link>

        {/* Conditional rendering of either hamburger or profile icon */}
        {!isRootUrl ? (
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)} 
            aria-controls="navbarNav" 
            aria-expanded={isExpanded} 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <img src="" alt="" />
            </span>
          </button>
        ) : (
          <div className='d-flex align-items-center' style={{ position: 'relative' }} ref={dropdownRef}>
           
              <Link className='me-3 color-bao' to={'/chat'} >
              <LucideMessageCircle color='#247BA0' size={30} />
              
              </Link>
            
            <div className="profile-icon" onClick={() => setShowProfileDropdown(!showProfileDropdown)} style={{ cursor: 'pointer' }}>
              <img src={person} height={40} width={40} alt="Profile Icon" />
            </div>
            
            {/* Dropdown menu when profile icon is clicked */}
            {showProfileDropdown && (
              <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, top: '50px' }}>
                <Link to="/root/profile" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>Profile</Link>
                <Link to="/root/templates" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>Templates</Link>
                
                <Link to="/login" className="dropdown-item">Logout</Link>
              </div>
            )}
          </div>
        )}
        {/* Navbar links for non-root URLs */}
        {!isRootUrl && 
          <div className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/contact" className="nav-link barlow-semibold color_bao me-3">
                  Contact Us
                </Link>
              </li>
              
              <li className="nav-item">
                <Link to="/signup" className="nav-link barlow-semibold color_bao">
                  SignUp / Login
                </Link>
              </li>
             
              {/* Add the Templates link here */}
              
            </ul>
          </div>
        }
      </div>
    </nav>
  );
};

export default NavbarComponent;

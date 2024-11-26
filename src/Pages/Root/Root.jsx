import React from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Profile from './ChildRoot/Profile';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../Errors/NotFound';
import AddBussiness from './ChildRoot/AddBussiness';
import Businesses from './ChildRoot/Businesses';

const Admin = () => {
    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            
            {/* Navbar at the top */}
            <Navbar  />
            
            {/* Main content area, flex-grow will push the footer to the bottom */}
            <div className="container flex-grow-1">
                <Routes>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/businesses" element={<Businesses />} />
                    <Route path="/add_business" element={<AddBussiness />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </div>
            
            {/* Footer at the bottom */}
            <Footer />
        </div>
    );
};

export default Admin;

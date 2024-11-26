import React from 'react';
import Dashboard from './ChildAdmin/Dashboard';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import '../../Components/Sidebar/Sidebar.css';
import Profile from './ChildAdmin/Profile';
import Help from './ChildAdmin/Help';
import Settings from './ChildAdmin/Settings';
import Billing from './ChildAdmin/Billing';
import Contact from './ChildAdmin/Contact';
import Reports from './ChildAdmin/Reports';
import ManageTeams from './ChildAdmin/ManageTeams';
import ManageAtheletes from './ChildAdmin/ManageAtheletes';
import AddAthelete from './ChildAdmin/AddAthelete';
import NotFound from '../../Pages/Errors/NotFound';
import AddTeam from './ChildAdmin/AddTeam';
import UploadAthlete from './ChildAdmin/UploadAthlete';
const Admin = () => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main scrollbar-hidden">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/teams" element={<ManageTeams />} />
          <Route path="/teams/add" element={<AddTeam />} />
          <Route path="/athletes" element={<ManageAtheletes />} />
          <Route path="/athletes/add" element={<AddAthelete />} />
          <Route path="/athletes/uploadFile" element={<UploadAthlete />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;

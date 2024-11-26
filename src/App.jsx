import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Signup from './Pages/Auth/Signup';
import OTP_Verification from './Pages/Auth/OTP_Verification';
import Login from './Pages/Auth/Login';
import Subscription from './Pages/Subscription/Subscription';
import NotFound from './Pages/Errors/NotFound';
import Sidebar from './Components/Sidebar/Sidebar';
import Admin from './Pages/Admin/Admin';
import Root from './Pages/Root/Root';
import Contact from './Pages/Admin/ChildAdmin/Contact';
import CheckIn from './Pages/CheckIn/CheckIn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />


          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otpVerify" element={<OTP_Verification />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/check-in/:name" element={<CheckIn />} />



          
          <Route path="/Admin/*" element={<Admin />} />
          <Route path="/root/*" element={<Root />} />


          <Route path='/*' element={<NotFound />} />
        </Routes>
          <ToastContainer />
    </Router>
  );
}

export default App;

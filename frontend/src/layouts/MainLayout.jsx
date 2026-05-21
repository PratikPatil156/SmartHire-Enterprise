import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar'; // HR Sidebar
import CandidateSidebar from '../components/Sidebar/CandidateSidebar'; // Candidate Sidebar
import CandidateNavbar from '../components/Navbar/CandidateNavbar';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const currentRole = localStorage.getItem('role');
    
    // Auth Check
    if (!currentRole) {
      navigate('/login-candidate'); // Login nahi hai toh yahan bhej do
      return;
    }
    
    setUserRole(currentRole);
  }, [location, navigate]); 

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* 100% Fixed Sidebar Switcher */}
      {userRole === 'hr' ? <Sidebar /> : <CandidateSidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar sirf Candidates ke liye */}
        {userRole === 'candidate' && <CandidateNavbar />}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc]">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
             <Outlet context={[userRole]} /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
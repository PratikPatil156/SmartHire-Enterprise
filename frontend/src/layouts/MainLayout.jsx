import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar'; // HR Sidebar
import CandidateSidebar from '../components/Sidebar/CandidateSidebar'; // Candidate Sidebar
import CandidateNavbar from '../components/Navbar/CandidateNavbar';
import HRNavbar from '../components/Navbar/HRNavbar';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer open state

  useEffect(() => {
    const currentRole = localStorage.getItem('role');
    
    // Auth Check
    if (!currentRole) {
      navigate('/login-candidate'); // Login nahi hai toh yahan bhej do
      return;
    }
    
    setUserRole(currentRole);
  }, [location, navigate]); 

  // Close sidebar drawer automatically when location changes (page navigate)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0f172a]/30 backdrop-blur-[2px] z-[100] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-[110] lg:z-50 transition-transform duration-300 lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {userRole === 'hr' ? (
          <Sidebar isCollapsed={isSidebarCollapsed} onClose={() => setIsSidebarOpen(false)} />
        ) : (
          <CandidateSidebar isCollapsed={isSidebarCollapsed} onClose={() => setIsSidebarOpen(false)} />
        )}
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar switcher */}
        {userRole === 'hr' && (
          <HRNavbar 
            onToggleSidebar={handleToggleSidebar} 
            isSidebarCollapsed={isSidebarCollapsed} 
          />
        )}
        {userRole === 'candidate' && (
          <CandidateNavbar 
            onToggleSidebar={handleToggleSidebar} 
          />
        )}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc]">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
             <Outlet context={[userRole]} /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from "./SideBar"
function DashboardLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check if a chat or profile is active
  const isActiveChatOrProfile = 
    location.pathname.includes('/dashboard/chat/') || 
    location.pathname === '/dashboard/profile';

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      {/* Fixed header */}
      <div className="h-14 w-full fixed top-0 z-50 left-0 right-0 bg-gray-950 shadow-md flex items-center px-4">
        <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-sky-700 bg-clip-text text-transparent">
          ChatterBox
        </div>
      </div>
      
      {/* Main content area with sidebar and content */}
      <div className="flex h-full pt-14">
        <div 
          className={`${
            isMobile && isActiveChatOrProfile ? 'hidden' : 'block'
          } w-full md:w-2/6 lg:1/6 bg-gray-950 fixed h-screen z-40 top-0 left-0 bottom-0 overflow-y-auto `}
        >
        <Sidebar/>
        </div>
        
        <div 
          className={`${
            isMobile && !isActiveChatOrProfile ? 'hidden' : 'block'
          } md:w-4/6 lg:5/6 w-full min-h-screen overflow-y-auto md:ml-auto`}
        >
          <Outlet />
        </div>
      </div>
      
      {/* Mobile navigation bar to go back to sidebar */}
      {isMobile && isActiveChatOrProfile && (
        <div className="fixed bottom-4 left-4 z-50">
          <button 
            className="bg-purple-600 text-white p-3 rounded-full shadow-lg"
            onClick={() => window.history.back()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}

export default DashboardLayout;
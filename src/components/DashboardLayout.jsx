import React from 'react';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      {/* Fixed header */}
      <div className="h-16 w-full fixed top-0 z-40 left-0 right-0 bg-white shadow-md"></div>
      
      {/* Main content area with sidebar and content */}
      <div className="flex h-full">
        {/* Sidebar - responsive width */}
        <div className="w-10 md:w-80 bg-blue-800 fixed h-screen z-50 top-0 left-0 bottom-0 overflow-y-auto"></div>
        
        {/* Main content - with proper margin to account for sidebar */}
        <div className="ml-10 md:ml-80 flex-grow  min-h-screen overflow-y-auto ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
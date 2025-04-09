import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

function DashboardLayout() {
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
        <div className="w-16 bg-gray-950 fixed h-screen z-40 top-0 left-0 bottom-0 overflow-y-auto">
          <SideBar/>
        </div>
        <div className="flex h-full ml-16 flex-grow">
          <div className="w-64 bg-gray-800 h-screen overflow-y-auto">
            <div className="p-4 pt-4">
              hello
            </div>
          </div>
          <div className="flex-grow min-h-screen overflow-y-auto ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import { useSelector } from "react-redux";
import {  initializeSocket, joinUserRoom } from "../utils/socket";
import toast from "react-hot-toast";
import ChatList from "./ChatList";
function DashboardLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [status,setStatus]=useState(false);
  const isActiveChatOrProfile =
    location.pathname.includes("/dashboard/conversation/") ||
    location.pathname === "/dashboard/profile";

  const isProfilePage= location.pathname === "/dashboard/profile"; 

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userId= useSelector((state) => state.user._id);
  useEffect(() => {
    const socket = initializeSocket();

    joinUserRoom(userId);

    const handleConnect = () => {
      setStatus("connected");
    };

    const handleDisconnect = () => {
      setStatus("disconnected");
    };


    

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", (error) => {
      toast.error(error.message || "Something went wrong!");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("error");
    };
  }, [userId]);




  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      {/* Fixed header */}

      {/* Main content area with sidebar and content */}
      <div className="flex h-full">
        <div
          className={`${
            isMobile && isActiveChatOrProfile ? "hidden" : "block"
          } w-full md:w-2/6 lg:1/6 bg-gray-950 fixed h-screen z-40 top-0 left-0 bottom-0 overflow-y-auto `}
        >
          <div className="h-14 w-full md:w-2/6 lg:1/6 fixed top-0 z-50 left-0  bg-gray-950 shadow-md flex items-center px-4">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-sky-700 bg-clip-text text-transparent">
              ChatterBox {status}
            </div>
          </div>
          <div className="flex">
           <Sidebar />
           <ChatList/>
          </div>
        </div>

        <div
          className={`${
            isMobile && !isActiveChatOrProfile ? "hidden" : "block"
          } md:w-4/6 lg:5/6 w-full bg-gray-950 min-h-screen overflow-y-auto md:ml-auto`}
        >
          <Outlet />
        </div>
      </div>

      {/* Mobile navigation bar to go back to sidebar */}
      {isMobile && isProfilePage && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            className="bg-purple-600 text-white p-3 rounded-full shadow-lg"
            onClick={() => window.history.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;

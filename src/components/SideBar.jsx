import { MessageCircle, User, LogOut, Users, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { 
      icon: MessageCircle, 
      path: "/dashboard", 
      label: "Chat"
    },
    { 
      icon: Users, 
      path: "/dashboard/groups", 
      label: "Group Chats" 
    },
  ];

  const handlelogout=async()=>{
    try{
      await axios.get('/api/v1/users/logout');
      toast.success("User is logout successfully")
      navigate('/login');
    }
    catch(error){
      console.log("the error during logout ",error);
      toast.error(error.response.data.error.message||"Failed to logot ")
        }
  }

  return (
    <div className="bg-gray-900 text-white h-screen fixed left-0 pt-14">
      <div className="flex flex-col justify-between h-full py-6 px-2 w-16">
        <div className="flex flex-col items-center gap-6">
          {navItems.map((item) => (
            <div 
              key={item.path}
              className="relative group"
              onMouseEnter={() => setHoveredIcon(item.path)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <button
                onClick={() => navigate(item.path)}
                className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-700 ${
                  isActive(item.path) ? "bg-sky-600 text-white" : "text-gray-400"
                }`}
              >
                <item.icon size={24} />
              </button>
              
              {hoveredIcon === item.path && (
                <div className="absolute left-16 top-0 bg-gray-800 text-white px-3 py-1 rounded whitespace-nowrap text-sm z-10">
                  {item.label}
                </div>
              )}
            </div>
          ))}

          {/* New Group Chat Button */}
          <div 
            className="relative group mt-4"
            onMouseEnter={() => setHoveredIcon("create-group")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <button
              className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-all duration-200 flex items-center justify-center"
            >
              <Users size={16} className="mr-1" />
              <Plus size={14} />
            </button>
            
            {hoveredIcon === "create-group" && (
              <div className="absolute left-16 top-0 bg-gray-800 text-white px-3 py-1 rounded whitespace-nowrap text-sm z-10">
                Create Group Chat
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div 
            className="relative group"
            onMouseEnter={() => setHoveredIcon("profile")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <button
              onClick={() => navigate('/dashboard/profile')}
              className={`p-2 rounded-full transition-all duration-200 ${
                isActive('/dashboard/profile') 
                  ? "bg-sky-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <User size={24} />
            </button>
            
            {hoveredIcon === "profile" && (
              <div className="absolute left-16 top-0 bg-gray-800 text-white px-3 py-1 rounded whitespace-nowrap text-sm z-10">
                Profile
              </div>
            )}
          </div>

          <div 
            className="relative group"
            onMouseEnter={() => setHoveredIcon("logout")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <button
              onClick={handlelogout}
              className="p-2 rounded-lg transition-all duration-200 text-gray-400 hover:bg-gray-700"
            >
              <LogOut size={24} />
            </button>
            
            {hoveredIcon === "logout" && (
              <div className="absolute left-16 top-0 bg-gray-800 text-white px-3 py-1 rounded whitespace-nowrap text-sm z-10">
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
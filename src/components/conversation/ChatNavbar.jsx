import { ArrowLeft, MoreVertical, User, Info, Bell, BellOff, Settings } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { MutedConversation } from '../../utils/socket';

function ChatNavbar({ conversation,setanychange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };

  const handleToggleMute = async (e) => {
    e.stopPropagation();
    try {
      await MutedConversation(conversation._id);
       setanychange(prev=>!prev)
    } catch {
      toast.error('Failed to mute/unmute conversation', {
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
    }
    setIsMenuOpen(false);
  };

  const navigateToInfo = () => {
    navigate(`/dashboard/conversation/${conversation._id}/information`);
    setIsMenuOpen(false);
  };

  const getStatusText = () => {
    if (conversation.isGroup) {
      return `${conversation.participants?.length || 0} participants`;
    } else if (conversation.otherUser?.status === 'online') {
      return 'Online';
    } else if (conversation.otherUser?.lastSeen) {
      return `Last seen ${formatMessageDate(conversation.otherUser.lastSeen)}`;
    } else {
      return "Last seen recently";
    }
  };

  return (
    <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <Link to="/dashboard" className="mr-4 p-2 hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        
        {conversation && conversation.displayAvatar ? (
          <img
            src={conversation.displayAvatar}
            alt={conversation.displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
          />
        ) : (
          <div className="rounded-full p-3 bg-gray-700 flex items-center justify-center">
            <User size={20} />
          </div>
        )}
        
        <div className="ml-3">
          <h3 className="font-medium text-lg">{conversation.displayName}</h3>
          <p className="text-xs text-gray-300">
            {getStatusText()}
          </p>
        </div>
      </div>
      
      <div className="relative" ref={menuRef}>
        <button 
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label="More options"
        >
          <MoreVertical size={20} className="cursor-pointer" />
        </button>
        
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 py-1 overflow-hidden">
            <button 
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-white hover:bg-gray-700 transition-colors"
              onClick={handleToggleMute}
            >
              {conversation.isusermuted ? (
                <>
                  <BellOff size={16} className="text-blue-400" />
                  <span>Unmute Conversation</span>
                </>
              ) : (
                <>
                  <Bell size={16} className="text-blue-400" />
                  <span>Mute Conversation</span>
                </>
              )}
            </button>
            
            <button 
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-white hover:bg-gray-700 transition-colors"
              onClick={navigateToInfo}
            >
              <Info size={16} className="text-blue-400" />
              <span>View Information</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatNavbar;
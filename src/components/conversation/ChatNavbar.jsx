import { ArrowLeft, MoreVertical, User } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

function ChatNavbar({conversation}) {
 
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
      
      


  return (
    <div className="bg-gray-950 text-white px-4 py-2 flex items-center justify-between">
    <div className="flex items-center">
      <Link to="/dashboard" className="mr-4">
        <ArrowLeft size={24} />
      </Link>
      {
        (conversation && conversation.displayAvatar )? (
          <img
          src={conversation.displayAvatar}
          alt={conversation.displayName}
          className="w-12 h-12 rounded-full object-cover"
        />
        ):(
          <div className='rounded-full p-2 bg-gray-600'>
            <User size={25}/>
          </div>
        )
      }

      <div className="ml-3">
        <h3 className="font-medium text-lg">{conversation.displayName}</h3>
        <p className="text-xs">
          {conversation.isGroup 
            ? `${conversation.participants?.length || 0} participants` 
            : conversation.otherUser?.status === 'online'
              ? 'Online'
              : conversation.otherUser.lastSeen?formatMessageDate(conversation.otherUser.lastSeen):"last seen recently"
          }
        </p>
      </div>
    </div>
    <div className="flex space-x-4">
      <MoreVertical size={20} className="cursor-pointer" />
    </div>
  </div>
  )
}

export default ChatNavbar

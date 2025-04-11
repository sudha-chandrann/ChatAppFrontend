import {  User } from 'lucide-react'
import React from 'react'
import { RiUnpinLine } from 'react-icons/ri'
import { PinnedMessage } from '../../utils/socket'
import toast from 'react-hot-toast';

function PinnedMessageCard({message,conversationId}) {
    console.log(" the pinned message is ",message)
    const handleUnPinned = async (e) => {
        e.stopPropagation();
        try {
          await PinnedMessage(message._id,conversationId);
          toast.success('Message Unpinned successfully');
        } catch {
          toast.error('Failed to Unpin message', {
            style: {
              background: '#1F2937',
              color: '#fff',
            },
          });
        }
      };

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-3 mb-4 rounded-md shadow-md text-gray-800 fixed top-16 z-50 w-full right-0 md:w-4/6 lg:5/6 mx-auto transition-all duration-300 hover:shadow-lg">
    <div className="flex items-start gap-3 relative">
      {/* Pin icon */}
      <div className="absolute -top-2 -left-2 bg-yellow-500 rounded-full p-1 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>

      {/* Avatar */}
      {message.sender.profilePicture ? (
        <img
          src={
            message.sender?.profilePicture 
          }
          alt={message.sender.username}
          className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400 shadow-sm"
        />
      ) : (
        <div className="bg-gradient-to-r from-gray-800 to-gray-300 p-2 rounded-full">
          <User size={23} />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs text-yellow-700">
              @
              {message.sender?.username || "unknown"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 italic">
              Unpin Message
            </span>
            {/* Unpin button - include onClick handler to call your unpin function */}
            <button
              className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Unpin message"
              onClick={handleUnPinned}
            >
              <RiUnpinLine/>
            </button>
          </div>
        </div>

        <div className="mt-1">
          <p className="text-gray-700 text-sm line-clamp-2 break-words">
            {
              message.content
            }
          </p>

        </div>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(
            message.createdAt
          ).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
  )
}

export default PinnedMessageCard

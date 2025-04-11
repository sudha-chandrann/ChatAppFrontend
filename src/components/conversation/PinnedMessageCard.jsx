import { User, Pin, X, ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'
import { PinnedMessage } from '../../utils/socket'
import toast from 'react-hot-toast'

function PinnedMessageCard({ message, conversationId, onUnpin }) {
  const handleUnpin = async (e) => {
    e.stopPropagation();
    try {
      await PinnedMessage(message._id, conversationId);
      toast.success('Message unpinned successfully');
      if (onUnpin) onUnpin(message._id);
    } catch  {
      toast.error('Failed to unpin message', {
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Pin className="h-4 w-4 text-amber-500" />
          
          <div className="flex-shrink-0">
            {message.sender.profilePicture ? (
              <img 
                src={message.sender.profilePicture} 
                alt={message.sender.username} 
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              @{message.sender?.username || "unknown"}
            </p>
          </div>
        </div>

        <button
          onClick={handleUnpin}
          className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
          title="Unpin Message"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mt-3 pl-10">
        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
      
      <div className="mt-3 pl-10">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}

function PinnedMessagesContainer({ pinnedMessages, conversationId }) {
  const [showAllPinned, setShowAllPinned] = useState(false);
  const [messages, setMessages] = useState(pinnedMessages || []);
  
  const visibleMessages = showAllPinned ? messages : messages.slice(0, 1);
  
  const handleUnpin = (messageId) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
  };

  if (!messages.length) return null;

  return (
    <div className="pinned-messages-container mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <Pin className="h-4 w-4 mr-2 text-amber-500" />
          Pinned Messages
        </h3>
      </div>

      <div className="space-y-3">
        {visibleMessages.map(message => (
          <PinnedMessageCard 
            key={message._id} 
            message={message} 
            conversationId={conversationId}
            onUnpin={handleUnpin}
          />
        ))}
      </div>

      {messages.length > 1 && (
        <button
          onClick={() => setShowAllPinned(!showAllPinned)}
          className="mt-3 w-full flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
          {showAllPinned ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show All Pinned Messages ({messages.length})
            </>
          )}
        </button>
      )}
    </div>
  );
}

export { PinnedMessageCard, PinnedMessagesContainer };
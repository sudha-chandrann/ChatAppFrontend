import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reply, Trash2, Share, Check, X, Smile } from 'lucide-react';
import { addReaction, deleteMessage, forwardMessage } from '../../utils/socket';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function MessageBox({ 
  message, 
  isMine, 
  isGroup, 
  conversations,
  onReply
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showForwardOptions, setShowForwardOptions] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const optionsRef = useRef(null);
  const currentUserId = useSelector((state) => state.user._id);

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    setShowReactions(false);
    setShowForwardOptions(false);
  };

  const toggleReactions = (e) => {
    e.stopPropagation();
    setShowReactions(!showReactions);
    setShowForwardOptions(false);
  };

  const toggleForwardOptions = (e) => {
    e.stopPropagation();
    setShowForwardOptions(!showForwardOptions);
    setShowReactions(false);
  };

  const handleReply = (e) => {
    e.stopPropagation();
    if (onReply) onReply(message);
    setShowOptions(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteMessage(message._id, message.conversation);
      toast.success('Message deleted');
    } catch  {
      toast.error('Failed to delete message');
    }
    setShowOptions(false);
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversations(prev => {
      if (prev.includes(conversationId)) {
        return prev.filter(id => id !== conversationId);
      } else {
        return [...prev, conversationId];
      }
    });
  };

  const handleForward = async (e) => {
    e.stopPropagation();
    
    if (showForwardOptions) {
      // If already showing forward options, proceed with forwarding
      if (selectedConversations.length === 0) {
        toast.error('Please select at least one conversation');
        return;
      }
      
      try {
        await forwardMessage(message._id, selectedConversations);
        toast.success(`Message forwarded to ${selectedConversations.length} conversations`);
        setShowForwardOptions(false);
        setSelectedConversations([]);
      } catch  {
        toast.error('Failed to forward message');
      }
    } else {
      // Show forward options
      toggleForwardOptions(e);
    }
    
    setShowOptions(false);
  };

  const handleReaction = async (emoji) => {
    try {
      await addReaction(message._id, emoji);
    } catch {
      toast.error('Failed to add reaction');
    }
    setShowReactions(false);
    setShowOptions(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
        setShowReactions(false);
        setShowForwardOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Display for message is deleted
  if (message.isDeleted) {
    return (
      <div className={`flex mb-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 shadow bg-gray-700 text-gray-400 italic`}>
          <p className="text-sm">This message was deleted</p>
        </div>
      </div>
    );
  }

  // Display for forwarded message
  const isForwarded = message.isForwarded;

  return (
    <div
      className={`flex mb-2 ${isMine ? 'justify-end' : 'justify-start'} relative`}
    >
      {/* Message bubble */}
      <div
        className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 shadow ${
          isMine
            ? 'bg-green-800 rounded-tr-none text-white'
            : 'bg-gray-800 rounded-tl-none text-white'
        }`}
        onClick={toggleOptions}
      >
        {/* Group sender name */}
        {isGroup && !isMine && (
          <div className="text-xs font-medium text-blue-400 mb-1">
            {message.sender.username}
          </div>
        )}
        
        {/* Forwarded label */}
        {isForwarded && (
          <div className="text-xs italic text-gray-400 mb-1">
            Forwarded
          </div>
        )}
        
        {/* Reply to indicator */}
        {message.replyTo && (
          <div className="bg-gray-700 p-2 rounded mb-2 border-l-2 border-blue-500">
            <div className="text-xs text-blue-400">
              Reply to {message.replyTo.sender.username}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {message.replyTo.contentType === 'text' ? 
                message.replyTo.content : 
                `[${message.replyTo.contentType}]`
              }
            </div>
          </div>
        )}

        {/* Message content */}
        {message.contentType === 'text' ? (
          <p>{message.content}</p>
        ) : message.contentType === 'image' ? (
          <div>
            <img
              src={message.mediaUrl || '/placeholder-image.jpg'}
              alt={message.mediaName || "Message attachment"}
              className="rounded mb-1 max-w-full w-52 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                // Handle image preview click
              }}
            />
          </div>
        ) : message.contentType === 'file' ? (
          <Link 
            to={message.mediaUrl} 
            target='_blank' 
            className="flex items-center bg-gray-700 p-2 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm text-blue-300">Document: {message.mediaName || 'File'}</span>
          </Link>
        ) : message.contentType === 'video' ? (
          <video 
            src={message.mediaUrl} 
            className="rounded mb-1 max-w-full" 
            muted 
            controls 
            onClick={(e) => e.stopPropagation()}
          />
        ) : null}

        {/* Message metadata and status */}
        <div className="flex items-center justify-end mt-1">
          <span className="text-xs text-gray-400">
            {formatMessageTime(message.createdAt)}
          </span>

          {isMine && (
            <span className="ml-1 text-xs">
              {message.deliveryStatus === 'sending' ? (
                <div className="w-3 h-3 rounded-full border border-gray-400"></div>
              ) : message.deliveryStatus === 'sent' ? (
                <div className="text-gray-400">✓</div>
              ) : message.deliveryStatus === 'delivered' ? (
                <div className="text-gray-400">✓✓</div>
              ) : message.deliveryStatus === 'read' ? (
                <div className="text-blue-400">✓✓</div>
              ) : null}
            </span>
          )}
        </div>
        
        {/* Reactions display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex -ml-2 mt-1">
            {Array.from(new Set(message.reactions.map(r => r.emoji))).map(emoji => {
              const count = message.reactions.filter(r => r.emoji === emoji).length;
              return (
                <div 
                  key={emoji} 
                  className="bg-gray-700 rounded-full px-2 py-1 mr-1 flex items-center text-xs"
                >
                  <span>{emoji}</span>
                  {count > 1 && <span className="ml-1 text-gray-400">{count}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message options dropdown */}
      {showOptions && (
        <div 
          ref={optionsRef}
          className={`absolute ${isMine ? 'right-0' : 'left-0'} -top-10 bg-gray-700 rounded-lg shadow-lg z-10`}
        >
          <div className="flex space-x-1 text-white p-1">
            <button 
              onClick={handleReply} 
              className="p-2 hover:bg-gray-600 rounded"
              title="Reply"
            >
              <Reply size={16} />
            </button>
            
            <button 
              onClick={toggleReactions}
              className="p-2 hover:bg-gray-600 rounded"
              title="React"
            >
              <Smile size={16} />
            </button>
            
            <button 
              onClick={handleForward} 
              className="p-2 hover:bg-gray-600 rounded"
              title="Forward"
            >
              <Share size={16} />
            </button>
            
            {isMine && (
              <button 
                onClick={handleDelete} 
                className="p-2 hover:bg-gray-600 rounded text-red-400"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reactions picker */}
      {showReactions && (
        <div 
          className={`absolute ${isMine ? 'right-0' : 'left-0'} -top-16 bg-gray-700 rounded-lg shadow-lg p-1 z-20`}
        >
          <div className="flex space-x-2">
            {["👍", "❤️", "😂", "😮", "😢", "🙏"].map(emoji => (
              <button 
                key={emoji} 
                className="hover:bg-gray-600 p-2 rounded-full transition-transform hover:scale-125"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Forward options */}
      {showForwardOptions && (
        <div 
          className={`absolute ${isMine ? 'right-0' : 'left-0'} top-full mt-2 bg-gray-700 rounded-lg shadow-lg p-2 z-20 w-64`}
        >
          <div className="mb-2 text-sm text-white font-medium">Forward to:</div>
          <div className="max-h-40 overflow-y-auto">
            {conversations && conversations.participants ? (
              // For single conversations (showing individual participants)
              <div 
                key={conversations._id}
                className="flex items-center p-2 hover:bg-gray-600 rounded cursor-pointer"
                onClick={() => handleSelectConversation(conversations._id)}
              >
                <div className="w-6 h-6 flex items-center justify-center mr-2">
                  {selectedConversations.includes(conversations._id) ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 truncate text-white">
                  {conversations.isGroup ? conversations.name : 
                    conversations.participants.find(p => p.user._id !== currentUserId)?.user.username || "Chat"}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center p-2">No conversations available</div>
            )}
          </div>
          <div className="mt-2 flex justify-end space-x-2">
            <button 
              className="p-1 text-gray-400 hover:text-white"
              onClick={toggleForwardOptions}
            >
              <X size={16} />
            </button>
            <button 
              className="p-1 text-green-500 hover:text-green-400"
              onClick={handleForward}
              disabled={selectedConversations.length === 0}
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageBox;
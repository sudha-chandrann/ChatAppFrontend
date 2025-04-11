import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reply, Trash2, Share, Check, X, Smile, Clock, User, Edit, Pin } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { addReaction, deleteMessage, forwardMessage, PinnedMessage, } from '../../utils/socket';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import MessageEditor from './MessageEditor';

function MessageBox({ 
  message, 
  isMine, 
  isGroup, 
  conversations,
  onReply
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showForwardOptions, setShowForwardOptions] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const optionsRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const currentUserId = useSelector((state) => state.user._id);
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    setShowEmojiPicker(false);
    setShowForwardOptions(false);
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
    setShowForwardOptions(false);
  };

  const toggleForwardOptions = (e) => {
    e.stopPropagation();
    setShowForwardOptions(!showForwardOptions);
    setShowEmojiPicker(false);
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
      toast.success('Message deleted', {
        icon: '🗑️',
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
    } catch {
      toast.error('Failed to delete message', {
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
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
      if (selectedConversations.length === 0) {
        toast.error('Please select at least one conversation', {
          style: {
            background: '#1F2937',
            color: '#fff',
          },
        });
        return;
      }
      
      try {
        await forwardMessage(message._id, selectedConversations);
        toast.success(`Message forwarded successfully`, {
          icon: '➡️',
          style: {
            background: '#1F2937',
            color: '#fff',
          },
        });
        setShowForwardOptions(false);
        setSelectedConversations([]);
      } catch {
        toast.error('Failed to forward message', {
          style: {
            background: '#1F2937',
            color: '#fff',
          },
        });
      }
    } else {
      toggleForwardOptions(e);
    }
    
    setShowOptions(false);
  };

  const handleEmojiClick = async (emojiData) => {
    try {
      await addReaction(message._id, emojiData.emoji);
    } catch {
      toast.error('Failed to add reaction', {
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
    }
    setShowEmojiPicker(false);
    setShowOptions(false);
  };
  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setShowOptions(false);
  };
  const handlePinned = async (e) => {
    e.stopPropagation();
    try {
      await PinnedMessage(message._id, message.conversation);
      toast.success('Message pinned successfully');
    } catch {
      toast.error('Failed to Pin message', {
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
    }
    setShowOptions(false);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
      
      if (showEmojiPicker && 
          emojiPickerRef.current && 
          !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      
      if (showForwardOptions && 
          event.target.closest('[data-forward-options]') === null) {
        setShowForwardOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker, showForwardOptions]);


  const handleRemoveReaction = async (emoji) => {
    try {
      await addReaction(message._id, emoji);

    } catch {
      toast.error('Failed to remove reaction', {
        style: {
          background: '#1F2937',
          color: '#fff',
        },
      });
    }
  };

  if (message.isDeleted) {
    return (
      <div className={`flex mb-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md rounded-xl px-4 py-2 shadow-md bg-gray-700 text-gray-400 italic transition-all duration-200`}>
          <p className="text-sm">This message was deleted</p>
          <span className='ml-auto'>DeletedAt : {formatMessageTime(message.deletedAt)}</span>
        </div>
      </div>
    );
  }
  const isForwarded = message.isForwarded;

  const getMessageBgColor = () => {
    if (isMine) {
      return 'bg-gradient-to-br from-green-700 to-green-900 border border-green-600';
    }
    return 'bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600';
  };

  const getStatusIcon = () => {
    switch (message.deliveryStatus) {
      case 'sending':
        return <Clock size={12} className="text-gray-400" />;
      case 'sent':
        return <div className="text-gray-400">✓</div>;
      case 'delivered':
        return <div className="text-gray-400">✓✓</div>;
      case 'read':
        return <div className="text-blue-400">✓✓</div>;
      default:
        return null;
    }
  };

  const organizeReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return [];
    
    const reactionsMap = {};
    message.reactions.forEach(reaction => {
      if (!reactionsMap[reaction.emoji]) {
        reactionsMap[reaction.emoji] = {
          emoji: reaction.emoji,
          count: 0,
          users: [],
          hasMyReaction: false
        };
      }
      reactionsMap[reaction.emoji].count++;
      reactionsMap[reaction.emoji].users.push(reaction.user);
      
      if (reaction.user === currentUserId) {
        reactionsMap[reaction.emoji].hasMyReaction = true;
      }
    });
    
    return Object.values(reactionsMap);
  };

  const organizedReactions = organizeReactions();

  return (
    <div  className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'} gap-1`}>
      {
        (isGroup && !isMine) && (
          message.sender.profilePicture ? 
          <img
          src={message.sender.profilePicture}
          alt=''
          className="w-12 h-12 rounded-full object-cover"

          />:(
            <div className='rounded-full p-2 text-white bg-gradient-to-r from-gray-900 to-gray-500 h-fit'>
              <User size={28}/>
            </div>
          )
        )
      }
    <div
      className={`flex  relative group`}
    >
      <div
        className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 shadow-lg ${getMessageBgColor()} ${
          isMine
            ? 'rounded-tr-none text-white'
            : 'rounded-tl-none text-white'
        } transition-all duration-200 hover:shadow-xl`}
        onClick={toggleOptions}
      >

        {isGroup && !isMine && (
          <div className="text-xs font-medium text-blue-400 mb-1">
            {message.sender.username}
          </div>
        )}
        
        {isForwarded && (
          <div className="text-xs italic text-gray-400 mb-1 flex items-center gap-1">
            <Share size={12} />
          </div>
        )}
        
        {message.replyTo && (
          <div className="bg-gray-800 bg-opacity-50 p-2 rounded-lg mb-2 border-l-2 border-blue-500">
            <div className="text-xs text-blue-400 flex items-center gap-1">
              <Reply size={12} />
              Reply to {message.replyTo.sender._id===currentUserId?"me":message.replyTo.sender.username}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {message.replyTo.contentType === 'text' ? 
                message.replyTo.content : 
                `[${message.replyTo.contentType}]`
              }
            </div>
          </div>
        )}
                {
          isEditing && message.contentType === 'text' ? (
            <MessageEditor 
            message={message} 
            conversationId={message.conversation}
            onClose={() => setIsEditing(false)}
          />
          ):(
            message.contentType === 'text' ? (
              <p className="break-words">                  {message.content}
              {message.isEdited && !isEditing && (
                <span className="text-xs text-gray-400 ml-1">(edited)</span>
              )}</p>
            ) : message.contentType === 'image' ? (
              <div>
                <img
                  src={message.mediaUrl || '/placeholder-image.jpg'}
                  alt={message.mediaName || "Message attachment"}
                  className="rounded-lg mb-1 max-w-full w-52 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
            ) : message.contentType === 'file' ? (
              <Link 
                to={message.mediaUrl} 
                target='_blank' 
                className="flex items-center bg-gray-800 bg-opacity-50 p-2 rounded-lg hover:bg-opacity-70 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-sm text-blue-300">Document: {message.mediaName || 'File'}</span>
              </Link>
            ) : message.contentType === 'video' ? (
              <video 
                src={message.mediaUrl} 
                className="rounded-lg mb-1 max-w-full" 
                muted 
                controls 
                onClick={(e) => e.stopPropagation()}
              />
            ) : null
          )
        }


        <div className="flex items-center justify-end mt-2 gap-1">
          <span className="text-xs text-gray-400">
            {
              message.isEdited ? formatMessageTime(message.editHistory[message.editHistory.length-1]?.editedAt):formatMessageTime(message.createdAt)
            }
          
          </span>

          {isMine && (
            <span className="ml-1 text-xs">
              {getStatusIcon()}
            </span>
          )}
        </div>
        
        {organizedReactions.length > 0 && (
          <div className="flex flex-wrap max-w-[200px] -ml-2 mt-2 gap-0.5">
            {organizedReactions.map(reaction => (
              <div 
                key={reaction.emoji} 
                className={`${reaction.hasMyReaction ? 'bg-blue-800' : 'bg-gray-800'} rounded-full px-1 py-1 flex items-center text-xs transition-transform hover:scale-110 cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (reaction.hasMyReaction) {
                    handleRemoveReaction(reaction.emoji);
                  }
                }}
                title={reaction.hasMyReaction ? "Click to remove your reaction" : 
                  `${reaction.count} ${reaction.count > 1 ? 'reactions' : 'reaction'}`}
              >
                <span>{reaction.emoji}</span>
                {reaction.count > 1 && <span className="ml-1 text-gray-400">{reaction.count}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div 
        className={`${isMine ? 'mr-2' : 'ml-2'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-end mb-1`}
        onClick={(e) => {
          e.stopPropagation();
          toggleOptions();
        }}
      >
        <button className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {showOptions && (
        <div 
          ref={optionsRef}
          className={`absolute ${isMine ? 'right-0' : 'left-0'} -top-12 bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-700 overflow-hidden transform transition-all duration-150 scale-100`}
        >
          <div className="flex space-x-1 text-white p-1">
            <button 
              onClick={handleReply} 
              className="p-2 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center"
              title="Reply"
            >
              <Reply size={16} />
            </button>
            {isMine && message.contentType === 'text'&&(
              <button 
                onClick={handleEdit}
                className="p-2 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center"
                title="Edit"
              >
                <Edit size={16} />
              </button>

            )}
              
              {
                !message.isPinned && (
                  <button
                   onClick={handlePinned}
                   className="p-2 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center"
                   title='pin'
                   >
                    <Pin size={16} />
                  </button>
                )
              }
            
              <button 
                onClick={toggleEmojiPicker} 
                className="p-2 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center"
                title="React"
                id="emoji-picker-toggle"
              >
                <Smile size={16} />
              </button>
        
            
            <button 
              onClick={handleForward} 
              className="p-2 hover:bg-gray-700 rounded-md transition-colors flex items-center justify-center"
              title="Forward"
            >
              <Share size={16} />
            </button>
            
            {isMine && (
              <button 
                onClick={handleDelete} 
                className="p-2 hover:bg-red-600 hover:bg-opacity-20 rounded-md transition-colors flex items-center justify-center text-red-400 hover:text-red-500"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>

            )}
          </div>
        </div>
      )}

      { showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-900 p-3 rounded-lg shadow-2xl relative">
            <button 
              className="absolute right-3 top-3 z-50 bg-gray-800 rounded-full p-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              onClick={() => setShowEmojiPicker(false)}
            >
              <X size={18} />
            </button>
            <div className="mb-3 text-white text-sm font-medium">
              Add Reaction
            </div>
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              searchDisabled={false}
              skinTonesDisabled
              width={300}
              height={350}
              previewConfig={{
                showPreview: false
              }}
              theme="dark"
              lazyLoadEmojis={true}
            />
          </div>
        </div>
      )}

      {showForwardOptions && (
        <div 
          data-forward-options="true"
          className={`absolute ${isMine ? 'right-0' : 'left-0'} top-full mt-2 bg-gray-800 rounded-lg shadow-lg p-3 z-20 w-64 border border-gray-700 transition-all duration-150`}
        >
          <div className="mb-3 text-sm text-white font-medium border-b border-gray-700 pb-2">Forward to:</div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {conversations && conversations.length > 0 ? (
              conversations.map(conversation => (
                <div 
                  key={conversation._id}
                  className="flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer mb-1 transition-colors"
                  onClick={() => handleSelectConversation(conversation._id)}
                >
                  <div className="w-6 h-6 flex items-center justify-center mr-2">
                    {selectedConversations.includes(conversation._id) ? (
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-4 h-4 border border-gray-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 truncate text-white">
                    {conversation.isGroup ? conversation.name : 
                      conversation.participants.find(p => p.user._id !== currentUserId)?.user.username || "Chat"}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center p-4">No conversations available</div>
            )}
          </div>
          <div className="mt-3 flex justify-end space-x-2 pt-2 border-t border-gray-700">
            <button 
              className="px-3 py-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1"
              onClick={toggleForwardOptions}
            >
              <X size={14} />
              <span className="text-xs">Cancel</span>
            </button>
            <button 
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                selectedConversations.length === 0 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
              onClick={handleForward}
              disabled={selectedConversations.length === 0}
            >
              <Check size={14} />
              <span className="text-xs">Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
    </div>

  );
}

export default MessageBox;
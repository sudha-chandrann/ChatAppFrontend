import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, Navigate } from 'react-router-dom';
import ChatNavbar from '../components/conversation/ChatNavbar';
import ChatInput from '../components/conversation/ChatInput';
import { useSelector } from 'react-redux';
import { 
  joinUserRoom, 
  joinConversation, 
  leaveConversation, 
  setupConversationListeners,
  sendMessage,
  markMessageAsRead
} from "../utils/socket"
import toast from 'react-hot-toast';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId;
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = useSelector((state) => state.user._id);
  const [typingUsers, setTypingUsers] = useState({});
  
  const getConversationDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/conversations/chat/${conversationId}`);
      console.log("Conversation response:", response.data);
      setConversation(response.data.Conversation);
      getMessages();
    } catch (err) {
      console.log("Error getting conversation details:", err);
      setError("Failed to load conversation");
      setLoading(false);
    }
  };
  
  const getMessages = async () => {
    try {
      const response = await axios.get(`/api/v1/conversations/messages/${conversationId}`);
      console.log("Messages response:", response.data);
      const messagesList = response.data.messages;
      setMessages(messagesList);
      
      // Mark all unread messages as read
      messagesList.forEach(message => {
        const isRead = message.readBy.some(read => read.user === currentUserId);
        if (!isRead && message.sender._id !== currentUserId) {
          markMessageAsRead(message._id, conversationId);
        }
      });
      
      setLoading(false);
    } catch (err) {
      console.log("Error getting messages:", err);
      setError("Failed to load messages");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getConversationDetails();
    
    joinUserRoom(currentUserId);
    joinConversation(conversationId);
    
    const cleanup = setupConversationListeners({
      onNewMessage: (message) => {
        if (message.conversation === conversationId) {
          setMessages(prev => [...prev, message]);
          
          // Mark message as read if it's not from current user
          if (message.sender._id !== currentUserId) {
            markMessageAsRead(message._id, conversationId);
          }
        }
      },
      onUserTyping: ({ userId, isTyping }) => {
        if (userId !== currentUserId) {
          setTypingUsers(prev => ({
            ...prev,
            [userId]: isTyping ? new Date() : null
          }));
        }
      },
      onMessageRead: ({ messageId, userId }) => {
        if (userId !== currentUserId) {
          setMessages(prev => 
            prev.map(msg => 
              msg._id === messageId 
                ? { 
                    ...msg, 
                    readBy: [...msg.readBy, { user: userId, readAt: new Date() }]
                  }
                : msg
            )
          );
        }
      }
    });
    
    // Cleanup function
    return () => {
      leaveConversation(conversationId);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      const now = new Date();
      const updatedTypingUsers = { ...typingUsers };
      let hasChanges = false;
      
      Object.entries(updatedTypingUsers).forEach(([userId, timestamp]) => {
        if (timestamp && now - new Date(timestamp) > 3000) {
          updatedTypingUsers[userId] = null;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setTypingUsers(updatedTypingUsers);
      }
    }, 3000);
    
    return () => clearTimeout(typingTimeout);
  }, [typingUsers]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
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
  
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const handleSendNewMessage = async (content, contentType = 'text', mediaData = null) => {
    try {
            await sendMessage({
        conversationId,
        content,
        contentType,
        mediaUrl: mediaData?.url || '',
        mediaName: mediaData?.name || '',
        mediaSize: mediaData?.size || 0,
        mediaType: mediaData?.type || ''
      });
      
    } catch (error) {
      toast.error(error.message||"Failed to send the message")
      console.error("Error sending message:", error);

    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link to="/dashboard" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  if (!conversation) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const groupedMessages = groupMessagesByDate();
  const isGroup = conversation.isGroup;
  
  const activeTypingUsers = Object.entries(typingUsers)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, timestamp]) => timestamp !== null)
    .map(([userId]) => {
      const participant = conversation.participants.find(p => p.user._id === userId);
      return participant ? participant.user.username : "Someone";
    });

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <ChatNavbar conversation={conversation} />

      <div 
        className="flex-grow overflow-y-auto p-4 pb-24"
        style={{ 
          backgroundImage: 'url("/chat-bg-dark.png")',
          backgroundSize: 'repeat',
          backgroundRepeat: 'repeat'
        }}
      >
        {conversation.pinnedmessage && conversation.pinnedmessage.length > 0 && (
          <div className="bg-gray-800 border-l-4 border-yellow-500 p-3 mb-4 rounded shadow-sm text-white">
            <div className="flex items-center text-yellow-500 mb-1">
              <span className="text-sm font-medium">Pinned Message</span>
            </div>
            <p className="text-gray-300">{conversation.pinnedmessage[0].content}</p>
          </div>
        )}
        
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center my-4">
              <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                {formatMessageDate(dateMessages[0].createdAt)}
              </span>
            </div>
            
            {dateMessages.map((message) => {
              const isMine = message.sender._id === currentUserId;
              
              return (
                <div 
                  key={message._id}
                  className={`flex mb-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 shadow ${
                      isMine 
                        ? 'bg-green-800 rounded-tr-none text-white' 
                        : 'bg-gray-800 rounded-tl-none text-white'
                    }`}
                  >
                    {isGroup && !isMine && (
                      <div className="text-xs font-medium text-blue-400 mb-1">
                        {message.sender.username}
                      </div>
                    )}
                    
                    {message.contentType === 'text' ? (
                      <p>{message.content}</p>
                    ) : message.contentType === 'image' ? (
                      <img 
                        src={message.mediaUrl || '/placeholder-image.jpg'} 
                        alt="Message attachment" 
                        className="rounded mb-1 max-w-full" 
                      />
                    ) : message.contentType === 'file' ? (
                      <div className="flex items-center bg-gray-700 p-2 rounded">
                        <span className="text-sm text-blue-300">Document: {message.fileName || 'File'}</span>
                      </div>
                    ) : null}
                    
                    <div className="flex items-center justify-end mt-1">
                      <span className="text-xs text-gray-400">
                        {formatMessageTime(message.createdAt)}
                      </span>
                      
                      {isMine && (
                        <span className="ml-1 text-xs">
                          {message.status === 'sending' ? (
                            <div className="w-3 h-3 rounded-full border border-gray-400"></div>
                          ) : message.status === 'sent' ? (
                            <div className="text-gray-400">✓</div>
                          ) : message.status === 'delivered' ? (
                            <div className="text-gray-400">✓✓</div>
                          ) : message.status === 'read' ? (
                            <div className="text-blue-400">✓✓</div>
                          ) : null}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Typing indicator */}
        {activeTypingUsers.length > 0 && (
          <div className="flex items-center text-gray-400 text-sm mt-2 mb-1 ml-2">
            {activeTypingUsers.length === 1 
              ? `${activeTypingUsers[0]} is typing...` 
              : `${activeTypingUsers.join(', ')} are typing...`}
            <span className="ml-1 flex">
              <span className="animate-bounce mx-0.5">.</span>
              <span className="animate-bounce mx-0.5 animation-delay-200">.</span>
              <span className="animate-bounce mx-0.5 animation-delay-400">.</span>
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendNewMessage} conversationId={conversationId} />
    </div>
  );
}
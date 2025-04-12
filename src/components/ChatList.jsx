import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Search, Bell, Settings, MessageCircle, Plus } from 'lucide-react';
import ConversationCard from './sidbar/ConversationCard';
import SearchUser from './sidbar/Searchuser';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

function ChatList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startnewchart, setstartnewchart] = useState(false);
  
  const getAllConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/conversations/getallconversations`, {
        withCredentials: true
      });
      
      const sortedConversations = sortConversationsByDate(response.data.conversations);
      
      setConversations(sortedConversations);
      setLoading(false);
    } catch (error) {
      console.error("Error during getting all conversations:", error);
      setError("Failed to fetch conversations");
      setLoading(false);
    }
  };

  // Function to sort conversations by date
  const sortConversationsByDate = (conversationsToSort) => {
    return [...conversationsToSort].sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1; 
      if (!b.lastMessage) return -1; 
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });
  };

  useEffect(() => {
    getAllConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessageUpdate = (conversationId, newMessage) => {
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map(conv => {
        if (conv._id === conversationId) {
          return { ...conv, lastMessage: newMessage };
        }
        return conv;
      });
      return sortConversationsByDate(updatedConversations);
    });
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => {
    const searchValue = searchTerm.toLowerCase();
    if (conversation.isGroup) {
      return conversation.displayName.toLowerCase().includes(searchValue);
    } else {
      return conversation.otherUser?.fullName?.toLowerCase().includes(searchValue) || 
             conversation.otherUser?.username?.toLowerCase().includes(searchValue);
    }
  });

  return (
    <div className='h-screen bg-gray-900 flex flex-col w-full pt-14 pl-14 text-gray-100'>
      {/* Header */}
      <div className='px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900'>
        <h1 className='text-xl font-bold text-white'>Messages</h1>
        <div className='flex space-x-4'>
          <button className='text-gray-400 hover:text-indigo-400 transition'>
            <Bell size={20} />
          </button>
          <button className='text-gray-400 hover:text-indigo-400 transition'>
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className='px-6 py-3 border-b border-gray-800 bg-gray-900'>
        <div >
          <div className='fixed inset-y-0 left-0 -z-10 pl-4 flex items-center pointer-events-none'>
            <Search className='text-gray-500' size={16} />
          </div>
          <input 
            type="text"
            placeholder='Search conversations...' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500'
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900'>
        {loading ? (
          <div className='flex justify-center items-center h-32'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500'></div>
          </div>
        ) : error ? (
          <div className='text-center p-4 text-red-400'>{error}</div>
        ) : filteredConversations.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
            {searchTerm ? (
              <>
                <Search size={40} className="mb-3 opacity-50" />
                <p>No conversations match your search</p>
              </>
            ) : (
              <>
                <MessageCircle size={40} className="mb-3 " />
                <p>No conversations yet</p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredConversations.map(conversation => (
              <ConversationCard 
                key={conversation._id} 
                conversation={conversation} 
                onMessageUpdate={handleMessageUpdate}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* New chat button */}
      <div className='p-4 bg-gray-900 border-t border-gray-800 shadow-lg'>
        <button 
          onClick={() => setstartnewchart(prev => !prev)}
          className='w-full py-2.5 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition font-medium'
        >
          <Plus size={18} className='mr-2' />
          New Conversation
        </button> 
        {startnewchart && (
          <SearchUser onClose={() => setstartnewchart(false)} />
        )}
      </div>
    </div>
  );
}

export default ChatList;
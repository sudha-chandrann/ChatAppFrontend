import axios from 'axios';
import { Search, X, UserPlus, User, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../utils/baseurl';

function CreateGroup({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm === '') {
        setUsers([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const timeoutId = setTimeout(async () => {
          const response = await axios.post(`${apiBaseUrl}/api/v1/users/getusers`, {
            term: searchTerm
          }, {
            withCredentials: true
          });
          if (response.data.success) {
            setUsers(response.data.data);
          } else {
            setError(response.data.message);
          }
          setLoading(false);
        }, 500);
        
        return () => clearTimeout(timeoutId);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
        setLoading(false);
      }
    };
    
    searchUsers();
  }, [searchTerm]);

  // Format last seen time
  const formatLastSeen = (date) => {
    const lastSeen = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return lastSeen.toLocaleDateString();
  };

  // Add or remove user from selected users
  const toggleUserSelection = (user) => {
    const isSelected = selectedUsers.some(selectedUser => selectedUser._id === user._id);
    
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Start a new group chat
  const createGroupChat = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (selectedUsers.length < 1) {
      toast.error('Please select at least 1 users for a group');
      return;
    }

    try {
      const userIds = selectedUsers.map(user => user._id);
      const response = await axios.post(`${apiBaseUrl}/api/v1/conversations/group`, {
        userIds,
        groupName
      }, {
        withCredentials: true
      });
      toast.success(response.data.message || "Group conversation created successfully");
      navigate(`/dashboard/conversation/${response.data.conversation}`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      console.error('Failed to create group chat:', err);
    }
  };

  return (
    <div className='h-screen w-full top-0 left-0 right-0 fixed z-50 pt-10 flex items-center justify-center bg-gray-950 bg-opacity-60 backdrop-blur-sm'>
      <div className='bg-gray-900 w-full max-w-md rounded-lg shadow-xl overflow-hidden'>
        <div className='p-4 border-b border-gray-800 flex justify-between items-center'>
          <h2 className='text-xl font-bold text-white'>Create Group</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            <X size={24} />
          </button>
        </div>
        
        <div className='p-4'>
          <div className='mb-4'>
            <label htmlFor="groupName" className='block text-sm font-medium text-gray-400 mb-1'>
              Group Name
            </label>
            <input 
              type="text"
              id="groupName"
              placeholder='Enter group name' 
              value={groupName} 
              onChange={(e) => setGroupName(e.target.value)}
              className='w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-400 mb-1'>
              Selected Users ({selectedUsers.length})
            </label>
            {selectedUsers.length > 0 ? (
              <div className='flex flex-wrap gap-2 mb-3'>
                {selectedUsers.map(user => (
                  <div 
                    key={user._id} 
                    className='bg-purple-900 px-3 py-1 rounded-full flex items-center text-sm'
                  >
                    <span className='text-white mr-1'>{user.username}</span>
                    <button 
                      onClick={() => toggleUserSelection(user)}
                      className='text-purple-300 hover:text-white'
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-sm mb-3'>No users selected yet</p>
            )}
          </div>

          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='text-gray-500' size={18} />
            </div>
            <input 
              type="text"
              placeholder='Search by username, email or full name' 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
          
          {error && (
            <div className='mt-4 text-red-500 text-sm'>
              {error}
            </div>
          )}
          
          <div className='mt-4 max-h-60 overflow-y-auto'>
            {loading ? (
              <div className='flex justify-center p-4'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500'></div>
              </div>
            ) : users.length > 0 ? (
              <ul className='space-y-2'>
                {users.map(user => {
                  const isSelected = selectedUsers.some(selectedUser => selectedUser._id === user._id);
                  
                  return (
                    <li 
                      key={user._id} 
                      className={`p-3 rounded-lg transition ${isSelected ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-750'}`}
                    >
                      <div className='flex items-center'>
                        <div className='relative'>
                          {user.profilePicture ? (
                            <img 
                              src={user.profilePicture} 
                              alt={user.username} 
                              className='w-12 h-12 rounded-full object-cover'
                            />
                          ) : (
                            <div className='w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center'>
                              <User size={20} className='text-white' />
                            </div>
                          )}
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        </div>
                        
                        <div className='ml-3 flex-1'>
                          <div className='flex items-center justify-between'>
                            <h3 className='text-white font-medium'>{user.fullName}</h3>
                            <button 
                              onClick={() => toggleUserSelection(user)}
                              className={`${isSelected ? 'text-purple-300' : 'text-purple-500 hover:text-purple-400'}`}
                            >
                              {isSelected ? (
                                <X size={18} />
                              ) : (
                                <UserPlus size={18} />
                              )}
                            </button>
                          </div>
                          <p className='text-gray-400 text-sm'>@{user.username}</p>
                          {user.status !== 'online' && (
                            <div className='flex items-center text-gray-500 text-xs mt-1'>
                              <Clock size={12} className='mr-1' />
                              {formatLastSeen(user.lastSeen)}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : searchTerm ? (
              <div className='text-center py-6 text-gray-500'>
                No users found matching "{searchTerm}"
              </div>
            ) : (
              <div className='text-center py-6 text-gray-500'>
                Type to search for users
              </div>
            )}
          </div>
        </div>
        
        <div className='p-4 border-t border-gray-800 flex gap-3'>
          <button 
            onClick={onClose} 
            className='flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition'
          >
            Cancel
          </button>
          <button 
            onClick={createGroupChat}
            disabled={selectedUsers.length < 1 || !groupName.trim()} 
            className={`flex-1 py-2 rounded-md transition ${
              selectedUsers.length < 1 || !groupName.trim() 
                ? 'bg-purple-900 text-purple-300 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
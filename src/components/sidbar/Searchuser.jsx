import { Search, X, UserPlus, User, Clock } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { change } from '../../redux/userslice';

function SearchUser({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  // Fetch users based on search term
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
          const response = await axiosInstance.post(`/api/v1/users/getusers`, {
            term: searchTerm
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

  // Start a new chat with user
  const startChat = async (userId) => {
    try {
      const response= await axiosInstance.get(`/api/v1/conversations/user/${userId}`, {
        withCredentials: true
      })
      toast.success(response.data.message||"Conversation is created Successfully")
      navigate(`/dashboard/conversation/${response.data.Conversation}`)
      dispatch(change())
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      console.error('Failed to start chat:', err);
    }
  };

  return (
    <div className='h-screen w-full top-0 left-0 right-0 fixed z-50 pt-10 flex items-center justify-center bg-gray-950 bg-opacity-60 backdrop-blur-sm'>
      <div className='bg-gray-900 w-full max-w-md rounded-lg shadow-xl overflow-hidden'>
        <div className='p-4 border-b border-gray-800 flex justify-between items-center'>
          <h2 className='text-xl font-bold text-white'>Find Users</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            <X size={24} />
          </button>
        </div>
       
        <div className='p-4'>
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
          
          <div className='mt-4 max-h-96 overflow-y-auto'>
            {loading ? (
              <div className='flex justify-center p-4'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500'></div>
              </div>
            ) : users.length > 0 ? (
              <ul className='space-y-2'>
                {users.map(user => (
                  <li key={user._id} className='p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition'>
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
                            onClick={() => startChat(user._id)}
                            className='text-purple-500 hover:text-purple-400'
                          >
                            <UserPlus size={18} />
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
                ))}
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
        
        <div className='p-4 border-t border-gray-800'>
          <button 
            onClick={onClose} 
            className='w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchUser
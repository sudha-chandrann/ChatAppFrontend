import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, redirect } from 'react-router-dom';
import ChatNavbar from '../components/conversation/ChatNavbar';
import ChatInput from '../components/conversation/ChatInput';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId;
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getConversationDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/conversations/chat/${conversationId}`);
      console.log("Conversation response:", response.data);
      setConversation(response.data.Conversation);
    } catch (err) {
      console.log("Error getting conversation details:", err);
      setError("Failed to load conversation");
    }
    finally{
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getConversationDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);
  

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link to="/dashboard" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Back to Conversations
        </Link>
      </div>
    );
  }
  
  if (!conversation) {
    return redirect('/dashboard');
  }
  
  
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
     <ChatNavbar conversation={conversation}/>

      {/* Chat area */}
    

    {/* chat input */}
      <ChatInput/>
    </div>
  );
}
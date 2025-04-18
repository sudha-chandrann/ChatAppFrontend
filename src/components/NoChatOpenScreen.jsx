import React from 'react';
import { MessageSquare } from 'lucide-react';

const NoChatOpenScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 dark:bg-sky-900 p-4 rounded-full">
            <MessageSquare size={48} className="text-sky-600 dark:text-sky-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
          No conversation selected
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Select an existing conversation from the sidebar or start a new chat to begin messaging.
        </p>
        
        <button className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-md">
          Start new conversation
        </button>
        

      </div>
    </div>
  );
};

export default NoChatOpenScreen;
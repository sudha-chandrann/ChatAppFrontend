import React from 'react'
import { Link } from 'react-router-dom';

function MessageBox({message,isMine,isGroup}) {
    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
      
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
          alt={message.mediaName||"Message attachment" }
          className="rounded mb-1 max-w-full w-52" 
        />
      ) : message.contentType === 'file' ? (
        <Link to={message.mediaUrl} target='_blank' className="flex items-center bg-gray-700 p-2 rounded">
          <span className="text-sm text-blue-300">Document: {message.mediaName || 'File'}</span>
        </Link>
      ) : message.contentType === 'video'?(
        <video src={message.mediaUrl} className="rounded mb-1 max-w-full" muted controls/>
      ):null}
      
      <div className="flex items-center justify-end mt-1">
        <span className="text-xs text-gray-400">
          {formatMessageTime(message.createdAt)}
        </span>
        
        {isMine && (
          <span className="ml-1 text-xs">
            {message.deliveryStatus === 'sending' ? (
              <div className="w-3 h-3 rounded-full border border-gray-400"></div>
            ) : message.deliveryStatus=== 'sent' ? (
              <div className="text-gray-400">✓</div>
            ) : message.deliveryStatus === 'delivered' ? (
              <div className="text-gray-400">✓✓</div>
            ) : message.deliveryStatus === 'read' ? (
              <div className="text-blue-400">✓✓</div>
            ) : null}
          </span>
        )}
      </div>
    </div>
  </div>
  )
}

export default MessageBox

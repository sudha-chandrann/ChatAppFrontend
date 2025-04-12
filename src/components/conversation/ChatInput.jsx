import {  File, Image, Mic, Paperclip, Send, Smile, Video, X } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { sendTypingStatus } from "../../utils/socket"
import uploadfile from "../../utils/uploadImage";

function ChatInput({ onSendMessage, conversationId, replyingTo, onCancelReply }) {
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const lastTypingTime = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === "Escape" && replyingTo) {
      onCancelReply();
    }
  };

  const toggleAttachMenu = () => {
    setShowAttachMenu(!showAttachMenu);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachMenu(false);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    onSendMessage(messageInput);
    setMessageInput("");
    messageInputRef.current?.focus();
    sendTypingStatus(conversationId, false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      console.log(" the file is ", file);
      
      let contentType;
      if (file.type.startsWith('image/')) {
        contentType = 'image';
      } else if (file.type.startsWith('video/')) {
        contentType = 'video';
      } else {
        contentType = 'file';
      }
      
      const uploadedFile = await uploadfile(file);
      
      onSendMessage(
        contentType === 'image' ? 'Image' : 
        contentType === 'video' ?  file.name : 
        file.name?file.name:"file",
        contentType,
        {
          url: uploadedFile,
          name: file.name,
          size: file.size,
          type: file.type
        }
      );
            
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    finally{
      setIsUploading(false);
    }
  };

  const handleAttachmentSelect = (type) => {
    setShowAttachMenu(false);
    
    // Set the appropriate accept attribute based on the type
    if (type === 'image') {
      fileInputRef.current.accept = 'image/*';
    } else if (type === 'video') {
      fileInputRef.current.accept = 'video/*';
    } else {
      fileInputRef.current.accept = '*/*';
    }
    
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    const now = new Date().getTime();
    if (!lastTypingTime.current || now - lastTypingTime.current > 2000) {
      sendTypingStatus(conversationId, true);
      lastTypingTime.current = now;
    }
    
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    typingTimerRef.current = setTimeout(() => {
      sendTypingStatus(conversationId, false);
    }, 2000);
  };
  
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        sendTypingStatus(conversationId, false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus the input when replying to a message
  useEffect(() => {
    if (replyingTo) {
      messageInputRef.current?.focus();
    }
  }, [replyingTo]);

  // Helper function to get a truncated content preview
  const getReplyPreview = (message) => {
    if (!message) return '';
    
    if (message.contentType === 'text') {
      return message.content.length > 50 
        ? message.content.substring(0, 50) + '...' 
        : message.content;
    } else if (message.contentType === 'image') {
      return 'Image';
    } else if (message.contentType === 'video') {
      return 'Video';
    } else if (message.contentType === 'file') {
      return 'File: ' + (message.mediaName || '');
    } else {
      return message.contentType;
    }
  };

  return (
    <div className="bg-gray-800 p-3 fixed bottom-0 right-0 md:w-4/6 lg:5/6 w-full">
      {/* Reply preview */}
      {replyingTo && (
        <div className="bg-gray-700 p-2 rounded mb-2 relative flex">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="w-1 h-full bg-blue-500 mr-2"></div>
              <div>
                <div className="text-xs text-blue-400 font-medium">
                  Replying to {replyingTo.sender.username}
                </div>
                <div className="text-sm text-gray-300 truncate">
                  {getReplyPreview(replyingTo)}
                </div>
              </div>
            </div>
          </div>
          <button 
            className="p-1 text-gray-400 hover:text-white self-start"
            onClick={onCancelReply}
          >
            <X size={16} />
          </button>
        </div>
      )}
        
      <div className="relative">
        {showAttachMenu && (
          <div className="absolute bottom-16 left-0 bg-gray-700 rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2">
            <div 
              className="flex flex-col items-center p-2 cursor-pointer hover:bg-gray-600 rounded-lg"
              onClick={() => handleAttachmentSelect('image')}
            >
              <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center mb-1">
                <Image size={20} className="text-white" />
              </div>
              <span className="text-xs text-white">Photos</span>
            </div>
            <div 
              className="flex flex-col items-center p-2 cursor-pointer hover:bg-gray-600 rounded-lg"
              onClick={() => handleAttachmentSelect('file')}
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-1">
                <File size={20} className="text-white" />
              </div>
              <span className="text-xs text-white">Document</span>
            </div>
            <div 
              className="flex flex-col items-center p-2 cursor-pointer hover:bg-gray-600 rounded-lg"
              onClick={() => handleAttachmentSelect('video')}
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mb-1">
                <Video size={20} className="text-white" />
              </div>
              <span className="text-xs text-white">Video</span>
            </div>
          </div>
        )}

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 bg-gray-700 rounded-lg shadow-lg p-2">
            <div className="grid grid-cols-8 gap-2">
              {[
                "😀", "😂", "😍", "🤔", "😎", "👍", "❤️", "🔥",
                "😊", "🙌", "👏", "🤝", "🎉", "✨", "💯", "🙏",
              ].map((emoji) => (
                <div
                  key={emoji}
                  className="w-8 h-8 flex items-center justify-center text-xl cursor-pointer hover:bg-gray-600 rounded"
                  onClick={() => setMessageInput((prev) => prev + emoji)}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="flex items-center bg-gray-700 rounded-full">
          <button
            className="p-3 text-gray-400 hover:text-gray-200"
            onClick={toggleEmojiPicker}
          >
            <Smile size={24} />
          </button>

          <button
            className="p-3 text-gray-400 hover:text-gray-200"
            onClick={toggleAttachMenu}
          >
            <Paperclip size={24} />
          </button>

          <textarea
            ref={messageInputRef}
            placeholder="Type a message"
            className="flex-1 py-3 px-3 bg-transparent outline-none resize-none max-h-20 text-white chat-input"
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            rows={1}
          />

          {isUploading ? (
            <div className="p-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <button className="p-3 text-gray-400 hover:text-gray-200">
              {messageInput.trim() === "" ? (
                <Mic size={24} />
              ) : (
                <Send
                  size={24}
                  onClick={handleSendMessage}
                  className="text-green-500"
                />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
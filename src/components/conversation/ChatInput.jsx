import { Camera, File, Image, Mic, Paperclip, Send, Smile } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { sendTypingStatus } from "../../utils/socket"

function ChatInput({ onSendMessage, conversationId }) {
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
      
      // Determine content type based on file mimetype
      const contentType = file.type.startsWith('image/') ? 'image' : 'file';
      
      // Here you would typically upload the file to your server/cloud storage
      // For now, we'll simulate this with a timeout
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate file upload with setTimeout
      setTimeout(() => {
        // For demo purposes, we'll create a fake URL
        const fakeUrl = URL.createObjectURL(file);
        
        // Send message with file attachment
        onSendMessage(
          contentType === 'image' ? 'Image' : 'File: ' + file.name,
          contentType,
          {
            url: fakeUrl,
            name: file.name,
            size: file.size,
            type: file.type
          }
        );
        
        setIsUploading(false);
      }, 1500);
      
      // In a real app, you would use axios to upload:
      /*
      const response = await axios.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onSendMessage(
        contentType === 'image' ? 'Image' : 'File: ' + file.name,
        contentType,
        {
          url: response.data.url,
          name: file.name,
          size: file.size,
          type: file.type
        }
      );
      
      setIsUploading(false);
      */
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const handleAttachmentSelect = (type) => {
    setShowAttachMenu(false);
    
    if (type === 'camera') {
      // In a mobile app, this would open the camera
      alert('Camera functionality is not available in this demo');
      return;
    }
    
    // Create and trigger file input
    fileInputRef.current.accept = type === 'image' ? 'image/*' : '*/*';
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

  return (
    <div className="bg-gray-800 p-3 fixed bottom-0 right-0 md:w-4/6 lg:5/6 w-full">
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
              onClick={() => handleAttachmentSelect('camera')}
            >
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mb-1">
                <Camera size={20} className="text-white" />
              </div>
              <span className="text-xs text-white">Camera</span>
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
            className="flex-1 py-3 px-3 bg-transparent outline-none resize-none max-h-20 text-white"
            value={messageInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
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
import { Camera, File, Image, Mic, Paperclip, Send, Smile } from "lucide-react";
import React, { useRef, useState } from "react";

function ChatInput() {
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const messageInputRef = useRef(null);

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
    setMessageInput("");
    messageInputRef.current?.focus();
  };

  return (
    <div className="bg-gray-100 p-3 fixed bottom-0 right-0 w-full md:w-4/6 lg:5/6 ">
      <div className="relative">
        {showAttachMenu && (
          <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center mb-1">
                <Image size={20} className="text-white" />
              </div>
              <span className="text-xs">Photos</span>
            </div>
            <div className="flex flex-col items-center p-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-1">
                <File size={20} className="text-white" />
              </div>
              <span className="text-xs">Document</span>
            </div>
            <div className="flex flex-col items-center p-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mb-1">
                <Camera size={20} className="text-white" />
              </div>
              <span className="text-xs">Camera</span>
            </div>
          </div>
        )}

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-lg p-2">
            <div className="grid grid-cols-8 gap-2">
              {[
                "😀",
                "😂",
                "😍",
                "🤔",
                "😎",
                "👍",
                "❤️",
                "🔥",
                "😊",
                "🙌",
                "👏",
                "🤝",
                "🎉",
                "✨",
                "💯",
                "🙏",
              ].map((emoji) => (
                <div
                  key={emoji}
                  className="w-8 h-8 flex items-center justify-center text-xl cursor-pointer hover:bg-gray-100 rounded"
                  onClick={() => setMessageInput((prev) => prev + emoji)}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center bg-white rounded-full">
          <button
            className="p-3 text-gray-500 hover:text-gray-700"
            onClick={toggleEmojiPicker}
          >
            <Smile size={24} />
          </button>

          <button
            className="p-3 text-gray-500 hover:text-gray-700"
            onClick={toggleAttachMenu}
          >
            <Paperclip size={24} />
          </button>

          <textarea
            ref={messageInputRef}
            placeholder="Type a message"
            className="flex-1 py-3 px-3 bg-transparent outline-none resize-none max-h-20"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />

          <button className="p-3 text-gray-500 hover:text-gray-700">
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
        </div>
      </div>
    </div>
  );
}

export default ChatInput;

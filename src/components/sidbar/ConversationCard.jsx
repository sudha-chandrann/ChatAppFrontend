import { Clock, User, Users, Check, CheckCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  joinConversation,
  joinUserRoom,
  setupConversationListeners,
} from "../../utils/socket";

function ConversationCard({ conversation, onMessageUpdate }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user._id);
  const url = `/dashboard/conversation/${conversation._id}`;
  
  const isMine = conversation.lastMessage?.sender?._id === userId;
  const conversationId = conversation._id;
  const [noofunreadmessages, setnoofunreadmessages] = useState(conversation.unreadCount || 0);
  const [lastMessage, setlastmessage] = useState(conversation.lastMessage || null);
  
  useEffect(() => {
    joinUserRoom(userId);
    joinConversation(conversationId);

    const cleanup = setupConversationListeners({
      onMessageNotification: ({ conversationId: notifConversationId, noofunreadmessage }) => {
        if (notifConversationId === conversation._id) {
          setnoofunreadmessages((prevCount) => prevCount + noofunreadmessage);
        }
      },
      onReadNotification: ({ conversationId: notifConversationId }) => {
        if (notifConversationId === conversation._id) {
          setnoofunreadmessages(0);
        }
      },
      onSendMessageNotification: ({ conversationId: notifConversationId, message }) => {
        if (notifConversationId === conversation._id) {
          setlastmessage(message);
          if (onMessageUpdate) {
            onMessageUpdate(conversationId, message);
          }
        }
      }
    });

    // Cleanup function
    return () => {
      cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, userId]);

  useEffect(() => {
    setlastmessage(conversation.lastMessage || null);
  }, [conversation.lastMessage]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();

    // If the message is from today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If the message is from this week, show day name
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }

    // Otherwise show date
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getPreviewContent = (lastMessage) => {
    if (!lastMessage) return "No messages yet";

    const { content, contentType, sender } = lastMessage;
    const isSender = sender?._id === userId;
    const prefix = isSender ? "You: " : `${sender.username}: `;

    switch (contentType) {
      case "text":
        return `${prefix}${
          content.length > 30 ? content.substring(0, 30) + "..." : content
        }`;
      case "image":
        return `${prefix}🖼️ Image`;
      case "file":
        return `${prefix}📎 File`;
      case "video":
        return `${prefix}🎬 Video`;
      default:
        return `${prefix}New message`;
    }
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "unavailable";

    const date = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  const handleConversationClick = (conversationId) => {
    navigate(`/dashboard/conversation/${conversationId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <div className="w-3 h-3 rounded-full border border-gray-400"></div>;
      case "sent":
        return <Check size={14} className="text-gray-400" />;
      case "delivered":
        return <CheckCheck size={14} className="text-gray-400" />;
      case "read":
        return <CheckCheck size={14} className="text-indigo-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`hover:bg-gray-800 cursor-pointer transition-all duration-200 ${
        isActive(url) ? "bg-gray-800 border-l-4 border-indigo-500" : "bg-transparent"
      }`}
      onClick={() => handleConversationClick(conversation._id)}
    >
      <div className="px-6 py-4 flex items-start">
        <div className=" flex-shrink-0">
          {conversation.displayAvatar ? (
            <img
              src={conversation.displayAvatar}
              alt={conversation.displayName}
              className="w-12 h-12 rounded-full object-cover border border-gray-700"
            />
          ) : conversation.isGroup ? (
            <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center">
              <Users size={20} className="text-indigo-300" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-300" />
            </div>
          )}

          {!conversation.isGroup &&
            conversation.otherUser?.status === "online" && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
            )}
        </div>

        <div className="ml-4 flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white truncate">
              {conversation.displayName}
            </h3>
            {lastMessage && (
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                {formatTime(lastMessage.createdAt)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center min-w-0 max-w-full">
              <p className="text-sm text-gray-300 truncate max-w-full">
                {getPreviewContent(lastMessage)}
              </p>
              {lastMessage && isMine && (
                <span className="ml-1.5 flex-shrink-0">
                  {getStatusIcon(lastMessage.deliveryStatus)}
                </span>
              )}
            </div>

            {noofunreadmessages > 0 && (
              <span className="ml-2 bg-indigo-600 text-white text-xs font-medium rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center flex-shrink-0">
                {noofunreadmessages}
              </span>
            )}
          </div>

          {!conversation.isGroup &&
            conversation.otherUser?.status !== "online" && (
              <div className="flex items-center mt-1.5 text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                <span>
                  Last seen {formatLastSeen(conversation.otherUser?.lastSeen)}
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default ConversationCard;
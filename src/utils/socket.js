// Enhance your existing socket.js file

import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    // Global socket error handler
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  return socket;
};

export const getSocket = () => {
  return socket || initializeSocket();
};

export const joinUserRoom = (userId) => {
  const socket = getSocket();
  if (userId) {
    socket.emit("joinUserRoom", userId);
  }
};

export const joinConversation = (conversationId) => {
  const socket = getSocket();
  if (conversationId) {
    socket.emit("joinConversation", conversationId);
  }
};

export const leaveConversation = (conversationId) => {
  const socket = getSocket();
  if (conversationId) {
    socket.emit("leaveConversation", conversationId);
  }
};

export const sendMessage = (messageData) => {
  const socket = getSocket();
  return new Promise((resolve, reject) => {
    try {
      socket.emit("sendMessage", messageData);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const sendTypingStatus = (conversationId, isTyping) => {
  const socket = getSocket();
  socket.emit("typing", { conversationId, isTyping });
};

export const markMessageAsRead = (messageId, conversationId) => {
  const socket = getSocket();
  socket.emit("markAsRead", { messageId, conversationId });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const setupConversationListeners = (callbacks) => {
  const socket = getSocket();
  
  // Listen for new messages
  socket.on('newMessage', (message) => {
    if (callbacks.onNewMessage) callbacks.onNewMessage(message);
  });
  
  // Listen for typing indicators
  socket.on('userTyping', (data) => {
    if (callbacks.onUserTyping) callbacks.onUserTyping(data);
  });
  
  // Listen for read receipts
  socket.on('messageRead', (data) => {
    if (callbacks.onMessageRead) callbacks.onMessageRead(data);
  });
  
  // Listen for user status changes
  socket.on('userStatus', (data) => {
    if (callbacks.onUserStatusChange) callbacks.onUserStatusChange(data);
  });
  
  // Listen for message notifications
  socket.on('messageNotification', (data) => {
    if (callbacks.onMessageNotification) callbacks.onMessageNotification(data);
  });
  
  return () => {
    // Cleanup listeners when component unmounts
    socket.off('newMessage');
    socket.off('userTyping');
    socket.off('messageRead');
    socket.off('userStatus');
    socket.off('messageNotification');
  };
};
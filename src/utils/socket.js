
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

export const sendReply = (messageData, replyToMessageId) => {
  const socket = getSocket();
  return new Promise((resolve, reject) => {
    try {
      socket.emit("sendMessage", {
        ...messageData,
        replyTo: replyToMessageId
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export const sendTypingStatus = (conversationId, isTyping) => {
  const socket = getSocket();
  socket.emit("typing", { conversationId, isTyping });
};

export const markMessageAsRead = (messageId, conversationId) => {
  const socket = getSocket();
  socket.emit("markAsRead", { messageId, conversationId });
};

export const addReaction = (messageId, emoji) => {
  const socket = getSocket();
  socket.emit("addReaction", { messageId, emoji });
};

export const editMessage = (messageId, conversationId, newContent) => {
  const socket = getSocket();
  socket.emit("editMessage", { messageId,conversationId, newContent });
};

export const deleteMessage = (messageId, conversationId) => {
  const socket = getSocket();
  return new Promise((resolve, reject) => {
    try {
      socket.emit("deleteMessage", { messageId, conversationId });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const forwardMessage = (messageId, targetConversationIds) => {
  const socket = getSocket();
  return new Promise((resolve, reject) => {
    try {
      socket.emit("forwardMessage", { messageId, targetConversationIds });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const PinnedMessage=(messageId, conversationId )=>{
  const socket = getSocket();
  socket.emit("pinnedMessage", { messageId, conversationId });
}

export const AddNewMemeber=( conversationId ,newuserIds)=>{
  const socket = getSocket();
  if(conversationId ){
    socket.emit("addnewmember", { conversationId, newuserIds });
  }
}

export const RemoveMember=(conversationId,memberId)=>{
  const socket = getSocket();
  if(conversationId ){
    socket.emit("removeMember", { conversationId, memberId });
  }
}

export const MakeMemberAdmin=(conversationId,memberId)=>{
  const socket = getSocket();
  if(conversationId ){
    socket.emit("makememberadmin", { conversationId, memberId });
  }
}

export const MutedConversation=(conversationId)=>{
  const socket = getSocket();
  socket.emit("muteConversation", { conversationId });
}

export const LeaveConversation=(conversationId)=>{
  const socket = getSocket();
  socket.emit("leavetheconversation", { conversationId });
}

export const DeleteTheConversation=(conversationId)=>{
  const socket = getSocket();
  if(conversationId){
    socket.emit("deletetheConversation", { conversationId });
  }
}

export const UpdateTheProfilePicture=(conversationId,uploadedphoto)=>{
  const socket = getSocket();
  if(conversationId ){
    socket.emit("EditTheProfilePicture", { conversationId, uploadedphoto });
  }
}

export const UpdateGroupInfo=(conversationId,data)=>{
  const socket = getSocket();
  if(conversationId ){
    socket.emit("EditGroupInfo", { conversationId, data });
  }
}


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const setupConversationListeners = (callbacks) => {
  const socket = getSocket();
  
  // Listen for new messages
  socket.on('newMessage', (data) => {
    if (callbacks.onNewMessage) callbacks.onNewMessage(data);
  });
  
  // Listen for typing indicators
  socket.on('userTyping', (data) => {
    console.log('Received typing status:', data);
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

  socket.on('sendmessageNotification', (data) => {
    if (callbacks.onSendMessageNotification) callbacks.onSendMessageNotification(data);
  });

  socket.on('markNotificationread', (data) => {
    if (callbacks.onReadNotification) callbacks.onReadNotification(data);
  });

  socket.on('messageReaction', (data) => {
    if (callbacks.onMessageReaction) callbacks.onMessageReaction(data);
  });

  socket.on('messageDeleted', (data) => {
    if (callbacks.onMessageDeleted) callbacks.onMessageDeleted(data);
  });
  socket.on('messageForwarded', (data) => {
    if (callbacks.onMessageForwarded) callbacks.onMessageForwarded(data);
  });
  socket.on('messageEdited', (data) => {
    if (callbacks.onMessageEdited) callbacks.onMessageEdited(data);
  });
  socket.on('messageUnpinned',(data)=>{
    if (callbacks.onMessageUnpinned) callbacks.onMessageUnpinned(data);
  })
  socket.on('messagePinned',(data)=>{
    if (callbacks.onMessagePinned) callbacks.onMessagePinned(data);
  })
  socket.on('unmuted',(data)=>{
    if (callbacks.onUnmuted) callbacks.onUnmuted(data);
  })
  socket.on('muted',(data)=>{
    if (callbacks.onMuted) callbacks.onMuted(data);
  })
  socket.on('memberremovedFromConversation',(data)=>{
    if (callbacks.onMemberRemovedFromConversation) callbacks.onMemberRemovedFromConversation(data);
  })
  socket.on('newmemberaddedtoconversation',(data)=>{
    if (callbacks.onMemberAddedToConversation) callbacks.onMemberAddedToConversation(data);
  })

  socket.on('membertoadmin',(data)=>{
    if (callbacks.onMemberToAdmin) callbacks.onMemberToAdmin(data);
  })

  socket.on('conversationleaved',(data)=>{
    if (callbacks.onConversationLeft) callbacks.onConversationLeft(data);
  })

  socket.on('deletedtheconversation',(data)=>{
    if (callbacks.onConversationDeleted) callbacks.onConversationDeleted(data);
  })

  socket.on("updatedProfilePicture",(data)=>{
    if(callbacks.onProfilePictureUpdated) callbacks.onProfilePictureUpdated(data);
  })
  socket.on("updatedGroupInfo",(data)=>{
    if(callbacks.onGroupInfoUpdated) callbacks.onGroupInfoUpdated(data);
  })

  
  return () => {
    // Cleanup listeners when component unmounts
    socket.off('newMessage');
    socket.off('userTyping');
    socket.off('messageRead');
    socket.off('userStatus');
    socket.off('messageNotification');
    socket.off('messageReaction');
    socket.off('messageDeleted');
    socket.off('messageForwarded');
    socket.off('messagePinned');
    socket.off('messageUnpinned');
    socket.off('messageEdited');
    socket.off('markNotificationread');
    socket.off('sendmessageNotification');
    socket.off('unmuted')
    socket.off('muted')
    socket.off('memberremovedFromConversation')
    socket.off('newmemberaddedtoconversation')
    socket.off('membertoadmin')
    socket.off('conversationleaved')
    socket.off('deletedtheconversation')
    socket.off("updatedProfilePicture")
    socket.off("updatedGroupInfo")
  };
};
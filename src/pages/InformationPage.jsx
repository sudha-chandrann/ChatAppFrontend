import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams, Link, useNavigate } from "react-router-dom";
import {
  User,
  Users,
  Edit,
  Trash2,
  LogOut,
  Crown,
  Bell,
  BellOff,
  ArrowLeft,
  UserPlus,
  UserX,
  Settings,
  Image,
} from "lucide-react";
import {
  DeleteTheConversation,
  joinConversation,
  joinUserRoom,
  LeaveConversation,
  MakeMemberAdmin,
  MutedConversation,
  RemoveMember,
  setupConversationListeners,
  UpdateGroupInfo,
  UpdateTheProfilePicture,
} from "../utils/socket";
import toast from "react-hot-toast";
import { PinnedMessagesContainer } from "../components/conversation/PinnedMessageCard";
import AddNewMember from "../components/sidbar/AddNewMember";
import uploadfile from "../utils/uploadImage";
import apiBaseUrl from "../utils/baseurl";

function InformationPage() {
  const params = useParams();
  const conversationId = params.conversationId;
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayAvatar, setdisplayAvatar] = useState();
  const [iseditingavatar, setiseditingavatar] = useState(false);
  const [error, setError] = useState(null);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const currentUserId = useSelector((state) => state.user._id);
  const [addnewmember, setaddnewmemeber] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [media, setmedia] = useState([]);
  const [mediaCount, setmediaCount] = useState(0);
  const navigate = useNavigate();

  const getConversationDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiBaseUrl}/api/v1/conversations/chatinfo/${conversationId}`,
        {
          withCredentials: true,
        }
      );
      setConversation(response.data.data.conversation);
      setdisplayAvatar(response.data.data.conversation.displayAvatar);
      setmedia(response.data.data.media);
      setmediaCount(response.data.data.mediaCount);
      setNewGroupDescription(response.data.data.conversation.displaydescription);
      setNewGroupName(response.data.data.conversation.name);
    } catch (err) {
      console.log("Error getting conversation details:", err);
      setError("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConversationDetails();

    joinUserRoom(currentUserId);
    joinConversation(conversationId);

    const cleanup = setupConversationListeners({
      onMemberRemovedFromConversation: ({
        conversationId: msgconversationId,
        removedUserId,
      }) => {
        if (conversationId === msgconversationId) {
          setConversation((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              participants: prev.participants.filter(
                (member) => member.user._id !== removedUserId
              ),
            };
          });
          toast.success(`Member removed from conversation`);

          // If current user is removed, navigate to dashboard
          if (removedUserId === currentUserId) {
            navigate("/dashboard");
          }
        }
      },
      onMemberAddedToConversation: ({
        conversationId: msgconversationId,
        participants: newparticipants,
      }) => {
        if (conversationId === msgconversationId) {
          setConversation((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              participants: newparticipants,
            };
          });
          toast.success("New members added to conversation");
        }
      },
      onMemberToAdmin: ({
        conversationId: msgconversationId,
        promotedUserId,
      }) => {
        if (conversationId === msgconversationId) {
          setConversation((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              participants: prev.participants.map((member) => {
                if (member.user._id === promotedUserId) {
                  return { ...member, role: "admin" };
                }
                return member;
              }),
            };
          });
          toast.success("Member promoted to admin");
        }
      },
      onConversationLeft: ({
        conversationId: msgconversationId,
        leaveduser,
        deleted,
      }) => {
        if (conversationId === msgconversationId) {
          if (deleted) {
            toast.info("Conversation has been deleted");
            navigate("/dashboard");
          } else {
            if (leaveduser === currentUserId) {
              toast.info("You have left the conversation");
              navigate("/dashboard");
            } else {
              setConversation((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  participants: prev.participants.filter(
                    (member) => member.user._id !== leaveduser
                  ),
                };
              });
              toast.info("A member has left the conversation");
            }
          }
        }
      },
      onConversationDeleted: ({ conversationId: msgconversationId }) => {
        if (conversationId === msgconversationId) {
          toast.info("Conversation has been deleted");
          navigate("/dashboard");
        }
      },
      onMessagePinned: ({
        conversationId: msgconversationId,
        messageId,
        message,
      }) => {
        if (conversationId === msgconversationId) {
          setConversation((prev) => {
            if (!prev) return prev;
            // Create a new pinnedmessage array if it doesn't exist
            const pinnedmessage = prev.pinnedmessage || [];
            // Only add the message if it's not already pinned
            if (!pinnedmessage.some((msg) => msg._id === messageId)) {
              return {
                ...prev,
                pinnedmessage: [...pinnedmessage, message],
              };
            }
            return prev;
          });
          toast.success("Message pinned");
        }
      },
      onMessageUnpinned: ({ conversationId: msgconversationId, messageId }) => {
        if (conversationId === msgconversationId) {
          setConversation((prev) => {
            if (!prev || !prev.pinnedmessage) return prev;
            return {
              ...prev,
              pinnedmessage: prev.pinnedmessage.filter(
                (message) => message._id !== messageId
              ),
            };
          });
          toast.success("Message unpinned");
        }
      },
      onMuted: ({ conversationId: msgconversationId, userId }) => {
        if (conversationId === msgconversationId && userId === currentUserId) {
          setConversation((prev) => ({
            ...prev,
            isusermuted: true,
          }));
          toast.success("Conversation muted");
        }
      },
      onUnmuted: ({ conversationId: msgconversationId, userId }) => {
        if (conversationId === msgconversationId && userId === currentUserId) {
          setConversation((prev) => ({
            ...prev,
            isusermuted: false,
          }));
          toast.success("Conversation unmuted");
        }
      },
      onProfilePictureUpdated: ({
        conversationId: msgconversationId,
        profilePicture,
      }) => {
        if (conversationId === msgconversationId) {
          displayAvatar(profilePicture);
        }
      },
      onGroupInfoUpdated:({conversationId:msgconversationId,name,description})=>{
        if(conversationId===msgconversationId){
          setConversation((prev) => {
            return{
              ...prev,
              name:name,
              description:description,
              displayName:name,
              displaydescription:description

            }
          })
          setNewGroupDescription(description);
          setNewGroupName(name);
        }
      }
    });

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, currentUserId, navigate]);

  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    try {
      await LeaveConversation(conversationId);
      // No need to navigate here as the socket event will handle it
    } catch (err) {
      console.error("Error leaving group:", err);
      toast.error("Failed to leave group. Please try again.");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await RemoveMember(conversationId, memberId);
      // The socket event will update the UI
    } catch (err) {
      console.error("Error removing member:", err);
      toast.error("Failed to remove member. Please try again.");
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm("Make this member an admin?")) return;
    try {
      await MakeMemberAdmin(conversationId, userId);
      // The socket event will update the UI
    } catch (err) {
      console.error("Error making admin:", err);
      toast.error("Failed to make user an admin. Please try again.");
    }
  };

  const handleToggleMute = async (e) => {
    e.stopPropagation();
    try {
      await MutedConversation(conversationId);
      // The socket event will update the UI
    } catch (err) {
      console.error("Error toggling mute:", err);
      toast.error("Failed to mute/unmute conversation");
    }
  };

  const handleDeleteConversation = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this conversation? This action cannot be undone."
      )
    )
      return;
    try {
      await DeleteTheConversation(conversationId);
      toast.success("Conversation deleted");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting conversation:", err);
      toast.error("Failed to delete conversation");
    }
  };

  const handleChangeProfilePicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      toast.loading("Uploading image...", { id: "uploading" });
      const uploadedphoto = await uploadfile(file);
      toast.success("Image uploaded successfully", { id: "uploading" });
      setdisplayAvatar(uploadedphoto);
      UpdateTheProfilePicture(conversationId, uploadedphoto);
    } catch {
      toast.error("Failed to upload image", { id: "uploading" });
    }
  };

  const handleEditGroupInfo = async (e) => {
    e.preventDefault();

    if (!newGroupName.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }

    try {
      toast.loading("Updating group info...", { id: "updating-group" });
      const data={
        name:newGroupName,
        displaydescription: newGroupDescription
      };
       await UpdateGroupInfo(conversationId,data)

      toast.success("Group Info updated successfully", { id: "updating-group" });
      setIsEditingInfo(false);
      
    } catch (error) {
      console.error("Error updating group info:", error);
      toast.error("Failed to update group info", { id: "updating-group" });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!conversation) {
    return <Navigate to="/dashboard" replace />;
  }

  const isGroup = conversation.isGroup;
  const isAdmin = conversation.userRole === "admin";
  const isMuted = conversation.isusermuted;

  // Get visible participants
  const visibleParticipants = showAllParticipants
    ? conversation.participants
    : conversation.participants.slice(0, 3);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="py-4 px-6 border-b border-gray-700 flex items-center">
        <Link to={`/dashboard/conversation/${conversationId}`} className="mr-4">
          <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-white" />
        </Link>
        <h1 className="text-xl font-semibold">Conversation Info</h1>
      </div>

      {/* Conversation details */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Main Info */}
        <div className="flex items-center mb-6">
          <div className="relative">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={conversation.displayName}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : isGroup ? (
              <div className="h-20 w-20 bg-gray-700 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
            ) : (
              <div className="h-20 w-20 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
            )}
            {isAdmin && isGroup && (
              <button className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full border border-gray-600 hover:bg-gray-700">
                <Edit
                  className="h-4 w-4 text-gray-400"
                  onClick={() => {
                    setiseditingavatar(true);
                  }}
                />
              </button>
            )}
            {isAdmin && isGroup && iseditingavatar && (
              <div className="absolute bottom-0 right-0">
                <input
                  type="file"
                  id="profilePictureInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeProfilePicture}
                />
                <label
                  htmlFor="profilePictureInput"
                  className="bg-gray-800 p-1 rounded-full border border-gray-600 hover:bg-gray-700 cursor-pointer flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 text-gray-400" />
                </label>
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">
              {isGroup ? conversation.name : conversation.displayName}
            </h2>
            {isGroup && (
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <Users className="h-4 w-4 mr-1" />
                <span>{conversation.participants.length} members</span>
              </div>
            )}
            <p className="text-sm text-gray-400 mt-1">
              Created {formatDate(conversation.createdAt)}
            </p>
          </div>
        </div>

        {/* Description (for groups) */}
        {conversation.displaydescription && (
          <div className="mb-6 bg-gray-800 p-4 rounded-md">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">About</h3>
            <p className="text-white">{conversation.displaydescription}</p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            className="flex items-center justify-center bg-gray-800 py-3 px-4 rounded-md hover:bg-gray-700 transition-colors"
            onClick={handleToggleMute}
          >
            {isMuted ? (
              <>
                <Bell className="h-5 w-5 mr-2" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <BellOff className="h-5 w-5 mr-2" />
                <span>Mute</span>
              </>
            )}
          </button>

          {isGroup && (
            <button
              onClick={handleLeaveGroup}
              className="flex items-center justify-center bg-red-900 py-3 px-4 rounded-md hover:bg-red-800 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Leave Group</span>
            </button>
          )}

          {isAdmin && isGroup && (
            <button
              className="flex items-center justify-center bg-gray-800 py-3 px-4 rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => {
                setNewGroupName(conversation.name || "");
                setNewGroupDescription(conversation.displaydescription || "");
                setIsEditingInfo(true);
              }}
            >
              <Settings className="h-5 w-5 mr-2" />
              <span>Edit Group</span>
            </button>
          )}

          {isAdmin && isGroup && (
            <button
              className="flex items-center justify-center bg-green-800 py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
              onClick={() => setaddnewmemeber(true)}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              <span>Add Member</span>
            </button>
          )}
        </div>

        {/* Media/Photos section placeholder */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Media </h3>
            {mediaCount > 3 && (
              <Link
                to={`/dashboard/conversation/${conversationId}/media`}
                className="text-sm text-green-600"
              >
                See All
              </Link>
            )}
          </div>
          <div className="flex">
            {media.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                {media.map((mediaItem) => (
                  <div
                    className="aspect-square bg-gray-800 rounded-md flex items-center justify-center relative group"
                    key={mediaItem._id}
                  >
                    {mediaItem.contentType === "image" ? (
                      <img
                        src={mediaItem.mediaUrl}
                        alt={mediaItem.mediaName || "Image"}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                        <video
                          src={mediaItem.mediaUrl}
                          className="w-full h-full object-cover rounded-md"
                          controls
                          muted
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center w-full">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                  <Image className="h-6 w-6 text-gray-500" />
                </div>
                <p className="text-gray-400">
                  No media shared in this conversation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Messages section */}
        {conversation.pinnedmessage &&
          conversation.pinnedmessage.length > 0 && (
            <PinnedMessagesContainer
              pinnedMessages={conversation.pinnedmessage}
              conversationId={conversationId}
              foredit={false}
            />
          )}

        {/* Members section (for groups) */}
        {isGroup && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Members ({conversation.participants.length})
            </h3>
            <div className="space-y-3">
              {visibleParticipants.map((participant) => (
                <div
                  key={participant._id || participant.user._id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-md"
                >
                  <div className="flex items-center">
                    {participant.user.profilePicture ? (
                      <img
                        src={participant.user.profilePicture}
                        alt={participant.user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="font-medium">
                        {participant.user.fullName || participant.user.username}
                        {participant.role === "admin" && (
                          <span className="inline-flex items-center ml-2 text-xs text-yellow-500">
                            <Crown className="h-3 w-3 mr-1" />
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        {participant.user._id === currentUserId
                          ? "me"
                          : `@${participant.user.username}`}
                      </p>
                    </div>
                  </div>

                  {isAdmin && participant.user._id !== currentUserId && (
                    <div className="flex space-x-2">
                      {participant.role !== "admin" && (
                        <button
                          onClick={() => handleMakeAdmin(participant.user._id)}
                          className="p-2 text-yellow-500 hover:bg-gray-700 rounded-full"
                          title="Make Admin"
                        >
                          <Crown className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMember(participant.user._id)}
                        className="p-2 text-red-500 hover:bg-gray-700 rounded-full"
                        title="Remove from group"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {conversation.participants.length > 3 && (
                <button
                  onClick={() => setShowAllParticipants(!showAllParticipants)}
                  className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  {showAllParticipants
                    ? "Show Less"
                    : `Show All (${conversation.participants.length})`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Delete conversation */}
        {isGroup && isAdmin && (
          <div className="mt-auto pt-6">
            <button
              onClick={handleDeleteConversation}
              className="w-full flex items-center justify-center bg-red-900 py-3 px-4 rounded-md hover:bg-red-800 transition-colors"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              <span>Delete Conversation</span>
            </button>
          </div>
        )}
      </div>

      {/* Add New Member Modal */}
      {addnewmember && (
        <AddNewMember
          onClose={() => setaddnewmemeber(false)}
          conversationId={conversationId}
        />
      )}

{isEditingInfo && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
      <h3 className="text-xl font-semibold mb-4">Edit Group Information</h3>
      
      <form onSubmit={handleEditGroupInfo}>
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-400 mb-1">
            Group Name*
          </label>
          <input
            type="text"
            id="groupName"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-400 mb-1">
            Group Description (Optional)
          </label>
          <textarea
            id="groupDescription"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsEditingInfo(false)}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default InformationPage;

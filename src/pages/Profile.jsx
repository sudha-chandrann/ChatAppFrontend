import axios from "axios";
import React, { useEffect, useState } from "react";
import { Camera, Edit2, Eye, EyeOff, Save, X, User } from "lucide-react";
import toast from "react-hot-toast";
import uploadfile from "../utils/uploadImage";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showcurrentPassword, setShowcurrentPassword] = useState(false);
  const [shownewPassword, setShownewPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    profilePicture: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/users/getcurrentuser`);
      setProfileData(response.data.user);
      setFormData({
        fullName: response.data.user.fullName,
        username: response.data.user.username,
        bio: response.data.user.bio || "",
        profilePicture: response.data.user.profilePicture || "",
      });
      setLoading(false);
    } catch (error) {
      console.log("Error during getting profile data:", error);
      setError("Failed to load profile data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Get initials from full name
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    try {
      toast.loading("Uploading image...", { id: "uploading" });
      const uploadedphoto = await uploadfile(file);
      setFormData((prev) => ({
        ...prev,
        profilePicture: uploadedphoto,
      }));
      setFilePreview(uploadedphoto);
      toast.success("Image uploaded successfully", { id: "uploading" });
    } catch (error) {
      toast.error("Failed to upload image", { id: "uploading" });
      console.error("Upload error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      const response = await axios.patch(
        `${BASE_URL}/api/v1/users/updateprofile`,
        formData
      );
      setSuccess(response.data.message || "Profile updated successfully!");
      setIsEditing(false);
      getProfile();
      setFilePreview(null);
      setLoading(false);
    } catch (error) {
      console.log("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(`${BASE_URL}/api/v1/users/changepassword`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess("Password changed successfully!");

    } catch (error) {
      console.log("Error changing password:", error);
      setError(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-purple-500"></div>
      </div>
    );
  }

  const Notification = ({ type, message, onClose }) => {
    return (
      <div className={`mb-6 p-4 rounded-lg flex justify-between items-center animate-fade-in transition-all duration-300 ${type === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500' : 'bg-green-500/20 text-green-200 border border-green-500'}`}>
        <span>{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-300 transition">
          <X size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-10  ">
      <div className=" mx-auto px-4 md:px-10 pb-4">
        {error && (
          <Notification 
            type="error" 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}

        {success && (
          <Notification 
            type="success" 
            message={success} 
            onClose={() => setSuccess(null)} 
          />
        )}

        <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm border border-gray-700/50">
          {/* Header with background decoration */}
          <div className="relative h-48 bg-gradient-to-r from-purple-600 via-sky-500 to-sky-600">
            <div className="absolute inset-0 bg-pattern opacity-20"></div>
            <div className="absolute right-4 top-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition backdrop-blur-sm text-sm font-medium"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFilePreview(null);
                      setFormData({
                        fullName: profileData.fullName,
                        username: profileData.username,
                        bio: profileData.bio || "",
                        profilePicture: profileData.profilePicture,
                      });
                    }}
                    className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600 rounded-full transition backdrop-blur-sm text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="edit-profile-form"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-900 rounded-full transition disabled:opacity-50 text-sm font-medium backdrop-blur-sm"
                  >
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="absolute -bottom-14 left-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full ring-4 ring-gray-800 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg">
                  {filePreview || profileData?.profilePicture ? (
                    <img
                      src={filePreview || profileData?.profilePicture}
                      alt={profileData?.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.parentNode.classList.add(
                          "flex",
                          "items-center",
                          "justify-center",
                          "bg-gradient-to-br",
                          "from-purple-500/20",
                          "to-pink-500/20"
                        );
                        const initials = document.createElement("span");
                        initials.className =
                          "text-3xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent";
                        initials.textContent = getInitials(
                          profileData?.fullName
                        );
                        e.target.parentNode.appendChild(initials);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">
                    <Camera className="text-white" size={24} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile tabs */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {profileData?.fullName}
                </h1>
                <div className="flex items-center text-gray-400 mt-1">
                  <span>@{profileData?.username}</span>
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition text-sm"
                >
                  Change Password
                </button>
              )}
            </div>
            
            <div className="border-b border-gray-700 mb-6">
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`pb-3 px-1 transition-all ${
                    activeTab === "profile"
                      ? "border-b-2 border-purple-500 font-medium text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`pb-3 px-1 transition-all ${
                    activeTab === "account"
                      ? "border-b-2 border-purple-500 font-medium text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Account
                </button>
              </nav>
            </div>

            {/* Profile content */}
            {activeTab === "profile" && (
              !isEditing ? (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-purple-300">About</h2>
                    <p className="text-gray-300">
                      {profileData?.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        required
                      />
                    </div>

                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
                    <p className="text-gray-400 text-sm">
                      Email: {profileData?.email}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      To change email, please contact support.
                    </p>
                  </div>
                </form>
              )
            )}

            {/* Account details */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-sky-300">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-gray-400 text-sm">Email</h3>
                      <p className="text-white font-medium mt-1">{profileData?.email}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 text-sm">Account ID</h3>
                      <p className="text-xs font-mono bg-gray-700/50 p-2 rounded mt-1 text-gray-300 overflow-auto">{profileData?._id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 text-sky-300">Security</h2>
                  <p className="text-gray-300 mb-4">
                    It's a good idea to regularly update your password to keep your account secure.
                  </p>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-600 rounded-lg transition text-white font-medium"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {/* Password change modal */}
            {isChangingPassword && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">

                <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700/50 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">Change Password</h2>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="text-gray-400 hover:text-white transition"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showcurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-4 pr-12 py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                          onClick={() => setShowcurrentPassword((prev) => !prev)}
                        >
                          {showcurrentPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={shownewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-4 pr-12 py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                          onClick={() => setShownewPassword((prev) => !prev)}
                        >
                          {shownewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showconfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-4 pr-12 py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                          onClick={() => setShowconfirmPassword((prev) => !prev)}
                        >
                          {showconfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-600 hover:to-sky-600 rounded-lg transition disabled:opacity-50 font-medium"
                      >
                        {loading ? (
                          <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
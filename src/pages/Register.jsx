import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiImageAddLine,
  RiCloseLine,
  RiMailLine,
  RiLockLine,
  RiUserLine,
  RiEyeLine,
  RiEyeOffLine,
  RiUser3Line,
} from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import uploadfile from "../utils/uploadImage";
// const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    profilePicture: "",
  });
  const [uploadphoto, setuploadphoto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleuploadphoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setuploadphoto(file);
      toast.loading("Uploading image...", { id: "uploading" });
      const uploadedphoto = await uploadfile(file);
      setFormData((prev) => ({
        ...prev,
        profilePicture: uploadedphoto,
      }));
      toast.success("Image uploaded successfully", { id: "uploading" });
    } catch (error) {
      toast.error("Failed to upload image", { id: "uploading" });
      console.error("Upload error:", error);
    }
  };

  const handleclearuploadimage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setuploadphoto(null);
    setFormData((prev) => ({
      ...prev,
      profilePicture: "",
    }));
  };

  const validateForm = () => {
    const { username, email, password, fullName } = formData;

    if (!username.trim()) {
      toast.error("Please enter your username");
      return false;
    }
    if (!fullName.trim()) {
      toast.error("Please enter your full Name");
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!password) {
      toast.error("Please enter a password");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleregistersubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`/api/v1/users/register`, formData);

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful!");
        navigate("/verificationOPT");
      } else {
        toast.error(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again later.";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
      setFormData({
        fullName: "",
        username: "",
        email: "",
        password: "",
        profilePicture: "",
      });
      setuploadphoto(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-gray-100 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-indigo-500/30">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-6">
            <h1 className="text-center text-3xl font-bold text-white">
              Create Account
            </h1>
            <div className="w-16 h-1 bg-cyan-300 mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="p-8">
            <div className="text-center mb-7">
              <p className="text-gray-300">
                Already have an account?{" "}
                <span
                  className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </span>
              </p>
            </div>

            <form onSubmit={handleregistersubmit} className="space-y-5">
              {/* Name Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-400">
                  <RiUserLine size={20} />
                </div>
                <input
                  className="w-full py-3 pl-12 pr-3 rounded-xl bg-gray-700/40 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Your full name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <div className="absolute h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-indigo-500 bottom-0 left-0 transition-all duration-300 group-hover:w-full"></div>
              </div>
              {/* username  field*/}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-400">
                  <RiUser3Line size={20} />
                </div>
                <input
                  className="w-full py-3 pl-12 pr-3 rounded-xl bg-gray-700/40 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Your username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <div className="absolute h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-indigo-500 bottom-0 left-0 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Email Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-400">
                  <RiMailLine size={20} />
                </div>
                <input
                  className="w-full py-3 pl-12 pr-3 rounded-xl bg-gray-700/40 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="absolute h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-indigo-500 bottom-0 left-0 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-400">
                  <RiLockLine size={20} />
                </div>
                <input
                  className="w-full py-3 pl-12 pr-12 rounded-xl bg-gray-700/40 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Create password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-300 transition-colors"
                >
                  {showPassword ? (
                    <RiEyeOffLine size={20} />
                  ) : (
                    <RiEyeLine size={20} />
                  )}
                </button>
                <div className="absolute h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-indigo-500 bottom-0 left-0 transition-all duration-300 group-hover:w-full"></div>
              </div>

              {/* Profile Image Upload */}
              <div className="mt-6">
                <label
                  htmlFor="profile"
                  className="flex items-center justify-center gap-3 w-full py-4 px-4 rounded-xl border-2 border-dashed border-indigo-400/50 bg-indigo-900/20 hover:bg-indigo-800/30 transition-all text-gray-300 cursor-pointer group"
                >
                  {uploadphoto ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="truncate max-w-[85%] text-indigo-200">
                        {uploadphoto.name}
                      </div>
                      <button
                        type="button"
                        onClick={handleclearuploadimage}
                        className="p-1.5 rounded-full hover:bg-indigo-700/60 transition-colors"
                      >
                        <RiCloseLine className="text-gray-300" size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <RiImageAddLine
                        size={24}
                        className="text-indigo-400 group-hover:text-cyan-400 transition-colors"
                      />
                      <span className="group-hover:text-cyan-300 transition-colors">
                        Upload profile picture
                      </span>
                    </>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="profile"
                  accept="image/*"
                  onChange={handleuploadphoto}
                />
              </div>

              {/* Submit Button */}
              <button
                className={`w-full py-3.5 px-4 mt-8 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-indigo-500/30 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-400 flex flex-col">
              <Link to={"/verificationOPT"} className="text-blue-600 mb-2">verify your Account</Link>
              By creating an account, you agree to our
              <div className="mt-1">
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Terms of Service
                </a>{" "}
                &{" "}
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

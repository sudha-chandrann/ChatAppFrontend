
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { RiEyeLine, RiEyeOffLine, RiLockLine, RiMailLine } from 'react-icons/ri';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function Login() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  const validateForm = () => {
    const {  email, password} = formData;

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

  const handleloginsubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/users/login`, formData);
      
      if (response.data.success) {
        toast.success(response.data.message || "Login successful!");
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again later.";
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
      setFormData({
        email: '',
        password: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-gray-100 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-indigo-500/30">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-6">
            <h1 className="text-center text-3xl font-bold text-white">Create Account</h1>
            <div className="w-16 h-1 bg-cyan-300 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-7">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <span 
                  className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors"
                  onClick={() => navigate('/register')}
                >
                  Sign In
                </span>
              </p>
            </div>
            
            <form onSubmit={handleloginsubmit} className="space-y-5">              
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
              

              {/* Submit Button */}
              <button 
                className={`w-full py-3.5 px-4 mt-8 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-indigo-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'login...' : 'login'}
              </button>
            </form>
            
            <div className="mt-8 text-center text-sm text-gray-400">
              By creating an account, you agree to our
              <div className="mt-1">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms of Service</a>
                {" "}&{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login

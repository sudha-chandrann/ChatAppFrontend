import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { FaArrowLeft, FaKey, FaLock } from "react-icons/fa";
import { RiMailLine } from "react-icons/ri";

function RecoverPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestRecoveryCode = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(
        "/api/v1/users/requestRecoveryCode",
        { email }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Recovery code sent to your email"
        );
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send recovery code");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error("Recovery request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/api/v1/users/resetnewpassword", {
        email,
        verificationCode,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password has been reset successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
      console.error("Password reset error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 text-gray-100 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-indigo-500/20">
          <div className="bg-gradient-to-r  from-blue-600 via-indigo-800 to-purple-600  p-6 relative">
            <button
              type="button"
              onClick={() => (step === 1 ? navigate("/login") : setStep(1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-200"
              aria-label="Go back"
            >
              <FaArrowLeft size={18} />
            </button>
            <h1 className="text-center text-2xl font-bold text-white">
              {step === 1 ? "Password Recovery" : "Reset Your Password"}
            </h1>
            <div className="w-16 h-1 bg-blue-300 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="text-center mb-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 mb-4">
                    <RiMailLine size={28} className="text-indigo-400" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Enter your email address and we'll send you a verification code
                    to reset your password.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={requestRecoveryCode}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-400">
                      <RiMailLine size={18} />
                    </div>
                    <input
                      id="email"
                      className="w-full py-3 pl-12 pr-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Email address"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-indigo-500/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? "Sending Code..." : "Send Recovery Code"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 mb-4">
                    <FaKey size={24} className="text-indigo-400" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Enter the verification code sent to <span className="text-indigo-300 font-medium">{email}</span> and create your new password.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={resetPassword}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-400">
                      <FaKey size={16} />
                    </div>
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Verification code"
                      required
                      autoComplete="one-time-code"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-400">
                      <FaLock size={16} />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="New password (min 8 characters)"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-400">
                      <FaLock size={16} />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Confirm new password"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-indigo-500/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="py-4 px-6 border-t border-gray-700/50 text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{" "}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RecoverPassword;
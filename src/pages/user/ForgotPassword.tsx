import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FormikHelpers } from "formik";
import useToast from "../../hooks/useToast";
import OtpModal from "../../components/modals/otpModal"; 
import {
  findByEmailAndSentOtp,
  resetPassword,
  verifyOtp,
} from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [err, setErr] = useState("");
  const { error, success } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifying(true);
    if (!email) {
      error("Error", "Email is missing");
      setIsVerifying(false);
      return;
    }
    try {
      const response = await findByEmailAndSentOtp(email);
      if (response.status === 200) {
        success("Success", "OTP Sent to the Email");
        setShowOtpModal(true);
        setErr("");
      }
    } catch (err) {
      error("Error", "Email not found");
      setErr("Please enter a valid email address");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpSubmit = async (
    values: { otp: string },
    formikHelpers: FormikHelpers<{ otp: string }>
  ) => {
    try {
      const response = await verifyOtp(values.otp);
      if (response) {
        setShowOtpModal(false);
        setIsOtpVerified(true);
        setErr("");
        formikHelpers.resetForm();
      }
    } catch (err) {
      setErr("Please enter a valid 6-digit OTP");
      error("Error", "Invalid OTP");
      formikHelpers.setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await findByEmailAndSentOtp(email);
      if (response.status === 200) {
        success("Success", "OTP Resent to the Email");
      }
    } catch (err) {
      error("Error", "Failed to resend OTP");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        setErr("Passwords do not match");
      } else if (newPassword.length < 6) {
        setErr("Password must be at least 6 characters long");
      } else {
        await resetPassword(newPassword, email);
        success("Success", "Password updated, Please login now.");
        navigate("/login");
      }
    } catch (err) {
        console.error(err);
        
      error("Error", "Error validating password");
    }
  };

  return (
    <div className="bg-[#F9F6F1] flex items-center justify-center min-h-screen">
      <motion.div
        className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-md max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="text-center mb-2 sm:mb-3"
          variants={itemVariants}
        >
          <h1 className="font-serif text-lg sm:text-xl md:text-2xl mb-1">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {isOtpVerified
              ? "Set your new password"
              : "Enter your email to receive an OTP"}
          </p>
        </motion.div>

        {err && (
          <motion.div
            className="text-red-500 text-xs text-center mb-2"
            variants={itemVariants}
          >
            {err}
          </motion.div>
        )}

        {!isOtpVerified ? (
          <motion.form
            className="space-y-3 sm:space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleEmailSubmit}
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium mb-1"
              >
                Email Address
              </label>
              <motion.input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                placeholder="you@example.com"
                required
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full bg-[#D6A85F] text-white rounded-md text-sm py-2"
                whileHover={{ scale: 1.05, backgroundColor: "#de9f40" }}
                whileTap={{ scale: 0.95 }}
              >
                {isVerifying ? "Sending..." : "Send OTP"}
              </motion.button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.form
            className="space-y-3 sm:space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handlePasswordSubmit}
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="newPassword"
                className="block text-xs sm:text-sm font-medium mb-1"
              >
                New Password
              </label>
              <motion.input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                placeholder="••••••••"
                required
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <motion.input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                placeholder="••••••••"
                required
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full bg-[#D6A85F] text-white rounded-md text-sm py-2"
                whileHover={{ scale: 1.05, backgroundColor: "#de9f40" }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Password
              </motion.button>
            </motion.div>
          </motion.form>
        )}

        <motion.div className="mt-3 text-center" variants={itemVariants}>
          <p className="text-xs text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-[#D6A85F] hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>

        <OtpModal
          isOpen={showOtpModal}
          email={email}
          onClose={() => setShowOtpModal(false)}
          onSubmit={handleOtpSubmit}
          onResentOtp={handleResendOtp}
          onSuccess={() => {
            setShowOtpModal(false);
            setIsOtpVerified(true);
          }}
        />
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
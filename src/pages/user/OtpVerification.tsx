import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string>("");

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

  // Handle OTP input change
  const handleOtpChange = (value: string) => {
    if (/^[0-9]{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length) {
      setOtp(paste);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace with your OTP verification logic (e.g., API call)
    console.log("OTP Submitted:", otp);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F9F6F1]">
      <main className="flex-grow flex items-center justify-center py-2 sm:py-4 md:py-6 px-4">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <motion.div
            className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="text-center mb-2 sm:mb-3"
              variants={itemVariants}
            >
              <h1 className="font-serif text-lg sm:text-xl md:text-2xl mb-1">
                Verify Your Email
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Enter the 6-digit code sent to your email
              </p>
            </motion.div>

            <motion.form
              className="space-y-3 sm:space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
            >
              <motion.div variants={itemVariants}>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  OTP Code
                </label>
                <motion.input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  onPaste={handlePaste}
                  className="w-full h-10 sm:h-11 border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 text-sm transition-all duration-200"
                  placeholder="123456"
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
                  disabled={otp.length !== 6}
                >
                  Verify OTP
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.div className="mt-3 text-center" variants={itemVariants}>
              <p className="text-xs text-gray-600">
                Didn’t receive the code?{" "}
                <Link to="#" className="text-[#D6A85F] hover:underline">
                  Resend OTP
                </Link>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Already verified?{" "}
                <Link to="/login" className="text-[#D6A85F] hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default OtpVerification;

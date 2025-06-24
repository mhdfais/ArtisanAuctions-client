import React, { useState, useEffect } from "react";
import { Field, Formik, FormikHelpers } from "formik";

import {
  OtpInitialValues,
  otpValidationSchema,
} from "../../utils/validations/otpValidator";
import useToast from "../../hooks/useToast";

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onSubmit: (
    values: { otp: string },
    formikHelpers: FormikHelpers<{ otp: string }>
  ) => void | Promise<void>;
  onResentOtp: () => void;
  onSuccess: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  email,
  onClose,
  onSubmit,
  onResentOtp,
}) => {
  // const [isLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const { error } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(120);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // prevent body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await onResentOtp();
      setTimeLeft(120);
      setIsResending(false);
    } catch (err: any) {
      console.error("Failed to resend OTP", err);
      error("Error", "Failed to resent OTP.");
      setIsResending(false);
    }
  };

  // format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out opacity-0 data-[open=true]:opacity-100"
      data-open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform scale-95 transition-all duration-300 ease-in-out data-[open=true]:scale-100">
        <h2
          id="otp-modal-title"
          className="text-2xl font-bold mb-4 text-center text-gray-800"
        >
          Verify OTP
        </h2>
        <p className="text-gray-600 mb-4 text-center">
          Enter the 6-digit OTP sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>
        <p className="text-gray-500 mb-3 text-center">
          Time remaining:{" "}
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </p>
        {timeLeft === 0 ? (
          <p className="text-red-500 text-center">Please resent OTP again</p>
        ) : (
          ""
        )}
        <Formik
          onSubmit={onSubmit}
          validationSchema={otpValidationSchema}
          initialValues={OtpInitialValues}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Field
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200 p-2 "
                  maxLength={6}
                  disabled={timeLeft === 0}
                />
              </div>
              <button
                type="submit"
                disabled={timeLeft === 0}
                className="w-full bg-[#D6A85F] text-white rounded-md text-sm py-2"
              >
                Verify OTP
              </button>
            </form>
          )}
        </Formik>
        <button
          onClick={handleResendOtp}
          disabled={isResending}
          className="w-full mt-4 text-[#D6A85F] hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OtpModal;

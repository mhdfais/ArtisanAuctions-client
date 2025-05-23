import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form, ErrorMessage, Field, FormikHelpers } from "formik";
import useToast from "../hooks/useToast";
import { useRef, useState } from "react";
import OtpModal from "./modals/otpModal";
import {
  signupInitialValues,
  signupSchema,
} from "../utils/validations/signupValidator";
import { RegisterData, SignupFormValues } from "../types/Types";
import { registerUser, sentOtp, verifyOtp } from "../services/authService";

const SignupForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState<RegisterData | null>(null);
  const { success, error } = useToast();
  const navigate = useNavigate();
  const formikRef = useRef<FormikHelpers<SignupFormValues>>(null);

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

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting }: FormikHelpers<SignupFormValues>
  ) => {
    try {
      setEmail(values.email);
      const registerData: RegisterData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: "user",
      };
      setFormData(registerData);
      const response = await sentOtp(values.email);

      if (response.status === 201) {
        setIsModalOpen(true);
        success(
          "OTP sent!",
          `Check ${values.email} for the verification code.`
        );
      }
    } catch (err: any) {
      // console.error(err.response)
      if (err?.response?.status === 400) {
        error("Error", "User already exists, Please Sign in instead");
      } else {
        error("Error", "Failed to send OTP. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (
    values: { otp: string },
    { setSubmitting }: FormikHelpers<{ otp: string }>
  ) => {
    if (!formData) {
      error("Error", "Missing registration data. Please try again.");
      return;
    }

    try {
      const otpResponse = await verifyOtp(values.otp);
      if (otpResponse) {
        console.log("OTP verified");
        await registerUser(formData);
        success("Success", "Account created");
        navigate("/login");
      }
    } catch (err) {
      console.error("OTP verification failed", err);
      error("Invalid OTP", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const resentOtp = async () => {
    try {
      if (!email) {
        error("Error", "Email is missing, Try signing up again.");
      }
      const response = await sentOtp(email);
      if (response.status === 201) {
        setIsModalOpen(true);
        success("Success", `Check ${email} for the verification code.`);
      }
    } catch (err) {
      error("Error", "Failed to resent OTP");
    }
  };

  return (
    <motion.div
      className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div className="text-center mb-2 sm:mb-3" variants={itemVariants}>
        <h1 className="font-serif text-lg sm:text-xl md:text-2xl mb-1">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Join our community of art enthusiasts
        </p>
      </motion.div>

      <Formik
        initialValues={signupInitialValues}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}
        innerRef={(instance) => {
          if (instance) formikRef.current = instance;
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <motion.div
              className="space-y-3 sm:space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-medium mb-1"
                >
                  Full Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  as={motion.input}
                  className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                  placeholder="John Doe"
                  whileFocus={{ scale: 1.02 }}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium mb-1"
                >
                  Email Address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  as={motion.input}
                  className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                  placeholder="you@example.com"
                  whileFocus={{ scale: 1.02 }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium mb-1"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  as={motion.input}
                  className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.02 }}
                />
                <p className="mt-1 text-xs text-gray-600">
                  At least 8 characters with a number and special character.
                </p>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-medium mb-1"
                >
                  Confirm Password
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  as={motion.input}
                  className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.02 }}
                />
                <p className="mt-1 text-xs text-gray-600">
                  Must match password.
                </p>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start">
                <Field
                  id="terms"
                  name="terms"
                  type="checkbox"
                  as={motion.input}
                  className="h-4 w-4 mt-0.5 accent-[#D6A85F] transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-xs text-gray-600"
                >
                  I agree to the{" "}
                  <Link to="#" className="text-[#D6A85F] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-[#D6A85F] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
                <ErrorMessage
                  name="terms"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="w-full bg-[#D6A85F] text-white rounded-md text-sm py-2"
                  whileHover={{ scale: 1.05, backgroundColor: "#de9f40" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </motion.button>
              </motion.div>
            </motion.div>
          </Form>
        )}
      </Formik>

      <motion.div className="mt-3 text-center" variants={itemVariants}>
        <p className="text-xs text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-[#D6A85F] hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
      <OtpModal
        isOpen={isModalOpen}
        email={email}
        onSubmit={handleVerifyOtp}
        onClose={() => {
          setIsModalOpen(false);
          formikRef.current?.resetForm();
        }}
        onResentOtp={resentOtp}
        onSuccess={() => {
          console.log("OTP verified, redirecting...");
          // Redirect to login or dashboard
          // e.g., window.location.href = "/login";
        }}
      />
    </motion.div>
  );
};

export default SignupForm;

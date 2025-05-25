import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { loginInitialValues,loginSchema, } from "@/utils/validations/loginValidator";
import { LoginFormData } from "@/types/Types";
import { loginUser } from "@/services/authService";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/store/authSlice";
import useToast from "@/hooks/useToast";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error } = useToast();

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

  const handleGoogleLogin = () => {
    // Placeholder for Google login implementation
    console.log("Initiating Google login...");
    // In a real app, this would trigger Google OAuth flow
  };

  const handleLogin = async (values: LoginFormData) => {
    try {
      const response = await loginUser(values);
      if (response.status === 200) {
        const { user } = response.data;
        dispatch(setUser(user));
        navigate("/");
        success("Success", "Login successfull");
      }
    } catch (err) {
      error("Error", "Invalid Credentials...");
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
          Sign In
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Welcome back to Artisan Auctions
        </p>
      </motion.div>

      <motion.div
        className="space-y-3 sm:space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Formik
          initialValues={loginInitialValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium mb-1"
              >
                Email Address
              </label>
              <Field
                id="email"
                type="email"
                name="email"
                className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                placeholder="you@example.com"
                required
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#D6A85F] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Field
                id="password"
                type="password"
                name="password"
                className="w-full border-b-2 border-gray-300 focus:ring-0 focus:outline-none focus:border-[#D6A85F] focus:bg-gray-50 h-9 px-2 text-sm transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <ErrorMessage
                name="password"
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
              >
                Sign In
              </motion.button>
            </motion.div>
          </Form>
        </Formik>
        <motion.div variants={itemVariants}>
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-700 border border-gray-300 rounded-md text-sm py-2 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05, backgroundColor: "#f9f9f9" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.29 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div className="mt-3 text-center" variants={itemVariants}>
        <p className="text-xs text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#D6A85F] hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;

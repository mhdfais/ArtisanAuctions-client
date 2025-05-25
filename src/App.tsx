import Home from "./pages/user/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import OtpVerification from "./pages/user/OtpVerification";
import { Toaster } from "sonner";
import ForgotPassword from "./pages/user/ForgotPassword";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import Layout from "./layout/Layout";
import PublicRoute from "./components/publicRoute/PublicRoute";
import Profile from "./pages/user/Profile";
import NotFound from "./pages/common/NotFound";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        {/* Landing page */}
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/otp-verification"
            element={
              <PublicRoute>
                <OtpVerification />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

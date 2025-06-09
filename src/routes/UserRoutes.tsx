import ProtectedRoute from "@/pages/user/protectedRoutes/ProtectedRoute";
import PublicRoute from "@/pages/user/publicRoute/PublicRoute";
import Layout from "@/layout/Layout";
import NotFound from "@/pages/common/NotFound";
import ForgotPassword from "@/pages/user/ForgotPassword";
import Home from "@/pages/user/Home";
import Login from "@/pages/user/Login";
import OtpVerification from "@/pages/user/OtpVerification";
import Profile from "@/pages/user/Profile";
import Signup from "@/pages/user/Signup";
import { Route } from "react-router-dom";
import ArtworkDetails from "@/pages/user/ArtworkDetails";

const UserRoutes = (
  <>
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

    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
    </Route>

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
      <Route
        path="/artwork/:id"
        element={
          <ProtectedRoute>
            <ArtworkDetails />
          </ProtectedRoute>
        }
      />
    </Route>
    {/* <Route path="*" element={<NotFound />} /> */}
  </>
);

export default UserRoutes;

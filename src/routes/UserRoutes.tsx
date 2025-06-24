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
import Auctions from "@/pages/user/Auctions";
import About from "@/pages/user/About";

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
  <Route path="/auctions" element={<Auctions />} />
  <Route path="/about" element={<About />} />
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
  
  {/* Catch-all route for unknown paths inside the Layout */}
  <Route path="*" element={<NotFound />} />
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

      {/* <Route
      path="/auctions"
      element={
        <ProtectedRoute>
          <Auctions />
        </ProtectedRoute>
      }
       /> */}
    </Route>
    {/* <Route path="*" element={<NotFound />} /> */}
  </>
);

export default UserRoutes;

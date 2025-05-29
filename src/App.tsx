import Home from "./pages/user/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import OtpVerification from "./pages/user/OtpVerification";
import { Toaster } from "sonner";
import ForgotPassword from "./pages/user/ForgotPassword";
import ProtectedRoute from "./pages/user/protectedRoutes/ProtectedRoute";
import Layout from "./layout/Layout";
import PublicRoute from "./pages/user/publicRoute/PublicRoute";
import Profile from "./pages/user/Profile";
import NotFound from "./pages/common/NotFound";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        {/* Landing page */}
        <Routes>
          {UserRoutes}
          {AdminRoutes}
          
        </Routes>
      </Router>
    </>
  );
}

export default App;

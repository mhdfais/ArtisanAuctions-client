import AdminApprovals from "@/components/admin/Approvals";
import AdminArtworks from "@/components/admin/Artworks";
import AdminDashboard from "@/components/admin/Dashboard";
import AdminSellers from "@/components/admin/Sellers";
import AdminSettings from "@/components/admin/Settings";
import AdminUsers from "@/components/admin/Users";
import AdminLayout from "@/layout/AdminLayout";
import AdminLogin from "@/pages/admin/Login";
import AdminProtectedRoute from "@/pages/admin/protectedRoute/AdminProtectedRoute";
import AdminPublicRoute from "@/pages/admin/publicRoute/AdminPublicRoute";
import { Route } from "react-router-dom";

const AdminRoutes = (
  <>
    {/* Public Route */}
    <Route
      path="/admin/login"
      element={
        <AdminPublicRoute>
          <AdminLogin />
        </AdminPublicRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }
    >
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="approvals" element={<AdminApprovals />} />
      <Route path="artworks" element={<AdminArtworks />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="sellers" element={<AdminSellers />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </>
);

export default AdminRoutes;

import { RootState } from "@/redux/store/store";
import React, { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.adminAuth.isAdminLoggedIn
  );
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  return children;
};

export default AdminProtectedRoute;

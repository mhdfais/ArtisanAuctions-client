import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useSelector((state: any) => state.auth);

  return isLoggedIn ? <Navigate to="/" /> : children;
};

export default PublicRoute;
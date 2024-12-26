import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

interface PublicRouteProps {
  children: ReactNode;
  userType: "user" | "tutor" | "admin";
}

export const PublicRoute = ({ children, userType }: PublicRouteProps) => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userAuth = useAppSelector((state) => state.user.isAuthenticated);
  const tutorAuth = useAppSelector((state) => state.tutor.isAuthenticated);
  const adminAuth = useAppSelector((state) => state.adminLogin.isAuthenticated);

  const getRedirectPath = () => {
    switch (userType) {
      case "user":
        return "/";
      case "tutor":
        return "/tutor/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const isAuthenticated = () => {
    switch (userType) {
      case "user":
        return userAuth;
      case "tutor":
        return tutorAuth;
      case "admin":
        return adminAuth;
      default:
        return false;
    }
  };

  if (isAuthenticated()) {
    return (
      <Navigate to={getRedirectPath()} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};

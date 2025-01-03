import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

interface AuthGuardProps {
  children: ReactNode;
  userType: "user" | "tutor" | "admin";
}

export const ProtectedRuote = ({ children, userType }: AuthGuardProps) => {
  const location = useLocation();
  const userAuth = useAppSelector((state) => state.user.isAuthenticated);
  const tutorAuth = useAppSelector((state) => state.tutor.isAuthenticated);
  const adminAuth = useAppSelector((state) => state.adminLogin.isAuthenticated);

  const getRedirectPath = () => {
    switch (userType) {
      case "user":
        return "/login";
      case "tutor":
        return "/tutor/login";
      case "admin":
        return "/admin/login";
      default:
        return "/login";
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

  if (!isAuthenticated()) {
    return (
      <Navigate to={getRedirectPath()} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser || !allowedRoles.includes(userRole ?? "")) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRole, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.type !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

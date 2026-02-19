// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const isSuper =
    userRole === "superadmin" ||
    userRole === "admin" ||
    localStorage.getItem("isSuperAdmin") === "true";

  if (!isSuper) {
    return <Navigate to="/station" replace />;
  }

  // render children (wrap in fragment to satisfy JSX)
  return <>{children}</>;
};

export default ProtectedRoute;

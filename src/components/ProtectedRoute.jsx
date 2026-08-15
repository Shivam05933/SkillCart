import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component for route protection and onboarding flow control.
 * Rules:
 * 1. Unauthenticated users are redirected to "/auth".
 * 2. Authenticated users with isNewUser = true are forced to "/resume".
 * 3. Authenticated users with isNewUser = false are blocked from "/resume" and redirected to "/home".
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isNewUser } = useAuth();
  const location = useLocation();

  // 1. Unauthenticated check
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 2. First-time registered user MUST go to Resume Page
  if (isNewUser && location.pathname !== "/resume") {
    return <Navigate to="/resume" replace />;
  }

  // 3. User should NEVER manually access "/resume" after completion
  if (!isNewUser && location.pathname === "/resume") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

import { Navigate } from "react-router-dom";
import AppLoader from "../components/common/AppLoader";
import { useAppContext } from "../hooks/useAppContext";

export function ProtectedRoute({ children }) {
  const { token, user, bootstrapLoading } = useAppContext();

  if (bootstrapLoading) {
    return <AppLoader />;
  }

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

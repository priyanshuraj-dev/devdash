import { Navigate } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useContext(AuthContext);

  // Wait for auth check
  if (loading) {
    return null; // or loader later
  }

  // not logged in → kick out
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

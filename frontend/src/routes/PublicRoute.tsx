import { Navigate } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { user, loading } = useContext(AuthContext);

  // Do nothing until auth check finishes
  if (loading) {
    return null; 
  }

  // logged-in users should not access login/signup
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

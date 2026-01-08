import { createContext } from "react";

interface User {
  username?: string;
  email?: string;
  isVerified?: boolean;
  avatar?: { url: string; publicId: string };
  leetcodeHandle?: string;
  codechefHandle?: string;
  githubHandle?: string;
  codeforcesHandle?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
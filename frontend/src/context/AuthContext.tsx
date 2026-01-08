import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

export const AuthContext = createContext<any>(null);
interface Props { children: ReactNode }
export const AuthProvider = ({ children }: Props) => {
    // this entire user logic is only to check where session exists or not
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Initial state is TRUE

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // This is where the 'loading' comes from. 
        // We call the 'me' endpoint to see if the user has a valid cookie/token.
        const res = await api.post("/api/auth/me");
        setUser(res.data.user);
      } catch (err:any) {
        if(err.response.status === 401){
            try {
                await api.post("/api/auth/refresh");
                const res = await api.post("/api/auth/me");
                setUser(res.data.user);
                return;
            } catch (error) {
                setUser(null);
                return;
            }
        }
        setUser(null);
      } finally {
        // Once the API responds (success or fail), loading becomes FALSE
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
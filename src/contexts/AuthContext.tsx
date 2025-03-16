

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../services/authService";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userRole: null,
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Prevent state updates if the component unmounts

    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedRole = localStorage.getItem("userRole");

   

        if (token && storedRole) {
          // Verify token
          const userData = await verifyToken(token);
          if (isMounted) {
            setCurrentUser(userData.user);
            const decodedRole = atob(storedRole);
            setUserRole(decodedRole);

            

            // Redirect only if not already on the correct page
            const currentPath = window.location.pathname;
            if (decodedRole === "admin" && currentPath == "/login") {
              navigate("/admin");
            } else if (decodedRole === "manager" && currentPath == "/login") {
              navigate("/manager");
            } else if (decodedRole === "user" && currentPath == "/login") {
              navigate("/dashboard");
            }
          }
        } else {
          
          const currentPath = window.location.pathname;
          if (currentPath == "/profile" || currentPath =="/dashboard"){
            
            navigate("/login");
          }

        }
      } catch (error) {
        
        if (isMounted) {
          setCurrentUser(null);
          setUserRole(null);
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          navigate("/login");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false; // Cleanup on component unmount
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setCurrentUser(null);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading, logout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};


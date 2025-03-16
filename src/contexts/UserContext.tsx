import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/auth";
import { useNavigate } from "react-router-dom";


interface User {
  id: string;
  name?: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  refreshUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  refreshUser: () => {},
  logout: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userid, setUserid] = useState<User | null>(null);

  const refreshUser = async () => {
    const idToken = localStorage.getItem("token");
    if (idToken) {
      try {
        const userData = await auth.verifyToken(idToken);
        setUser(userData);
      } catch (error) {
       
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const gettinguserid = async () => {
    const tk = localStorage.getItem("token")
    try {
      const response = await fetch("http://localhost:5000/api/users/gettinguserid", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tk}`, },
        body: JSON.stringify({ tk }),
      });
  
      const data = await response.json();
      if (data.uid) {
        
        setUserid(data.uid);

      } else {
        
      }
    } catch (error) {
      
    }
  };

  
const navigate = useNavigate();

  const logout = () => {
    auth.logout();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    refreshUser();
    // gettinguserid();
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser, logout}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

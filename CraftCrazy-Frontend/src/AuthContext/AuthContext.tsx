import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";


interface User {
  name: string;
  email: string;
}

interface DecodedToken {
  exp: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Validate JWT token
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  // Restore session from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && isTokenValid(token)) {
      const decoded: DecodedToken = jwtDecode(token);

      setUser({
        name: decoded.name,
        email: decoded.email,
      });

      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, []);

  // Login function
  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);

    const decoded: DecodedToken = jwtDecode(token);

    setUser({
      name: decoded.name,
      email: decoded.email,
    });

    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

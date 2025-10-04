"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  encSalt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  masterPassword: string | null;
  login: (token: string, user: User, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [masterPassword, setMasterPassword] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedPassword = sessionStorage.getItem("masterPassword");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      if (savedPassword) {
        setMasterPassword(savedPassword);
      }
    }
  }, []);

  const login = (newToken: string, newUser: User, password: string) => {
    setToken(newToken);
    setUser(newUser);
    setMasterPassword(password);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    sessionStorage.setItem("masterPassword", password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMasterPassword(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("masterPassword");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        masterPassword,
        login,
        logout,
        isAuthenticated: !!token && !!user && !!masterPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  isSuperAdmin: boolean;
  login: (isSuper: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isSuperAdmin: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn") === "true";
    const storedSuper = localStorage.getItem("isSuperAdmin") === "true";
    setIsLoggedIn(storedLogin);
    setIsSuperAdmin(storedSuper);
  }, []);

  const login = (isSuper: boolean) => {
    setIsLoggedIn(true);
    setIsSuperAdmin(isSuper);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isSuperAdmin", isSuper ? "true" : "false");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsSuperAdmin(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isSuperAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

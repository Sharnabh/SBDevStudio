import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({ token: null, login: () => {}, logout: () => {} });
const TOKEN_KEY = "sbdev_admin_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    // keep token in sync with storage
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      login: setToken,
      logout: () => setToken(null),
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

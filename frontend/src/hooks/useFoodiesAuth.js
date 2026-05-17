import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/* ────────────────────────────────────────────
   Foodies Auth Hook
   Stores the Foodies POS JWT completely
   separately from the SBDevStudio token.
   ──────────────────────────────────────────── */

const FoodiesAuthContext = createContext({ token: null, login: () => {}, logout: () => {} });
const FOODIES_TOKEN_KEY = "foodies_admin_token";

export const FoodiesAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(FOODIES_TOKEN_KEY));

  useEffect(() => {
    if (token) {
      localStorage.setItem(FOODIES_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(FOODIES_TOKEN_KEY);
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

  return <FoodiesAuthContext.Provider value={value}>{children}</FoodiesAuthContext.Provider>;
};

export const useFoodiesAuth = () => useContext(FoodiesAuthContext);
export const getFoodiesStoredToken = () => localStorage.getItem(FOODIES_TOKEN_KEY);

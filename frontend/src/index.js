import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { FoodiesAuthProvider } from "@/hooks/useFoodiesAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <FoodiesAuthProvider>
        <App />
        <Toaster />
      </FoodiesAuthProvider>
    </AuthProvider>
  </React.StrictMode>,
);

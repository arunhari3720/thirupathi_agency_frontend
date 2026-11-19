
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppRoutes from "./App";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
        </GoogleOAuthProvider>

  </React.StrictMode>
);

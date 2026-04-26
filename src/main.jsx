import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "./store/store";
import AppRoutes from "./routes/AppRoutes";

// ✅ GLOBAL COMPONENTS
import Navbar from "./components/Navbar";
import NotificationBanner from "./components/NotificationBanner";

// ✅ STYLES
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/components.css";
import "./styles/admin.css";
import "./index.css";

// ✅ UTILITIES
import ErrorBoundary from "./utils/ErrorBoundary";
import { loadAuth } from "./utils/auth";
import { setAuthFromStorage } from "./store/authSlice";

// ================= ROOT =================
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing in index.html");
}

// ================= AUTH RESTORE =================
// 🔥 Restore auth BEFORE render
const savedAuth = loadAuth();
if (savedAuth?.data) {
  store.dispatch(setAuthFromStorage(savedAuth.data));
}

// ================= APP =================
const root = createRoot(container);

const App = (
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>

        {/* ✅ GLOBAL NAVBAR */}
        <Navbar />

        {/* 🔔 GLOBAL NOTIFICATION BANNER (TOAST / ALERT TYPE) */}
        <NotificationBanner />

        {/* ✅ ROUTES */}
        <AppRoutes />

      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);

// ================= RENDER =================
const isDev = import.meta.env.MODE === "development";

root.render(
  isDev ? (
    <React.StrictMode>{App}</React.StrictMode>
  ) : (
    App
  )
);

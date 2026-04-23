import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import AppRoutes from "./routes/AppRoutes";

// ✅ ADD NAVBAR
import Navbar from "./components/Navbar";

// styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/components.css";
import "./styles/admin.css";
import "./index.css";

// Error Boundary
import ErrorBoundary from "./utils/ErrorBoundary";

// Auth restore
import { loadAuth } from "./utils/auth";
import { setAuthFromStorage } from "./store/authSlice";
import NotificationBanner from "./components/NotificationBanner";
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing in index.html");
}

// 🔥 Restore auth BEFORE render
const savedAuth = loadAuth();
if (savedAuth?.data) {
  store.dispatch(setAuthFromStorage(savedAuth.data));
}

const root = createRoot(container);

const App = (
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        {/* ✅ GLOBAL NAVBAR (FIXED) */}
        <Navbar />
        <NotificationBanner />
        {/* ✅ ROUTES */}
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);

if (import.meta.env.MODE === "development") {
  root.render(<React.StrictMode>{App}</React.StrictMode>);
} else {
  root.render(App);
}

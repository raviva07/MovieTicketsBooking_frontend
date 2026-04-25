// src/App.jsx
import React from "react";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotificationBanner from "./components/NotificationBanner";

// Routes
import AppRoutes from "./routes/AppRoutes";


const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Global notification (renders outside container so it can be full width) */}
      <NotificationBanner />

      {/* Top navigation */}
      <header>
        <Navbar />
      </header>

      {/* Main content */}
      <main className="flex-grow-1">
        <div className="container py-4">
          <AppRoutes />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default App;

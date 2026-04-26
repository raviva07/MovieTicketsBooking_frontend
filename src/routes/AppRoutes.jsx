import { Routes, Route, Navigate } from "react-router-dom";

/* ================= PAGES ================= */
import HomePage from "../pages/HomePage";
import MovieListPage from "../pages/MovieListPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import BookingHistoryPage from "../pages/BookingHistoryPage";
import ProfilePage from "../pages/ProfilePage";
import SeatBookingPage from "../pages/SeatBookingPage";
import PaymentPage from "../pages/PaymentPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

/* ✅ EXTRA PAGES */
import ShowPage from "../pages/ShowPage";
import TheaterPage from "../pages/TheaterPage";

/* 📩 NOTIFICATION FULL PAGE (IMPORTANT) */
import NotificationInbox from "../pages/NotificationInbox";


/* ================= ADMIN ================= */
import AdminDashboard from "../admin/AdminDashboard";
import ManageMovies from "../admin/ManageMovies";
import ManageTheaters from "../admin/ManageTheaters";
import ManageShows from "../admin/ManageShows";
import ManageSeats from "../admin/ManageSeats";
import ManageBookings from "../admin/ManageBookings";
import ManageUsers from "../admin/ManageUsers";

/* ================= ROUTES ================= */
import ProtectedRoutes from "../components/ProtectedRoute";
import AdminRoutes from "./AdminRoutes";
import BookingTicketPage from "../pages/BookingTicketPage";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ================= USER ================= */}
      <Route element={<ProtectedRoutes />}>

        {/* 🏠 HOME */}
        <Route path="/" element={<HomePage />} />

        {/* 🎬 MOVIES */}
        <Route path="/movies" element={<MovieListPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />

        {/* 🎭 THEATERS */}
        <Route path="/theaters" element={<TheaterPage />} />
        <Route path="/theaters/:id" element={<TheaterPage />} />

        {/* 🎟 SHOWS */}
        <Route path="/shows" element={<ShowPage />} />
        <Route path="/shows/:id" element={<ShowPage />} />

        {/* 💺 SEATS */}
        <Route path="/shows/:id/seats" element={<SeatBookingPage />} />

        {/* 💳 PAYMENT */}
        <Route path="/payments/:bookingId" element={<PaymentPage />} />

        {/* 📜 BOOKINGS */}
        <Route path="/bookings" element={<BookingHistoryPage />} />
        <Route path="/bookings/:id" element={<BookingTicketPage />} />

        {/* 👤 PROFILE */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* 📩 NOTIFICATION PAGE (NEW FIX) */}
        <Route path="/notifications" element={<NotificationInbox />} />

      </Route>

      {/* ================= ADMIN ================= */}
      <Route element={<AdminRoutes />}>

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<ManageMovies />} />
        <Route path="/admin/theaters" element={<ManageTheaters />} />
        <Route path="/admin/shows" element={<ManageShows />} />
        <Route path="/admin/seats" element={<ManageSeats />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/bookings/:id" element={<BookingTicketPage />} />
        <Route path="/admin/users" element={<ManageUsers />} />

      </Route>

      {/* ================= DEFAULT ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default AppRoutes;

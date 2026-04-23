import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { useSelector } from "react-redux";

const BookingTicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { role } = useSelector((s) => s.auth);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 detect admin navigation
  const fromAdmin = location.state?.fromAdmin;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data?.data || res.data);
      } catch (err) {
        console.log(err);
        alert("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ================= BACK HANDLER =================
  const handleBack = () => {
    // ✅ If admin came from ManageBookings
    if (fromAdmin || role === "ADMIN" || role === "ROLE_ADMIN") {
      navigate("/admin/bookings");
    } else {
      // ✅ normal user
      navigate("/bookings");
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!booking) return <div className="p-4 text-center">No ticket found</div>;

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: "450px" }}>

        <h3 className="text-center">🎟 Movie Ticket</h3>

        <p><b>Booking ID:</b> {booking.id}</p>
        <p><b>Status:</b> {booking.status}</p>
        <p><b>Seats:</b> {(booking.seatNumbers || booking.seatIds || []).join(", ")}</p>
        <p><b>Total:</b> ₹{booking.totalAmount}</p>
        <p><b>Payment:</b> {booking.paymentId || "Pending"}</p>

        {/* ✅ FIXED BACK BUTTON */}
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={handleBack}
        >
          ⬅ Back
        </button>

      </div>
    </div>
  );
};

export default BookingTicketPage;

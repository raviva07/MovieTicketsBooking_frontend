import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookings from "../hooks/useBooking";

const BookingHistoryPage = () => {
  const navigate = useNavigate();

  const {
    enrichedList = [],
    loading,
    error,
    fetchMyBookings,
    cancelBooking,
  } = useBookings();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchMyBookings({ page, size });
  }, [page, size]);

  const bookings = useMemo(() => {
    return [...enrichedList].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [enrichedList]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setProcessingId(id);
    try {
      await cancelBooking(id);
      await fetchMyBookings({ page, size });
    } finally {
      setProcessingId(null);
    }
  };

  const handlePay = (id) => {
    navigate(`/payments/${id}`);
  };

  const handleTicket = (id) => {
    navigate(`/bookings/${id}`);
  };

  const badge = (status) => {
    const map = {
      CONFIRMED: "bg-success",
      PENDING: "bg-warning text-dark",
      CANCELLED: "bg-danger",
      EXPIRED: "bg-secondary",
    };
    return map[status] || "bg-dark";
  };

  // ✅ FIX 1: unified ticket visibility rule
  const canViewTicket = (status) => {
    return ["CONFIRMED", "EXPIRED", "CANCELLED"].includes(status);
  };

  return (
    <div className="container py-4">

      <h2 className="text-center mb-4">🎟 My Bookings</h2>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && bookings.length === 0 && (
        <div className="text-center text-muted">No bookings found</div>
      )}

      <div className="row g-3">
        {bookings.map((b) => (
          <div key={b.id} className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex justify-content-between">

                {/* LEFT */}
                <div>
                  <h5>{b.movieTitle || "Movie Ticket"}</h5>

                  <div className="text-muted small">
                    {b.theaterName} •{" "}
                    {b.showTime
                      ? new Date(b.showTime).toLocaleString()
                      : "TBA"}
                  </div>

                  <div className="mt-2">
                    <strong>Seats:</strong>{" "}
                    {(b.seatNumbers || []).join(", ") || "N/A"}
                  </div>

                  <div className="mt-1">
                    <strong>Total:</strong> ₹{b.totalAmount}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-end">

                  <span className={`badge ${badge(b.status)}`}>
                    {b.status}
                  </span>

                  <div className="small text-muted mt-2">
                    {new Date(b.createdAt).toLocaleString()}
                  </div>

                  <div className="mt-3 d-flex gap-2 justify-content-end">

                    {/* PAY + CANCEL ONLY FOR PENDING */}
                    {b.status === "PENDING" && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handlePay(b.id)}
                        >
                          Pay
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          disabled={processingId === b.id}
                          onClick={() => handleCancel(b.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {/* ✅ FIX 2: Ticket ALWAYS visible (correct logic) */}
                    {canViewTicket(b.status) && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleTicket(b.id)}
                      >
                        🎟 Ticket
                      </button>
                    )}

                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingHistoryPage;

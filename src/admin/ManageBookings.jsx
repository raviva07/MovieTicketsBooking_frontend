import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBookings,
  cancelBooking,
  confirmBookingPayment,
  clearCurrentBooking,
} from "../store/bookingSlice";
import { fetchAllUsers } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const ManageBookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allBookings, loading } = useSelector((s) => s.booking);
  const { users = [] } = useSelector((s) => s.user);
  const { role } = useSelector((s) => s.auth);

  const [page, setPage] = useState(0);
  const size = 10;
  const [processingId, setProcessingId] = useState(null);

  // ================= SECURITY GUARD =================
  useEffect(() => {
    if (role !== "ADMIN" && role !== "ROLE_ADMIN") {
      navigate("/"); // ❌ block non-admin
    }
  }, [role, navigate]);

  // ================= LOAD DATA =================
  useEffect(() => {
    dispatch(clearCurrentBooking());
    dispatch(fetchAllBookings({ page, size }));
    dispatch(fetchAllUsers());
  }, [dispatch, page]);

  // ================= SAFE DATA =================
  const bookings = allBookings?.content || [];
  const totalPages = allBookings?.totalPages || 1;

  // ================= USER MAP =================
  const userMap = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      map[u.id] = u.name;
    });
    return map;
  }, [users]);

  // ================= CANCEL =================
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    setProcessingId(id);
    try {
      await dispatch(cancelBooking(id)).unwrap();
      dispatch(fetchAllBookings({ page, size }));
    } catch (err) {
      alert(err?.message || "Cancel failed");
    } finally {
      setProcessingId(null);
    }
  };

  // ================= CONFIRM =================
  const handleConfirmPayment = async (id) => {
    const paymentId = prompt("Enter Payment ID");
    if (!paymentId) return;

    setProcessingId(id);
    try {
      await dispatch(confirmBookingPayment({ id, paymentId })).unwrap();
      dispatch(fetchAllBookings({ page, size }));
    } catch (err) {
      alert(err?.message || "Payment failed");
    } finally {
      setProcessingId(null);
    }
  };

  // ================= VIEW =================
  const handleView = (id) => {
    navigate(`/bookings/${id}`, {
      state: { fromAdmin: true }, // 🔥 important
    });
  };

  // ================= STATUS BADGE =================
  const statusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-warning text-dark";
      case "CONFIRMED":
        return "bg-success";
      case "CANCELLED":
        return "bg-secondary";
      case "EXPIRED":
        return "bg-danger";
      default:
        return "bg-dark";
    }
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold">🎟 Booking Management</h3>
          <small className="text-muted">Admin Panel</small>
        </div>

        <div className="d-flex gap-2">

          {/* ✅ SAFE BACK */}
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/dashboard")}
          >
            ⬅ Back
          </button>

          {/* REFRESH */}
          <button
            className="btn btn-primary"
            onClick={() => {
              setPage(0);
              dispatch(fetchAllBookings({ page: 0, size }));
            }}
          >
            🔄 Refresh
          </button>

        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && bookings.length === 0 && (
        <div className="alert alert-light text-center">
          No bookings found
        </div>
      )}

      {/* TABLE */}
      {!loading && bookings.length > 0 && (
        <div className="card shadow-sm border-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-dark">
                <tr>
                  <th>Booking</th>
                  <th>User</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>

                    {/* BOOKING */}
                    <td>
                      <div className="fw-bold">{b.id}</div>
                      <small className="text-muted">
                        {b.movieTitle || "Movie"}
                      </small>
                    </td>

                    {/* USER */}
                    <td className="fw-semibold">
                      {userMap[b.userId] || b.userEmail || "Unknown"}
                    </td>

                    {/* SEATS */}
                    <td>
                      {b.seatNumbers?.length ? (
                        b.seatNumbers.map((s, i) => (
                          <span key={i} className="badge bg-light text-dark me-1">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">
                          {b.seatIds?.join(", ") || "-"}
                        </span>
                      )}
                    </td>

                    {/* AMOUNT */}
                    <td className="fw-bold">₹{b.totalAmount || 0}</td>

                    {/* STATUS */}
                    <td>
                      <span className={`badge ${statusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td>
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    {/* ACTIONS */}
                    <td className="text-end">

                      {b.status === "PENDING" ? (
                        <>
                          <button
                            className="btn btn-sm btn-outline-danger me-2"
                            disabled={processingId === b.id}
                            onClick={() => handleCancel(b.id)}
                          >
                            Cancel
                          </button>

                          <button
                            className="btn btn-sm btn-success"
                            disabled={processingId === b.id}
                            onClick={() => handleConfirmPayment(b.id)}
                          >
                            Confirm
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleView(b.id)}
                        >
                          View
                        </button>
                      )}

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>
      )}

      {/* PAGINATION */}
      <div className="d-flex justify-content-between mt-4">

        <button
          className="btn btn-outline-secondary"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          ⬅ Prev
        </button>

        <div className="fw-bold">
          Page {page + 1} / {totalPages}
        </div>

        <button
          className="btn btn-outline-secondary"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ➡
        </button>

      </div>

    </div>
  );
};

export default ManageBookings;

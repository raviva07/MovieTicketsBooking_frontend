import React, { useEffect, useMemo, useState } from "react";
import seatService from "../services/seatService";
import theaterService from "../services/theaterService";
import showService from "../services/showService";
import { getUserRoleFromStorage } from "../utils/auth";

const ManageSeats = () => {
  const [theaterId, setTheaterId] = useState("");
  const [showId, setShowId] = useState("");

  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const role = getUserRoleFromStorage(); // 🔥 detect role

  const clearMsg = () => setMessage({ type: "", text: "" });

  const unwrap = (res) => res?.data?.data ?? res?.data ?? res ?? [];

  // ================= LOAD THEATERS =================
  useEffect(() => {
    (async () => {
      const res = await theaterService.getAllTheaters();
      setTheaters(unwrap(res));
    })();
  }, []);

  // ================= LOAD SHOWS =================
  useEffect(() => {
    if (!theaterId) return setShows([]);

    (async () => {
      const res = await showService.getByTheater(theaterId);
      setShows(unwrap(res));
    })();
  }, [theaterId]);

  // ================= LOAD SEATS =================
  const loadSeats = async () => {
    if (!theaterId) {
      return setMessage({ type: "warning", text: "Select theater first" });
    }

    try {
      setLoading(true);
      const res = await seatService.getSeats(theaterId);
      setSeats(unwrap(res));
      setSelectedSeats([]);
    } catch {
      setMessage({ type: "danger", text: "Failed to load seats" });
    } finally {
      setLoading(false);
    }
  };

  // ================= SELECT SEAT =================
  const toggleSeat = (seat) => {
    if (seat.status !== "AVAILABLE") return;

    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );
  };

  // ================= RESERVE =================
  const reserveSeats = async () => {
    if (!showId || selectedSeats.length === 0) {
      return setMessage({ type: "warning", text: "Select show & seats" });
    }

    try {
      setLoading(true);

      await seatService.reserve({
        showId,
        seatIds: selectedSeats,
        lockSeconds: 600,
      });

      setMessage({ type: "success", text: "Seats locked (10 min)" });
      loadSeats();
    } catch {
      setMessage({ type: "danger", text: "Reserve failed" });
    } finally {
      setLoading(false);
    }
  };

  // ================= CONFIRM =================
  const confirmSeats = async () => {
    try {
      await seatService.confirm(selectedSeats);
      setMessage({ type: "success", text: "Booking confirmed" });
      loadSeats();
    } catch {
      setMessage({ type: "danger", text: "Confirm failed" });
    }
  };

  // ================= GROUP =================
  const grouped = useMemo(() => {
    const map = {};
    seats.forEach((s) => {
      if (!map[s.row]) map[s.row] = [];
      map[s.row].push(s);
    });
    return map;
  }, [seats]);

  // ================= UI =================
  return (
    <div className="container mt-4">

      <h3 className="text-center text-danger fw-bold mb-3">
        🎟 Seat Selection
      </h3>

      {/* MESSAGE */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {/* SELECTORS */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-2">

          <div className="col-md-4">
            <select className="form-select" value={theaterId}
              onChange={(e) => setTheaterId(e.target.value)}>
              <option value="">Select Theater</option>
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select className="form-select" value={showId}
              onChange={(e) => setShowId(e.target.value)}>
              <option value="">Select Show</option>
              {shows.map((s) => (
                <option key={s.id} value={s.id}>
                  Screen {s.screen} | {s.language}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={loadSeats}>
              Load Seats
            </button>
          </div>

        </div>
      </div>

      {/* LEGEND */}
      <div className="mb-3 d-flex gap-3">
        <span className="badge bg-secondary">Available</span>
        <span className="badge bg-success">Selected</span>
        <span className="badge bg-warning text-dark">Reserved</span>
        <span className="badge bg-danger">Booked</span>
      </div>

      {/* ACTIONS (ONLY USER) */}
      {role === "USER" && (
        <div className="mb-3 d-flex gap-2">
          <button className="btn btn-success" onClick={reserveSeats}>
            Reserve Seats
          </button>

          <button className="btn btn-dark" onClick={confirmSeats}>
            Confirm Booking
          </button>
        </div>
      )}

      {/* SEATS */}
      {/* SEATS */}
<div className="card p-4 shadow-sm border-0">

  {Object.keys(grouped).length === 0 && (
    <p className="text-center text-muted">No seats</p>
  )}

  {/* SCREEN */}
  <div className="text-center mb-4">
    <div
      className="bg-secondary mx-auto rounded"
      style={{ height: 6, width: "60%" }}
    ></div>
    <small className="text-muted">SCREEN</small>
  </div>

  {Object.keys(grouped).sort().map((row) => (
    <div key={row} className="mb-4 text-center">

      {/* ROW LABEL */}
      <div className="fw-bold mb-2 text-secondary">
        Row {row}
      </div>

      {/* SEAT ROW */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          gap: "10px",
          flexWrap: "nowrap", // ❌ STOP WRAPPING
          overflowX: "auto"   // ✅ scroll if too many seats
        }}
      >
        {grouped[row]
          .sort((a, b) => a.position - b.position)
          .map((seat) => {

            let cls = "btn-outline-secondary";

            if (seat.status === "BOOKED") cls = "btn-danger";
            else if (seat.status === "RESERVED") cls = "btn-warning";
            else if (selectedSeats.includes(seat.id)) cls = "btn-success";

            return (
              <button
                key={seat.id}
                className={`btn ${cls}`}
                style={{
                  width: 42,
                  height: 42,
                  fontSize: 12,
                  borderRadius: "8px"
                }}
                onClick={() => toggleSeat(seat)}
              >
                {seat.seatNumber}
              </button>
            );
          })}
      </div>
    </div>
  ))}
</div>


    </div>
  );
};

export default ManageSeats;

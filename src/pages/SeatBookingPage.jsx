import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import seatService from "../services/seatService";
import theaterService from "../services/theaterService";
import showService from "../services/showService";
import bookingService from "../services/bookingService";

const getUserIdFromAuth = (auth) =>
  auth?.user?.id || auth?.id || auth?.userId || auth?.email || "";

const STEPS = {
  THEATER: 1,
  SHOW: 2,
  SEATS: 3,
};

const SeatBookingPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((s) => s.auth);

  const [step, setStep] = useState(STEPS.THEATER);

  const [userId, setUserId] = useState("");
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [seats, setSeats] = useState([]);

  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [reservationActive, setReservationActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setUserId(getUserIdFromAuth(auth));
  }, [auth]);

  const unwrap = (r) => r?.data?.data ?? r?.data ?? [];

  const showMsg = (type, text) => setMessage({ type, text });

  // ================= LOAD =================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await theaterService.getAllTheaters?.();
        setTheaters(unwrap(res));
      } catch {
        showMsg("danger", "Failed to load theaters");
      }
    };
    load();
  }, []);

  const loadShows = async (t) => {
    try {
      const res = await showService.getByTheater(t?.id || t);
      setShows(unwrap(res));
    } catch {
      showMsg("danger", "Failed to load shows");
    }
  };

  const loadSeats = async (t) => {
    try {
      const res = await seatService.getSeats(t?.id || t);
      setSeats(unwrap(res));
    } catch {
      showMsg("danger", "Failed to load seats");
    }
  };

  // ================= SELECT =================
  const selectTheater = async (t) => {
    setSelectedTheater(t);
    setStep(STEPS.SHOW);
    await loadShows(t);
  };

  const selectShow = async (s) => {
    setSelectedShow(s);
    setStep(STEPS.SEATS);
    await loadSeats(selectedTheater);
  };

  const toggleSeat = (seat) => {
    if (seat.status !== "AVAILABLE") return;

    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((x) => x !== seat.id)
        : [...prev, seat.id]
    );
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

  const totalAmount = seats
    .filter((s) => selectedSeats.includes(s.id))
    .reduce((sum, s) => sum + Number(s.basePrice || 0), 0);

  // ================= RESERVE =================
  const reserveSeats = async () => {
    if (!selectedSeats.length) {
      return showMsg("warning", "Select seats first");
    }

    try {
      setProcessing(true);

      await seatService.reserve({
        showId: selectedShow.id,
        userId,
        seatIds: selectedSeats,
        lockSeconds: 600,
      });

      setReservationActive(true);
      showMsg("success", "Seats reserved");

      await loadSeats(selectedTheater);
    } catch (err) {
      showMsg("danger", err?.message || "Reservation failed");
    } finally {
      setProcessing(false);
    }
  };

  // ================= RELEASE =================
  const releaseSeats = async () => {
    try {
      await seatService.release(selectedSeats);
      setSelectedSeats([]);
      setReservationActive(false);
      await loadSeats(selectedTheater);
    } catch {
      showMsg("danger", "Failed to release seats");
    }
  };

  // ================= BOOK =================
  const bookNow = async () => {
    if (!reservationActive) {
      return showMsg("warning", "Reserve seats first");
    }

    try {
      setProcessing(true);

      const res = await bookingService.create({
        userId,
        showId: selectedShow.id,
        seatIds: selectedSeats,
        totalAmount,
      });

      const booking = res?.data ?? res;

      if (!booking?.id) {
        throw new Error("Booking creation failed");
      }

      showMsg("success", "Redirecting to payment...");
      navigate(`/payments/${booking.id}`);
    } catch (err) {
      showMsg("danger", err?.message || "Booking failed");
    } finally {
      setProcessing(false);
    }
  };

  // ================= UI HELPERS =================
  const seatClass = (seat) => {
    if (seat.status === "BOOKED") return "btn btn-danger btn-sm m-1 disabled";
    if (seat.status === "LOCKED") return "btn btn-warning btn-sm m-1";
    if (selectedSeats.includes(seat.id))
      return "btn btn-success btn-sm m-1";
    return "btn btn-outline-dark btn-sm m-1";
  };

  return (
    <div className="container py-4">

      <h3 className="text-center mb-4">🎬 Movie Ticket Booking</h3>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card p-4 shadow">
          <h5>Select Theater</h5>
          {theaters.map((t) => (
            <button
              key={t.id}
              className="btn btn-outline-dark m-2"
              onClick={() => selectTheater(t)}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="card p-4 shadow">
          <h5>Select Show</h5>
          {shows.map((s) => (
            <button
              key={s.id}
              className="btn btn-outline-primary m-2"
              onClick={() => selectShow(s)}
            >
              {s.screen} | {s.language}
            </button>
          ))}
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="card shadow-lg border-0">

          {/* SCREEN */}
          <div className="text-center py-3">
            <div
              style={{
                width: "60%",
                margin: "0 auto",
                height: "30px",
                background: "linear-gradient(to right, #ccc, #eee)",
                borderRadius: "50%",
              }}
            ></div>
            <small className="text-muted">SCREEN</small>
          </div>

          <div className="card-body">

            {Object.keys(grouped).map((row) => (
              <div key={row} className="d-flex align-items-center mb-2">

                <div style={{ width: "30px", fontWeight: "bold" }}>
                  {row}
                </div>

                <div className="d-flex flex-wrap">
                  {grouped[row].map((seat, index) => {
                    const isAisle = (index + 1) % 4 === 0;

                    return (
                      <React.Fragment key={seat.id}>
                        <button
                          className={seatClass(seat)}
                          style={{ width: "40px", height: "40px" }}
                          onClick={() => toggleSeat(seat)}
                        >
                          {seat.seatNumber}
                        </button>

                        {isAisle && <div style={{ width: "20px" }}></div>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="text-center mt-4">
              <span className="badge bg-secondary me-2">Available</span>
              <span className="badge bg-success me-2">Selected</span>
              <span className="badge bg-warning text-dark me-2">Locked</span>
              <span className="badge bg-danger">Booked</span>
            </div>

            <hr />

            <h5 className="text-center">Total: ₹{totalAmount}</h5>

            <div className="d-flex justify-content-center gap-3 mt-3">
              <button
                className="btn btn-warning"
                onClick={reserveSeats}
                disabled={processing}
              >
                Reserve
              </button>

              <button
                className="btn btn-secondary"
                onClick={releaseSeats}
              >
                Release
              </button>

              <button
                className="btn btn-success"
                onClick={bookNow}
                disabled={!reservationActive || processing}
              >
                Book Now
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SeatBookingPage;

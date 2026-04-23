import React from "react";
import {
  groupSeatsByRow,
  getSeatClass,
  toggleSeatSelection,
  calculateTotal,
  formatPrice,
} from "./seatUtils";

const SeatLayout = ({ seats = [], selectedIds = [], setSelectedIds }) => {

  const { rows } = groupSeatsByRow(seats);

  const handleToggle = (seat) => {
    const updated = toggleSeatSelection(seat, selectedIds);
    setSelectedIds(updated);
  };

  const selectedSeats = seats.filter((s) => selectedIds.includes(s.id));
  const total = calculateTotal(selectedSeats);

  return (
    <div className="container py-4">

      {/* SCREEN */}
      <div className="text-center mb-4">
        <div className="bg-light rounded shadow-sm mx-auto"
             style={{ height: 8, width: "60%" }} />
        <small className="text-muted">All eyes this way please</small>
      </div>

      {/* LEGEND */}
      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <Legend label="Available" className="seat-available" />
        <Legend label="Selected" className="seat-selected" />
        <Legend label="Locked" className="seat-locked" />
        <Legend label="Booked" className="seat-booked" />
      </div>

      {/* SEATS */}
      {rows.map(({ row, seats }) => (
        <div key={row} className="mb-3 text-center">

          <div className="fw-bold mb-2">Row {row}</div>

          <div className="d-flex justify-content-center flex-wrap gap-2">

            {seats.map((seat, index) => {

              const isAisle = index === 3 || index === 7; // aisle gap

              return (
                <React.Fragment key={seat.id}>
                  <button
                    className={`btn seat-btn ${getSeatClass(seat, selectedIds)}`}
                    onClick={() => handleToggle(seat)}
                  >
                    {seat.seatNumber}
                  </button>

                  {isAisle && <div style={{ width: 20 }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}

      {/* SUMMARY */}
      <div className="card mt-4 shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">Selected Seats</div>
            <small className="text-muted">
              {selectedSeats.map((s) => s.seatNumber).join(", ") || "None"}
            </small>
          </div>

          <div className="text-end">
            <div className="fw-bold">Total</div>
            <div className="text-primary fs-5">{formatPrice(total)}</div>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .seat-btn {
          width: 42px;
          height: 42px;
          font-size: 11px;
          border-radius: 6px;
          padding: 0;
        }

        .seat-available {
          border: 1px solid #198754;
          color: #198754;
          background: transparent;
        }

        .seat-available:hover {
          background: #198754;
          color: white;
        }

        .seat-selected {
          background: #0d6efd;
          color: white;
          border: none;
        }

        .seat-locked {
          background: #212529;
          color: #adb5bd;
          cursor: not-allowed;
        }

        .seat-booked {
          background: #6c757d;
          color: white;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

/* LEGEND COMPONENT */
const Legend = ({ label, className }) => (
  <div className="d-flex align-items-center gap-2">
    <div className={`seat-btn ${className}`} />
    <small>{label}</small>
  </div>
);

export default SeatLayout;

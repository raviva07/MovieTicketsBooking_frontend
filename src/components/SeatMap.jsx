import React from "react";

/**
 * SeatMap (BookMyShow Style UI - Logic Safe)
 */
const SeatMap = ({ seats = [], onToggle, currentUser, loading }) => {

  // GROUP BY ROW
  const rows = seats.reduce((acc, seat) => {
    const r = seat.row || "A";
    acc[r] = acc[r] || [];
    acc[r].push(seat);
    return acc;
  }, {});

  // STYLE
  const getSeatClass = (seat) => {
    if (seat.status === "BOOKED") return "seat booked";

    if (seat.status === "LOCKED") {
      if (seat.lockedBy === currentUser) return "seat locked-own";
      return "seat locked";
    }

    if (seat._selected) return "seat selected";

    return "seat available";
  };

  const isDisabled = (seat) => {
    if (seat.status === "BOOKED") return true;
    if (seat.status === "LOCKED" && seat.lockedBy !== currentUser) return true;
    return false;
  };

  return (
    <div className="seat-wrapper">

      {/* SCREEN */}
      <div className="screen-container">
        <div className="screen"></div>
        <p>All eyes this way please!</p>
      </div>

      {/* LEGEND */}
      <div className="legend">
        <span><div className="seat available"></div> Available</span>
        <span><div className="seat selected"></div> Selected</span>
        <span><div className="seat locked-own"></div> Your Lock</span>
        <span><div className="seat locked"></div> Locked</span>
        <span><div className="seat booked"></div> Booked</span>
      </div>

      {/* SEATS */}
      {Object.keys(rows).sort().map((rowKey) => (
        <div key={rowKey} className="row-block">

          <div className="row-label">{rowKey}</div>

          <div className="seat-row">
            {rows[rowKey]
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((seat, index) => {

                const disabled = isDisabled(seat);
                const btnClass = getSeatClass(seat);

                // 👉 aisle gap after 4 seats (cinema feel)
                const isAisle = index === 3 || index === 7;

                return (
                  <React.Fragment key={seat.id}>
                    <button
                      className={btnClass}
                      disabled={disabled || loading}
                      onClick={() => onToggle(seat.id)}
                    >
                      {seat.seatNumber}
                    </button>

                    {isAisle && <div className="aisle-gap" />}
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      ))}

      {!seats.length && (
        <div className="empty">No seats available</div>
      )}

      {/* STYLES */}
      <style>{`
        .seat-wrapper {
          padding: 20px;
          background: #0f172a;
          color: white;
          border-radius: 12px;
        }

        .screen-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .screen {
          width: 70%;
          height: 8px;
          background: linear-gradient(to right, #fff, #aaa);
          margin: auto;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(255,255,255,0.4);
        }

        .screen-container p {
          font-size: 12px;
          color: #94a3b8;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          font-size: 12px;
        }

        .legend span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .row-block {
          margin-bottom: 16px;
        }

        .row-label {
          text-align: center;
          margin-bottom: 6px;
          font-weight: bold;
          color: #cbd5f5;
        }

        .seat-row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .aisle-gap {
          width: 20px;
        }

        .seat {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          border: 1px solid #334155;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .seat:hover {
          transform: scale(1.1);
        }

        .available {
          background: transparent;
          color: #22c55e;
          border: 1px solid #22c55e;
        }

        .selected {
          background: #2563eb;
          color: white;
        }

        .locked-own {
          background: #facc15;
          color: black;
        }

        .locked {
          background: #1e293b;
          color: #64748b;
          cursor: not-allowed;
        }

        .booked {
          background: #64748b;
          color: white;
          cursor: not-allowed;
        }

        .empty {
          text-align: center;
          padding: 30px;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default SeatMap;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyNotifications,
  markNotificationAsRead,
} from "../store/notificationSlice";

const NotificationInbox = () => {
  const dispatch = useDispatch();

  const { myList = [], loading } = useSelector(
    (s) => s.notification || {}
  );

  const [selected, setSelected] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, [dispatch]);

  // ================= OPEN =================
  const openMail = (n) => {
    setSelected(n);

    if (!n.read) {
      dispatch(markNotificationAsRead(n.id));
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row border rounded shadow-sm" style={{ height: "85vh" }}>

        {/* ================= LEFT PANEL ================= */}
        <div
          className="col-md-4 border-end p-0"
          style={{ overflowY: "auto", background: "#f8f9fa" }}
        >
          <div className="p-3 border-bottom bg-white fw-bold d-flex justify-content-between">
            <span>📩 Inbox</span>
            <span className="text-muted" style={{ fontSize: "13px" }}>
              {myList.length}
            </span>
          </div>

          {loading && <p className="p-3">Loading...</p>}

          {!loading && myList.length === 0 && (
            <p className="p-3 text-muted">No notifications</p>
          )}

          {myList.map((n) => (
            <div
              key={n.id}
              onClick={() => openMail(n)}
              className={`p-3 border-bottom inbox-item ${
                selected?.id === n.id ? "bg-light" : "bg-white"
              }`}
              style={{ cursor: "pointer" }}
            >
              {/* TITLE */}
              <div
                style={{
                  fontWeight: n.read ? "normal" : "bold",
                  color: "#212529",
                }}
              >
                {n.title}
                {!n.read && (
                  <span
                    style={{
                      marginLeft: 6,
                      color: "#0d6efd",
                      fontSize: "12px",
                    }}
                  >
                    ●
                  </span>
                )}
              </div>

              {/* MESSAGE PREVIEW */}
              <div
                style={{
                  fontSize: "13px",
                  color: "#6c757d",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {n.message}
              </div>

              {/* TYPE */}
              <div className="d-flex justify-content-between mt-1">
                <small className="text-muted">
                  {n.type || "Notification"}
                </small>

                {!n.read && (
                  <span className="badge bg-primary">NEW</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="col-md-8 p-4 bg-white">

          {!selected ? (
            <div className="text-center text-muted mt-5">
              📭 Select a notification to view details
            </div>
          ) : (
            <>
              {/* TITLE */}
              <h4 className="fw-bold">{selected.title}</h4>

              <hr />

              {/* MESSAGE */}
              <p style={{ fontSize: "16px" }}>
                {selected.message}
              </p>

              {/* META */}
              <div className="mt-4 p-3 bg-light rounded">

                <p className="mb-2">
                  <b>Reference ID:</b> {selected.referenceId || "N/A"}
                </p>

                <p className="mb-2">
                  <b>Type:</b> {selected.type || "Notification"}
                </p>

                <p className="mb-0 text-muted">
                  <b>Status:</b>{" "}
                  {selected.read ? "Read" : "Unread"}
                </p>
              </div>

              {/* ACTION */}
              <div className="mt-3">
                {!selected.read && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      dispatch(markNotificationAsRead(selected.id))
                    }
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationInbox;

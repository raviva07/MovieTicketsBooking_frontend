import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyNotifications,
  markNotificationAsRead,
} from "../store/notificationSlice";

import "./NotificationBell.css";

const NotificationBell = () => {
  const dispatch = useDispatch();

  const { myList = [], loading } = useSelector(
    (state) => state.notification || {}
  );

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchMyNotifications());

    const interval = setInterval(() => {
      dispatch(fetchMyNotifications());
    }, 15000); // 🔥 every 15 sec

    return () => clearInterval(interval);
  }, [dispatch]);

  // ================= UNREAD COUNT =================
  const unreadCount = myList.filter((n) => !n.read).length;

  // ================= OPEN MAIL =================
  const handleOpenNotification = (n) => {
    setSelected(n);

    if (!n.read) {
      dispatch(markNotificationAsRead(n.id));
    }
  };

  return (
    <div className="notif-container">
      
      {/* 📩 MAIL ICON */}
      <div className="notif-bell" onClick={() => setOpen(!open)}>
        📩
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </div>

      {/* ================= DROPDOWN ================= */}
      {open && (
        <div className="notif-dropdown">

          {/* HEADER */}
          <div className="notif-header">
            Inbox
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setOpen(false)}
            >
              ✖
            </span>
          </div>

          <div className="notif-body">

            {/* ================= LEFT LIST ================= */}
            <div className="notif-list">
              {loading && <p className="empty">Loading...</p>}

              {!loading && myList.length === 0 && (
                <p className="empty">No notifications</p>
              )}

              {myList.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${
                    selected?.id === n.id ? "active" : ""
                  } ${n.read ? "read" : "unread"}`}
                  onClick={() => handleOpenNotification(n)}
                >
                  <div className="notif-title">
                    {n.title}
                    {!n.read && <span className="new-dot"> •</span>}
                  </div>

                  <div className="notif-msg">
                    {n.message?.length > 50
                      ? n.message.slice(0, 50) + "..."
                      : n.message}
                  </div>

                  <div className="notif-small">
                    {n.type || "Notification"}
                  </div>
                </div>
              ))}
            </div>

            {/* ================= RIGHT DETAIL ================= */}
            <div className="notif-detail">
              {!selected ? (
                <p className="empty">
                  Select a notification
                </p>
              ) : (
                <>
                  <h5>{selected.title}</h5>

                  <p>{selected.message}</p>

                  <hr />

                  <p>
                    <b>Reference:</b> {selected.referenceId}
                  </p>

                  <p>
                    <b>Status:</b>{" "}
                    {selected.read ? "Read" : "Unread"}
                  </p>

                  {/* ❌ NO createdAt (you removed it backend) */}
                  <p className="text-muted">
                    {selected.type}
                  </p>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

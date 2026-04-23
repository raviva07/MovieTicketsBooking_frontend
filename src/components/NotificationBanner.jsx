// src/components/NotificationBanner.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification } from "../store/notificationSlice";

const NotificationBanner = () => {
  const notifications = useSelector((s) => s.notification?.list || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => {
        dispatch(removeNotification(n.id));
      }, 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, dispatch]);

  if (!notifications.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 1050,
        width: "300px",
      }}
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`alert alert-${n.type || "info"} alert-dismissible fade show shadow-sm mb-2`}
          role="alert"
        >
          <strong>{n.title || "Notification"}:</strong> {n.message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => dispatch(removeNotification(n.id))}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;

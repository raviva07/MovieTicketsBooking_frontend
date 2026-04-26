// src/components/NotificationBanner.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const NotificationBanner = () => {
  // ✅ FIX: no filter inside selector
  const myList = useSelector((state) => state.notification.myList);

  const [visible, setVisible] = useState(true);

  // ✅ derive unread safely
  const unread = myList.filter((n) => !n.read);

  // show latest unread only
  const latest = unread.length > 0 ? unread[0] : null;

  // auto hide after 5 sec
  useEffect(() => {
    if (latest) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [latest]);

  if (!latest || !visible) return null;

  return (
    <div className="notif-banner shadow">
      <div className="d-flex justify-content-between align-items-start">

        {/* TEXT */}
        <div>
          <div className="fw-bold">{latest.title}</div>
          <div className="small text-muted">{latest.message}</div>
        </div>

        {/* CLOSE */}
        <button
          className="btn-close btn-close-white ms-2"
          onClick={() => setVisible(false)}
        />
      </div>

      {/* STYLES */}
      <style>{`
        .notif-banner {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 280px;
          max-width: 320px;
          background: #0d6efd;
          color: white;
          padding: 12px 16px;
          border-radius: 10px;
          z-index: 9999;
          animation: slideIn 0.3s ease;
        }

        .notif-banner .btn-close {
          filter: invert(1);
          font-size: 10px;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationBanner;

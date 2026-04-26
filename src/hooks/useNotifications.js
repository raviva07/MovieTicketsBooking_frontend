// src/hooks/useNotifications.js
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import {
  addLocal,
  removeNotification,
  clearNotifications,
} from "../store/notificationSlice";

const useNotifications = () => {
  const dispatch = useDispatch();

  // ✅ SAFE STATE ACCESS
  const list = useSelector((s) => s.notification?.list || []);
  const myList = useSelector((s) => s.notification?.myList || []);

  // ✅ MERGE + REMOVE DUPLICATES
  const notifications = useMemo(() => {
    const merged = [...list, ...myList];

    const unique = [];
    const seen = new Set();

    for (let n of merged) {
      if (!seen.has(n.id)) {
        seen.add(n.id);
        unique.push(n);
      }
    }

    return unique;
  }, [list, myList]);

  return {
    notifications,

    // ================= PUSH =================
    push: ({ title = "Notification", message, type = "info" }) => {
      dispatch(addLocal({ title, message, type }));
    },

    // ================= SUCCESS =================
    success: (message, title = "Success") => {
      dispatch(addLocal({ title, message, type: "success" }));
    },

    // ================= ERROR =================
    error: (message, title = "Error") => {
      dispatch(addLocal({ title, message, type: "danger" })); // bootstrap
    },

    // ================= INFO =================
    info: (message, title = "Info") => {
      dispatch(addLocal({ title, message, type: "info" }));
    },

    // ================= REMOVE =================
    remove: (id) => {
      dispatch(removeNotification(id));
    },

    // ================= CLEAR =================
    clear: () => {
      dispatch(clearNotifications());
    },
  };
};

export default useNotifications;

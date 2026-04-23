import { useSelector, useDispatch } from "react-redux";
import {
  addLocal,                // ✅ import properly
  removeNotification,
  clearNotifications,
} from "../store/notificationSlice";

const useNotifications = () => {
  const { list = [], myList = [] } = useSelector(
    (s) => s.notification || {}
  );

  const dispatch = useDispatch();

  // 🔥 merge + avoid duplicates (optional safe handling)
  const notifications = [...list, ...myList].filter(
    (v, i, arr) => arr.findIndex((n) => n.id === v.id) === i
  );

  return {
    notifications,

    // ✅ generic push
    push: (payload) => {
      dispatch(
        addLocal({
          id: Date.now().toString(),
          title: payload.title || "Notification",
          message: payload.message,
          type: payload.type || "info",
        })
      );
    },

    // ✅ success
    success: (message, title = "Success") => {
      dispatch(
        addLocal({
          id: Date.now().toString(),
          title,
          message,
          type: "success",
        })
      );
    },

    // ✅ error
    error: (message, title = "Error") => {
      dispatch(
        addLocal({
          id: Date.now().toString(),
          title,
          message,
          type: "danger", // bootstrap uses danger
        })
      );
    },

    // ✅ info
    info: (message, title = "Info") => {
      dispatch(
        addLocal({
          id: Date.now().toString(),
          title,
          message,
          type: "info",
        })
      );
    },

    // ✅ remove
    remove: (id) => dispatch(removeNotification(id)),

    // ✅ clear all
    clear: () => dispatch(clearNotifications()),
  };
};

export default useNotifications;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import movieReducer from "./movieSlice";
import theaterReducer from "./theaterSlice";
import showReducer from "./showSlice";
import seatReducer from "./seatSlice";
import bookingReducer from "./bookingSlice";
import paymentReducer from "./paymentSlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    movie: movieReducer,
    theater: theaterReducer,
    show: showReducer,
    seat: seatReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

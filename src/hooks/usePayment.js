// src/hooks/usePayments.js
import { useSelector, useDispatch } from "react-redux";
import {
  initiatePayment,
  verifyPayment,
  fetchPaymentByBookingId,
  clearCurrentPayment,
  clearPaymentError,
} from "../store/paymentSlice";

const usePayments = () => {
  const payment = useSelector((s) => s.payment);
  const dispatch = useDispatch();

  return {
    payment,
    initiatePayment: (payload) => dispatch(initiatePayment(payload)).unwrap(),
    verifyPayment: (payload) => dispatch(verifyPayment(payload)).unwrap(),
    fetchPaymentByBookingId: (bookingId) => dispatch(fetchPaymentByBookingId(bookingId)).unwrap(),
    clearCurrentPayment: () => dispatch(clearCurrentPayment()),
    clearPaymentError: () => dispatch(clearPaymentError()),
  };
};

export default usePayments;

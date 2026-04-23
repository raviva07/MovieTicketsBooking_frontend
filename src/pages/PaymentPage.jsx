// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initiatePayment,
  verifyPayment,
  fetchPaymentByBookingId,
} from "../store/paymentSlice";
import {
  confirmBookingPayment,
  fetchBookingById,
} from "../store/bookingSlice";
import { confirmSeats } from "../store/seatSlice";
import { useParams, useNavigate } from "react-router-dom";
import useNotifications from "../hooks/useNotifications";

// ================= LOAD RAZORPAY SCRIPT =================
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotifications();

  const [processing, setProcessing] = useState(false);

  const { current: payment, loading: paymentLoading } =
    useSelector((s) => s.payment);

  const { current: booking, loading: bookingLoading } =
    useSelector((s) => s.booking);

  // ================= LOAD =================
  useEffect(() => {
    if (!bookingId) return;

    dispatch(fetchBookingById(bookingId));
    dispatch(fetchPaymentByBookingId(bookingId));
  }, [dispatch, bookingId]);

  const amount = booking?.totalAmount || 0;

  // ================= PAYMENT =================
  const handlePayment = async () => {
    if (!bookingId || amount <= 0) {
      notify.error("Invalid booking");
      return;
    }

    try {
      setProcessing(true);

      // 1️⃣ Load Razorpay SDK
      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        notify.error("Razorpay SDK failed to load");
        return;
      }

      // 2️⃣ Create Payment Order from backend
      const res = await dispatch(
        initiatePayment({
          bookingId,
          amount,
          method: "UPI",
        })
      ).unwrap();

      const paymentData = res?.data ?? res;

      if (!paymentData?.razorpayOrderId) {
        throw new Error("Order creation failed");
      }

      // 3️⃣ Open Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,

        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Movie Booking App",
        description: `${booking?.seatIds?.length || 0} seats`,

        order_id: paymentData.razorpayOrderId,

        handler: async function (response) {

  try {
    // 1️⃣ VERIFY PAYMENT
    await dispatch(
      verifyPayment({
        bookingId,
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      })
    ).unwrap();

  } catch (err) {
    notify.error("Payment verification failed");
    return;
  }

  try {
    // 2️⃣ CONFIRM BOOKING
    await dispatch(
      confirmBookingPayment({
        id: bookingId,
        paymentId: response.razorpay_payment_id,
      })
    ).unwrap();
  } catch (err) {
    console.error("Booking confirm failed", err);
  }

  try {
    // 3️⃣ CONFIRM SEATS (optional safety)
    if (booking?.seatIds?.length) {
      await dispatch(confirmSeats(booking.seatIds)).unwrap();
    }
  } catch (err) {
    console.warn("Seats already confirmed or failed", err);
  }

  // ✅ SUCCESS ALWAYS AFTER PAYMENT VERIFIED
  notify.success("Payment successful 🎉");
  navigate("/bookings");
},


        prefill: {
          name: "Movie User",
          email: "user@example.com",
        },

        theme: {
          color: "#0d6efd",
        },

        modal: {
          ondismiss: () => {
            notify.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      notify.error(err?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  // ================= UI =================
  if (!bookingId) {
    return <div className="text-center mt-5">Invalid URL</div>;
  }

  if (bookingLoading) {
    return <div className="text-center mt-5">Loading booking...</div>;
  }

  if (!booking) {
    return <div className="text-center mt-5">Booking not found</div>;
  }

  if (booking.status === "EXPIRED") {
    return (
      <div className="text-center mt-5 text-danger">
        ❌ Booking expired. Please book again.
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">

        {/* LEFT */}
        <div className="col-lg-6">
          <div className="card p-4 shadow-sm">
            <h5>🎟 Booking Details</h5>

            <p><strong>ID:</strong> {booking.id}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Seats:</strong> {booking.seatIds?.join(", ")}</p>

            <h4 className="text-success">₹{amount}</h4>
          </div>

          <div className="card p-4 mt-3 shadow-sm">
            <h6>Payment Status</h6>

            {paymentLoading && <p>Loading...</p>}

            {payment ? (
              <>
                <p>ID: {payment.id}</p>
                <p>Status: {payment.status}</p>
              </>
            ) : (
              <p>No payment yet</p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-6">
          <div className="card p-4 shadow-sm text-center">

            <h4>💳 Complete Payment</h4>

            <h2 className="text-primary">₹{amount}</h2>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handlePayment}
              disabled={processing || amount <= 0}
            >
              {processing ? "Processing..." : "Pay Now"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;

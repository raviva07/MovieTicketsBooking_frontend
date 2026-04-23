import React, { useState } from "react";

const PaymentForm = ({ amount = 0, onInitiate, onVerify }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    setLoading(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Initiate payment
      const res = await onInitiate({
        amount,
        currency: "INR",
        method: "RAZORPAY",
      });

      const data = res?.data ?? res;

      const options = {
        key: "rzp_test_YOUR_KEY", // 🔥 replace
        amount: data.amount,
        currency: data.currency,
        name: "🎬 Movie Booking",
        description: "Ticket Payment",
        order_id: data.razorpayOrderId,

        handler: async function (response) {
          try {
            // 2️⃣ Verify payment
            await onVerify({
              amount,
              method: "RAZORPAY",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            alert("Payment successful 🎉");
          } catch (err) {
            alert("Verification failed");
          }
        },

        prefill: {
          name: "User",
        },

        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err?.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <div className="card shadow-lg border-0 p-4">
      <h5 className="mb-3 text-center">💳 Secure Payment</h5>

      <div className="text-center mb-4">
        <h2 className="fw-bold text-success">₹{amount}</h2>
      </div>

      <button
        className="btn btn-primary w-100 py-2 fw-bold"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentForm;

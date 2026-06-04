import { useState, useEffect } from "react";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useLocation } from "../../context/LocationContext";
import LocationModal from "../../components/LocatioModal";

export default function OrderSummary({ setCartItems }) {

  const navigate = useNavigate();

  

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [progress, setProgress] = useState(0);


  const { location } = useLocation();

  const routerLocation = useRouterLocation();
  const state = routerLocation.state || {};

  const cartItems = state.cartItems || [];
  const totalDistance = state.totalDistance || 0;

  // ✅ DELIVERY FEE IN STATE (FOR DB)
  const [deliveryFee, setDeliveryFee] = useState(state.deliveryFee || 0);

  // ========================
  // PAYMENT MODAL STATE
  // ========================
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [timer, setTimer] = useState(180); // 3 mins fake timer

  useEffect(() => {
    let interval;

    if (showPaymentModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showPaymentModal, timer]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ========================
  // DELIVERY TIME
  // ========================
  const getDeliveryTime = (distanceKm = 0) => {
    if (distanceKm <= 2) return "15–25 mins";
    if (distanceKm <= 5) return "25–40 mins";
    if (distanceKm <= 10) return "40–60 mins";
    return "60+ mins";
  };

  const deliveryTime = getDeliveryTime(totalDistance);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
const [paymentSuccess, setPaymentSuccess] = useState(false);
const [loadingProgress, setLoadingProgress] = useState(0);

  // ========================
  // CALCULATIONS
  // ========================
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  // ========================
  // PLACE ORDER (opens modal)
  // ========================
  const handlePlaceOrder = async () => {
    if (!auth.currentUser) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    setShowPaymentModal(true);
    setTimer(180);
  };

  // ========================
  // CONFIRM PAYMENT
  // ========================
  const confirmPayment = async () => {

    try {
  
      setIsProcessingPayment(true);
  
      // =====================================
      // FAKE LOADING ANIMATION
      // =====================================
  
      let progress = 0;
  
      const interval = setInterval(() => {
  
        progress += Math.random() * 12;
        if (progress >= 100) {
          progress = 100;
        }
  
        setLoadingProgress(progress);
  
      }, 700);
  
      // 10 SECOND CINEMATIC WAIT
      await new Promise((resolve) =>
        setTimeout(resolve, 10000)
      );
  
      clearInterval(interval);
  
      // =====================================
      // FIREBASE ORDER
      // =====================================
  
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      const userData = userSnap.data();
  
      const orderData = {
        userId: auth.currentUser.uid,
        customerName: userData?.name,
        customerEmail: userData?.email,
        deliveryAddress: userData?.location || "Not set yet",
        items: cartItems,
        subtotal,
        deliveryFee,
        discount,
        totalAmount: total,
        orderStatus: "pending",
        paymentStatus: "unsettled",
        createdAt: serverTimestamp(),
        orderTime: new Date().toISOString(),
      };
      await addDoc(collection(db, "orders"), orderData);

      if (setCartItems) {
        setCartItems([]);
      }
  
      // =====================================
      // SUCCESS SCREEN
      // =====================================
  
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
  
      // REDIRECT AFTER SUCCESS ANIMATION
      setTimeout(() => {
  
        setShowPaymentModal(false);
        setPaymentSuccess(false);
  
        navigate("/");

      }, 5000);

    } catch (err) {
  
      console.log(err);
  
      setIsProcessingPayment(false);
  
      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white font-montserrat relative pb-28">

      {/* HEADER */}
      <div className="relative bg-[#111] px-6 pt-10 pb-8 border-b border-white/5">
        <h1 className="text-2xl font-semibold text-center font-bric">
          Order Summary
        </h1>
        <p className="text-center text-white/40 text-sm mt-1">
          Review your order before checkout
        </p>
      </div>

      <div className="px-5 lg:px-[400px] mt-6 space-y-6">

        {/* ITEMS */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-3">Items</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-white/5 py-2">
              <div>
                <p>{item.name}</p>
                <p className="text-white/40 text-sm">
                  {item.quantity} × ₦{item.price}
                </p>
              </div>
              <p className="text-orange-400">
                ₦{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* PRICING */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₦{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₦{deliveryFee}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>₦{discount}</span>
          </div>

          <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-orange-500">₦{total}</span>
          </div>
        </div>

        {/* DELIVERY */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
          <p className="text-white/50">Your Address</p>
          <p className="text-sm text-white/70">
            {location?.display_name || "No location found"}
          </p>

          <p className="mt-3 text-white/50 text-sm">
            ETA: {deliveryTime}
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0b0b0b] border-t border-white/5 p-4">
        <button
          onClick={handlePlaceOrder}
          className="w-full py-4 rounded-2xl bg-orange-500 font-semibold"
        >
          Place Order • ₦{total}
        </button>
      </div>

      {/* ================= PAYMENT MODAL ================= */}

      
      {showPaymentModal && (

<div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-[9999] p-3 md:p-6 overflow-hidden">

  {/* BACKGROUND GLOW */}
  <div className="absolute w-[600px] h-[600px] bg-orange-500/20 blur-[180px] rounded-full animate-pulse"></div>

  {/* CARD */}
  <div className="relative w-full max-w-md max-h-[95vh] bg-[#0d0d0d]/95 border border-white/10 rounded-[38px] overflow-hidden shadow-[0_0_100px_rgba(255,115,0,0.15)] flex flex-col">

    {/* ===================================== */}
    {/* SUCCESS SCREEN */}
    {/* ===================================== */}

    {paymentSuccess ? (

      <div className="relative px-8 py-16 flex flex-col items-center justify-center text-center overflow-hidden">

        {/* SUCCESS GLOW */}
        <div className="absolute w-[300px] h-[300px] bg-green-500/20 blur-[120px] rounded-full animate-pulse"></div>

        {/* SUCCESS RINGS */}
        <div className="relative flex items-center justify-center mb-8">

          <div className="absolute w-40 h-40 border border-green-500/20 rounded-full animate-ping"></div>

          <div className="absolute w-32 h-32 border border-green-400/20 rounded-full animate-pulse"></div>

          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.6)] animate-bounce">

            <i className="fa-solid fa-check text-4xl text-white"></i>

          </div>

        </div>

        <h2 className="text-3xl font-bold font-bric tracking-tight">
          Payment Confirmed
        </h2>

        <p className="text-white/50 mt-3 leading-relaxed max-w-[280px]">
          Your order has been received and is now being processed.
        </p>

        {/* FLOATING PARTICLES */}
        <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-green-400 animate-bounce"></div>
        <div className="absolute top-24 right-16 w-2 h-2 rounded-full bg-orange-400 animate-ping"></div>
        <div className="absolute bottom-16 left-20 w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
        <div className="absolute bottom-24 right-10 w-4 h-4 rounded-full bg-orange-500 animate-bounce"></div>

        {/* LOADING LINE */}
        <div className="w-full mt-10">

          <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">

            <div className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-300 animate-[successload_5s_linear_forwards]"></div>

          </div>

          <p className="text-white/40 text-xs mt-3">
            Redirecting to homepage...
          </p>

        </div>

      </div>

    ) : (

      <>

        {/* HEADER */}
        <div className="px-5 pt-3 pb-2 border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-transparent">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-semibold font-bric">
                Complete Payment
              </h2>

              <p className="text-white/45 text-sm mt-1">
                Secure bank transfer checkout
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(255,115,0,0.15)]">
              <i className="fa-solid fa-shield-halved text-orange-400 text-xl"></i>
            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="py-2 px-5 md:px-6 md:py-2 space-y-4 overflow-y-auto scrollbar-hide">

          {/* BANK CARD */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1b1b1b] to-[#111111] px-5 py-3 shadow-2xl">

            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 blur-[100px]"></div>

            <div className="flex items-center justify-between mb-2">

              <div>
                <p className="text-white/40 text-xs uppercase tracking-[0.3em]">
                  Bank Name
                </p>

                <h3 className="text-lg font-semibold mt-1">
                  Opay
                </h3>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(255,115,0,0.4)]">
                <i className="fa-solid fa-building-columns text-white text-medium"></i>
              </div>

            </div>

            <div className="space-y-2">

              <div>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">
                Account Number
                </p>

                <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-2xl px-4 py-2">
                  <span className="text-lg tracking-[0.3em] font-semibold">
                    8086267740
                  </span>

                  <button className="w-7 h-7 rounded-full bg-orange-500/20 hover:bg-orange-500 transition-all duration-300 flex items-center justify-center">
                    <i className="fa-regular fa-copy text-orange-300 text-sm"></i>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">
                  Account Name
                </p>

                <div className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 text-lg">
                Ukpe Victor Ukpono
                </div>
              </div>

            </div>

          </div>

          {/* TIMER */}
          <div className="bg-[#141414] border border-white/5 rounded-[28px] px-5 py-3 text-center">

            <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">
              Session Expires In
            </p>

            <div className="text-xl md:text-2xl font-bold font-bric text-orange-400 tracking-tight animate-pulse">
              {formatTime(timer)}
            </div>

          </div>

          {/* TOTAL */}
          <div className="bg-[#141414] border border-white/5 rounded-[28px] px-5 py-2">

            <div className="flex items-center justify-between text-white/50 text-sm mb-0">
              <span>Amount To Pay</span>
              <span>NGN</span>
            </div>

            <div className="text-lg md:text-2xl font-bold font-bric text-white tracking-tight">
              ₦{total}
            </div>

          </div>

          {/* PROCESSING */}
          {isProcessingPayment && (

            <div className="space-y-2">

              <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">

                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 transition-all duration-700 shadow-[0_0_40px_rgba(255,115,0,0.7)]"
                  style={{
                    width: `${loadingProgress}%`,
                  }}
                >

                  <div className="absolute right-0 top-0 h-full w-12 bg-white/30 blur-md"></div>

                </div>

              </div>

              <div className="flex items-center justify-center gap-3 text-orange-300 text-sm">

                <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>

                Verifying payment securely...

              </div>

            </div>
          )}

          {/* BUTTONS */}
          {!isProcessingPayment && (

            <div className="space-y-3 pt-2">

              <button
                onClick={confirmPayment}
                className="relative overflow-hidden group w-full py-5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 font-semibold text-lg shadow-[0_0_50px_rgba(255,115,0,0.35)]"
              >

                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute -left-20 top-0 w-20 h-full bg-white/30 skew-x-[30deg] group-hover:left-[120%] transition-all duration-1000"></div>

                <span className="relative flex items-center justify-center gap-3">
                  <i className="fa-solid fa-circle-check"></i>
                  I've Made Payment
                </span>

              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-white/60"
              >
                Cancel Payment
              </button>

            </div>

          )}

        </div>

      </>

    )}

  </div>

</div>
)}

    </div>
  );
}
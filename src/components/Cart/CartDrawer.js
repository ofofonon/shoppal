import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useLocation } from "../../context/LocationContext";


import LocationModal from "../LocatioModal";
import PhoneModal from "../PhoneModal";

export default function CartDrawer({
  isOpen,
  setIsOpen,
  cartItems = [],
  increaseQty,
  decreaseQty,
  removeItem,
}) {
  const navigate = useNavigate();

const [userData, setUserData] = useState(null);
const [isCalculating, setIsCalculating] = useState(false);
const [showLocationModal, setShowLocationModal] = useState(false);
const [showPhoneModal, setShowPhoneModal] = useState(false);

// =========================
// USER LOCATION FROM CONTEXT
// =========================
const { location: userLocation } = useLocation();


// =========================
// GROUP BY VENDOR
// =========================
const groupByVendor = (items) => {
  return items.reduce((acc, item) => {
    const vendorId = item.vendorId;

    if (!vendorId) return acc; // safety check

    if (!acc[vendorId]) acc[vendorId] = [];

    acc[vendorId].push(item);

    return acc;
  }, {});
};


// =========================
// DISTANCE (HAVERSINE)
// =========================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};


// =========================
// GET VENDOR LOCATION (FIREBASE)
// =========================
const getVendorLocation = async (vendorId) => {
  const ref = doc(db, "users", vendorId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data().location;
};


// =========================
// DELIVERY FEE CALCULATION
// =========================
const calculateDeliveryFee = async (userLocation, cartItems) => {
  if (!userLocation) return 0;

  const grouped = groupByVendor(cartItems);

  let totalFee = 0;

  for (const vendorId in grouped) {
    const vendorLocation = await getVendorLocation(vendorId);

    if (!vendorLocation) continue;

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      vendorLocation.lat,
      vendorLocation.lng
    ).toFixed(1);

    // BASE RULE
    const baseFee = 500;
    const perKm = 250;

    const fee = baseFee + distance * perKm;

    totalFee += fee;
  }

  return totalFee;
};


// =========================
// FETCH USER DATA
// =========================
useEffect(() => {
  const fetchUser = async () => {
    if (!auth.currentUser) return;

    const ref = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setUserData(snap.data());
    }
  };

  fetchUser();
}, []);


// =========================
// SAVE LOCATION
// =========================
const saveLocation = async (location) => {
  localStorage.setItem("userLocation", JSON.stringify(location));

  setShowLocationModal(false);

  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    location,
  });

  setUserData((prev) => ({
    ...prev,
    location,
  }));
};


// =========================
// SAVE PHONE
// =========================
const savePhone = async (phone) => {
  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    phone,
  });

  setUserData((prev) => ({
    ...prev,
    phone,
  }));

  setShowPhoneModal(false);
};


const { location } = useLocation();
// =========================
// CHECKOUT
// =========================
const handleCheckout = async () => {
  setIsOpen(false);

  if (!auth.currentUser) {
    navigate("/login");
    return;
  }

  if (!location?.lat || !location?.lng) {
    setShowLocationModal(true);
    return;
  }

  if (!userData?.phone) {
    setShowPhoneModal(true);
    return;
  }

  try {
    setIsCalculating(true); // 👈 start loader

    const fee = await calculateDeliveryFee(userLocation, cartItems);

    navigate("/order-summary", {
      state: {
        cartItems,
        deliveryFee: fee,
        subtotal,
      },
    });

  } finally {
    setIsCalculating(false); // 👈 always stop loader
  }
};


// =========================
// SUBTOTAL
// =========================
const subtotal = cartItems.reduce(
  (acc, item) => acc + item.price * item.quantity,
  0
);

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-md z-[90] transition-all duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* DRAWER */}
      <div
        className={`fixed z-[100] bg-[#0b0b0b] border-l border-white/10 shadow-2xl transition-all duration-500 flex flex-col
        w-full h-[88vh] bottom-0 left-0 rounded-t-[34px]
        md:w-[430px] md:h-screen md:top-0 md:right-0 md:left-auto md:rounded-none
        ${
          isOpen
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
      >


      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between thin-scrollbar">
        <div> 
          <h2 className="text-2xl font-semibold text-white font-bric"> Cart </h2> 
          <p className="text-sm text-white/40 mt-1 font-montserrat"> {cartItems.length} item(s) </p> 
          </div> 
          <button onClick={() => setIsOpen(false)} className="w-11 h-11 rounded-full bg-white/5 hover:bg-orange-500 transition-all duration-300 flex items-center justify-center" > <i className="fa-solid fa-xmark text-lg text-white"></i> 
          </button> 

          </div>
        {/* CONTENT (UNCHANGED) */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 thin-scrollbar">

  {
    cartItems.length === 0 ? (

      <div className="h-full flex flex-col items-center justify-center text-center">

        <div className="w-24 h-24 rounded-full bg-orange-500/10 flex items-center justify-center mb-5">
          <i className="fa-solid fa-bag-shopping text-3xl text-orange-500"></i>
        </div>

        <h3 className="text-xl font-semibold font-bric text-white">
          Your cart is empty
        </h3>

        <p className="text-white/40 mt-2 text-sm max-w-[250px] font-montserrat">
          Add delicious items and they’ll appear here.
        </p>

      </div>

    ) : (

      cartItems.map((item) => (

        <div
          key={item.id}
          className="bg-[#111111] border border-white/5 rounded-[28px] p-3 flex gap-4"
        >

          {/* IMAGE */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 shrink-0">

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />

          </div>

          {/* INFO */}
          <div className="flex-1 flex flex-col justify-between">

            <div>

              <h3 className="font-medium text-white text-base line-clamp-1 font-bric">
                {item.name}
              </h3>

              <p className="text-white/40 text-sm mt-1 font-montserrat">
                ₦{item.price}
              </p>

            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-between mt-3">

              <div className="flex items-center gap-2">

                <button
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-orange-500 transition-all duration-300 text-white"
                  onClick={() => decreaseQty(item.id)}
                >
                  <i className="fa-solid fa-minus text-sm"></i>
                </button>

                <span className="text-sm w-5 text-center text-white">
                  {item.quantity}
                </span>

                <button
                  className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white"
                  onClick={() => increaseQty(item.id)}
                >
                  <i className="fa-solid fa-plus text-sm"></i>
                </button>

              </div>

              <button
                className="text-red-400 text-sm hover:text-red-300 transition-all mt-[-30%]"
                onClick={() => removeItem(item.id)}
              >
                <i class="fa-solid fa-trash-can text-lg "></i>
              </button>

            </div>

          </div>

        </div>

      ))

    )
  }

</div>

        {/* FOOTER */}
        <div className="border-t border-white/5 p-5 bg-[#0b0b0b]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/50 font-montserrat">
              Subtotal
            </span>

            <span className="text-xl font-semibold text-white font-bric">
              ₦{subtotal}
            </span>
          </div>

          <button
          onClick={handleCheckout}
          disabled={isCalculating}
          className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 transition-all duration-300 font-semibold text-white font-montserrat flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isCalculating ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Calculating route...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </button>
        </div>
      </div>

      {/* ========================= */}
      {/* LOCATION MODAL */}
      {/* ========================= */}
      {showLocationModal && (
        <LocationModal
          closeModal={() => setShowLocationModal(false)}
          saveLocation={saveLocation}
        />
      )}

      {/* ========================= */}
      {/* PHONE MODAL (NEW) */}
      {/* ========================= */}
      {showPhoneModal && (
        <PhoneModal
          closeModal={() => setShowPhoneModal(false)}
          savePhone={savePhone}
        />
      )}
    </>
  );
}
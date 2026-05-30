import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, query } from "firebase/firestore";
import { productMap } from "../../data/products";
import { shops } from "../../data/shops/index";
import { useLocation } from "../../context/LocationContext";
import LocationModal from "../../components/LocatioModal";


import shopBg from "../../Assets/images/shop-banner.jpg";
import financeImg from "../../Assets/images/freepik_br_4503ced2-2ede-4941-8a6c-003101179a27.png";
import ordersImg from "../../logos/grocery.avif";

export default function VendorProfile() {

  const [showLocationModal, setShowLocationModal] = useState(false);
  
  const { location, saveLocation } = useLocation();

  const allProducts = Object.values(productMap).flat();
  const vendorShop = shops.find(
    (shop) => shop.vendorId === auth.currentUser?.uid
  );

  const vendorProducts = allProducts.filter(
    (p) => p.vendorId === auth.currentUser.uid
  );

  const [userData, setUserData] = useState(null);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const navigate = useNavigate();

  

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return;
  
      const vendorId = auth.currentUser.uid;
  
      // ========================
      // 1. PRODUCTS COUNT
      // ========================
      const allProducts = Object.values(productMap).flat();

      const vendorProducts = allProducts.filter(
        (p) => p.vendorId === vendorId
      );
  
      // ========================
      // 2. ORDERS + REVENUE
      // ========================
      const ordersSnap = await getDocs(
        collection(db, "orders")
      );
  
      let orderCount = 0;
      let revenue = 0;
  
      ordersSnap.forEach((doc) => {
        const order = doc.data();
  
        const vendorItems = (order.items || []).filter(
          (item) => item.vendorId === vendorId
        );
  
        if (vendorItems.length > 0) {
          orderCount += 1;
  
          vendorItems.forEach((item) => {
            revenue += item.price * item.quantity;
          });
        }
      });
  
      setStats({
        products: vendorProducts.length,
        orders: orderCount,
        revenue,
      });
    };
  
    fetchStats();
  }, []);

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

  const initial =
    userData?.name?.charAt(0)?.toUpperCase() || "V";

  return (
    <>
    <div className="min-h-screen bg-[#111111] text-white relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0">

        <div className="absolute w-[500px] h-[500px] bg-orange-500/10 blur-[120px] top-[-120px] left-[-120px]" />

        <div className="absolute w-[400px] h-[400px] bg-orange-500/5 blur-[120px] bottom-[-120px] right-[-120px]" />

      </div>

      <div className="relative max-w-4xl mx-auto px-5 py-10">

        {/* 🧑 HERO */}
        <div className="flex flex-col items-center text-center">

          <div className="relative">

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-3xl font-bold shadow-lg shadow-orange-500/20">
              {initial}
            </div>

            <div className="absolute inset-0 rounded-full blur-2xl bg-orange-500/20 -z-10" />

          </div>

          <h1 className="text-2xl mt-4 font-semibold">
            {userData?.name || "Loading..."}
          </h1>

          <p className="text-white/50 text-sm font-montserrat">
            {userData?.email}
          </p>

          <p className="text-orange-400/70 text-xs font-mono mt-1 break-all">
          Vendor ID: {auth.currentUser?.uid}
        </p>

        </div>

        {/* 🏪 OPEN SHOP */}
        <div
          onClick={() => {
            if (userData?.shopConnected) {
              navigate(`/shop/${vendorShop.slug}`);
            } else {
              navigate("/plans");
            }
          }}
          className="relative mt-8 h-[180px] rounded-3xl overflow-hidden cursor-pointer group"
        >

          <img
            src={shopBg}
            alt="shop"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/40 to-transparent" />

          <div className="absolute bottom-6 left-6">

          <h2 className="text-3xl font-bold">
          {userData?.shopConnected
            ? "View Shop"
            : "Choose a Plan"}
        </h2>

        <p className="text-white/70 font-montserrat">
          {userData?.shopConnected
            ? "Manage your storefront"
            : "Activate your shop on Shoppal"}
        </p>

          </div>

        </div>

        {/* 📊 DASHBOARD */}
        <div className="mt-6 grid grid-cols-3 gap-4">

          {/* PRODUCTS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">

            <div className="text-white/40 text-sm font-montserrat">
              Products
            </div>

            <div className="md:text-3xl text-md font-bold mt-2">
            {stats.products}
            </div>

          </div>

          {/* ORDERS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">

            <div className="text-white/40 text-sm font-montserrat">
              Orders 
            </div>

            <div className="md:text-3xl text-md  font-bold mt-2">
            {stats.orders}
            </div>

          </div>

          {/* REVENUE */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">

            <div className="text-white/40 text-sm font-montserrat">
              Revenue
            </div>

            <div className="md:text-3xl text-md  font-bold mt-2">
             ₦{stats.revenue.toLocaleString()}
            </div>

          </div>

        </div>

        {/* ⚡ ACTIONS */}
        <div className="mt-8 grid grid-cols-2 gap-10">

          {/* MANAGE ORDERS */}
          <div
            onClick={() => navigate("/vendor-orders")}
            className="p-1 md:py-5 py-2 rounded-2xl bg-orange-500 border border-orange-500/20 hover:bg-orange-600 transition cursor-pointer"
          >

            <img
              src={ordersImg}
              alt="orders"
              className="md:w-[35%] w-[80%] md:ml-[32.5%] ml-[10%]"
            />

            <div className="md:text-xl text-base font-semibold font-montserrat text-center leading-[15px]">
              Orders & Finance
            </div>

          </div>

          {/* FINANCES */}
          <div
            onClick={() => navigate("/settings")}
            className="p-1 py-5 py-2 rounded-2xl bg-orange-500 border border-orange-500/20 hover:bg-orange-600 transition cursor-pointer"
          >

            <img
              src={financeImg}
              alt="finance"
              className="md:w-[35%] w-[80%] md:ml-[32.5%] ml-[10%]"
            />

            <div className="md:text-xl text-base font-semibold font-montserrat text-center">
              Settings
            </div>

          </div>

        </div>

        {/* 📍 LOCATION */}
        <button
        onClick={() => setShowLocationModal(true)}
        className="relative md:w-full w-full mt-3 border rounded-2xl py-3 bg-white text-[#111] text-start font-montserrat flex items-center"
      >
        <i className="fa-solid fa-location-dot text-orange-600 pl-10 pr-4"></i>

        <span className="truncate max-w-[500px]">
          {location?.display_name
            ? location.display_name.slice(0, 50) + "..."
            : "Select Your Address"}
        </span>
      </button>

        

        {/* ❓ FAQ */}
        <div
          onClick={() => navigate("/faq")}
          className="bg-orange-500 mt-4 p-5 rounded-2xl border border-white/10 hover:border-orange-500/30 transition cursor-pointer flex items-center justify-between"
        >

          <div>

            <div className="font-medium font-montserrat">
              <i className="fa-solid fa-circle-question"></i> FAQ
            </div>

            <div className="text-white/40 text-sm font-montserrat">
              Help & common questions
            </div>

          </div>

          <span className="text-white/40">
            <i className="fa-solid fa-angle-right"></i>
          </span>

        </div>
            
        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-montserrat"
        >
          Logout
        </button>

      </div>
    </div>

    {
                  showLocationModal && (

                    <LocationModal
                      closeModal={() => setShowLocationModal(false)}
                      saveLocation={saveLocation}
                    />

                  )
                }
    </>
  );
}
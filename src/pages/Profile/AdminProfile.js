import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { productMap } from "../../data/products";

import ordersImg from "../../logos/grocery.avif";
import financeImg from "../../Assets/images/freepik_br_4503ced2-2ede-4941-8a6c-003101179a27.png";

export default function AdminProfile() {

  const allProducts = Object.values(productMap).flat();
  const totalProducts = allProducts.length;

 
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const adminName =
    auth.currentUser?.displayName ||
    auth.currentUser?.email?.charAt(0)?.toUpperCase() ||
    "A";

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const usersSnap =
          await getDocs(collection(db, "users"));

        const productsSnap =
          await getDocs(collection(db, "products"));

        const ordersSnap =
          await getDocs(collection(db, "orders"));

        let vendorCount = 0;
        let revenue = 0;

        usersSnap.forEach((doc) => {

          const data = doc.data();

          if (data.role === "vendor") {
            vendorCount++;
          }

        });

        ordersSnap.forEach((doc) => {

          const data = doc.data();

          const items = data.items || [];

          items.forEach((item) => {
            revenue += (item.price || 0) * (item.quantity || 0);
          });

        });

        setStats({
          users: usersSnap.size,
          vendors: vendorCount,
          products: totalProducts,
          orders: ordersSnap.size,
          revenue,
        });

      } catch (error) {
        console.log(error);
      }

    };

    fetchStats();

  }, []);

  return (

    <div className="min-h-screen bg-[#111111] text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">

        <div className="absolute w-[500px] h-[500px] bg-orange-500/10 blur-[120px] top-[-120px] left-[-120px]" />

        <div className="absolute w-[400px] h-[400px] bg-orange-500/5 blur-[120px] bottom-[-120px] right-[-120px]" />

      </div>

      <div className="relative max-w-5xl mx-auto px-5 py-10">

        {/* HERO */}
        <div className="flex flex-col items-center text-center">

          <div className="relative">

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-3xl font-bold shadow-lg shadow-orange-500/20">
              {adminName}
            </div>

            <div className="absolute inset-0 rounded-full blur-2xl bg-orange-500/20 -z-10" />

          </div>

          <h1 className="text-2xl mt-4 font-semibold">
            Admin Dashboard
          </h1>

          <p className="text-white/50 text-sm font-montserrat">
            {auth.currentUser?.email}
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-10">

          {/* USERS */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">

            <div className="text-white/40 text-sm font-montserrat">
              Users
            </div>

            <div className="text-3xl font-bold mt-3">
              {stats.users}
            </div>

          </div>


          <div className="rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">

          <div className="text-white/40 text-sm font-montserrat">
            Shops
          </div>

          <div className="text-3xl font-bold mt-3">
            3
          </div>

          </div>

          {/* VENDORS */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">

            <div className="text-white/40 text-sm font-montserrat">
              Vendors
            </div>

            <div className="text-3xl font-bold mt-3">
              {stats.vendors}
            </div>

          </div>

          {/* PRODUCTS */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">

            <div className="text-white/40 text-sm font-montserrat">
              Products
            </div>

            <div className="text-3xl font-bold mt-3">
              {stats.products}
            </div>

          </div>

          {/* ORDERS */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">

            <div className="text-white/40 text-sm font-montserrat">
              Orders
            </div>

            <div className="text-3xl font-bold mt-3">
              {stats.orders}
            </div>

          </div>

          {/* REVENUE */}
          <div className="rounded-3xl bg-orange-500 p-5 shadow-xl shadow-orange-500/20">

            <div className="text-sm font-montserrat text-white/80">
              Revenue
            </div>

            <div className="text-3xl font-bold mt-3">
            ₦{stats.revenue}
            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8 grid grid-cols-2 gap-6">

          {/* MANAGE ORDERS */}
          <div
            onClick={() => navigate("/admin-orders")}
            className="p-5 rounded-3xl bg-orange-500 border border-orange-500/20 cursor-pointer hover:scale-[1.02] transition"
          >

            <img
              src={ordersImg}
              alt=""
              className="w-[35%] mx-auto"
            />

            <div className="text-center text-xl font-semibold mt-2 font-montserrat">
              Orders & Finance
            </div>

          </div>

          {/* FINANCES */}
          <div
            onClick={() => navigate("/admin-shops")}
            className="p-5 rounded-3xl bg-orange-500 border border-orange-500/20 cursor-pointer hover:scale-[1.02] transition"
          >

            <img
              src={financeImg}
              alt=""
              className="w-[35%] mx-auto"
            />

            <div className="text-center text-xl font-semibold mt-2 font-montserrat">
              Shops
            </div>

          </div>

        </div>


        {/* USERS */}
    <div
          onClick={() => navigate("/admin-users")}
          className="bg-white/5 mt-6 p-5 rounded-3xl border border-white/10 hover:border-orange-500/30 transition cursor-pointer flex items-center justify-between backdrop-blur-xl"
        >

          <div>

            <div className="font-semibold font-montserrat text-lg">
              Users
            </div>

            <div className="text-white/40 text-sm font-montserrat">
              Manage all registered users
            </div>

          </div>

          <span className="text-white/40 text-xl">
            <i className="fa-solid fa-angle-right"></i>
          </span>

        </div>



        {/* VENDORS */}
        <div
          onClick={() => navigate("/admin-vendors")}
          className="bg-white/5 mt-6 p-5 rounded-3xl border border-white/10 hover:border-orange-500/30 transition cursor-pointer flex items-center justify-between backdrop-blur-xl"
        >

          <div>

            <div className="font-semibold font-montserrat text-lg">
              Vendors
            </div>

            <div className="text-white/40 text-sm font-montserrat">
              Manage all registered vendors
            </div>

          </div>

          <span className="text-white/40 text-xl">
            <i className="fa-solid fa-angle-right"></i>
          </span>

        </div>


    
      
    


        {/* SETTINGS */}
        <div
          onClick={() => navigate("/settings")}
          className="bg-white/5 mt-4 p-5 rounded-3xl border border-white/10 hover:border-orange-500/30 transition cursor-pointer flex items-center justify-between backdrop-blur-xl"
        >

          <div>

            <div className="font-semibold font-montserrat text-lg">
              Settings
            </div>

            <div className="text-white/40 text-sm font-montserrat">
              Manage admin preferences
            </div>

          </div>

          <span className="text-white/40 text-xl">
            <i className="fa-solid fa-angle-right"></i>
          </span>

        </div>

        {/* FAQ */}
        <div
          onClick={() => navigate("/faq")}
          className="bg-orange-500 mt-4 p-5 rounded-3xl border border-orange-500/20 transition cursor-pointer flex items-center justify-between"
        >

          <div>

            <div className="font-medium font-montserrat">
              <i className="fa-solid fa-circle-question mr-2"></i>
              FAQ
            </div>

            <div className="text-white/70 text-sm font-montserrat">
              Help & support
            </div>

          </div>

          <span className="text-white text-xl">
            <i className="fa-solid fa-angle-right"></i>
          </span>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-montserrat"
        >
          Logout
        </button>

      </div>

    </div>

  );

}
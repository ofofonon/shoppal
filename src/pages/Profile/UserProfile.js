import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Becomeamerchant from "../../components/cards/becomeamerchant"
import food4 from "../../logos/grocery.avif"
import gear from "../../Assets/images/freepik_br_4503ced2-2ede-4941-8a6c-003101179a27.png"
import { signOut } from "firebase/auth";
import { useLocation } from "../../context/LocationContext";
import LocationModal from "../../components/LocatioModal";



export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const { location, saveLocation } = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

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

  const initial = userData?.name?.charAt(0)?.toUpperCase() || "U";

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
        </div>

        {/* ⚡ QUICK ACTIONS (REPLACED SECTION) */}
        <div className="mt-8 grid grid-cols-2 gap-10">

          {/* ORDERS */}
          <div
            onClick={() => navigate("/user-orders")}
            className="p-1 py-5 rounded-2xl bg-orange-500 border border-orange-500/20 hover:bg-orange-500/20 transition cursor-pointer"
          >
             <img src={food4} alt="food" className="w-[35%] ml-[32.5%]" />
            <div className="text-xl font-semibold font-montserrat text-center">Orders</div>
           
          </div>



          {/* SETTINGS */}
          <div
            onClick={() => navigate("/settings")}
            className="p-1 py-5 rounded-2xl bg-orange-500 border border-orange-500/20 hover:bg-orange-500/20 transition cursor-pointer"
          >
            <img src={gear} alt="food" className="w-[35%] ml-[32.5%]" />
            <div className="text-xl font-semibold font-montserrat text-center">Settings</div>
            
          </div>

        </div>

        {/* 📍 LOCATION */}
        <button
            onClick={() => setShowLocationModal(true)}
            className="relative md:w-[100%] w-[100%]  border border-[1px] rounded-2xl py-3 md:py-5 text-sm md:text-lg bg-white text-[#111111] text-start font-montserrat mt-4 flex"
          >
          
             <i className="fa-solid fa-location-dot text-orange-600 md:text-[26px] text-md pr-4 md:pl-10 pl-10"></i>

            
            <span className="max-w-[500px] truncate">
            {location?.display_name
              ? location.display_name.slice(0, 50) + "..."
              : "Enter Your Location"}
            </span>

            <i className="fa-solid fa-angle-right cursor-pointer md:text-[20px] text-sm  ml-auto mr-3"></i>
            
          </button> 

        {/* ❓ FAQ (REPLACED OLD SETTINGS AREA) */}
        <div
          onClick={() => navigate("/faq")}
          className="bg-orange-500 mt-4 p-5 rounded-2xl  border border-white/10 hover:border-orange-500/30 transition cursor-pointer flex items-center justify-between "
        >
          <div>
            <div className="font-medium font-montserrat"><i class="fa-solid fa-circle-question"></i> FAQ</div>
            <div className="text-white/40 text-sm font-montserrat">
              Help & common questions
            </div>
          </div>

          <span className="text-white/40"><i class="fa-solid fa-angle-right"></i></span>
        </div>

        {/* 🚪 LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-montserrat"
        >
          Logout
        </button>

      </div>

      <div className="mt-[10px] relative">
  <Becomeamerchant />
  </div>
    </div>

    {
                  showLocationModal && (

                    <LocationModal
                      closeModal={() =>
                        setShowLocationModal(false)
                      }
                      saveLocation={saveLocation}
                    />

                  )
                }

    </>
  );
}
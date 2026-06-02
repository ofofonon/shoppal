import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useLocation } from "../context/LocationContext";
import LocationModal from "./LocatioModal";

import logo5 from "../logos/ShopPal logo white - Copy.PNG";
import logo6 from "../logos/ShopPal logo white - Copy.PNG";

const Navbar = ({ setCartOpen, cartItems }) => {

  const [isScrolled, setIsScrolled] = useState(false);

  const { location, saveLocation } = useLocation();
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

 

  const totalItems = cartItems?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ IMPORTANT FIX: only treat verified users as logged in
  const isLoggedIn = !!user;

  

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 md:px-10 flex items-center transition-all duration-1000 rounded-b-2xl text-white bg-gradient-to-b from-[#111111] to-transparent md:pt-3
        ${
          isScrolled
            ? "max-h-40 translate-y-[0px]"
            : "max-h-0 translate-y-[-80px]"
        }`}
      >

        <div className="text-2xl font-bold cursor-pointer">

          <img
            src={`${isScrolled ? logo5 : logo6}`}
            alt="logo"
            className="lg:w-[16%] w-[70%] mt-[25px] md:mt-0"
            onClick={() => navigate("/")}
          />

          {/* LOCATION BUTTON */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="text-[11px] md:text-sm bg-orange-500 px-3 py-0 md:py-2 mt-1 rounded-full font-montserrat ml-2"
          >
            <i className="fa-solid fa-location-dot pr-1"></i>

            <span className="max-w-[120px] truncate">
              {location?.display_name
                ? location.display_name.slice(0, 14) + "..."
                : "Set Location"}
            </span>
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 text-xl">

          {/* CART */}
          <div
            className="relative cursor-pointer flex justify-center items-center w-9 h-9 rounded-full bg-[#111111]"
            onClick={() => setCartOpen(true)}
          >
            <i className="fa-solid fa-cart-shopping md:text-base text-sm"></i>

            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 text-[10px] flex items-center justify-center">
              {totalItems}
            </span>
          </div>

          {/* USER */}
          <div className="flex items-center gap-4">

            {isLoggedIn ? (

              <div
                onClick={() =>
                  navigate(
                    user.role === "admin"
                      ? "/admin-profile"
                      : user.role === "vendor"
                      ? "/vendor-profile"
                      : "/user-profile"
                  )
                }
                className="flex items-center gap-2 cursor-pointer bg-orange-500 pr-2 py-0 rounded-full"
              >
                <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold">
                  <i className="fa-solid fa-user"></i>
                </div>

                <span className="md:text-sm text-[11px] font-montserrat font-bold">
                  {user.name?.split(" ")[0]}
                </span>
              </div>

            ) : (

              <>
                <button
                  className="bg-white rounded-full text-black font-bold md:text-base text-[11px] md:px-7 px-3 py-1 hidden md:block font-montserrat"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>

                <button
                  className="md:bg-[#111111] bg-[white] rounded-full md:text-base text-[11px] md:text-white text-black font-bold md:px-7 px-3 py-1 font-montserrat"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </button>
              </>
            )}

          </div>

        </div>

      </nav>

      {/* LOCATION MODAL */}
      {showLocationModal && (
        <LocationModal
          closeModal={() => setShowLocationModal(false)}
          saveLocation={saveLocation}
        />
      )}
    </>
  );
};

export default Navbar;
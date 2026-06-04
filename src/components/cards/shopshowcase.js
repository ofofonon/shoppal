import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

import { shops } from "../../data/shops/index";

import { Link } from "react-router-dom";

import {
  useLocation,
} from "../../context/LocationContext";

import {
  calculateDistance,
} from "../../Utility/shopDiscovery";

export default function ShopShowcase() {

  const {
    location: userLocation,
  } = useLocation();

  const [vendors, setVendors] =
    useState({});

  // =========================
  // FETCH VENDORS
  // =========================
  useEffect(() => {

    const fetchVendors = async () => {

      const map = {};

      for (const shop of shops) {

        if (!shop.vendorId) continue;

        try {

          const vendorRef = doc(
            db,
            "users",
            shop.vendorId
          );

          const vendorSnap =
            await getDoc(vendorRef);

          if (vendorSnap.exists()) {

            map[shop.vendorId] =
              vendorSnap.data();

          }

        } catch (err) {

          console.log(
            "Vendor fetch error:",
            err
          );

        }

      }

      setVendors(map);

    };

    fetchVendors();

  }, []);

  // =========================
  // FILTER NEARBY SHOPS
  // =========================
  const nearbyShops = useMemo(() => {

    // NO USER LOCATION
    if (
      !userLocation?.lat ||
      !userLocation?.lng
    ) {
      return [];
    }

    const enriched = shops.map((shop) => {

      const vendor =
        vendors[shop.vendorId];

      if (
        !vendor?.location?.lat ||
        !vendor?.location?.lng
      ) {
        return null;
      }

      const distance =
        calculateDistance(
          userLocation.lat,
          userLocation.lng,
          vendor.location.lat,
          vendor.location.lng
        );

      return {
        ...shop,
        distance,
      };

    });

    return enriched
      .filter(Boolean)
      .filter(
        (shop) => shop.distance <= 60
      );

  }, [vendors, userLocation]);

  // =========================
  // SHOW NOTHING
  // =========================
  if (nearbyShops.length === 0) {
    return null;
  }

  const sizeClasses = {
    large: "md:col-span-7",
    medium: "md:col-span-5",
    small: "md:col-span-4",
  };

  return (
    <div className="w-full bg-[#111111] text-white px-4 md:px-8 py-10 overflow-hidden scrollbar-hide">

      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl md:text-4xl font-bric font-semibold tracking-tight">
            Explore Shops
          </h2>

          <p className="text-white/50 mt-1 text-xs md:text-base font-montserrat">
            Discover premium stores around you.
          </p>

        </div>

        <button className=" md:flex md:text-sm text-xs bg-orange-500 md:p-3 p-2 font-montserrat rounded-full text-white hover:text-white/60 hover:bg-orange-500/50 transition-colors duration-300 font-bold"  onClick={() => {
    document
      .getElementById("plans-section")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}>
          View All
        </button>

      </div>

      {/* MOBILE SCROLL */}
      <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 scrollbar-hide">

        {nearbyShops.map((shop) => (

          <div
            key={shop.id}
            className="w-[82%] snap-start flex-shrink-0"
          >

            <ShopCard shop={shop} />

          </div>

        ))}

      </div>

      {/* DESKTOP BENTO LAYOUT */}
      <div className="hidden lg:grid grid-cols-12 gap-5 auto-rows-auto scrollbar-hide">

        {nearbyShops.map((shop) => (

          <div
            key={shop.id}
            className={`${sizeClasses[shop.size]} group`}
          >

            <ShopCard
              shop={shop}
              desktop
            />

          </div>

        ))}

      </div>

    </div>
  );
}

function ShopCard({
  shop,
  desktop,
}) {

  return (

    <Link
      to={`/shop/${shop.slug}`}
      className="group cursor-pointer block"
    >

      {/* BANNER */}
      <div
        className={`relative overflow-hidden rounded-[28px] bg-neutral-900 ${
          desktop
            ? "h-[200px]"
            : "h-[180px]"
        }`}
      >

        {/* IMAGE */}
        <img
          src={shop.banner}
          alt={shop.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* TOP BADGE */}
        <div className="absolute top-4 left-4 backdrop-blur-md bg-orange-500 border border-white/10 rounded-full px-3 py-1 text-xs text-white/90">
          Featured
        </div>

        {/* LOGO */}
        <div className="absolute -bottom-7 left-5 w-[70px] h-[70px] rounded-2xl bg-white shadow-2xl overflow-hidden border border-black/10 p-2">

          <img
            src={shop.logo}
            alt={shop.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />

        </div>

      </div>

      {/* CONTENT */}
      <div className="pt-10 px-1">

        <div className="flex items-center justify-between gap-4">

          <h3 className="text-lg md:text-xl font-semibold font-bric tracking-tight transition-colors duration-300">
            {shop.name}
          </h3>

          <div className="flex items-center gap-1 text-sm text-orange-400">

            <span>★</span>

            <span>{shop.rating}</span>

          </div>

        </div>

        <p className="text-white/45 text-sm mt-1 font-montserrat">
          Fast delivery • Premium quality
        </p>

      </div>

    </Link>

  );
}
import {
    useEffect,
    useMemo,
    useState,
  } from "react";

  import AdSlider from "../../components/cards/adslider";

  import { useSearchParams } from "react-router-dom";

  import coolestad from "../../logos/Coldest Combos.PNG"
  
  import {
    doc,
    getDoc,
  } from "firebase/firestore";
  
  import {
    db,
  } from "../../firebase";
  
  import {
    shops,
  } from "../../data/shops/index";
  
  import {
    productMap,
  } from "../../data/products";
  
  import {
    useLocation,
  } from "../../context/LocationContext";
  
  import {
    calculateDistance,
    getDeliveryTime,
    getFeaturedShops,
    filterShopsByCategory,
    searchShopsAndProducts,
  } from "../../Utility/shopDiscovery";
  
  import {
    Link,
  } from "react-router-dom";
  
  export default function ShopsPage() {



    const [searchParams] = useSearchParams();

const initialCategory = searchParams.get("category") || "browse-all";


    


  
    const {
      location: userLocation,
    } = useLocation();
  
    const [vendors, setVendors] =
      useState({});
  
    const [search, setSearch] =
      useState("");
  
    const [activeCategory,
      setActiveCategory] =
      useState(initialCategory);

      useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, [activeCategory]);
  
  
  
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
    // MERGE DISTANCE + LOCATION
    // =========================
    const enrichedShops = useMemo(() => {
        if (!userLocation?.lat || !userLocation?.lng) {
          return shops.map((shop) => ({
            ...shop,
            distance: null,
            eta: null,
          }));
        }
      
        return shops.map((shop) => {
          const vendor = vendors[shop.vendorId];
      
          if (!vendor?.location?.lat || !vendor?.location?.lng) {
            return {
              ...shop,
              distance: null,
              eta: null,
            };
          }
      
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            vendor.location.lat,
            vendor.location.lng
          );
      
          return {
            ...shop,
            distance: Number(distance.toFixed(1)),
            eta: getDeliveryTime(distance),
          };
        });
      }, [vendors, userLocation]);

      const nearbyShops = useMemo(() => {
        return enrichedShops.filter((shop) => {
          if (shop.distance === null) return true;
          return shop.distance <= 200; // change radius here
        });
      }, [enrichedShops]);
  
  
  
  
  
    // =========================
    // CATEGORY FILTER
    // =========================
    const categoryFiltered = filterShopsByCategory(
        nearbyShops,
        activeCategory
      );
  
  
  
  
  
    // =========================
    // SEARCH
    // =========================
    const finalShops = searchShopsAndProducts(
        categoryFiltered,
        productMap,
        search
      );
  
  
  
  
  
    // =========================
    // FEATURED
    // =========================
    const featuredShops = getFeaturedShops(nearbyShops);
  
  
  
  
  
    const categories = [
      "browse-all",
      "food",
      "grocery",
      "pharmacy",
    ];
  
  
  
  
  
    const isSearching =
      search.trim().length > 0;


      console.log("USER LOCATION:", userLocation);
console.log("VENDORS:", vendors);
  

  
  
  
  
    return (
  
      <div className="min-h-screen bg-[#111111] text-white font-montserrat">
  
        {/* ========================= */}
        {/* STICKY TOP */}
        {/* ========================= */}
        <div className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-xl border-b border-white/5">
  
          {/* SEARCH */}
          <div className="px-4 md:px-8 pt-5">
  
            <div className="flex items-center bg-[#1a1a1a] border border-white/5 rounded-full px-4 h-[58px]">
  
              <i className="fa-solid fa-magnifying-glass text-white/40"></i>
  
              <input
                type="text"
                placeholder="Search shops or products..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="bg-transparent outline-none flex-1 px-3 text-sm"
              />
  
            </div>
  
          </div>
  
  
  
  
  
          {/* CATEGORIES */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 md:px-8 py-4 scrollbar-hide">
  
            {
              categories.map(
                (category) => (
  
                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`px-5 py-2 rounded-full whitespace-nowrap text-sm transition-all duration-300
                  ${
                    activeCategory ===
                    category
  
                    ? "bg-orange-500 text-white"
  
                    : "bg-[#1a1a1a] text-white/60"
                  }`}
                >
  
                  {
                    category
                      .replace("-", " ")
                  }
  
                </button>
              ))
            }

            
  
          </div>
  
        </div>
  
  
  
  
  
        {/* ========================= */}
        {/* NO SHOPS IN LOCATION */}
        {/* ========================= */}
        {
          enrichedShops.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-28 px-6">
  
              <div className="w-24 h-24 rounded-full bg-orange-500/10 flex items-center justify-center mb-6">
                <i className="fa-solid fa-shop text-3xl text-orange-500"></i>
              </div>
  
              <h2 className="text-2xl font-bric font-semibold">
                No Shops Available
              </h2>
  
              <p className="text-white/45 mt-3 max-w-[320px]">
                There are currently no shops available in your location yet.
              </p>
  
            </div>
          )
        }
  
  
  
  
  
        {
          enrichedShops.length > 0 && (
            <>
            
              {/* ========================= */}
              {/* FEATURED */}
              {/* ========================= */}
              {
                activeCategory ===
                  "browse-all" &&
                !isSearching && (
  
                  <section className="px-4 md:px-8 pt-8">
  
                    <div className="flex items-center justify-between mb-5">
  
                      <h2 className="text-2xl font-bric font-semibold">
                        Featured Shops
                      </h2>
  
                    </div>
  
                    <div className="flex gap-5 overflow-x-auto no-scrollbar pb-3 thin-scrollbar">
  
                      {
                        featuredShops.map(
                          (shop) => (
  
                          <div
                            key={shop.id}
                            className="min-w-[320px]"
                          >
  
                            <ShopCard
                              shop={shop}
                            />
  
                          </div>
                        ))
                      }
  
                    </div>
  
                  </section>
                )
              }
  
  
  
  
  
              {/* ========================= */}
              {/* EXPLORE */}
              {/* ========================= */}
              {
                activeCategory ===
                  "browse-all" &&
                !isSearching && (
  
                  <section className="px-4 md:px-8 pt-10">
  
                    <h2 className="text-2xl font-bric font-semibold mb-5">
                      Explore
                    </h2>
  
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 thin-scrollbar scrollbar-hide">
  
                      {
                        enrichedShops
                          .slice(0, 10)
                          .map((shop) => (
  
                          <Link
                            key={shop.id}
                            to={`/shops-page`}
                            className="min-w-[220px] bg-[#1a1a1a] border border-white/5 rounded-3xl md:p-4 p-3 flex items-center gap-4"
                          >
  
                            <div className="md:w-14 w-10 md:h-14 h-10 rounded-2xl overflow-hidden bg-white">
  
                              <img
                                src={shop.logo}
                                alt={shop.name}
                                className="w-full h-full object-contain"
                              />
  
                            </div>
  
                            <div>
  
                              <h3 className="font-semibold font-bric md:text-base text-sm">
                                {shop.name}
                              </h3>
  
                              <p className="text-orange-400 md:text-sm text-xs">
                                ★ {shop.rating}
                              </p>
  
                            </div>
  
                          </Link>
                        ))
                      }
  
                    </div>

                    <div className="flex items-center w-full md:mt-[100px] mt-20 overflow-hidden md:h-[300px] h-auto">
                    <AdSlider />
                  </div>
  
                  </section>
                )
              }
  
  
  
  
  
              {/* ========================= */}
              {/* SHOPS */}
              {/* ========================= */}
              <section className="px-4 md:px-8 py-10">
  
                <h2 className="text-2xl font-bric font-semibold mb-6">
                  {
                    isSearching
                      ? "Search Results"
                      : "Shops"
                  }
                </h2>
  
  
  
  
  
                {/* NO SEARCH RESULTS */}
                {
                  finalShops.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-16">
  
                      <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mb-5">
                        <i className="fa-solid fa-magnifying-glass text-orange-500 text-2xl"></i>
                      </div>
  
                      <h3 className="text-xl font-semibold font-bric">
                        Nothing Found
                      </h3>
  
                      <p className="text-white/45 mt-2 max-w-[300px]">
                        We couldn't find any shops or products matching your search.
                      </p>
  
                    </div>
                  )
                }
  
  
  
  
  
                {/* MOBILE */}
                <div className="md:hidden flex flex-col gap-6">
  
                  {
                    finalShops.map(
                      (shop) => (
  
                      <ShopCard
                        key={shop.id}
                        shop={shop}
                      />
                    ))
                  }
  
                </div>
  
  
  
  
  
                {/* DESKTOP */}
                <div className="hidden md:grid grid-cols-12 gap-5">
  
                  {
                    finalShops.map(
                      (shop) => (
  
                      <div
                        key={shop.id}
                        className="col-span-4"
                      >
  
                        <ShopCard
                          shop={shop}
                        />
  
                      </div>
                    ))
                  }
  
                </div>
  
              </section>
  
            </>
          )
        }
  
      </div>
    );
  }
  
  
  
  
  
  function ShopCard({
    shop,
  }) {
  
    return (
  
      <Link
        to={`/shop/${shop.slug}`}
        className="block group"
      >
  
        <div className="relative overflow-hidden rounded-[28px] h-[190px] bg-[#1a1a1a]">
  
          <img
            src={shop.banner}
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
  
  
  
  
  
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
  
  
  
  
  
          {
            shop.featured && (
              <div className="absolute top-4 left-4 bg-orange-500 px-3 py-1 rounded-full text-xs">
  
                Featured
  
              </div>
            )
          }
  
  
  
  
  
          <div className="absolute bottom-5 left-5 right-5">
  
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white mb-1">
  
              <img
                src={shop.logo}
                alt={shop.name}
                className="w-full h-full object-contain"
              />
  
            </div>
  
  
  
  
  
            <div className="flex items-center justify-between">
  
              <h3 className="text-xl font-semibold font-bric">
                {shop.name}
              </h3>
  
              <div className="text-orange-400 text-sm">
                ★ {shop.rating}
              </div>
  
            </div>
  
  
  
  
  
            <div className="flex items-center gap-4 mt-1 text-sm text-white/70">
  
              {
                shop.distance !== null && (
                  <span>
                    {shop.distance}km away
                  </span>
                )
              }
  
              {
                shop.eta && (
                  <span>
                    {shop.eta}
                  </span>
                )
              }
  
            </div>
  
          </div>
  
        </div>
  
      </Link>
    );
  }
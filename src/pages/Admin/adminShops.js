import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";

import { shops } from "../../data/shops/index";

export default function AdminShops() {

  const [shopData, setShopData] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH SHOPS DATA
  // =========================
  useEffect(() => {

    const fetchShops = async () => {

      try {

        // GET ALL ORDERS
        const ordersSnap = await getDocs(
          collection(db, "orders")
        );

        // MAP SHOPS
        const formattedShops = shops.map((shop) => {

          let revenue = 0;

          // LOOP THROUGH ORDERS
          ordersSnap.forEach((doc) => {

            const order = doc.data();

            const items = order.items || [];

            // FILTER ITEMS BELONGING TO SHOP
            const shopItems = items.filter(
              (item) => item.vendorId === shop.vendorId
            );

            // CALCULATE REVENUE
            shopItems.forEach((item) => {

              revenue += item.price * item.quantity;

            });

          });

          return {

            ...shop,
            revenue,

          };

        });

        setShopData(formattedShops);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchShops();

  }, []);

  return (

    <div className="min-h-screen bg-[#111111] text-white relative overflow-hidden">

      {/* GLOW */}
      <div className="absolute inset-0">

        <div className="absolute w-[500px] h-[500px] bg-orange-500/10 blur-[120px] top-[-120px] left-[-120px]" />

        <div className="absolute w-[400px] h-[400px] bg-orange-500/5 blur-[120px] bottom-[-120px] right-[-120px]" />

      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-10">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Shops Management
          </h1>

          <p className="text-white/40 mt-2 font-montserrat">
            View all shops on the platform
          </p>

        </div>

        {/* LOADING */}
        {loading && (

          <div className="text-center py-20 text-white/40">
            Loading shops...
          </div>

        )}

        {/* EMPTY */}
        {!loading && shopData.length === 0 && (

          <div className="flex flex-col items-center justify-center text-center py-24">

            <div className="text-6xl mb-4">
              🏪
            </div>

            <h2 className="text-2xl font-semibold">
              No shops found
            </h2>

            <p className="text-white/40 mt-2">
              No shops are currently available.
            </p>

          </div>

        )}

        {/* SHOPS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {shopData.map((shop, index) => (

            <div
              key={index}
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:border-orange-500/30 transition"
            >

              {/* TOP */}
              <div className="flex justify-between items-start gap-4">

                <div>

                  <h2 className="text-2xl font-semibold">
                    {shop.name}
                  </h2>

                  <p className="text-white/40 text-sm mt-1">
                    {shop.description || "No description"}
                  </p>

                </div>

                {/* REVENUE */}
                <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg shadow-orange-500/20">

                  ₦{shop.revenue.toLocaleString()}

                </div>

              </div>

              {/* SHOP INFO */}
              <div className="mt-6 space-y-2">

                {/* SHOP ID */}
                <div className="bg-black/30 border border-white/5 rounded-2xl p-4">

                  <p className="text-white/30 text-xs mb-1">
                    SHOP ID
                  </p>

                  <p className="break-all text-sm text-white/70 font-mono">
                    {shop.slug || "No shop id"}
                  </p>

                </div>

                {/* VENDOR ID */}
                <div className="bg-black/30 border border-white/5 rounded-2xl p-4">

                  <p className="text-white/30 text-xs mb-1">
                    VENDOR UID
                  </p>

                  <p className="break-all text-sm text-white/70 font-mono">
                    {shop.vendorId || "No vendor id"}
                  </p>

                </div>

                {/* CREATED */}
                <div className="bg-black/30 border border-white/5 rounded-2xl p-4">

                  <p className="text-white/30 text-xs mb-1">
                    CREATED AT
                  </p>

                  <p className="text-sm text-white/70">
                    {shop.createdAt
                      ? new Date(shop.createdAt).toLocaleString()
                      : "No date available"}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}
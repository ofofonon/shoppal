
import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

import { db } from "../../firebase";

import { shops } from "../../data/shops";

export default function AdminVendors() {

  const [vendors, setVendors] = useState([]);

  useEffect(() => {

    const fetchVendors = async () => {

      const usersSnap = await getDocs(
        collection(db, "users")
      );

      const ordersSnap = await getDocs(
        collection(db, "orders")
      );

      const vendorUsers = usersSnap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.role === "vendor");

      const vendorsWithStats = vendorUsers.map((vendor) => {

        let revenue = 0;

        ordersSnap.forEach((orderDoc) => {

          const order = orderDoc.data();

          const vendorItems = (order.items || []).filter(
            (item) => item.vendorId === vendor.uid
          );

          vendorItems.forEach((item) => {
            revenue += item.price * item.quantity;
          });

        });

        const vendorShop = shops.find(
          (shop) => shop.vendorId === vendor.uid
        );

        return {
          ...vendor,
          revenue,
          shop: vendorShop || null,
        };

      });

      setVendors(vendorsWithStats);

    };

    fetchVendors();

  }, []);

  // =========================
  // STATUS TOGGLE
  // =========================
  const toggleStatus = async (vendor) => {

    const newStatus =
      vendor.status === "suspended"
        ? "active"
        : "suspended";

    await updateDoc(
      doc(db, "users", vendor.uid),
      {
        status: newStatus,
      }
    );

    setVendors((prev) =>
      prev.map((v) =>
        v.uid === vendor.uid
          ? { ...v, status: newStatus }
          : v
      )
    );

  };

  // =========================
  // DISCONNECT SHOP
  // =========================
  const toggleShopConnection = async (vendor) => {

    const newState = !vendor.shopConnected;
  
    await updateDoc(
      doc(db, "users", vendor.uid),
      {
        shopConnected: newState,
      }
    );


  
    setVendors((prev) =>
      prev.map((v) =>
        v.uid === vendor.uid
          ? {
              ...v,
              shopConnected: newState,
            }
          : v
      )
    );
  
  };

  // =========================
  // SEND NOTIFICATION
  // =========================
  const sendNotification = async (
    vendorId,
    subject,
    message
  ) => {

    if (!subject || !message) return;

    await updateDoc(
      doc(db, "users", vendorId),
      {
        notifications: arrayUnion({
          subject,
          message,
          createdAt:
            new Date().toISOString(),
          read: false,
        }),
      }
    );

    alert("Notification sent");

  };

  return (

    <div className="min-h-screen bg-[#0b0b0b] text-white px-4 md:px-10 py-10 font-montserrat">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-3xl font-bric">
          Vendor Management
        </h1>

        <p className="text-white/40 text-sm mt-1">
          Manage all platform vendors
        </p>

      </div>

      {/* VENDORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {vendors.map((vendor) => (

          <VendorCard
            key={vendor.uid}
            vendor={vendor}
            toggleStatus={toggleStatus}
            toggleShopConnection={toggleShopConnection}
            sendNotification={sendNotification}
          />

        ))}

      </div>

    </div>

  );

}

// =====================================
// CARD
// =====================================
function VendorCard({
    vendor,
    toggleStatus,
    toggleShopConnection,
    sendNotification,
}) {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (

    <div className="bg-[#111] border border-white/5 rounded-3xl p-5">

      {/* TOP */}
      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-semibold">
            {vendor.name}
          </h2>

          <p className="text-white/40 text-sm">
            {vendor.email}
          </p>

          <p className="text-white/30 text-xs mt-2">
            UID: {vendor.uid}
          </p>

          <div className="flex justify-between">
        <span className="text-white/40">
            Shop Status:
                    </span>

        <span
            className={`text-sm ${
            vendor.shopConnected
                ? "text-green-400"
                : "text-red-400"
            }`}
        >
            {vendor.shopConnected
            ? "Connected"
            : "Disconnected"}
        </span>
        </div>

        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs ${
            vendor.status === "suspended"
              ? "bg-red-500/20 text-red-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {vendor.status || "active"}
        </div>


        

      </div>

      {/* STATS */}
      <div className="mt-5 space-y-2 text-sm">

        <div className="flex justify-between">
          <span className="text-white/40">
            Revenue
          </span>

          <span className="text-orange-400">
            ₦{vendor.revenue.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/40">
            Shop
          </span>

          <span>
            {vendor.shop?.name || "No Shop"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/40">
            Shop ID
          </span>

          <span className="text-white/50 text-xs">
            {vendor.shop?.id || "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/40">
            Last Login
          </span>

          <span className="text-xs">
            {vendor.lastLogin
              ? new Date(
                  vendor.lastLogin
                ).toLocaleString()
              : "Never"}
          </span>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="mt-6 grid grid-cols-2 gap-3">

        <button
          onClick={() =>
            toggleStatus(vendor)
          }
          className={`p-3 rounded-xl font-semibold transition ${
            vendor.status === "suspended"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {vendor.status === "suspended"
            ? "Activate"
            : "Suspend"}
        </button>

        <button
        onClick={() =>
            toggleShopConnection(vendor)
        }
        className={`p-3 rounded-xl font-semibold transition ${
            vendor.shopConnected
            ? "bg-red-500"
            : "bg-green-500"
        }`}
        >
        {vendor.shopConnected
            ? "Disconnect Shop"
            : "Connect Shop"}
        </button>

      </div>

      {/* CUSTOM NOTIFICATION */}
      <div className="mt-6 space-y-3">

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
        />

        <textarea
          placeholder="Message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none min-h-[120px]"
        />

        <button
          onClick={() =>
            sendNotification(
              vendor.uid,
              subject,
              message
            )
          }
          className="w-full p-3 rounded-xl bg-blue-500 font-semibold"
        >
          Send Notification
        </button>

      </div>

      {/* FIXED NOTIFICATIONS */}
      <div className="mt-4 grid grid-cols-2 gap-3">

        <button
          onClick={() =>
            sendNotification(
              vendor.uid,
              "Shop Disconnected",
              "Your shop has been disconnected because your plan was not renewed."
            )
          }
          className="p-3 rounded-xl bg-red-500/20 text-red-400"
        >
          Expired Plan
        </button>

        <button
          onClick={() =>
            sendNotification(
              vendor.uid,
              "Welcome to Shoppal",
              "Congratulations on becoming a Shoppal vendor."
            )
          }
          className="p-3 rounded-xl bg-green-500/20 text-green-400"
        >
          Welcome Vendor
        </button>

      </div>

    </div>

  );

}


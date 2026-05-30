import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
  } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";




export default function UserOrders() {

    const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
  
      const fetchOrders = async () => {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
  
        const snap = await getDocs(q);
  
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setOrders(data);
      };
  
      fetchOrders();
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-4 md:px-10 py-10 font-montserrat">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bric font-semibold">
          My Orders
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Only your purchases appear here
        </p>
      </div>

      {/* ORDERS */}
      <div className="space-y-4">

      {orders.length === 0 && (
  <div className="flex flex-col items-center justify-center text-center py-20 px-6">
    
    {/* ICON */}
    <div className="text-5xl mb-4">🛒</div>

    {/* TITLE */}
    <h2 className="text-xl font-semibold text-white">
      No orders yet
    </h2>

    {/* DESCRIPTION */}
    <p className="text-white/40 text-sm mt-2 max-w-md">
      You haven’t placed any orders yet. Start shopping to see your orders appear here.
    </p>

    {/* CTA BUTTON */}
    <button
      onClick={() => navigate("/")}
      className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 transition rounded-xl font-semibold"
    >
      Start Shopping
    </button>

  </div>
)}

        {orders.map((order) => {
          const firstItem = order.items?.[0];
          const isOpen = openOrder === order.id;

          return (
            <div
              key={order.id}
              className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden"
            >

              {/* TOP CARD */}
              <div
                onClick={() =>
                  setOpenOrder(isOpen ? null : order.id)
                }
                className="flex items-center gap-4 p-4 cursor-pointer"
              >

                {/* IMAGE */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-black flex-shrink-0">
                  {firstItem?.image ? (
                    <img
                      src={firstItem.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5" />
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1">

                  <div className="flex justify-between items-center">

                    <p className="text-white/40 text-xs">
                      Order Id: {order.id}
                    </p>

                    <p className="text-orange-400 font-semibold">
                      ₦{order.totalAmount}
                    </p>

                  </div>

                  <div className="flex justify-between text-xs text-white/40 mt-1">

                    <span>
                      🕒{" "}
                      {order.orderTime
                        ? new Date(order.orderTime).toLocaleString()
                        : "No time"}
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full ${
                        order.orderStatus === "delivered"
                          ? "bg-green-500/20 text-green-400"
                          : order.orderStatus === "confirmed"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                  </div>
                </div>

                {/* ARROW */}
                <div className="text-white/40">
                  {isOpen ? "▲" : "▼"}
                </div>

              </div>

              {/* DROPDOWN */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-white/5">

                  <div className="pt-3 space-y-3">

                    {order.items?.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          <p>{item.name}</p>
                          <p className="text-white/40 text-xs">
                            {item.quantity} × ₦{item.price}
                          </p>
                        </div>

                        <p className="text-orange-400">
                          ₦{item.quantity * item.price}
                        </p>
                      </div>
                    ))}

                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
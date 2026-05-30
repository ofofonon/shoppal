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



export default function VendorOrders() {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const statusFilters = ["all", "pending", "confirmed", "delivered"];
  const paymentFilters = ["all", "unsettled", "settled"];


  const vendorId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders"),
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
  }, []);

  // =============================
  // FILTER ONLY VENDOR ORDERS
  // =============================
  const vendorOrders = orders
    .map((order) => {
      const vendorItems = order.items.filter(
        (item) => item.vendorId === vendorId
      );

      const vendorSubtotal = vendorItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      return {
        ...order,
        items: vendorItems,
        vendorSubtotal,
      };
    })
    .filter((order) => order.items.length > 0);

  // =============================
  // FILTER LOGIC
  // =============================
  const filteredOrders = vendorOrders.filter((order) => {
    const statusMatch =
      statusFilter === "all" || order.orderStatus === statusFilter;

    const paymentMatch =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return statusMatch && paymentMatch;
  });

  // =============================
  // TOTAL EARNINGS
  // =============================
  const totalEarnings = filteredOrders.reduce(
    (acc, order) => acc + order.vendorSubtotal,
    0
  );

  const EmptyState = ({ message, onClick }) => (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
  
      <div className="text-5xl mb-3">📦</div>
  
      <h2 className="text-xl font-semibold text-white">
        No orders found
      </h2>
  
      <p className="text-white/40 text-sm mt-2 max-w-md">
        {message}
      </p>
  
      {onClick && (
        <button
          onClick={onClick}
          className="mt-6 px-5 py-3 bg-orange-500 hover:bg-orange-600 transition rounded-xl font-semibold"
        >
          Reset / Go Home
        </button>
      )}
  
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-4 md:px-10 py-10  font-montserrat">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bric font-bric">Vendor Orders</h1>
        <p className="text-white/40 text-sm">
          Orders containing your products only
        </p>

        <p className="text-orange-400 mt-2 font-semibold">
          Your Earnings: ₦{totalEarnings}
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 mb-4">

        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              statusFilter === f
                ? "bg-orange-500 border-orange-500"
                : "bg-white/5 border-white/10 text-white/40"
            }`}
          >
            {f}
          </button>
        ))}

      </div>

      <div className="flex flex-wrap gap-2 mb-8">

        {paymentFilters.map((f) => (
          <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              paymentFilter === f
                ? "bg-green-500 border-green-500"
                : "bg-white/5 border-white/10 text-white/40"
            }`}
          >
            {f}
          </button>
        ))}

      </div>

      

      {/* ORDERS GRID */}
    

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{filteredOrders.length === 0 ? (
  <EmptyState
    message={
      statusFilter !== "all" || paymentFilter !== "all"
        ? "No orders match your filters. Try changing them."
        : "No orders yet."
    }
    onClick={() => {
      setStatusFilter("all");
      setPaymentFilter("all");
    }}
  />
) : (
  filteredOrders.map((order) => (
    <div key={order.id}>
      <div
            key={order.id}
            className="bg-[#111] border border-white/5 rounded-3xl p-5"
          >

            {/* CUSTOMER INFO */}
            <div className="mb-4">
            <div className="flex justify-between items-start">
  
           

          </div>
              <h2 className="text-lg font-semibold">
                {order.customerName}
              </h2>

              <div>
              <p className="text-white/40 text-xs">
                OrderId: {order.id}
              </p>

              <p className="text-white/40 text-xs mt-1">
                🕒 {order.orderTime
                  ? new Date(order.orderTime).toLocaleString()
                  : "No time available"}
              </p>
            </div>

              <p className="text-white/40 text-sm">
                {order.customerEmail}
              </p>

              <p className="text-white/40 text-sm">
                📞 {order.phoneNumber || "No phone number"}
              </p>

              <p className="text-white/40 text-sm">
              📍 {order.deliveryAddress?.display_name || "No location set"}
              </p>

              <p className="text-orange-400 mt-2 font-semibold">
                Vendor Total: ₦{order.vendorSubtotal}
              </p>
            </div>

            {/* ITEMS */}
            <div className="bg-black/30 p-3 rounded-2xl space-y-2 max-h-[200px] overflow-y-auto">

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm border-b border-white/5 pb-2"
                >

                  <div>
                    <p className="font-medium">{item.name}</p>

                    <p className="text-white/40 text-xs">
                      {item.quantity} × ₦{item.price}
                    </p>

                    <p className="text-white/30 text-xs">
                      🏪 {item.shopName}
                    </p>
                  </div>

                  <p className="text-orange-300">
                    ₦{item.price * item.quantity}
                  </p>

                </div>
              ))}

            </div>

            {/* STATUS */}
            <div className="mt-4 text-xs text-white/40 flex justify-between">
              <span>Status: {order.orderStatus}</span>
              <span>Payment: {order.paymentStatus}</span>
            </div>

          </div>
    </div>
  ))
)}

</div>

        

      </div>

   
  );
}
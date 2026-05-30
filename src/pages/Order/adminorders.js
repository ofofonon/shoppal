import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import {
    collection,
    getDocs,
    query,
    orderBy,
    updateDoc,
    doc,
    deleteDoc,
    arrayUnion, // ADD THIS
    getDoc,
  } from "firebase/firestore";
  import { onAuthStateChanged } from "firebase/auth";
  
  import { db, auth } from "../../firebase";
  import { shops } from "../../data/shops/index";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    
    const statusFilters = ["all", "pending", "confirmed", "delivered"];
    const paymentFilters = ["all", "unsettled", "settled"];



    const sendReceiptEmail = async (order) => {

      const itemsHtml = order.items.map(
        (item) => `
          <table width="100%" style="margin-bottom:25px;">
    
            <tr>
    
              <td>
    
                <div style="display:flex;gap:10px;">
    
                  <span style="
                    color:#9ca3af;
                    font-weight:bold;
                    font-size:10px;
                  ">
                    ${item.quantity}x
                  </span>
    
                  <div>
    
                    <p style="
                      margin:0;
                      font-size:10px;
                      color:white;
                      font-weight:600;
                    ">
                      ${item.name}
                    </p>
    
                    <p style="
                      margin-top:6px;
                      color:#777;
                      font-size:10px;
                    ">
                      ${item.shopName}
                    </p>
    
                  </div>
    
                </div>
    
              </td>
    
              <td
                align="right"
                style="
                  color:white;
                  font-size:10px;
                  font-weight:bold;
                "
              >
                ₦${item.price * item.quantity}
              </td>
    
            </tr>
    
          </table>
        `
      ).join("");
    
      await emailjs.send(
    
        "service_p9mdjs4",
    
        "template_ijwp5uo",
    
        {
    
          
    
          customer_name:
            order.customerName,
    
          order_id:
            order.id.slice(0, 10),
    
          subtotal:
            order.subtotal,
    
          delivery_fee:
            order.deliveryFee,
    
          total:
            order.totalAmount,
    
          delivery_address:
            order.deliveryAddress?.display_name,
    
          order_time:
            new Date(
              order.orderTime
            ).toLocaleString(),
    
          items_html:
            itemsHtml,
    
        },
    
        "Q_2kuRLqDh_9h5D_I"
    
      );
    
    };

    const deleteOrderItem = async (orderId, itemIndex) => {
      try {
        const orderRef = doc(db, "orders", orderId);
    
        const order = orders.find((o) => o.id === orderId);
        if (!order) return;
    
        const updatedItems = [...order.items];
    
        updatedItems.splice(itemIndex, 1);
    
        await updateDoc(orderRef, {
          items: updatedItems,
        });
    
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, items: updatedItems }
              : o
          )
        );
    
      } catch (error) {
        console.log("Error deleting item:", error);
      }
    };

    const deleteOrder = async (orderId) => {
      try {
        await deleteDoc(doc(db, "orders", orderId));
    
        setOrders((prev) =>
          prev.filter((order) => order.id !== orderId)
        );
    
      } catch (error) {
        console.log("Error deleting order:", error);
      }
    };
 

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      statusFilter === "all" || order.orderStatus === statusFilter;
  
    const paymentMatch =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;
  
    return statusMatch && paymentMatch;
  });

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


  const sendNotification = async (
    userId,
    subject,
    message,
    receiptLink = null
  ) => {
  
    try {
  
      const userRef = doc(db, "users", userId);
  
      await updateDoc(userRef, {
  
        notifications: arrayUnion({
  
          subject,
          message,
          receiptLink,
          read: false,
          createdAt: new Date().toISOString(),
  
        }),
  
      });
  
    } catch (err) {
  
      console.log("Notification error:", err);
  
    }
  };



  const updateField = async (
    orderId,
    field,
    value
  ) => {
  
    const currentOrder =
      orders.find((o) => o.id === orderId);
  
    if (!currentOrder) return;
  
    // UPDATE UI INSTANTLY
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, [field]: value }
          : order
      )
    );
  
    try {
  
      // UPDATE FIREBASE
      await updateDoc(
        doc(db, "orders", orderId),
        {
          [field]: value,
        }
      );
  
      // =====================================
      // ORDER CONFIRMED
      // =====================================
  
      if (
        field === "orderStatus" &&
        value === "confirmed"
      ) {
  
        // CUSTOMER NOTIFICATION
        await sendNotification(

          currentOrder.userId,
        
          "Order Confirmed",
        
          `Your order #${orderId.slice(0, 8)}
        has been confirmed successfully.
        
        Your items are now being prepared.`,
        
          `/receipt/${orderId}`
        
        );
        await sendReceiptEmail(currentOrder);
  
        // =====================================
        // VENDOR NOTIFICATIONS
        // =====================================
  
        const notifiedVendors = new Set();
  
        for (const item of currentOrder.items) {
  
          // FIND SHOP
          const shop = shops.find(
            (s) =>
              s.name === item.shopName
          );
  
          if (!shop?.vendorId) continue;
  
          // PREVENT DUPLICATES
          if (
            notifiedVendors.has(
              shop.vendorId
            )
          ) continue;
  
          notifiedVendors.add(
            shop.vendorId
          );
  
          await sendNotification(
  
            shop.vendorId,
  
            "New Order Received",
  
            `You just received a new order.
  
  Order ID:
  ${orderId}
  
  Customer:
  ${currentOrder.customerName}
  
  Please check your order history
  to begin processing.`
  
          );
  
        }
  
      }
  
      // =====================================
      // PAYMENT SETTLED
      // =====================================
  
      if (
        field === "paymentStatus" &&
        value === "settled"
      ) {
  
        const notifiedVendors = new Set();
  
        for (const item of currentOrder.items) {
  
          const shop = shops.find(
            (s) =>
              s.name === item.shopName
          );
  
          if (!shop?.vendorId) continue;
  
          if (
            notifiedVendors.has(
              shop.vendorId
            )
          ) continue;
  
          notifiedVendors.add(
            shop.vendorId
          );
  
          await sendNotification(
  
            shop.vendorId,
  
            "Order Payment Settled",
  
            `Payment for Order #${orderId.slice(0, 8)}
  has been settled successfully.
  
  Amount:
  ₦${currentOrder.totalAmount}
  
  The funds for this order
  have now been marked as settled.`
  
          );
  
        }
  
      }
  
    } catch (err) {
  
      console.log(err);
  
    }
  
  };
  

  const statusOptions = ["pending", "confirmed", "delivered"];
  const paymentOptions = ["unsettled", "settled"];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-4 md:px-10 py-10 font-montserrat">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bric font-semibold">
          Orders Management
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Track and manage all platform orders
        </p>
      </div>

            <div className="flex gap-2 flex-wrap mb-3">

        {statusFilters.map((f) => (
        <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition
            ${
                statusFilter === f
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
            }`}
        >
            {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
        ))}

        </div>

        <div className="flex gap-2 flex-wrap mb-6">

        {paymentFilters.map((f) => (
            <button
            key={f}
            onClick={() => setPaymentFilter(f)}
            className={`px-4 py-2 rounded-full text-sm border transition
                ${
                paymentFilter === f
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                }`}
            >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
        ))}

        </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {filteredOrders.map((order) => (

          <div
            key={order.id}
            className="bg-[#111] border border-white/5 rounded-3xl p-5 flex flex-col gap-4"
          >

            {/* TOP */}
            <div className="flex justify-between items-start">

              <div>
              <button
                onClick={() => deleteOrder(order.id)}
                className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs transition"
              >
                Delete Order
              </button>
                
                <h2 className="text-lg font-semibold">
                  {order.customerName}
                </h2>

                <p className="text-white/40 text-sm">
                  {order.customerEmail}
                </p>

                {/* PHONE */}
                <p className="text-white/40 text-sm mt-1">
                  📞 {order.phoneNumber || "No phone added"}
                </p>

                {/* LOCATION */}
                <p className="text-white/40 text-sm">
                  📍 {order.deliveryAddress?.display_name || "No location set"}
                </p>

                <p className="text-white/40 text-xs mt-1">
            🕒 {order.orderTime
                ? new Date(order.orderTime).toLocaleString()
                : "No time available"}
            </p>

            <p className="text-white/30 text-xs">
            🧾 Order ID: {order.id}
            </p>
              </div>

              <div className="text-right">
                <p className="text-orange-400 font-semibold">
                  ₦{order.totalAmount}
                </p>
                <p className="text-white/40 text-xs">
                  {order.orderStatus}
                </p>
              </div>

            </div>

            {/* ITEMS */}
            <div className="bg-black/30 rounded-2xl p-3 space-y-2 max-h-[180px] overflow-y-auto">

              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start text-sm border-b border-white/5 pb-2"
                >
                  <div>

                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-white/40 text-xs">
                      {item.quantity} × ₦{item.price}
                    </p>

                    {/* SHOP NAME */}
                    <p className="text-white/30 text-xs mt-1">
                      🏪 {item.shopName}
                    </p>

                  </div>

                  <div>
                  <p className="text-orange-300 font-semibold">
                    ₦{item.price * item.quantity}
                  </p>
                  <button
                  onClick={() => deleteOrderItem(order.id, index)}
                  className="text-red-400 hover:text-red-500 text-xs mt-1 transition"
                >
                  Delete
                </button>
                  </div>

                </div>
              ))}

            </div>

            {/* ORDER STATUS */}
            <div className="flex bg-white/5 rounded-full p-1">

              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    updateField(order.id, "orderStatus", status)
                  }
                  className={`flex-1 py-2 rounded-full text-sm transition ${
                    order.orderStatus === status
                      ? "bg-orange-500 text-white"
                      : "text-white/40"
                  }`}
                >
                  {status}
                </button>
              ))}

            </div>

            {/* PAYMENT STATUS */}
            <div className="flex bg-white/5 rounded-full p-1">

              {paymentOptions.map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    updateField(order.id, "paymentStatus", status)
                  }
                  className={`flex-1 py-2 rounded-full text-sm transition ${
                    order.paymentStatus === status
                      ? "bg-green-500 text-white"
                      : "text-white/40"
                  }`}
                >
                  {status}
                </button>
              ))}

            </div>

            {/* FOOTER */}
            <div className="flex justify-between text-xs text-white/30">
              <span>Items: {order.items?.length || 0}</span>
              <span>ID: {order.id}</span>
            </div>

          </div>

        ))}

      </div>
    </div>
  );
}
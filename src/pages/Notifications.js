import { useState, useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNotifications } from "../hooks/useNotifications";
import { Link } from "react-router-dom";

export default function NotificationsPanel() {
  const { notifications, setNotifications } = useNotifications();
  const [openId, setOpenId] = useState(null);

  // SORT BY LATEST
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [notifications]);

  // MARK AS READ (ARRAY BASED)
  const markAsRead = async (id) => {
    const ref = doc(db, "users", auth.currentUser.uid);

    const updated = notifications.map((n) =>
      n.subject === id || n.id === id
        ? { ...n, read: true }
        : n
    );

    await updateDoc(ref, {
      notifications: updated,
    });

    setNotifications(updated);
  };

  return (

    <>
    <div className="w-full flex justify-center">
        <div className="w-[95%] md:w-[70%]  overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0b0b]/90 backdrop-blur-xl shadow-2xl font-montserrat">

{/* HEADER */}
<div className="p-4 border-b border-white/10">
  <h2 className="text-white font-semibold text-3xl font-bric">
    Notifications
  </h2>
  <p className="text-white/40 ">
    Latest updates from Shoppal
  </p>
</div>

{/* EMPTY STATE */}
{sortedNotifications.length === 0 && (
  <div className="p-6 text-center text-white/40 text-sm">
    No notifications yet
  </div>
)}

{/* LIST */}
{sortedNotifications.map((n, i) => (
  <div
    key={i}
    className={`border-b border-white/5 transition-all duration-300 ${
      !n.read ? "bg-white/5" : ""
    }`}
  >
    {/* TOP ROW */}
    <div
      onClick={() => {
        setOpenId(openId === i ? null : i);
        markAsRead(n.subject);
      }}
      className="p-4 cursor-pointer flex flex-col gap-1"
    >
      {/* SUBJECT + DOT */}
      <div className="flex items-center justify-between">
        <p
          className={`text-sm ${
            n.read
              ? "text-white/60 font-normal"
              : "text-white font-semibold"
          }`}
        >
          {n.subject}
        </p>

        {!n.read && (
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        )}
      </div>

      {/* TIME */}
      <span className="text-[10px] text-white/30">
        {new Date(n.createdAt).toLocaleString()}
      </span>
    </div>

    {/* MESSAGE */}
    <div
      className={`px-4 overflow-hidden transition-all duration-300 ${
        openId === i
          ? "max-h-40 pb-4 opacity-100"
          : "max-h-0 opacity-0"
      }`}
    >
      <p className="text-sm text-white/50 leading-relaxed">
        {n.message}
      </p>
      {n.receiptLink && (

<Link
  to={n.receiptLink}
  className="mt-4 inline-flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500 hover:text-white text-orange-400 px-4 py-2 rounded-full text-sm transition-all duration-300"
>

  View Receipt

  <i className="fa-solid fa-arrow-right"></i>

</Link>

)}
    </div>
  </div>
))}
</div>



    </div>

    
    </>
  );
}
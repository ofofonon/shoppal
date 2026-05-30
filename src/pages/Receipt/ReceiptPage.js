import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import cook from "../../Assets/images/Shop pal plain.webp"

import html2pdf from "html2pdf.js";

export default function ReceiptPage() {

  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  const receiptRef = useRef();

  useEffect(() => {

    const fetchOrder = async () => {

      const ref = doc(
        db,
        "orders",
        orderId
      );

      const snap = await getDoc(ref);

      if (snap.exists()) {

        setOrder({
          id: snap.id,
          ...snap.data(),
        });

      }

    };

    fetchOrder();

  }, [orderId]);

  const downloadReceipt = () => {

    const element = receiptRef.current;

    html2pdf()
      .set({
        margin: 0,
        filename: `receipt-${order.id}.pdf`,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 2,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();

  };

  if (!order) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading receipt...
      </div>
    );

  }

  const subtotal =
    order.items?.reduce(
      (acc, item) =>
        acc + item.price * item.quantity,
      0
    ) || 0;

  return (

    <div className="min-h-screen bg-[#050505] text-white font-montserrat pb-20">

      {/* HERO */}

      <div className="relative overflow-hidden bg-[#111] rounded-br-[120px]">

        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/20 blur-[120px] rounded-full"></div>

        <img src={cook} alt="cookie" className="absolute w-[100%] bottom-0"/>

        <div className="px-6 md:pt-16 pt-16 pb-12 relative z-8">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_50px_rgba(255,115,0,0.4)]">

              <i className="fa-solid fa-check text-2xl"></i>

            </div>

            <div>

              <p className="text-white/50 text-sm">
                HEY {order.customerName}
              </p>

              <h1 className="text-4xl font-bold font-bric leading-none mt-1">
                Delivered
              </h1>

            </div>

          </div>

          <p className="text-white/60 mt-6 md:text-lg text-sm leading-relaxed max-w-[300px] md:max-w-[500px]">
            Your order has been completed successfully.
            Below is your payment receipt and delivery breakdown.
          </p>

        </div>

      </div>

      {/* RECEIPT */}

      <div className="relative z-10 px-4 md:px-0">

        <div
          ref={receiptRef}
          className="max-w-2xl mx-auto mt-3 bg-[#141414] border border-white/5 rounded-[38px] overflow-hidden shadow-2xl"
        >

          {/* TOP */}

          <div className="p-6 border-b border-white/5">

            <div className="flex items-center justify-between">

              <div>

              <h2 className=" text-lg mt-1">
                  {order.customerName}
                </h2>
                <p className="text-white/40 text-sm">
                  Receipt ID
                </p>

                <h2 className="font-semibold text-lg mt-1">
                  #{order.id.slice(0, 10)}
                </h2>

              </div>

              <div className="bg-orange-500/15 text-orange-400 px-4 py-2 rounded-full text-sm">
                Paid
              </div>

            </div>

          </div>

          {/* ITEMS */}

          <div className="p-6 space-y-5">

            {order.items?.map((item, index) => (

              <div
                key={index}
                className="flex justify-between items-start"
              >

                <div>

                  <div className="flex items-center gap-3">

                    <span className="text-white/40 font-bold">
                      {item.quantity}x
                    </span>

                    <div>

                      <p className="font-medium text-lg">
                        {item.name}
                      </p>

                      <p className="text-white/35 text-sm mt-1">
                        {item.shopName}
                      </p>

                    </div>

                  </div>

                </div>

                <p className="font-semibold text-lg">
                  ₦{item.price * item.quantity}
                </p>

              </div>

            ))}

          </div>

          {/* TOTALS */}

          <div className="px-6 py-5 border-t border-dashed border-white/10 space-y-4">

            <div className="flex justify-between text-white/60">
              <span>Products</span>
              <span>₦{subtotal}</span>
            </div>

            <div className="flex justify-between text-white/60">
              <span>Delivery</span>
              <span>₦{order.deliveryFee}</span>
            </div>

            <div className="flex justify-between text-white/60">
              <span>Service Fee</span>
              <span>₦0</span>
            </div>

            <div className="border-t border-white/10 pt-5 flex justify-between items-center">

              <span className="text-2xl font-bold">
                Total
              </span>

              <span className="text-3xl font-bold text-orange-400">
                ₦{order.totalAmount}
              </span>

            </div>

          </div>

          {/* DELIVERY */}

          <div className="p-6 border-t border-white/5 bg-black/20">

            <h3 className="font-semibold text-xl mb-4">
              Delivery Details
            </h3>

            <div className="space-y-3 text-white/60">

              <p>
                📍 {order.deliveryAddress?.display_name}
              </p>

              <p>
                👤 {order.customerName}
              </p>

              <p>
                🕒 {
                  new Date(
                    order.orderTime
                  ).toLocaleString()
                }
              </p>

            </div>

          </div>

        </div>

        {/* DOWNLOAD */}

        <div className="max-w-2xl mx-auto mt-6">

          <button
            onClick={downloadReceipt}
            className="w-full py-5 rounded-2xl bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-lg font-semibold shadow-[0_0_50px_rgba(255,115,0,0.3)]"
          >

            <i className="fa-solid fa-download mr-3"></i>

            Download Receipt

          </button>

        </div>

      </div>

    </div>
  );
}
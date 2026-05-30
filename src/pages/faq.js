import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Delivery takes 20 minutes to an hour depending on your location."
    },
    {
      q: "Can I return an item?",
      a: "Yes, returns are accepted within 7 days if unused and in original packaging."
    },
    {
      q: "Do you offer refunds?",
      a: "Refunds are processed within 3–7 business days after close inspection."
    },
    {
      q: "How can I contact support?",
      a: "Use the contact page or email support@shoppal.com"
    }
  ];

  return (
    <>
    <div className="min-h-screen bg-[#111111] text-white px-6 md:px-20 md:py-24 py-20 font-montserrat">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold font-bric">
          FAQ <span className="text-orange-500">Center</span>
        </h1>
        <p className="text-gray-400 mt-4 text-sm md:text-base">Everything you need to know</p>
      </motion.div>

      {/* ACCORDION */}
      <div className="max-w-3xl mx-auto mt-20 space-y-4">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="bg-[#1a1a1a] rounded-xl p-5 cursor-pointer"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold ">{item.q}</h3>
              <span className="text-orange-500 text-xl">
                {open === i ? "−" : "+"}
              </span>
            </div>

            <AnimatePresence>
              {open === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-gray-400 mt-3 text-xs md:text-base"
                >
                  {item.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>


      
    </div>
    <Footer />
    </>
  );
}

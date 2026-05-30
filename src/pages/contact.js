import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { db } from "../firebase";


export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [currentReview, setCurrentReview] = useState(0);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Customer",
    subject: "",
    message: "",
  });

  const whatsappNumber = "2347064539263";

  const faqs = [
    {
      question: "How long does delivery take?",
      answer:
        "Most orders are delivered within 30-90 minutes depending on the vendor and delivery distance.",
    },
    {
      question: "Can I create a shop on Shoppal?",
      answer:
        "Yes. Vendors can subscribe to one of our plans and instantly launch their own storefront.",
    },
    {
      question: "How are delivery fees calculated?",
      answer:
        "Delivery fees are calculated based on distance, location, and order size.",
    },
  ];

  const reviews = [
    {
      name: "Sophia R.",
      review:
        "Fast delivery, beautiful interface, and excellent support. Easily my favorite marketplace.",
    },
    {
      name: "Daniel M.",
      review:
        "Managing my store has never been easier. Inventory tracking is smooth and intuitive.",
    },
    {
      name: "Amara K.",
      review:
        "Love being able to order groceries, food, and tech products from one platform.",
    },
  ];

  // ==========================
  // SEND NOTIFICATION TO ADMINS
  // ==========================
  const sendToAdmins = async () => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "admin")
    );

    const snap = await getDocs(q);

    const promises = snap.docs.map((adminDoc) => {
      return updateDoc(doc(db, "users", adminDoc.id), {
        notifications: arrayUnion({
          subject: "New Contact Message",
          message: `
Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Type: ${form.type}

Subject: ${form.subject}

Message:
${form.message}
          `,
          read: false,
          createdAt: new Date().toISOString(),
        }),
      });
    });

    await Promise.all(promises);
  };

  // ==========================
  // SUBMIT HANDLER
  // ==========================
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;

    try {
      setLoading(true);

      await sendToAdmins();

      setSuccess(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        type: "Customer",
        subject: "",
        message: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white overflow-hidden font-montserrat">

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl z-50"
          >
            Message sent successfully 🚀
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-500/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[160px] rounded-full" />
      </div>

      {/* HERO */}
      <section className="relative px-6 md:px-20 md:pt-10 pt-5 pb-10 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 md:text-sm text-xs">
          <i className="fa-solid fa-headset"></i>
          Customer & Vendor Support
        </span>

        <h1 className="mt-8 text-4xl md:text-7xl font-bold leading-tight font-bric">
          Let's Build Something
          <span className="block text-orange-500">Amazing<br className="block md:hidden" /> Together</span>
        </h1>
      </section>

      {/* FORM + INFO */}
      <section className="px-1 md:px-20 py-0">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* FORM (UNCHANGED UI + LOGIC ADDED) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#1a1a1a] border border-white/10 rounded-3xl md:p-8 p-5 overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-500/10 blur-[120px] rounded-full" />

            <h2 className="md:text-3xl text-2xl font-bold font-bric">
              Send us a message
            </h2>

            <p className="text-gray-400 mt-2 mb-8 md:text-base text-xs">
              We'll get back to you as soon as possible.
            </p>

            {/* GRID INPUTS */}
            <div className="grid md:grid-cols-2 gap-4 md:text-base text-xs">

              
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Full Name"
                className="w-full pl-5 pr-4 py-3 bg-[#1a1a1a] border border-white/5 rounded-xl focus:border-orange-500 outline-none"
              />
              

              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Email Address"
                className="w-full pl-5 pr-4 py-3 bg-[#1a1a1a] border border-white/5 rounded-xl focus:border-orange-500 outline-none"
              />
            </div>

            <input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              placeholder="Phone Number"
              className="w-full mt-4 pl-5 pr-4 py-3 bg-[#1a1a1a] border border-white/5 rounded-xl focus:border-orange-500 outline-none md:text-base text-xs"
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="w-full mt-4 pl-5 pr-4 py-3 bg-[#111111] border border-white/5 rounded-xl focus:border-orange-500 outline-none md:text-base text-xs"
            >
              <option>Customer</option>
              <option>Vendor</option>
              <option>Delivery Partner</option>
            </select>

            <input
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              placeholder="Subject"
              className="w-full mt-4 pl-5 pr-4 py-3 bg-[#1a1a1a] border border-white/5 rounded-xl focus:border-orange-500 outline-none md:text-base text-xs"
            />

            <textarea
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              rows={3}
              placeholder="Message"
              className="w-full mt-4 pl-5 pr-4 py-3 bg-[#111111] border border-white/5 rounded-xl focus:border-orange-500 outline-none md:text-base text-xs"
            />

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-3 w-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl py-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 md:text-base text-xs"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <i className="fa-solid fa-paper-plane"></i>
                </>
              )}
            </button>

            {/* WHATSAPP */}
            <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
            <button className="mt-3 w-full bg-green-500 rounded-full py-4 font-semibold flex items-center justify-center gap-2 md:text-base text-xs">
              <i className="fa-brands fa-whatsapp text-xl"></i>
              Whatsapp
            </button>
            </a>
          </motion.div>

          {/* RIGHT SIDE UNTOUCHED */}
          <div className="space-y-6">

            <div className="bg-[#1a1a1a] rounded-3xl border border-white/5 p-8">
              <h3 className="md:text-3xl text-2xl font-bold font-bric">Why Contact Shoppal?</h3>

              <div className="space-y-5 mt-8 text-gray-300 md:text-base text-xs">
                <p><i className="fa-solid fa-shield-halved text-orange-500 mr-2"></i>Secure Communication</p>
                <p><i className="fa-solid fa-clock text-orange-500 mr-2"></i>Fast Response Times</p>
                <p><i className="fa-solid fa-truck-fast text-orange-500 mr-2"></i>Delivery Assistance</p>
                <p><i className="fa-solid fa-headset text-orange-500 mr-2"></i>Dedicated Vendor Support</p>
              </div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
              className="rounded-3xl h-[260px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
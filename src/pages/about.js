import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import abtimg from "../Assets/images/abtimg.jpg"

export default function AboutPage() {

  
  const navigate = useNavigate();
  const stats = [
    { label: "Active Users", value: "300+" },
    { label: "Products", value: "2K+" },
    { label: "Orders", value: "700+" },
    { label: "Shops", value: "100+" }
  ];

  const reviews = [
    {
      name: "Amara K.",
      text: "Honestly one of the smoothest delivery platforms I've used. Everything just feels premium and fast.",
      rating: "★★★★★"
    },
    {
      name: "Daniel M.",
      text: "The vendor shop system is brilliant. I can track inventory and orders without stress.",
      rating: "★★★★★"
    },
    {
      name: "Sofia R.",
      text: "Love how I can order groceries and tech in one place. Delivery is always on time.",
      rating: "★★★★★"
    }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: "Restaurants", desc: "Meals from top local vendors" },
    { name: "Groceries", desc: "Daily essentials delivered fast" },
    { name: "Tech", desc: "Devices & accessories" },
    { name: "Beauty & Pharmacy", desc: "Health & personal care" }
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white overflow-hidden font-montserrat">

      {/* HERO */}
      <div className="relative px-4 md:px-20 py-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-orange-500/10 blur-[120px] rounded-full" />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold font-bric"
        >
          Welcome to <span className="text-orange-500">Shoppal</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mt-6 max-w-2xl mx-auto md:text-lg text-sm"
        >
          A next-generation marketplace connecting users to restaurants, groceries,
          tech vendors, and pharmacies — all delivered to your doorstep seamlessly.
        </motion.p>
      </div>

      {/* STATS */}
      <div className="px-6 md:px-20 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1a1a1a] p-6 rounded-2xl text-center border border-white/5"
          >
            <p className="text-orange-500 text-3xl font-bold font-bric">{s.value}</p>
            <p className="text-gray-400 mt-2 md:text-sm text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* MISSION */}
      <div className="px-6 md:px-20 mt-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
        >
          <h2 className="text-3xl font-semibold font-bric">Our Mission</h2>
          <p className="text-gray-400 mt-4 leading-relaxed md:text-base text-xs">
            We are building a unified delivery ecosystem where vendors manage their shops,
            customers enjoy seamless ordering, and logistics happen effortlessly behind the scenes.
          </p>

          <p className="text-gray-400 mt-4 leading-relaxed md:text-base text-xs">
            Every shop on Shoppal is powered by subscription-based vendor plans,
            giving businesses tools to scale while we handle delivery and infrastructure.
          </p>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          src={abtimg}
          className="rounded-2xl md:h-[420px] h-auto w-full object-cover"
        />
      </div>

      {/* CATEGORIES */}
      <div className="px-6 md:px-20 mt-24">
        <h2 className="text-3xl font-semibold text-center mb-10 font-bric">What You Can Order</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5"
            >
              <h3 className="text-orange-500 font-semibold text-lg">{c.name}</h3>
              <p className="text-gray-400 md:text-sm text-xs mt-2">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="px-6 md:px-20 mt-24 text-center">
        <h2 className="text-3xl font-semibold mb-10 font-bric">What People Are Saying</h2>

        <div className="max-w-2xl mx-auto bg-[#1a1a1a] h-[220px] flex items-center px-10 rounded-2xl border border-white/5 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-orange-500 text-lg">{reviews[index].rating}</p>
              <p className="text-gray-300 mt-4 italic">"{reviews[index].text}"</p>
              <p className="mt-4 text-sm text-gray-500">— {reviews[index].name}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 md:px-20 mt-28 text-center md:pb-24 pb-2">
        <h2 className="md:text-3xl text-xl font-semibold font-bric">Ready to experience it?</h2>
        <p className="text-gray-400 mt-3 md:text-base text-xs">Join thousands already using Shoppal daily</p>

        <button className="mt-6 bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-full font-semibold md:text-base text-xs" onClick={()=> navigate("/#plans-section")}>
          Get Started
        </button>
      </div>


      <Footer />
    </div>
  );
}

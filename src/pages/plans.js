import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("shops");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const whatsappNumber = "2347064539263";

  const categories = [
    "restaurants",
    "tech",
    "shops",
  ];

  const plans = [
    {
      name: "Standard",
      price: "₦30k",
      color: "#a78bfa",
      border: "border-purple-400",
      badge: "",
      duration:
        "3 months listing period to showcase your products",
      products:
        selectedCategory === "restaurants"
          ? "List up to 25 products"
          : "List up to 50 products",
      shops: "1 Shop",
    },

    {
      name: "Pro",
      price: "₦55k",
      color: "#f4b77d",
      border: "border-orange-300",
      badge: "POPULAR",
      duration:
        "6 months listing period to showcase your products",
      products:
        selectedCategory === "restaurants"
          ? "List up to 50 products"
          : "List up to 100 products",
      shops: "1 Shop",
    },

    {
      name: "Max",
      price: "₦100k",
      color: "#bdddf4",
      border: "border-sky-200",
      badge: "POWER USER",
      duration:
        "12 months listing period to showcase your products",
      products: "Unlimited product listing",
      shops: "Unlimited Shops",
    },
  ];

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setPopup(null);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setEmail("");
    setMessage("");
  };

  const sendRequest = async () => {
    if (!email || !message) {
      setPopup("error");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        "service_wy8r2ij",
        "template_6n4edtf",
        {
          title: selectedPlan.name,
          price: selectedPlan.price,
          category: selectedCategory,
          email,
          message,
        },
        "acn5iRbpm8_vilvsV"
      );

      setPopup("success");
      setLoading(false);

      setTimeout(() => {
        closeModal();
      }, 2000);

    } catch (err) {
      console.log(err);
      setPopup("error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-10 overflow-hidden">

      {/* HEADER */}
      <div className="text-center">

        <h1 className="text-5xl md:text-7xl font-bold">
          Choose a plan
        </h1>

        <p className="text-white/40 md:text-base text-sm mt-4 font-montserrat">
          Scale your business visibility on ShopPal
        </p>

      </div>

      {/* CATEGORY SLIDER */}
      <div className="flex justify-center mt-8">

        <div className="bg-[#111111] border border-white/10 rounded-full p-1 flex gap-2">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full transition-all duration-300 capitalize font-semibold ${
                selectedCategory === cat
                  ? "bg-white text-black"
                  : "text-white/60"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>

      </div>

      {/* PLANS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-14">

        {plans.map((plan, i) => (

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`relative rounded-[35px] border ${plan.border} bg-[#111111] overflow-hidden`}
          >

            {/* TOP LABEL */}
            {plan.badge && (
              <div
                style={{
                  background: plan.color,
                  color: "#111",
                }}
                className="w-full py-3 px-6 font-bold text-sm"
              >
                {plan.badge}
              </div>
            )}

            <div className="p-7">

              {/* NAME */}
              <h2 className="text-4xl font-bold">
                {plan.name}
              </h2>

              {/* PRICE */}
              <div className="mt-5 flex items-end gap-2">

                <span
                  className="text-5xl font-bold"
                  style={{ color: plan.color }}
                >
                  {plan.price}
                </span>

                <span className="text-white/60 mb-2">
                  /plan
                </span>

              </div>

              {/* DESCRIPTION */}
              <p className="text-white/50 mt-5 md:text-base text-sm leading-relaxed font-montserrat">
                Grow your {selectedCategory} business and
                reach more customers.
              </p>

              {/* BUTTON */}
              <button
                onClick={() => openModal(plan)}
                style={{
                  background: plan.color,
                  color: "#111",
                }}
                className="w-full py-4 rounded-2xl font-bold mt-8 hover:scale-[1.02] transition"
              >
                Upgrade to {plan.name}
              </button>

              {/* FEATURES */}
              <div className="border-t border-white/10 mt-8 pt-8 space-y-5">

                <div className="flex gap-3">
                  <i className="fa-solid fa-check mt-1"></i>
                  <p>{plan.duration}</p>
                </div>

                <div className="flex gap-3">
                  <i className="fa-solid fa-check mt-1"></i>
                  <p>Access to store inventory</p>
                </div>

                <div className="flex gap-3">
                  <i className="fa-solid fa-check mt-1"></i>
                  <p>{plan.products}</p>
                </div>

                <div className="flex gap-3">
                  <i className="fa-solid fa-check mt-1"></i>
                  <p>{plan.shops}</p>
                </div>

                {/* SMALL FEATURE BOXES */}
                <div className="space-y-3 mt-8">

                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    Premium visibility
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    Better customer reach
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    Inventory management
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    Business growth tools
                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

      {/* MODAL */}
      <AnimatePresence>

        {selectedPlan && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              style={{
                borderColor: selectedPlan.color,
              }}
              className="bg-[#111111] border-2 w-full max-w-lg rounded-[35px] p-7 relative overflow-hidden font-montserrat"
            >

              {/* CLOSE */}
              <button
                onClick={closeModal}
                className="absolute right-5 top-5 text-white/50 hover:text-white"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>

              <h2 className="text-4xl font-bold">
                {selectedPlan.name}
              </h2>

              <p
                style={{
                  color: selectedPlan.color,
                }}
                className="text-3xl font-bold mt-2"
              >
                {selectedPlan.price}
              </p>

              <p className="text-white/40 mt-4 md:text-base text-sm">
                {selectedCategory} business plan
              </p>

              {/* INPUTS */}
              <div className="mt-8 space-y-4">

                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-2 md:p-4 outline-none md:text-base text-sm"
                />

                <textarea
                  placeholder="Tell us about your business..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  className="w-full min-h-[140px] bg-white/5 border border-white/10 rounded-2xl p-2 md:p-4 outline-none md:text-base text-sm"
                />

              </div>

              {/* STATUS */}
              {popup === "success" && (
                <div className="text-green-400 mt-4 md:text-base text-sm">
                  Request sent successfully ✔
                </div>
              )}

              {popup === "error" && (
                <div className="text-red-400 mt-4 md:text-base text-sm">
                  Please complete all fields ❌
                </div>
              )}

              {/* BUTTONS */}
              <div className="grid grid-cols-2 gap-4 mt-8">

                <button
                  onClick={sendRequest}
                  disabled={loading}
                  style={{
                    background: selectedPlan.color,
                    color: "#111",
                  }}
                  className="md:py-4 py-2 rounded-2xl font-bold md:text-base text-sm"
                >
                  {loading ? "Sending..." : "Send Request"}
                </button>

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 md:py-4 py-2 rounded-2xl font-bold flex items-center justify-center gap-3 md:text-base text-sm"
                >
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                  WhatsApp
                </a>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}
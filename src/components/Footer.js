import { useNavigate } from "react-router-dom"


const Footer = () => {

const navigate = useNavigate()

return (

<footer className="relative mt-20 rounded-t-3xl overflow-hidden border-t border-white/10 bg-[#070707] text-white font-montserrat">

{/* GLOW BLOBS */}

<div className="absolute top-[-120px] left-[-100px] w-[300px] h-[300px] bg-orange-500/10 blur-[120px] rounded-full"></div>

<div className="absolute bottom-[-120px] right-[-80px] w-[260px] h-[260px] bg-orange-400/10 blur-[100px] rounded-full"></div>

{/* NOISE */}

<div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>

<div className="relative z-10 px-6 md:px-16 py-16">

  {/* TOP */}

  <div className="flex flex-col lg:flex-row justify-between gap-16">

    {/* LEFT */}

    <div className="max-w-[450px]">

      {/* LOGO */}

      <div className="flex items-center gap-3">

        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(255,115,0,0.35)]">

          <i className="fa-solid fa-bag-shopping text-xl"></i>

        </div>

        <div>

          <h2 className="text-3xl font-bold font-bric">
            ShopPal
          </h2>

          <p className="text-white/40 text-sm">
            Fast delivery. Modern shopping.
          </p>

        </div>

      </div>

      {/* DESCRIPTION */}

      <p className="mt-6 text-white/55 leading-relaxed text-xs md:text-base">

        ShopPal connects users with nearby vendors for food,
        groceries, tech, pharmacy and more — delivered quickly
        with a smooth modern experience.

      </p>

      {/* SOCIALS */}

      <div className="flex gap-4 mt-8">

        <a
          href="https://www.instagram.com/shoppal.network?igsh=MzdzaG5ta21ob2t3&utm_source=qr"
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
        >
          <i className="fa-brands fa-instagram"></i>
        </a>

        <a
          href="https://www.linkedin.com/company/shoppalnetwork/"
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
        >
          <i className="fa-brands fa-linkedin"></i>
        </a>

        <a
          href="https://www.tiktok.com/@shoppalnetwork?_r=1&_t=ZS-96mMMQk57vo"
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
        >
          <i className="fa-brands fa-tiktok"></i>
        </a>

        <a
          href="https://www.facebook.com/share/1amChHuH9H/?mibextid=wwXIfr"
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
        >
          <i className="fa-brands fa-facebook-f"></i>
        </a>

      </div>

    </div>

    {/* RIGHT */}

    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">

      {/* COMPANY */}

      <div>

        <h3 className="font-bold text-lg mb-5">
          Company
        </h3>

        <div className="space-y-4 text-white/50 md:text-sm text-xs">

          <a
            onClick={()=> navigate("/about")}
            className="block hover:text-orange-400 transition cursor-pointer"
          >
            About
          </a>

          <a
            onClick={()=> navigate("/contact")}
            className="block hover:text-orange-400 transition cursor-pointer"
          >
            Contact
          </a>

          <a
            onClick={()=> navigate("/faq")}
            className="block hover:text-orange-400 transition cursor-pointer"
          >
            FAQ
          </a>

        </div>

      </div>

      {/* LEGAL */}

      <div>

        <h3 className="font-bold text-lg mb-5">
          Legal
        </h3>

        <div className="space-y-4 text-white/50 md:text-sm text-xs cursor-pointer">

          <a
            onClick={()=> navigate("/tnc")}
            className="block hover:text-orange-400 transition"
          >
            Terms
          </a>

          <a
            onClick={()=> navigate("/tnc")}
            className="block hover:text-orange-400 transition"
          >
            Privacy
          </a>

          <a
            onClick={()=> navigate("/tnc")}
            className="block hover:text-orange-400 transition"
          >
            Cookies
          </a>

        </div>

      </div>

      {/* SERVICES */}

      <div>

        <h3 className="font-bold text-lg mb-5">
          Services
        </h3>

        <div className="space-y-4 text-white/50 md:text-sm text-xs">

          <a
            onClick={()=> navigate("/")}
            className="block hover:text-orange-400 transition cursor-pointer"
          >
            Food Delivery
          </a>

          <a
           onClick={()=> navigate("/")}
            className="block hover:text-orange-400 transition cursor-pointer"
          >
            Groceries
          </a>

          <a
            onClick={()=> navigate("/")}
            className="block hover:text-orange-400 transition cursor-pointer"
          >
            Tech & Gadgets
          </a>

        </div>

      </div>

    </div>

  </div>

  {/* NEWSLETTER */}

  <div className="mt-20 bg-white/[0.03] border border-white/10 rounded-[32px] p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-xl">

    <div>

      <h3 className="text-2xl md:text-3xl font-bold font-bric">
        Stay Updated
      </h3>

      <p className="text-white/45 mt-2 text-xs md:text-base">
        Get updates, discounts and new vendor drops.
      </p>

    </div>

    <div className="md:flex w-full lg:w-auto gap-3">

      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 lg:w-[320px] bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-white/25"
      />

      <button className="md:mt-0 mt-4 px-7  md:py-4 py-2 rounded-2xl bg-orange-500 hover:bg-orange-600 transition-all duration-300 font-semibold shadow-[0_0_40px_rgba(255,115,0,0.25)]">

        Join

      </button>

    </div>

  </div>

  {/* BOTTOM */}

  <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-5 justify-between items-center">

    <p className="text-white/35 md:text-sm text-xs text-center md:text-left">
      © 2026 ShopPal. All rights reserved.
    </p>

    <div className="flex items-center gap-6 text-white/35 md:text-sm text-xs">

      <a
        href="/terms"
        className="hover:text-orange-400 transition"
      >
        Terms
      </a>

      <a
        href="/privacy"
        className="hover:text-orange-400 transition"
      >
        Privacy
      </a>

      <a
        onClick={()=> navigate("/contact")}
        className="hover:text-orange-400 transition cursor-pointer "
      >
        Contact
      </a>

    </div>

  </div>

</div>

</footer>

)

}

export default Footer
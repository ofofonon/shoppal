import dasherpic from "../../Assets/images/portrait-young-african-guy-accepts-order-by-phone-motorbike-holding-boxes-with-pizza-sit-his-bike-urban-place (2).jpg"
import { useNavigate } from "react-router-dom"

export default function BecomeMerchantCard() {

  const navigate = useNavigate();

  const cards = [
    {
      id: 1,
      title: "Become a Rider",
      text: "Deliver orders quickly and earn by completing deliveries across your city.",
      cta: "Start Delivering",
      image:
        "https://cdn-icons-png.flaticon.com/512/1995/1995479.png",
    },
    {
      id: 2,
      title: "Become a Vendor",
      text: "List your shop on Shoppal and reach thousands of active customers instantly.",
      cta: "Register Shop",
      image:
        "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
    },
    {
      id: 3,
      title: "Best Shoppal Experience",
      text: "Enjoy fast browsing, smooth checkout, and premium shopping convenience.",
      cta: "Coming soon",
      image:
        "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    },
  ];


return (
    <div>
  <div className="w-[95%] bg-gradient-to-r from-orange-600 to-[#111111] text-white ml-[2.5%] px-5 md:px-8 py-8 md:py-5 rounded-[30px] relative overflow-hidden">
    <div className="md:flex items-center justify-between">
      {/* LEFT CONTENT */}
      <div className="max-w-xl">
        <h2 className="text-3xl md:text-[50px] font-bric font-semibold tracking-tight">
          Become a Rider
        </h2>

        <p className="text-white/60 mt-3 text-[13px] md:text-base leading-relaxed font-montserrat">
        Deliver orders across your city and turn your time into steady daily income. Whether you ride a bike, scooter, or car — Shoppal connects you directly to customers ordering food, groceries, tech, and pharmacy items near you
        </p>

        <button className="mt-6 px-6 py-3 bg-orange-500 hover:bg-purple-700 transition-all duration-300 rounded-full text-sm md:text-base font-medium shadow-lg shadow-orange-600/20" onClick={() => navigate("/contact")}>
          Get Started
        </button>
      </div>

      {/* RIGHT IMAGE (HIDDEN ON MOBILE) */}
      <div className="md:w-[500px]  relative">
        {/* glow effect */}
        <div className="md:absolute relative md:inset-0 bg-purple-600/20 blur-3xl rounded-full" />

        <img
          src={dasherpic}
          alt="Become a merchant"
          className="relative md:w-full w-full  h-auto object-cover rounded-2xl shadow-2xl mt-6 md:mt-0"
          loading="lazy"
        />
      </div>
    </div>

   
  </div>

  
 </div>
);
}

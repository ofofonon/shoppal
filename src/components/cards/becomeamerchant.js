import vendorpic from "../../Assets/images/sustainable-products-modern-shop (1).jpg"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

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
            link:"/signup?role=vendor"
        },
        {
          id: 3,
          title: "Best Shoppal Experience",
          text: "Enjoy fast browsing, smooth checkout, and premium shopping convenience.",
          cta: "Coming soon",
          image:
            "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
          pv: "plans-section"
        },
      ];


    return (
        <div>
      <div className="w-[95%] bg-gradient-to-r from-[#111111] to-orange-600 text-white ml-[2.5%] px-5 md:px-8 py-8 md:py-5 rounded-[30px] relative overflow-hidden">
        <div className="md:flex items-center justify-between">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-[50px] font-bric font-semibold tracking-tight">
              Become a Vendor
            </h2>
  
            <p className="text-white/60 mt-3 text-[13px] md:text-base leading-relaxed font-montserrat">
              Join Shoppal and turn your business into a modern digital storefront. 
              Reach more customers, manage your shop effortlessly, and grow your
              sales with a platform built for scalable commerce.
            </p>
  
            <button className="mt-6 px-6 py-3 bg-orange-500 hover:bg-purple-700 transition-all duration-300 rounded-full text-sm md:text-base font-medium shadow-lg shadow-orange-600/20" onClick={()=> navigate("/signup?role=vendor")}>
              Get Started
            </button>
          </div>
  
          {/* RIGHT IMAGE (HIDDEN ON MOBILE) */}
          <div className="md:w-[500px]  relative">
            {/* glow effect */}
            <div className="md:absolute relative md:inset-0 bg-purple-600/20 blur-3xl rounded-full" />
  
            <img
              src={vendorpic}
              alt="Become a merchant"
              className="relative md:w-full w-full  h-auto object-cover rounded-2xl shadow-2xl mt-6 md:mt-0"
              loading="lazy"
            />
          </div>
        </div>

       
      </div>

       <div className="w-full py-12 px-4 md:px-10  text-white md:mt-0 mt-[-30px]">
       {/* HEADER */}
       <motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  viewport={{ once: false, amount: 0 }}
  className="overflow-y-visible "
>
       
       {/* HORIZONTAL SCROLL AREA */}
       <div className="md:flex gap-5 overflow-x-auto overflow-y-visible snap-x snap-mandatory px-2 py-2 pb-4 scrollbar-hide">
         {cards.map((card) => (
           <div
             key={card.id}
             className="min-w-[78%] md:min-w-[320px] snap-start bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/10 rounded-[26px] p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 md:mt-0 mt-3" 
           >
            
             {/* IMAGE */}
             <div className="md:w-14 w-10 md:h-14 h-10 mb-4 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden">
               <img
                 src={card.image}
                 alt={card.title}
                 className="md:w-10 w-7 md:h-10 h-7 object-contain"
                 loading="lazy"
               />
             </div>
 
             {/* TEXT */}
             <div id={card.pv}>
               <h3 className="text-lg md:text-xl font-semibold font-bric">
                 {card.title}
               </h3>
 
               <p className="text-white/50 md:text-sm text-[13px] mt-2 font-montserrat leading-relaxed">
                 {card.text}
               </p>
             </div>
 
             {/* CTA */}
             <div className="mt-2  rounded-full text-orange-500  transition-all duration-300 md:text-sm text-[13px] font-medium cursor-pointer"  onClick={()=> navigate(card.link)}>
               {card.cta}
             </div>
             
           </div>
           

         ))}


         
       </div>
       </motion.div>
     </div>
     </div>
    );
  }
  
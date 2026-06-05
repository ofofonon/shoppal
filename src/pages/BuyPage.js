import { useState, useRef, useEffect } from "react"
import Shopshowcase from "../components/cards/shopshowcase"
import Becomeamerchant from "../components/cards/becomeamerchant"
import Becomeadasher from "../components/cards/becomeadasher"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useLocation } from "../context/LocationContext";
import AdSlider from "../components/cards/adslider";

import { motion, AnimatePresence } from "framer-motion"
import { shops } from "../data/shops/index"
import { useNavigate } from "react-router-dom"
import logowhite from "../logos/ShopPal logo white.PNG"
import food1 from "../logos/freepik_br_b67262ec-0148-4c5a-8867-a35d386c5732.avif"
import food2 from "../logos/freepik_br_d3f69d9e-75a9-4870-9722-e21bbafd92e5.avif"
import food3 from "../logos/Burger.avif"
import food4 from "../logos/grocery.avif"
import grocery from "../Assets/images/woman-shopping-vegetables-supermarket (1).jpg"
import LocationModal from "../components/LocatioModal";
import coolestad from "../Assets/images/Nano_Banana_2_-_Produce_this_image_in_the_highest_quality_possible__make_it_sharp_and_good__DO_NOT_T.jpg"
import ora1 from "../Assets/images/Ora design 2.PNG"
import ora2 from "../Assets/images/Ora design 3.webp"
import ora3 from "../Assets/images/Ora design.webp"
import pab from "../Assets/images/Pharm & beauty.webp"
import tech from "../Assets/images/Tech .webp"
import city from "../Assets/images/indian-city-scene (1).jpg"
import Footer from "../components/Footer";
import TypingButton from "../components/typebut";



const BuyPage = () => {
  
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userData] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isLoggedIn = !!user;

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






  const { location, saveLocation } = useLocation();
  
  const handleshopopen = async () => {

    if (!auth.currentUser) {
      navigate("/login");
      return;
    }
  
    // ✅ CHECK CONTEXT LOCATION INSTEAD
    if (!location?.lat || !location?.lng) {
      setShowLocationModal(true);
      return;
    }
  
    navigate("/shops-page");
  };

  const handleCategoryClick = (category) => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }
  
    if (!location?.lat || !location?.lng) {
      setShowLocationModal(true);
      return;
    }
  
    navigate(`/shops-page?category=${category}`);
  };
  
  


  return (

    <>

    <div className="min-h-screen bg-[#111111]  font-bric relative max-w-screen overflow-x-hidden">
      
      
      <div className="relative flex w-full md:h-[600px] h-[450px] bg-orange-500 items-center overflow-hidden md:rounded-b-[50px] rounded-b-[30px]">
      <div className="animate-slowSpin absolute md:w-[80%] w-[170%] top-[130px] md:top-5 md:left-[50%] left-[0%]  ">
      <img src={food1} alt="food" className="w-full" />
      </div>
      <div className=" absolute md:w-[60%] w-[90%] top-[-100px] left-[-25%]  md:left-[-12%] -rotate-45">
      <img src={food2} alt="food" className="w-full" />
      </div>
      <div className="absolute top-0 right-0 flex gap-3 font-montserrat mt-5 m-2">


            <div className="flex items-center gap-4">

      {isLoggedIn  ? (
        // 👇 LOGGED IN STATE
        <div
        onClick={() =>
          navigate(
            user.role === "admin"
              ? "/admin-profile"
              : user.role === "vendor"
              ? "/vendor-profile"
              : "/user-profile"
          )
        }
          className="flex items-center gap-2 cursor-pointer bg-white pr-2 py-0 rounded-full"
        >
          <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold">
          <i className="fa-solid fa-user cursor-pointer md:text-base text-sm"
                  
                ></i>
          </div>

          <span className="md:text-sm text-[11px] font-montserrat font-bold">
            {user.name?.split(" ")[0]}
          </span>
        </div>

      ) : (
        // 👇 LOGGED OUT STATE
        <>
        <button className="bg-white rounded-full  text-black font-bold md:text-base text-[11px] md:px-7 px-3 py-1  font-montserrat" onClick={() => navigate("/login")}> Login</button>
                  <button className="bg-[#111111] rounded-full md:text-base text-[11px] text-white font-bold md:px-7 px-3 py-1  font-montserrat" onClick={() => navigate("/signup")}> Signup</button>
        </>
      )}

      </div>
          </div>


      <div className="relative py-0 px-2 mx-0 my-0">
      <img src={logowhite} alt="logo" className="md:w-[12%] w-[34%] md:ml-[44%] ml-[33%] m-0" /><br/>
      <p className="text-white font-bric font-bold text-3xl md:text-[50px] text-center mt-[-9px] md:mt-[-5px]">ORDER AND BE BACK FOR MORE</p>
      <div className="relative md:w-[40%] w-[90%] ml-[5%] md:ml-[30%] md:mt-4 mt-1">
         
          <button
            onClick={() => setShowLocationModal(true)}
            className="relative md:w-[100%] w-[100%]  border border-[1px] rounded-full py-3 md:py-5 text-sm md:text-lg bg-white text-[#111111] text-start font-montserrat"
          >
          
             <i className="fa-solid fa-location-dot text-orange-600 md:text-[26px] text-md pr-4 md:pl-10 pl-10"></i>

            <span className="max-w-[120px] truncate">
            {location?.display_name
              ? location.display_name.slice(0, 20) + "..."
              : "Enter Your Location"}
            </span>
          </button> 
     </div>

     <div className="flex justify-center">
     <div className="flex gap-3 font-montserrat mt-5">
            


            {user ? (
        // 👇 LOGGED IN STATE
        <div
          onClick={() => navigate(
            user.role === "admin"
              ? "/admin-profile"
              : user.role === "vendor"
              ? "/vendor-profile"
              : "/user-profile"
          )}
          className=""
        >
          <button className="bg-white rounded-full md:text-base text-sm  text-black font-bold w-10 h-10"><i class="fa-solid fa-user text-black"></i>  </button>
        </div>

      ) : (
        // 👇 LOGGED OUT STATE
        <>
        <button className="bg-white rounded-full md:text-base text-[11px]  text-black font-bold px-3 md:px-10 py-3 md:py-3"><i class="fa-solid fa-user text-black"></i>  Login</button>
        </>
      )}



            <button className="bg-[#111111] rounded-full  text-white font-bold px-3 md:px-10 py-3 md:py-3 md:text-base text-[11px] "
            onClick={() => setShowLocationModal(true)} ><i class="fa-solid fa-location-arrow text-white md:text-base text-sm "></i> Use current Location</button>
          </div>
     </div>
      </div>
      </div>


  

  <div className="relative">
    <Shopshowcase />
  </div>


  

  
  <div className="md:mt-5 mt-5 relative ">

  {/* BIG GOOFY GLOW BLOBS */}

  <div className="absolute top-[10%] left-[-120px] w-[280px] h-[280px] bg-orange-500/20 blur-[90px] rounded-full animate-pulse"></div>

  <div className="absolute bottom-[-80px] right-[-100px] w-[240px] h-[240px] bg-orange-400/20 blur-[100px] rounded-full animate-pulse"></div>

  <div className="absolute top-[40%] left-[35%] w-[180px] h-[180px] bg-orange-300/10 blur-[80px] rounded-full"></div>

  {/* FLOATING STARS */}

  <div className="absolute top-[18%] left-[12%] text-orange-400/40 text-xl rotate-12 animate-bounce">
    ✦
  </div>

  <div className="absolute md:top-[28%] top-[60%] md:right-[18%] right-[40%] text-orange-300/30 text-2xl animate-pulse">
    ✦
  </div>

  <div className="absolute md:bottom-[18%] bottom-[80%] md:left-[30%] left-[90%] text-orange-500/30 text-lg animate-bounce delay-300">
    ✦
  </div>

  <div className="absolute md:bottom-[0%] bottom-[0%] md:left-[90%] left-[90%] text-orange-500/30 text-lg animate-pulse delay-300">
    ✦
  </div>
  

  {/* HEADING */}

  <p className="relative z-10 text-white text-center font-bold text-3xl md:text-[50px] leading-none md:mt-10 mt-4">
    Select a
    <br className="block md:hidden" />
    <span className="text-orange-500"> Category</span>
  </p>

  {/* CATEGORY SECTION */}

  <div className="md:flex md:justify-center relative z-10">

    {/* LEFT SIDE */}

    <div className="flex md:w-[40%] w-[100%] gap-4 font-bric p-3 md:p-3 font-montserrat">

      {/* FOOD */}

      <div className="relative flex-1 group cursor-pointer"  onClick={() => handleCategoryClick("food")}>

        {/* GLOW CARD */}

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent blur-2xl rounded-full scale-90 group-hover:scale-110 transition duration-500"></div>

        {/* ORANGE SPLASH */}

        <img
          src={ora3}
          alt="ora1"
          className="absolute w-[68%] md:w-[50%] top-[-20px] ml-[16%] md:ml-[25%] rotate-[-8deg]"
        />

        {/* PRODUCT */}

        <img
          src={food3}
          alt="food"
          className="relative md:w-[40%] w-[60%] ml-[20%] md:ml-[30%] hover:scale-110 transition duration-500"
        />

        {/* LABEL */}

        <p className="mt-3 font-bold text-center md:text-sm text-[10px] text-white relative tracking-widest">
          FOOD
        </p>

      </div>

      {/* GROCERY */}

      <div className="relative flex-1 group overflow-visible cursor-pointer"  onClick={() => handleCategoryClick("grocery")}>

        {/* GLOW */}

        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent blur-2xl rounded-full scale-90 group-hover:scale-110 transition duration-500"></div>

        <img
          src={ora2}
          alt="ora1"
          className="absolute w-[100%] md:w-[80%] top-[-60px] ml-[8%] md:ml-[15%] max-w-none rotate-[10deg]"
        />

        <img
          src={food4}
          alt="food"
          className="md:w-[50%] w-[60%] ml-[25%] md:ml-[25%] relative hover:scale-110 transition duration-500"
        />

        <p className="mt-3 font-bold text-center md:text-sm text-[10px] text-white relative tracking-widest">
          GROCERY
        </p>

      </div>

    </div>

    {/* RIGHT SIDE */}

    <div className="flex md:w-[40%] w-[100%] gap-4 font-bric p-3 md:p-3 font-montserrat">

      {/* TECH */}

      <div className="relative flex-1 group overflow-visible cursor-pointer" onClick={() => handleCategoryClick("tech")}>

        {/* GLOW */}

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent blur-2xl rounded-full scale-90 group-hover:scale-110 transition duration-500"></div>

        <img
          src={ora2}
          alt="ora1"
          className="absolute w-[100%] md:w-[80%] top-[-60px] ml-[8%] md:ml-[15%] max-w-none rotate-[10deg]"
        />

        <img
          src={tech}
          alt="food"
          className="md:w-[50%] w-[60%] ml-[25%] md:ml-[25%] relative hover:scale-110 transition duration-500"
        />

        <p className="mt-3 font-bold text-center md:text-sm text-[10px] text-white relative tracking-widest">
          TECH.
        </p>

      </div>

      {/* PHARMACY */}

      <div className="relative flex-1 group cursor-pointer" onClick={() => handleCategoryClick("pharmacy")}>

        {/* GLOW */}

        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent blur-2xl rounded-full scale-90 group-hover:scale-110 transition duration-500"></div>

        <img
          src={ora3}
          alt="ora1"
          className="absolute w-[68%] md:w-[50%] top-[-20px] ml-[16%] md:ml-[25%] rotate-[-8deg]"
        />

        <img
          src={pab}
          alt="food"
          className="relative md:w-[40%] w-[60%] ml-[20%] md:ml-[30%] hover:scale-110 transition duration-500"
        />

        <p className="mt-3 font-bold text-center md:text-sm text-[10px] text-white relative tracking-widest leading-tight">
          PHARMACY &
          <br />
          BEAUTY
        </p>

      </div>

    </div>

  </div>

</div>  


<motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  viewport={{ once: false, amount: 0 }}
>
  <div className="md:mt-[80px] mt-10 relative">
  <Becomeamerchant />
  </div>

  </motion.div>

  

  <div className="relative text-center mt-10"  onClick={handleshopopen}>
  <div className="absolute md:top-[18%] top-[-5%] left-[12%] text-orange-400/40 text-xl rotate-12 animate-bounce">
    ✦
  </div>

  <div className="absolute md:top-[28%] top-[60%] md:right-[18%] right-[73%] text-orange-300/30 text-2xl animate-pulse">
    ✦
  </div>

  <div className="absolute md:bottom-[18%] md:top-auto top-[-2%] md:left-[30%] left-[90%] text-orange-500/30 text-lg animate-bounce delay-300">
    ✦
  </div>

  <div className="absolute md:bottom-[0%] bottom-[0%] md:left-[90%] left-[90%] text-orange-500/30 text-lg animate-pulse delay-300">
    ✦
  </div>
    <p className="relative text-white font-bold md:text-[50px] text-4xl leading-none px-3 md:px-0">
      Convinience <span className="text-orange-500 rotate-12 animate-bounce animate-pulse delay-500">Stores at</span> <br className="hidden md:block"/> Your Doorstep
    </p>
    <p className="relative text-white/50 font-montserrat mt-5 md:text-sm text-[13px] px-10 md:px-0">
      Stock up on snacks, household essentials, candy, or vitamins <br className="hidden md:block"/> - all delivered really quickly...
    </p>

   <TypingButton />
  </div>
     

  <motion.div
  initial={{ opacity: 0, x: 60 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: false, amount: 0 }}
>
   <div className="relative mt-20 md:w-[60%] w-[95%] rounded-3xl ml-[2.5%] md:ml-[20%] overflow-hidden ">
      <div className="flex absolute items-center bg-orange-500/70 w-full h-full top-0">
      <div className="w-full text-center">
      <img src={logowhite} alt="logo" className="md:w-[16%] w-[40%] ml-[30%] md:ml-[42%] mt-0 md:mt-10 text-center p-3" />
      <p className="text-white text-center font-bold md:text-[50px] text-[25px] leading-none">
      Get Groceries and<br/>Convinience Store<br/>Esentials
    </p>
    <button className="bg-[#111111] hover:bg-white hover:text-orange-500 transition-colors duration-900  text-white rounded-full md:py-2 py-4 md:px-[90px] px-[50px] mt-5 font-montserrat text-sm md:text-base" onClick={handleshopopen}>
      Shop Groceries
    </button>
      </div>
      </div>
      <img src={grocery} alt="grocery" className="h-auto"/>
      
    </div>
    </motion.div>


    <AdSlider />

    
    <motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  viewport={{ once: false, amount: 0 }}
>
    <div className="">
      <Becomeadasher />
    </div>
    </motion.div>
    
    
          
    <div className="relative w-[80%] ml-[10%] h-[300px] md:h-[450px] overflow-hidden  bg-[#111111] ">

{/* IMAGE */}
<img
  src={city}
  alt="banner"
  className="w-full h-full object-cover"
/>



{/* LEFT FADE */}
<div className="absolute top-0 left-0 h-full w-[60%] bg-gradient-to-r from-[#111111] to-transparent z-8"></div>

{/* RIGHT FADE */}
<div className="absolute top-0 right-0 h-full w-[60%] bg-gradient-to-l from-[#111111] to-transparent z-8">
  
</div>

<div className="flex w-full absolute items-center justify-center h-[300px] md:h-[450px] top-0 w-full z-21">
  <div className="">
    <p className="text-white text-center text-4xl md:text-[60px] font-bold leading-[50px] font-montserrat ">
      Delivered<br/><span className="text-orange-500">To</span><br/>Your<br/><span className="text-orange-500"><i className="fa-solid fa-location-dot "></i> Doorstep</span>
    </p>
  </div>
</div>

<div className="absolute top-[30%] md:top-[37%] left-[14%] md:left-[34%] p-2 font-bold  flex items-center font-montserrat justify-center text-xs md:text-base bg-orange-500 rounded-full text-white  z-18 rotate-[20deg]">
    Abuja  
</div>

<div className="absolute top-[12%] md:top-[20%] p-2 font-bold  flex items-center font-montserrat justify-center text-xs md:text-base bg-orange-500 rounded-full text-white  z-25 -rotate-[10deg] right-[20%] md:right-[40%] rotate-12 animate-bounce ">
    Uyo  
</div>

<div className="absolute top-[53%] md:top-[60%] left-[0%] md:left-[27%] p-2 font-bold  flex items-center font-montserrat justify-center  bg-[#111111] rounded-full text-orange-500  z-18 -rotate-[30deg] rotate-7 animate-bounce text-xs md:text-base">
    Lagos 
</div>

<div className="absolute top-[80%] md:top-[76%] left-[50%] p-2 font-bold  flex items-center font-montserrat justify-center text-xs bg-[#111111] rounded-full text-orange-500  z-18 rotate-[10deg] text-xs md:text-base">
    Port Harcourt 
</div>



</div>


<div className="flex items-center w-full md:w-[90%] md:ml-[5%] md:rounded-2xl  overflow-hidden md:h-[350px] h-auto">
      <img src={coolestad} alt=" " className="w-full" />
    </div>





     {/* REVIEWS */}
     <div className="px-6 md:px-20 mt-24 text-center">
        <h2 className="text-3xl font-semibold mb-10 font-bric text-white">What People Are <span className="text-orange-500">Saying</span></h2>

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

    <Footer />


     </div>

     {
                  showLocationModal && (

                    <LocationModal
                      closeModal={() =>
                        setShowLocationModal(false)
                      }
                      saveLocation={saveLocation}
                    />

                  )
                }
    
     </> 
  )
}

export default BuyPage
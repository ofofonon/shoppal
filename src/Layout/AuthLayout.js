import { Outlet } from "react-router-dom";
import wom from "../Assets/images/female-shopkeeper-smiling-camera (1).jpg"

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex md:items-center justify-center px-4">

      <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10">

        {/* LEFT BRAND PANEL */}
        <div className="hidden relative md:flex flex-col justify-center p-12 bg-gradient-to-br from-[#111111] to-black">

        <div className="absolute inset-0  bg-cover">
        <img src={wom} className="  opacity-20 mt-[-100px] bg-cover" />    
        
        </div>
          <h1 className="relative text-5xl font-bric font-bold text-orange-500 font-montserrat">
            Shoppal
          </h1>

          <p className="relative mt-4 text-white/50 leading-relaxed font-montserrat">
            A modern marketplace connecting consumers and vendors in one seamless experience.
          </p>

          <div className="relative mt-6 text-sm text-orange-400">
            Fast • Smart • Local Commerce
          </div>

        </div>

        {/* RIGHT FORM AREA */}
        <div className="p-8 md:p-12 bg-[#111111]">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
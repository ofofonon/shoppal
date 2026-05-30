import React from "react";
import logo from "../logos/ShopPal logo white - Copy.PNG"

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#111111] flex items-center justify-center">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* ORANGE GLOW ORBS */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-orange-500/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[350px] h-[350px] bg-orange-500/20 blur-[140px] animate-pulse delay-300" />

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-orange-500/40 animate-float"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="relative flex flex-col items-center justify-center">

        {/* OUTER GLOW RING */}
        <div className="absolute w-[350px] h-[350px] rounded-full border border-orange-500/10 animate-spin-slow" />

        {/* SECOND RING */}
        <div className="absolute w-[280px] h-[280px] rounded-full border border-orange-500/20 animate-spin-reverse" />

        {/* LIGHT SWEEP */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent rotate-12 blur-3xl animate-pulse" />

        {/* LOGO WRAPPER */}
        <div className="relative group">
          
          {/* SOFT GLOW */}
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl scale-125 animate-pulse rounded-full" />

          {/* LOGO */}
          <img
            src={logo}
            alt="ShopPal"
            className="relative w-[240px] md:w-[420px] object-contain animate-logoFloat"
          />

          {/* SHIMMER */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
          </div>
        </div>

        {/* LOADING TEXT */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce delay-150"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce delay-300"></span>
          </div>
        </div>
      </div>

      {/* BOTTOM LIGHT */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      
    </div>
  );
};

export default Loader;
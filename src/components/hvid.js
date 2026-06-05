import { useRef, useState } from "react";
import hvids from "../Assets/images/Hvid.webm"

export default function HeroVideo() {
  const videoRef = useRef(null);

  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative  overflow-hidden bg-black rounded-3xl mt-20">

      {/* 🔥 Fallback background while video loads */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black rounded-3xl" />

      {/* 🎥 Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => setLoaded(true)}
        className={`
        
          transition-all duration-700 ease-out rounded-3xl
          ${loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"}
        `}
      >
        <source src={hvids} type="video/webm" />
      </video>

      {/* 🌑 Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 🔊 Mute / Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-20 
                   bg-black/60 text-white md:text-base text-sm px-4 py-2 
                   rounded-full backdrop-blur-md 
                   hover:bg-black/80 transition"
      >
        {muted ? "Unmute 🔊" : "Mute 🔇"}
      </button>

    </div>
  );
}
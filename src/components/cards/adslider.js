import { useEffect, useState } from "react";
import ad1 from "../../Assets/images/Shop Apple Ad cover.jpg"
import ad2 from "../../Assets/images/Nano_Banana_2_-_Produce_this_image_in_the_highest_quality_possible__make_it_sharp_and_good__DO_NOT_T.jpg"
import ad3 from "../../Assets/images/Vary_Image_-_Produce_this_image_in_the_highest_quality_possible__make_it_sharp_and_good.png"
import ad4 from "../../Assets/images/Shop Pal - 1.PNG"
import ad5 from "../../Assets/images/Shop Pal - 2.PNG"

export default function AdSlider() {
  const [current, setCurrent] = useState(0);

  // SLIDES
  const slides = [
    {
      type: "image",
      content: (
        <img
          src={ad1}
          alt=""
          className="w-full h-full object-cover"
        />
      ),
    },

    {
      type: "image",
      content: (
        <img
          src={ad2}
          alt=""
          className="w-full h-full object-cover"
        />
      ),
    },

    {
      type: "image",
      content: (
        <img
          src={ad3}
          alt=""
          className="w-full  object-cover"
        />
      ),
    },

    {
      type: "image",
      content: (
        <img
          src={ad4}
          alt=""
          className="w-full h-full object-cover"
        />
      ),
    },

    {
      type: "image",
      content: (
        <img
          src={ad5}
          alt=""
          className="w-full h-full object-cover"
        />
      ),
    },

    
  ];

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // NEXT
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // PREV
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full flex justify-center py-10 md:py-20 ">

      {/* SLIDER CONTAINER */}
      <div className="relative w-full max-w-6xl h-auto md:h-[320px] overflow-hidden md:rounded-2xl">

        {/* SLIDES WRAPPER */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >

          {/* SLIDES */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full h-full"
            >
              {slide.content}
            </div>
          ))}
        </div>

        {/* LEFT BUTTON */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "w-10 h-[6px] bg-white"
                  : "w-4 h-[6px] bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
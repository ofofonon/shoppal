import { useEffect, useState } from "react";

export default function TypingButton({
  words = ["Shop now", "Resturants", "Pharmarcies", "Beauty", "Tech."],
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(120);

  useEffect(() => {
    const current = words[index];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.substring(0, text.length + 1));

        if (text === current) {
          setIsDeleting(true);
          setSpeed(60);
        }
      } else {
        setText(current.substring(0, text.length - 1));

        if (text === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
          setSpeed(200);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, words, speed]);

  return (
    <button className="relative overflow-hidden bg-orange-500 text-white rounded-full py-2 md:w-[20%] w-[60%] mt-5 font-bold transition">
      <span className="flex items-center justify-center gap-0">
        {text}<span className="animate-pulse">|</span>
      </span>
    </button>
  );
}
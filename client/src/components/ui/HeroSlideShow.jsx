// HeroSlideshow.jsx
import React, { useState, useEffect } from "react";
import mukhota1 from "../../assets/mukhota1.jpg"
import mukhota2 from "../../assets/mukhota2.jpg"
import mukhota3 from "../../assets/mukhota3.jpg"
import mukhota4 from "../../assets/mukhota4.jpg"
import mukhota5 from "../../assets/mukhota5.jpg"

const images = [
    mukhota1,
    mukhota2,
    mukhota3,
    mukhota4,
    mukhota5
];

export default function HeroSlideshow({ children, height = "h-dvh" }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden ${height}`}>
      {/* Background images */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-in-out`}
          style={{
            backgroundImage: `url(${src})`,
            opacity: idx === current ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-black opacity-60" />

      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
        {/* Your transparent div with text */}
        <div className="bg-opacity-0">{children}</div>
      </div>
    </div>
  );
}

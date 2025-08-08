// Loader.jsx
import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-50">
      {/* Pulsing circle spotlight */}
      <div className="absolute w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-20 animate-ping" />

      {/* Mask animation */}
      <div className="relative flex flex-col items-center">
        <div className="text-6xl animate-bounce">🎭</div>
        <p className="mt-4 text-lg tracking-wide animate-pulse">
          Bringing the stage to life...
        </p>
      </div>

      {/* Keyframes for smoother bounce */}
      <style>
        {`
          @keyframes bounce-smooth {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
          .animate-bounce {
            animation: bounce-smooth 1.5s infinite;
          }
        `}
      </style>
    </div>
  );
}

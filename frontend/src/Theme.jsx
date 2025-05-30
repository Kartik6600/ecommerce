import React from "react";
import { assets } from "./assets/assets";
import "./index.css";
const Theme = ({ children }) => {
  const superheroImages = [
    assets.superhero_11,
    assets.superhero_12,
    assets.superhero_13,
    assets.superhero_14,
    assets.superhero_15,
    assets.superhero_16,
    assets.superhero_17,
    assets.superhero_18,
    assets.superhero_19,
  ];
  return (
    <div className="relative min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] text-moon overflow-hidden bg-zinc-100">
      <div
        className="fixed top-0 left-0 w-full h-[200vh] opacity-10 z-0 pointer-events-none overflow-hidden animated-background"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 100px)",
          gridAutoRows: "100px",
          justifyContent: "center",
          alignContent: "start",
        }}
      >
        {Array.from({ length: 400 }).map((_, i) => (
          <img
            key={i}
            src={superheroImages[i % superheroImages.length]}
            alt={`superhero-${i}`}
            className="w-[100px] h-[100px] object-cover animate-image bg-cyan-100 rounded-full p-3"
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
export default Theme;
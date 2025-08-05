import HeroSlideshow from "@/components/ui/HeroSlideShow";
import { Lightbulb, Sparkles } from "lucide-react";
import React from "react";

const Home = () => {
  return (
    <div className="">
      <HeroSlideshow height={"h-dvh"}>
        <div className="">
          <h1 className="text-4xl sm:text-4xl md:text-7xl font-bold text-white mb-4">
            Welcome to Mukhauta
          </h1>
          <p className="text-lg sm:text-2xl text-white">
            Where every story comes alive on stage.
          </p>
          <button className="mt-6 px-4 py-2 cursor-pointer border border-white text-white font-bold rounded hover:bg-white hover:text-black transition">
            Join Us
          </button>
        </div>
      </HeroSlideshow>

      {/* animated right to left text travel animation with tag line */}
      <div className="relative overflow-hidden bg-black py-4">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-10" />

        {/* Marquee container */}
        <div className="flex whitespace-nowrap animate-marquee">
          {/* Content repeated twice inside */}
          <div className="flex">
            <span className="mx-8 text-sm font-medium text-white">
              Where every stage tells a story.
            </span>
            <span className="mx-8 text-sm font-medium text-white">
              Unleashing emotions through art.
            </span>
            <span className="mx-8 text-sm font-medium text-white">
              Bringing scripts to life, one scene at a time.
            </span>
            <span className="mx-8 text-sm font-medium text-white">
              Creating memories under the spotlight.
            </span>
            <span className="mx-8 text-sm font-medium text-white">
              Drama is life, perfectly rehearsed.
            </span>
          </div>

          <div className="flex">
            <span className="mx-8 text-sm font-medium text-white">
              Where every stage tells a story.
            </span>
            <span className="mx-8 text-sm font-medium text-white">
              Unleashing emotions through art.
            </span>
            <span className="mx-8 text-sm font-medium text-white">
              Bringing scripts to life, one scene at a time.
            </span>
            <span className="mx-8 text-sm font-medium text-white">
              Creating memories under the spotlight.
            </span>
            <span className="mx-8 text-sm font-medium text-white">
              Drama is life, perfectly rehearsed.
            </span>
          </div>
        </div>

        {/* Keyframes for smooth infinite scroll */}
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              width: 200%; /* Twice content width */
              animation: marquee 20s linear infinite;
            }
          `}
        </style>
      </div>

      <section className="relative py-20 bg-black text-white">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-[url('/images/stage-bg.jpg')] bg-cover bg-center"
          style={{ opacity: 0.2 }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <Lightbulb className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            We aim to nurture creativity and passion for the performing arts by
            providing a platform for students to explore, express, and excel in
            theatre. Through our productions, workshops, and cultural exchanges,
            we strive to inspire storytelling that resonates with audiences and
            celebrates the art of drama.
          </p>
          <div className="flex justify-center mt-6">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

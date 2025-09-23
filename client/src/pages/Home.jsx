import ContactSection from "@/components/ui/Contact";
import HeroSlideshow from "@/components/ui/HeroSlideShow";
import TeamSection from "@/components/ui/TeamSection";
import { Lightbulb, Sparkles, Users } from "lucide-react";
import React, { useEffect } from "react";
import { MdOutlineExplore } from "react-icons/md";

const Home = () => {
  
  return (
    <div className="">
      <HeroSlideshow height={"h-dvh"}>
        <div className="flex flex-col gap-4">
          <h1 className=" text-4xl sm:text-4xl md:text-7xl font-bold text-white mb-4">
            Welcome to{" "}
            <span className="relative text-yellow-500 font-bold">
              Mukhauta
              <span className="absolute text-white text-sm -bottom-4 sm:-bottom-2 right-0 font-medium">
                A drama society...
              </span>
            </span>
          </h1>
          <p className="text-lg sm:text-2xl font-semibold text-white">
            Where every story comes alive on stage.
          </p>
          <a
            href="#vision"
            className="flex flex-row gap-2 items-center font-medium px-4 py-2 w-fit m-auto cursor-pointer border border-white text-white rounded hover:bg-white hover:text-black transition"
          >
            <MdOutlineExplore size={20} />
            Explore community
          </a>
        </div>
      </HeroSlideshow>

      {/* animated right to left text travel animation with tag line */}
      <div className="relative overflow-hidden bg-zinc-950 py-4">
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-10" />

        <div className="flex whitespace-nowrap animate-marquee">
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

      {/* vision section */}
      <section className=" py-20 bg-black text-white" id="vision">
        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <Lightbulb className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-4 flex flex-row gap-4 justify-center">
            Our <span className="text-yellow-500">Vision</span>
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            Our vision is to ignite a deep passion for theatre and the
            performing arts within our college community. We aim to create a
            space where creativity thrives, and every voice finds expression on
            stage. By making theatre accessible to all regardless of experience,
            we nurture talent, build confidence, and inspire artistic
            exploration. We believe in the transformative power of performance
            to connect, challenge, and uplift. Through inclusive and dynamic
            storytelling, we strive to empower performers of all levels to
            discover their potential.
          </p>
          <div className="flex justify-center mt-6">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* About us */}
      <section className="bg-black py-16 px-6 md:px-20 text-center " id="about">
        <div className="max-w-6xl mx-auto">
          <h2 className="flex flex-row gap-4 items-center font-bold text-4xl lg:text-6xl text-white mb-6 justify-center">
            <span className="text-yellow-500">About</span> Us
          </h2>

          <p className="text-lg text-white leading-relaxed mb-6">
            <strong>Mukhauta</strong> is the official drama society of{" "}
            <strong>J.B KNOWLEDGE PARK</strong>, bringing stories to life
            through stage and street performances since <strong>2019</strong>.
            We are a collective of passionate artists—actors, writers,
            directors, and backstage magicians—who believe in the power of
            expression.
          </p>

          <p className="text-lg text-white leading-relaxed mb-6">
            From energetic street plays that spark conversations to immersive
            stage productions that move hearts, our performances aim to
            entertain, enlighten, and engage. We also host acting workshops,
            scriptwriting sessions, and open mics to keep our creative fire
            alive.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
            <div className="bg-gradient-to-bl from-black to-red-800 border border-yellow-500 p-6 rounded-xl shadow hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                🎭 Stage Plays
              </h3>
              <p className="text-white">
                Performing dramas, tragedies, comedies, and experimental theatre
                on campus and beyond.
              </p>
            </div>

            <div className="bg-gradient-to-tr from-black to-red-800 border border-yellow-500 p-6 rounded-xl shadow hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                📣 Street Performances
              </h3>
              <p className="text-white">
                Spreading social awareness and provoking thought through
                impactful nukkad natak performances.
              </p>
            </div>

            <div className="bg-gradient-to-br from-black to-red-800 border border-yellow-500 p-6 rounded-xl shadow hover:scale-105 transition">
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                🧠 Creative Workshops
              </h3>
              <p className="text-white">
                Training the next generation of storytellers through regular
                acting, writing, and direction workshops.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TeamSection />

      <ContactSection />

      <div className="bg-zinc-900 text-white px-2 rounded-2xl fixed bottom-2 right-2 flex flex-row items-center justify-center border border-white/50">
        <img className="w-9 h-9" src="./cc_logo_transparent.png" alt="" />
        <p className="text-xs">Developed by Code Catalyst</p>
      </div>
    </div>
  );
};

export default Home;

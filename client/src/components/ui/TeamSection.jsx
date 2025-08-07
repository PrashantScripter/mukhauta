import React from "react";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Aarav Kapoor",
    role: "President & Director",
    img: "data:image/jpeg;base64,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",
    desc: "Guides the team with vision and direction. Known for bold storytelling.",
    socials: {
      instagram: "https://instagram.com/aarav",
      linkedin: "https://linkedin.com/in/aarav",
      facebook: "https://facebook.com/aarav",
    },
  },
  {
    name: "Riya Mehra",
    role: "Lead Actor",
    img: "data:image/jpeg;base64,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",
    desc: "An expressive performer who brings emotions to life on stage.",
    socials: {
      instagram: "https://instagram.com/riya",
    },
  },
  {
    name: "Kunal Sharma",
    role: "Scriptwriter",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMS3hXNFfsF7UxgHSfzJxDW8yr-jXZ4FdvOQ&s",
    desc: "Weaves powerful narratives that challenge, move, and inspire.",
    socials: {
      linkedin: "https://linkedin.com/in/kunal",
    },
  },
  {
    name: "Meera Singh",
    role: "Stage Designer",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG5nK91v1Fdz1bPiPAbjWb1Ol5DhYsmWO1fA&s",
    desc: "Transforms ideas into breathtaking visual environments.",
    socials: {
      facebook: "https://facebook.com/meera",
    },
  },
];

const TeamSection = () => {
  return (
    <section className="bg-black py-16 px-6 md:px-20" id="team">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4">
          Our <span className="text-yellow-500">Team</span>
        </h2>
        <p className="text-white text-lg mb-14">
          Meet the passionate minds behind every curtain call.
        </p>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          <Button className="absolute right-0 -bottom-12 bg-yellow-500 cursor-pointer  hover:border border-yellow-500 text-black hover:text-white">
            <Link to={"/team"} className="font-bold">
              View all members
            </Link>
          </Button>

          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-red-800 to-black rounded-xl shadow-lg hover:shadow-xl transition p-6 flex flex-col items-center border border-yellow-400"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 object-cover rounded-full mb-4 border border-yellow-400"
              />
              <h3 className="text-xl font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-sm text-yellow-600 font-medium mb-2">
                {member.role}
              </p>
              <p className="text-sm text-white/80 text-center mb-4">
                {member.desc}
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-auto">
                {member.socials?.instagram && (
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-400 transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {member.socials?.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-400 transition"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.socials?.facebook && (
                  <a
                    href={member.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-400 transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

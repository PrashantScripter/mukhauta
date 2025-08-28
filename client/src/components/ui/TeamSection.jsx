import React, { useEffect, useState } from "react";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_SERVER_URL;

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${API}/api/user/all-members`);
      setTeamMembers(res.data.members);
      console.log(res);
      console.log(teamMembers);
    } catch (err) {
      console.error("Failed to fetch team", err);
    } finally {
    }
  };

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
          <Link to={"/team"} className="absolute right-0 -bottom-12">
            <Button className="bg-yellow-500 cursor-pointer hover:border border-yellow-500 text-black hover:text-white">
              View all members
            </Button>
          </Link>

          {teamMembers.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="bg-gradient-to-br from-red-800 to-black rounded-xl shadow-lg hover:shadow-xl transition p-6 flex flex-col items-center border border-yellow-500"
            >
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-28 h-28 object-cover rounded-full mb-4 border-2 border-yellow-500"
              />
              <h3 className="text-xl font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-sm text-yellow-600 font-medium mb-2">
                {member.role}
              </p>
              <p className="text-sm text-white/80 text-center mb-4 line-clamp-3 w-full">
                {member.description}
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-auto">
                {member.socialLinks?.instagram && (
                  <a
                    href={member.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-400 transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {member.socialLinks?.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-400 transition"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.socialLinks?.facebook && (
                  <a
                    href={member.socialLinks.facebook}
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

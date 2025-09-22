import React, { useEffect, useState } from "react";
import { Instagram, Linkedin, Facebook, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import EmptyState from "@/components/ui/EmptyState";
const API = import.meta.env.VITE_SERVER_URL;

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API}/api/user/all-members`);
      setTeamMembers(res.data.members);
      console.log(teamMembers);
    } catch (err) {
      console.error("Failed to fetch team", err);
      alert("Failed to fetch team. Check console for details.");
    } finally {
      setFetching(false);
    }
  };

  return (
    <section
      className="bg-black min-h-screen pt-30 pb-20 px-6 md:px-20 "
      id="team"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4">
          Our <span className="text-yellow-500">Team</span>
        </h2>
        <p className="text-white text-lg mb-14">
          Meet the passionate minds behind every curtain call.
        </p>

        {fetching ? (
          <Loader2Icon className="animate-spin flex mx-auto text-white size-14" />
        ) : teamMembers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-red-800 to-black rounded-xl shadow-lg hover:shadow-xl transition p-6 flex flex-col items-center border border-yellow-400"
              >
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-28 h-28 object-cover rounded-full mb-4 border border-yellow-400"
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
        )}
      </div>
    </section>
  );
};

export default Team;

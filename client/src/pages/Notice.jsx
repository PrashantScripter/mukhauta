import React from "react";
import { GrAnnounce } from "react-icons/gr";

const notices = [
  {
    id: 1,
    title: "Auditions for Annual Play",
    description:
      "We are excited to announce the auditions for our upcoming annual drama performance. Open to all college students!",
    date: "2025-08-05",
  },
  {
    id: 2,
    title: "Workshop: Voice Modulation & Stage Presence",
    description:
      "Join our exclusive workshop on improving vocal range and stage confidence. Limited seats available.",
    date: "2025-08-02",
  },
  {
    id: 3,
    title: "Backstage Volunteers Needed",
    description:
      "We are looking for passionate members to join our backstage crew. Help us bring stories to life!",
    date: "2025-07-28",
  },
];

const Notices = () => {
  return (
    <div className="bg-black min-h-screen pt-30 pb-20 px-6 md:px-20 text-white">
      <h2 className=" flex flex-row gap-4 items-center justify-center text-4xl lg:text-6xl text-yellow-500 text-center mb-12">
        <GrAnnounce className="text-white" /> Notices
      </h2>
      <div className="max-w-5xl mx-auto space-y-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="relative border border-yellow-500/40 bg-zinc-950 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
          >
            <div className="absolute -top-3 -left-3 bg-yellow-500 text-black px-3 py-1 rounded-tr-xl rounded-bl-xl text-xs font-bold">
              {new Date(notice.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
            <h3 className="text-xl font-semibold mb-2">{notice.title}</h3>
            <p className="text-gray-300">{notice.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notices;

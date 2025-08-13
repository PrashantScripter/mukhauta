import axios from "axios";
import React, { useEffect, useState } from "react";
import { GrAnnounce } from "react-icons/gr";
const API = import.meta.env.VITE_SERVER_URL;


const Notices = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    getNotices();
  }, []);

  const getNotices = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/allNotices`);
      setNotices(res.data);
    } catch (error) {
      console.error(error);
    }
  };
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
              {new Date(notice.createdAt).toLocaleString()}
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

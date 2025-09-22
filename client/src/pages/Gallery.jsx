import EmptyState from "@/components/ui/EmptyState";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_SERVER_URL;

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [fetching, setFetching] = useState(false);

  // if parent did not provide gallery, try to load initial from backend
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API}/api/admin/allGallery`);
      if (res?.data?.data) {
        setGallery(res.data.data);
        console.log(res.data.data);
      } else if (Array.isArray(res?.data)) {
        setGallery(res.data);
      }
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setFetching(false);
    }
  };
  return (
    <section className="bg-black min-h-screen pt-30 pb-20 px-6 md:px-20 ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-6xl font-bold text-center text-white mb-6">
          Photo <span className="text-yellow-500">Gallery</span>
        </h2>
        <p className="text-white text-center text-lg mb-12">
          Capturing the magic, moments, and madness behind the curtain.
        </p>

        {fetching ? (
          <Loader2Icon className="animate-spin flex mx-auto text-white size-14" />
        ) : gallery.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="relative group overflow-hidden rounded-xl shadow-lg border border-yellow-600"
              >
                <img
                  src={img.ImageUrl}
                  alt={img.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-300 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/70 bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <p className="text-yellow-400 text-lg font-semibold text-center px-2">
                    {img.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

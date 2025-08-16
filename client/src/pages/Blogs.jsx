import EmptyState from "@/components/ui/EmptyState";
import axios from "axios";
import { CircleX, Rss } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TfiWrite } from "react-icons/tfi";

const API = import.meta.env.VITE_SERVER_URL;

const Blog = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/all-blogs`);
      if (res.data.success) {
        setBlogs(res.data.data);
        console.log(res);
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-30 pb-20 px-6 md:px-20 text-white">
      <h2 className="flex flex-row gap-4 items-center justify-center text-4xl lg:text-6xl text-yellow-500 text-center mb-12">
        <Rss className="text-white size-10" />
        Blogs
      </h2>

      <p className="text-white text-center text-lg mb-12">
        Stories, scripts, and society snapshots — dive into the drama behind the
        scenes.
      </p>

      {blogs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-zinc-950 border border-yellow-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6 space-y-3">
                <p className="text-sm text-yellow-400 font-medium">
                  {new Date(blog.createdAt).toLocaleString()}
                </p>
                <h3 className="text-xl font-semibold hover:underline">
                  {blog.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-3">
                  {blog.content}
                </p>
                <p className="text-sm italic text-yellow-200 mt-2">
                  — {blog.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* read blogs popup */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-zinc-950 text-white max-w-2xl w-full rounded-lg p-6 relative shadow-lg border border-yellow-500/30 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute cursor-pointer top-2 right-2 text-white text-xl font-bold hover:text-yellow-500"
              onClick={() => setSelectedBlog(null)}
            >
              <CircleX size={30} />
            </button>
            <img
              src={selectedBlog.imageUrl}
              className="w-full h-60 object-cover rounded"
              alt={selectedBlog.title}
            />
            <h2 className="text-2xl font-bold mt-4">{selectedBlog.title}</h2>
            <p className="text-sm text-yellow-400 mb-2 whitespace-pre-wrap">
              {new Date(selectedBlog.createdAt).toLocaleString()} | By{" "}
              {selectedBlog.author}
            </p>
            <p className="text-gray-300 mt-4">{selectedBlog.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;

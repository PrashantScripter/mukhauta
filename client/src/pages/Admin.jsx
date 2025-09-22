import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2Icon, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

const API = import.meta.env.VITE_SERVER_URL;

/* -----------------------------
  Admin Page (main)
------------------------------*/
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [notices, setNotices] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch blogs
        const blogsRes = await axios.get(`${API}/api/admin/all-blogs`);
        if (blogsRes.data.success) {
          setBlogs(blogsRes.data.data);
        } else {
          toast.error("Failed to load blogs");
        }

        // Fetch gallery
        const galleryRes = await axios.get(`${API}/api/admin/allGallery`);
        if (galleryRes.data.success) {
          setGallery(galleryRes.data.data);
        } else {
          toast.error("Failed to load gallery");
        }

        // Fetch notices
        const noticesRes = await axios.get(`${API}/api/admin/allNotices`);
        if (noticesRes.data.success) {
          setNotices(noticesRes.data.notices);
        } else {
          toast.error("Failed to load notices");
        }

        // Fetch team
        const teamRes = await axios.get(`${API}/api/user/all-members`);
        if (teamRes.data.success) {
          setTeam(teamRes.data.members);
        } else {
          toast.error("Failed to load team");
        }
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="bg-black min-h-screen pt-20 pb-10 px-6 md:px-20 text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-[100%] sm:max-w-7xl mx-auto px-0 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Mukhauta Admin</h1>
          <p className="text-sm text-gray-300">
            Manage blogs, gallery, notices & team
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="col-span-1 bg-zinc-950 rounded-xl p-4 border border-yellow-700/30 h-fit">
            <nav className="space-y-2">
              {[
                ["dashboard", "Dashboard"],
                ["blogs", "Blogs"],
                ["gallery", "Gallery"],
                ["notices", "Notices"],
                ["team", "Team"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full text-left px-3 py-2 rounded-md transition flex items-center justify-between cursor-pointer ${
                    activeTab === key
                      ? "bg-yellow-500 text-black font-semibold"
                      : "text-gray-200 hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="col-span-1 md:col-span-3 bg-gradient-to-br from-red-900 to-black rounded-xl p-4 sm:p-6 border border-yellow-700/20">
            {activeTab === "dashboard" && (
              <Dashboard
                blogs={blogs}
                gallery={gallery}
                notices={notices}
                team={team}
                setActiveTab={setActiveTab}
                loading={loading}
              />
            )}
            {activeTab === "blogs" && (
              <BlogsManager blogs={blogs} setBlogs={setBlogs} />
            )}
            {activeTab === "gallery" && (
              <GalleryManager gallery={gallery} setGallery={setGallery} />
            )}
            {activeTab === "notices" && (
              <NoticesManager notices={notices} setNotices={setNotices} />
            )}
            {activeTab === "team" && (
              <TeamManager team={team} setTeam={setTeam} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
  Dashboard component
------------------------------*/
function Dashboard({ blogs, gallery, notices, team, setActiveTab, loading }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Blogs"
          value={blogs.length}
          onClick={() => setActiveTab("blogs")}
          loading={loading}
        />
        <StatCard
          label="Gallery"
          value={gallery.length}
          onClick={() => setActiveTab("gallery")}
          loading={loading}
        />
        <StatCard
          label="Notices"
          value={notices.length}
          onClick={() => setActiveTab("notices")}
          loading={loading}
        />
        <StatCard
          label="Team Members"
          value={team.length}
          onClick={() => setActiveTab("team")}
          loading={loading}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, onClick, loading }) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-zinc-950 border border-yellow-700/20 cursor-pointer"
    >
      <p className="text-sm text-gray-300">{label}</p>
      {loading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <p className="text-2xl font-bold text-white">{value}</p>
      )}
    </div>
  );
}

/* -----------------------------
  Blogs Manager (CRUD)
------------------------------*/
function BlogsManager({ blogs, setBlogs }) {
  const { user } = useUser();
  const empty = {
    title: "",
    content: "",
    imageUrl: null,
    imagePreview: null,
    author: "",
  };

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [backendRequest, setBackendRequest] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    return () => {
      if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    };
  }, [form.imagePreview]);

  useEffect(() => {
    if (editing) {
      const b = blogs.find((x) => x.id === editing);
      if (b) {
        setForm({
          ...b,
          imageUrl: null,
          imagePreview: b.imageUrl || null,
        });
      }
    } else {
      setForm(empty);
    }
  }, [editing, blogs]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/all-blogs`);
      if (res.data.success) {
        setBlogs(res.data.data);
      } else {
        toast.error("Failed to load blogs");
      }
    } catch (err) {
      toast.error("Failed to load blogs");
    }
  };

  const create = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setBackendRequest(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("content", form.content.trim());
      fd.append("author", user.fullName);
      if (form.imageUrl) fd.append("image", form.imageUrl);

      const res = await axios.post(`${API}/api/admin/create-blog`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);

      if (res.data.success) {
        setBlogs([res.data.data, ...blogs]);
        setEditing(null);
        setForm(empty);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to create blog");
      }
    } catch (err) {
      toast.error("Failed to create blog");
    }
    setBackendRequest(false);
  };

  const update = async () => {
    if (!editing) return;
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setBackendRequest(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("content", form.content.trim());
      if (form.imageUrl) fd.append("image", form.imageUrl);

      const res = await axios.put(
        `${API}/api/admin/update-blog/${editing}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(res);
      if (res.data.success) {
        setBlogs(blogs.map((b) => (b.id === editing ? res.data.data : b)));
        setEditing(null);
        setForm(empty);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to update blog");
      }
    } catch (err) {
      toast.error("Failed to update blog");
    }
    setBackendRequest(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this blog?")) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`${API}/api/admin/delete-blog/${id}`);
      console.log(res);
      if (res.data.success) {
        setBlogs(blogs.filter((b) => b.id !== id));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to delete blog");
      }
    } catch (err) {
      toast.error("Failed to delete blog");
    }
    setDeletingId(null);
  };

  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imageUrl: file, imagePreview: preview }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <button
          onClick={() => setForm(empty)}
          className="px-3 py-2 rounded cursor-pointer bg-yellow-500 text-black font-semibold"
        >
          clear
        </button>
      </div>

      <div className="mb-6 bg-[#0f0f0f] p-4 rounded">
        <label className="text-sm text-gray-300">Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
          required
        />

        <label className="text-sm text-gray-300">
          Content
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={6}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-300">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              className="w-full mt-1 text-sm text-gray-300 bg-black py-2 px-3 rounded cursor-pointer"
            />
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="preview"
                className="w-32 h-20 object-cover mt-2 rounded"
              />
            )}
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          {editing ? (
            <>
              <button
                onClick={update}
                disabled={backendRequest}
                className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded bg-yellow-500 text-black font-semibold disabled:opacity-60"
              >
                Update
                {backendRequest && <Loader2Icon className="animate-spin" />}
              </button>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm(empty);
                }}
                className="px-4 py-2 rounded bg-white/5 cursor-pointer"
                disabled={backendRequest}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={create}
              disabled={backendRequest}
              className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded bg-yellow-500 text-black font-semibold disabled:opacity-60"
            >
              Create
              {backendRequest && <Loader2Icon className="animate-spin" />}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="p-3 bg-[#111111] rounded flex items-center gap-3 border border-yellow-700/10"
          >
            <div className="w-20 h-12 bg-gray-800 rounded overflow-hidden">
              {b.imageUrl ? (
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{b.title}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(b.id)}
                    className="text-sm px-2 py-1 rounded bg-white/5 cursor-pointer"
                    disabled={deletingId !== null}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(b.id)}
                    className="flex items-center gap-2 cursor-pointer text-sm px-2 py-1 rounded bg-red-600 text-white"
                    disabled={deletingId !== null}
                  >
                    Delete
                    {deletingId === b.id && (
                      <Loader2Icon className="animate-spin" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-300">{b.excerpt}</p>
              <p className="text-xs text-gray-400">
                By {b.author} • {b.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -----------------------------
  Gallery Manager (CRUD)
------------------------------*/
function GalleryManager({ gallery, setGallery }) {
  const empty = { title: "", image: null, preview: null };
  const [form, setForm] = useState(empty);
  const [backendRequest, setBackendRequest] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    return () => {
      if (form.preview) URL.revokeObjectURL(form.preview);
    };
  }, [form.preview]);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/allGallery`);
      if (res.data.success) {
        setGallery(res.data.data);
      } else {
        toast.error("Failed to load gallery");
      }
    } catch (err) {
      toast.error("Failed to load gallery");
    }
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (form.preview) URL.revokeObjectURL(form.preview);
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, image: file, preview }));
  };

  const create = async () => {
    if (!form.title.trim() || !form.image) {
      toast.error("Title and image are required");
      return;
    }
    setBackendRequest(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("image", form.image);

      const res = await axios.post(`${API}/api/admin/upload-image`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setGallery([res.data.data, ...gallery]);
        setForm(empty);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to upload image");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
    setBackendRequest(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this gallery item?")) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`${API}/api/admin/delete-image/${id}`);
      if (res.data.success) {
        setGallery(gallery.filter((g) => g.id !== id));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to delete image");
      }
    } catch (err) {
      toast.error("Failed to delete image");
    }
    setDeletingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <button
          onClick={() => setForm(empty)}
          className="px-3 py-2 cursor-pointer rounded bg-yellow-500 text-black font-semibold"
        >
          Clear
        </button>
      </div>

      <div className="mb-6 bg-zinc-950 p-4 rounded">
        <label className="text-sm text-gray-300">Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
          required
        />

        <label className="text-sm text-gray-300">Choose Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="w-full mt-1 text-sm text-gray-300 bg-black py-2 px-3 rounded cursor-pointer"
        />

        {form.preview && (
          <img
            src={form.preview}
            alt="preview"
            className="w-48 h-28 object-cover mt-2 rounded"
          />
        )}

        <div className="mt-3 flex gap-3">
          <button
            onClick={create}
            disabled={backendRequest}
            className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded bg-yellow-500 text-black font-semibold disabled:opacity-60"
          >
            Upload
            {backendRequest && <Loader2Icon className="animate-spin" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {gallery.map((g) => (
          <div
            key={g.id}
            className="bg-zinc-950 p-3 rounded border border-yellow-700/10"
          >
            <div className="w-full h-44 bg-gray-800 rounded overflow-hidden mb-2">
              {g.ImageUrl ? (
                <img
                  src={g.ImageUrl}
                  alt={g.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{g.title}</p>
                <p className="text-xs text-gray-400">ID: {g.id}</p>
              </div>
              <button
                onClick={() => remove(g.id)}
                className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded bg-red-600 text-white"
                disabled={deletingId !== null}
              >
                Delete
                {deletingId === g.id && (
                  <Loader2Icon className="animate-spin" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -----------------------------
  Notices Manager
------------------------------*/
function NoticesManager({ notices, setNotices }) {
  const empty = { title: "", description: "" };
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [backendRequest, setBackendRequest] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getNotices();
  }, []);

  const getNotices = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/allNotices`);
      if (res.data.success) {
        setNotices(res.data.notices);
      } else {
        toast.error("Failed to load notices");
      }
    } catch (err) {
      toast.error("Failed to load notices");
    }
  };

  const createNotice = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setBackendRequest(true);
    try {
      const res = await axios.post(`${API}/api/admin/create-notice`, {
        title: form.title.trim(),
        description: form.description.trim(),
      });
      console.log(res.data);
      if (res.data.success) {
        setNotices([res.data.notice, ...notices]);
        setForm(empty);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to create notice");
      }
    } catch (err) {
      toast.error("Failed to create notice");
    }
    setBackendRequest(false);
  };

  const updateNotice = async (e) => {
    e.preventDefault();
    if (!editing || !form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    console.log(editing);
    setBackendRequest(true);
    try {
      const res = await axios.put(`${API}/api/admin/update-notice/${editing}`, {
        title: form.title.trim(),
        description: form.description.trim(),
      });
      console.log(res.data);
      if (res.data.success) {
        setNotices(
          notices.map((n) => (n.id === editing ? res.data.updated : n))
        );
        setEditing(null);
        setForm(empty);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to update notice");
      }
    } catch (err) {
      toast.error("Failed to update notice");
    }
    setBackendRequest(false);
  };

  const removeNotice = async (id) => {
    if (!confirm("Delete this notice?")) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`${API}/api/admin/delete-notice/${id}`);
      if (res.data.success) {
        setNotices(notices.filter((n) => n.id !== id));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to delete notice");
      }
    } catch (err) {
      toast.error("Failed to delete notice");
    }
    setDeletingId(null);
  };

  const startEditing = (id) => {
    const notice = notices.find((n) => n.id === id);
    if (notice) {
      setForm({ title: notice.title, description: notice.description });
      setEditing(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Notices</h2>
        <button
          onClick={() => {
            setEditing(null);
            setForm(empty);
          }}
          className="px-3 py-2 cursor-pointer rounded bg-yellow-500 text-black font-semibold"
        >
          Clear
        </button>
      </div>

      <form
        onSubmit={editing ? updateNotice : createNotice}
        className="mb-6 bg-[#0f0f0f] p-4 rounded"
      >
        <label className="text-sm text-gray-300">Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
          required
        />

        <label className="text-sm text-gray-300">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
          required
        />

        <div className="mt-3 flex gap-3">
          <button
            type="submit"
            disabled={backendRequest}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded bg-yellow-500 text-black font-semibold disabled:opacity-60"
          >
            {editing ? "Update" : "Create Notice"}
            {backendRequest && <Loader2Icon className="animate-spin" />}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
              className="px-4 py-2 rounded bg-white/5 cursor-pointer"
              disabled={backendRequest}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className="p-3 bg-[#111111] rounded flex items-start gap-3 border border-yellow-700/10"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{n.title}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(n.id)}
                    className="text-sm px-2 py-1 rounded bg-white/5 cursor-pointer"
                    disabled={deletingId !== null}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeNotice(n.id)}
                    className="flex items-center gap-2 cursor-pointer text-sm px-2 py-1 rounded bg-red-600 text-white"
                    disabled={deletingId !== null}
                  >
                    Delete
                    {deletingId === n.id && (
                      <Loader2Icon className="animate-spin" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-line">{n.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -----------------------------
  Team Manager (CRUD)
------------------------------*/
function TeamManager({ team, setTeam }) {
  const empty = {
    name: "",
    role: "",
    desc: "",
    imageUrl: null,
    imgPreview: null,
    socials: { instagram: "", linkedin: "", facebook: "" },
  };

  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    return () => {
      if (form.imgPreview) URL.revokeObjectURL(form.imgPreview);
    };
  }, [form.imgPreview]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/user/all-members`);
      console.log(res);
      if (res.data.success) {
        setTeam(res.data.members);
      } else {
        toast.error("Failed to load team");
      }
    } catch (err) {
      toast.error("Failed to load team");
    }
    setLoading(false);
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name || "",
      role: member.role || "",
      desc: member.description || "",
      imageUrl: member.imageUrl,
      imgPreview: member.imageUrl || null,
      socials: {
        instagram: member.socials?.instagram || "",
        linkedin: member.socials?.linkedin || "",
        facebook: member.socials?.facebook || "",
      },
    });
    setEditing(member.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    if (form.imgPreview) URL.revokeObjectURL(form.imgPreview);
    setForm(empty);
    setEditing(null);
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (form.imgPreview) URL.revokeObjectURL(form.imgPreview);
    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imageUrl: file, imgPreview: preview }));
  };

  const handleChangeSocial = (key, value) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));

  const createMember = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.desc.trim()) {
      toast.error("Name, role, and bio are required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("role", form.role.trim());
      fd.append("description", form.desc.trim());
      fd.append("socialLinks", JSON.stringify(form.socials));
      if (form.imageUrl) fd.append("image", form.imageUrl);

      const res = await axios.post(`${API}/api/user/create-member`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setTeam([res.data.member, ...team]);
        resetForm();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to create member");
      }
    } catch (err) {
      toast.error("Failed to create member");
    }
    setSubmitting(false);
  };

  const updateMember = async () => {
    if (
      !editing ||
      !form.name.trim() ||
      !form.role.trim() ||
      !form.desc.trim()
    ) {
      toast.error("Name, role, and bio are required");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("role", form.role.trim());
      fd.append("description", form.desc.trim());
      fd.append("socialLinks", JSON.stringify(form.socials));
      if (form.imageUrl) fd.append("image", form.imageUrl);

      const res = await axios.put(
        `${API}/api/user/update-user/${editing}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(res);

      if (res.data.success) {
        setTeam(team.map((m) => (m.id === editing ? res.data.member : m)));
        resetForm();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to update member");
      }
    } catch (err) {
      toast.error("Failed to update member");
    }
    setSubmitting(false);
  };

  const removeMember = async (id) => {
    if (!confirm("Delete this team member?")) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`${API}/api/user/delete-user/${id}`);
      if (res.data.success) {
        setTeam(team.filter((m) => m.id !== id));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to delete member");
      }
    } catch (err) {
      toast.error("Failed to delete member");
    }
    setDeletingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Team</h2>
        <button
          onClick={resetForm}
          className="px-3 py-2 cursor-pointer rounded bg-yellow-500 text-black font-semibold"
        >
          Clear
        </button>
      </div>

      <form className="mb-6 bg-zinc-950 p-4 rounded">
        <label className="text-sm text-gray-300">Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
          required
        />

        <label className="text-sm text-gray-300">Role</label>
        <input
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
          required
        />

        <label className="text-sm text-gray-300">Bio / Short Description</label>
        <textarea
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          rows={3}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-300">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              className="w-full mt-1 text-sm text-gray-300 py-2 px-3 rounded bg-black cursor-pointer"
            />
            {form.imgPreview && (
              <img
                src={form.imgPreview}
                alt="preview"
                className="w-32 h-24 object-cover mt-2 rounded"
              />
            )}
          </div>

          <div>
            <label className="text-sm text-gray-300">Instagram</label>
            <input
              value={form.socials.instagram}
              onChange={(e) => handleChangeSocial("instagram", e.target.value)}
              className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">LinkedIn</label>
            <input
              value={form.socials.linkedin}
              onChange={(e) => handleChangeSocial("linkedin", e.target.value)}
              className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
            />
          </div>
        </div>

        <div className="mt-3 flex gap-3">
          <button
            onClick={editing ? updateMember : createMember}
            disabled={submitting}
            className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded bg-yellow-500 text-black font-semibold disabled:opacity-60"
          >
            {editing ? "Update" : "Add Member"}
            {submitting && <Loader2Icon className="animate-spin" />}
          </button>
          {editing && (
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded bg-white/5 cursor-pointer"
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div>Loading team...</div>
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2">
            <User size={18} />
            All Users
          </h2>
          {team.map((m) => (
            <div
              key={m.id}
              className="bg-zinc-950 p-3 rounded border border-yellow-700/10"
            >
              <div className="flex flex-col justify-center sm:flex-row items-center gap-3">
                <div className="w-20 h-20 bg-gray-800 rounded-full overflow-hidden">
                  {m.imageUrl ? (
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-yellow-400">{m.role}</p>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-3">
                    {m.description}
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="px-2 py-1 rounded bg-white/5 cursor-pointer"
                    disabled={deletingId !== null}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded bg-red-600 text-white"
                    disabled={deletingId !== null}
                  >
                    Delete
                    {deletingId === m.id && (
                      <Loader2Icon className="animate-spin" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex gap-3">
                {m.socials?.instagram && (
                  <a
                    href={m.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-300"
                  >
                    Instagram
                  </a>
                )}
                {m.socials?.linkedin && (
                  <a
                    href={m.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-300"
                  >
                    LinkedIn
                  </a>
                )}
                {m.socials?.facebook && (
                  <a
                    href={m.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-300"
                  >
                    Facebook
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

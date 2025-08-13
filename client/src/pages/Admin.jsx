import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2Icon, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
const API = import.meta.env.VITE_SERVER_URL;

const LS_KEYS = {
  blogs: "admin_blogs_v1",
  gallery: "admin_gallery_v1",
  notices: "admin_notices_v1",
  team: "admin_team_v1",
};

const loadFromLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load from localStorage", e);
    return fallback;
  }
};

const saveToLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
};

/* -----------------------------
  Small helper: file -> base64
------------------------------*/
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* -----------------------------
  Initial demo data (one-item examples)
------------------------------*/
const initialBlogs = [
  {
    id: 1,
    title: "Behind the Curtain: A Look Into Our Rehearsals",
    excerpt:
      "Peek behind the scenes at how we prepare for our annual productions...",
    content:
      "Rehearsals are where the magic begins.\n\nWe warm up, block scenes, rehearse entrances and exits, and integrate light and sound. This is where characters are born and bonds are formed.",
    author: "Ananya Verma",
    date: "2025-07-25",
    image: "", // base64 or url
  },
];

const initialGallery = [{ id: 1, title: "Annual Drama Night", image: "" }];

const initialNotices = [
  {
    id: 1,
    title: "Auditions for Annual Play",
    description:
      "Auditions next week at the auditorium. Bring a short monologue.",
    date: "2025-08-05",
  },
];

const initialTeam = [
  {
    id: 1,
    name: "Aarav Kapoor",
    role: "President & Director",
    desc: "Guides the team with vision and direction.",
    img: "",
    socials: { instagram: "", linkedin: "", facebook: "" },
  },
];

/* -----------------------------
  Admin Page (main)
------------------------------*/
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // State for each resource
  const [blogs, setBlogs] = useState(() =>
    loadFromLS(LS_KEYS.blogs, initialBlogs)
  );
  const [gallery, setGallery] = useState(() =>
    loadFromLS(LS_KEYS.gallery, initialGallery)
  );
  const [notices, setNotices] = useState(() =>
    loadFromLS(LS_KEYS.notices, initialNotices)
  );
  const [team, setTeam] = useState(() => loadFromLS(LS_KEYS.team, initialTeam));

  // Persist on change
  useEffect(() => saveToLS(LS_KEYS.blogs, blogs), [blogs]);
  useEffect(() => saveToLS(LS_KEYS.gallery, gallery), [gallery]);
  useEffect(() => saveToLS(LS_KEYS.notices, notices), [notices]);
  useEffect(() => saveToLS(LS_KEYS.team, team), [team]);

  return (
    <div className="bg-black min-h-screen pt-30 pb-20 px-6 md:px-20  text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mukhauta Admin</h1>
            <p className="text-sm text-gray-300">
              Manage blogs, gallery, notices & team
            </p>
          </div>
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
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="col-span-1 md:col-span-3 bg-gradient-to-br from-red-900 to-black rounded-xl p-6 border border-yellow-700/20">
            {activeTab === "dashboard" && (
              <Dashboard
                blogs={blogs}
                gallery={gallery}
                notices={notices}
                team={team}
                setActiveTab={setActiveTab}
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
function Dashboard({ blogs, gallery, notices, team, setActiveTab }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Blogs"
          value={blogs.length}
          onClick={() => setActiveTab("blogs")}
        />
        <StatCard
          label="Gallery"
          value={gallery.length}
          onClick={() => setActiveTab("gallery")}
        />
        <StatCard
          label="Notices"
          value={notices.length}
          onClick={() => setActiveTab("notices")}
        />
        <StatCard
          label="Team Members"
          value={team.length}
          onClick={() => setActiveTab("team")}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab("blogs")}
            className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
          >
            Add Blog
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
          >
            Add Gallery
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-zinc-950 border border-yellow-700/20 cursor-pointer"
    >
      <p className="text-sm text-gray-300">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

/* -----------------------------
  Blogs Manager (CRUD)
------------------------------*/
function BlogsManager({ blogs, setBlogs }) {
  const empty = {
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: "",
    image: "",
  };
  const [editing, setEditing] = useState(null); // id or null
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (editing) {
      const b = blogs.find((x) => x.id === editing);
      if (b) setForm({ ...b });
    } else setForm(empty);
  }, [editing]);

  const create = async () => {
    const next = Math.max(0, ...blogs.map((b) => b.id)) + 1;
    setBlogs([{ id: next, ...form }, ...blogs]);
    setEditing(null);
  };

  const update = async () => {
    setBlogs(
      blogs.map((b) => (b.id === editing ? { ...form, id: editing } : b))
    );
    setEditing(null);
  };

  const remove = (id) => {
    if (!confirm("Delete this blog?")) return;
    setBlogs(blogs.filter((b) => b.id !== id));
  };

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await fileToBase64(file);
    setForm((f) => ({ ...f, image: data }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <div>
          <button
            onClick={() => setEditing(null)}
            className="px-3 py-2 rounded bg-yellow-500 text-black font-semibold"
          >
            Create New
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="mb-6 bg-[#0f0f0f] p-4 rounded">
        <label className="text-sm text-gray-300">Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-black border border-yellow-600 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <label className="text-sm text-gray-300">Excerpt</label>
        <input
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full bg-black border border-yellow-600 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <label className="text-sm text-gray-300">
          Content (Markdown or plain text)
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={6}
          className="w-full bg-black border border-yellow-600 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-300">Author</label>
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full bg-black border border-yellow-600 px-3 py-2 rounded mt-1 mb-3 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-black border border-yellow-600 px-3 py-2 rounded mt-1 mb-3 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              className="w-full mt-1 text-sm text-gray-300"
            />
            {form.image && (
              <img
                src={form.image}
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
                className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded bg-white/5"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={create}
              className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
            >
              Create
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="p-3 bg-[#111111] rounded flex items-center gap-3 border border-yellow-700/10"
          >
            <div className="w-20 h-12 bg-gray-800 rounded overflow-hidden">
              {b.image ? (
                <img
                  src={b.image}
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
                    onClick={() => {
                      setEditing(b.id);
                    }}
                    className="text-sm px-2 py-1 rounded bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(b.id)}
                    className="text-sm px-2 py-1 rounded bg-red-600 text-black"
                  >
                    Delete
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
  const empty = { title: "", image: "" };
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [backendRequest, setBackendRequest] = useState(false);

  useEffect(() => {
   
  }, []);

  const create = async () => {
    
  };

  const update = async () => {
    
  };

  const remove = (id) => {
    
  };

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await fileToBase64(file);
    setForm((f) => ({ ...f, image: data }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Gallery</h2>
        <div>
          <button
            onClick={() => setEditing(null)}
            className="px-3 py-2 rounded bg-yellow-500 text-black font-semibold"
          >
            Add Image
          </button>
        </div>
      </div>

      <div className="mb-6 bg-zinc-950 p-4 rounded">
        <label className="text-sm text-gray-300">Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <label className="text-sm text-gray-300">Choose Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="w-full mt-1 text-sm text-gray-300 bg-black py-2 px-3 cursor-pointer"
        />
        {form.image && (
          <img
            src={form.image}
            alt="preview"
            className="w-48 h-28 object-cover mt-2 rounded"
          />
        )}

        <div className="mt-3 flex gap-3">
          {editing ? (
            <>
              <button
                onClick={update}
                className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded bg-white/5"
              >
                Cancel
              </button>
            </>
          ) : backendRequest ? (
            <button
              onClick={create}
              className="flex flex-row gap-2 items-center px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
            >
              Uploading...
              <Loader2Icon className="animate-spin" />
            </button>
          ) : (
            <button
              onClick={create}
              className="px-4 py-2 rounded cursor-pointer bg-yellow-500 text-black font-semibold"
            >
              Upload
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {gallery.map((g) => (
          <div
            key={g.id}
            className="bg-zinc-950 p-3 rounded border border-yellow-700/10"
          >
            <div className="w-full h-44 bg-gray-800 rounded overflow-hidden mb-2">
              {g.image ? (
                <img
                  src={g.image}
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
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(g.id)}
                  className="px-2 py-1 rounded bg-white/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(g.id)}
                  className="px-2 py-1 rounded bg-red-600 text-black"
                >
                  Delete
                </button>
              </div>
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
function NoticesManager() {
  const empty = { title: "", description: "" };
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [notices, setNotices] = useState([]);
  const [backendRequest, setBackendRequest] = useState(false);

  useEffect(() => {
    getNotices();
  }, []);

  // ✅ Fetch all notices
  const getNotices = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/allNotices`);
      setNotices(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Create new notice
  const createNotice = async (e) => {
    e.preventDefault();
    setBackendRequest(true);
    try {
      const res = await axios.post(`${API}/api/admin/create-notice`, form);
      setForm(empty);
      toast.success(res.data.message);
      getNotices(); // refresh list
    } catch (error) {
      console.error(error);
    } finally {
      setBackendRequest(false);
    }
  };

  // ✅ Update existing notice
  const updateNotice = async (e) => {
    e.preventDefault();
    setBackendRequest(true);
    try {
      const res = await axios.put(
        `${API}/api/admin/update-notice/${editing}`,
        form
      );
      setForm(empty);
      setEditing(null);
      getNotices();
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setBackendRequest(false);
    }
  };

  // ✅ Delete notice
  const removeNotice = async (id) => {
    if (!confirm("Delete this notice?")) return;
    try {
      const res = await axios.delete(`${API}/api/admin/delete-notice/${id}`);
      getNotices(); // refresh list
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Set form data when editing
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
          clear
        </button>
      </div>

      <form
        onSubmit={editing ? updateNotice : createNotice}
        className="mb-6 bg-[#0f0f0f] p-4 rounded"
      >
        <label className="text-sm text-gray-300">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <label className="text-sm text-gray-300">Description</label>
        <textarea
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <div className="mt-3 flex gap-3">
          {editing ? (
            <>
              {backendRequest ? (
                <button
                  type="submit"
                  className="flex flex-row gap-2 items-center px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
                >
                  Update
                  <Loader2Icon className="animate-spin" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold"
                >
                  Update
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(empty);
                }}
                className="px-4 py-2 rounded bg-white/5"
              >
                Cancel
              </button>
            </>
          ) : backendRequest ? (
            <button
              type="submit"
              className=" flex flex-row gap-2 items-center px-4 py-2 cursor-pointer rounded bg-yellow-500 text-black font-semibold"
            >
              Create Notice
              <Loader2Icon className="animate-spin" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer rounded bg-yellow-500 text-black font-semibold"
            >
              Create Notice
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
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeNotice(n.id)}
                    className="text-sm px-2 py-1 rounded bg-red-600 text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-300">{n.description}</p>
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

const emptyForm = {
  id: null,
  name: "",
  role: "",
  desc: "",
  // imageUrl is stored when server returns uploaded file URL
  imageUrl: "",
  // imageFile is a File used for uploading (not sent to server as JSON)
  imageFile: null,
  // preview locally
  imgPreview: null,
  socials: { instagram: "", linkedin: "", facebook: "" },
};

function TeamManager({ initialTeam = [], setTeam: setParentTeam }) {
  const [team, setTeam] = useState(initialTeam);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false); // boolean: are we editing existing member?
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // fetch team on mount
  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/user/all-members`);
      setTeam(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch team", err);
      alert("Failed to fetch team. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // when admin clicks Edit, we fill form with member data
  const handleEdit = (member) => {
    setForm({
      id: member.id,
      name: member.name || "",
      role: member.role || "",
      desc: member.description || "",
      imageUrl: member.imageUrl || "",
      imageFile: null,
      imgPreview: member.imageUrl || null,
      socials: {
        instagram: member.socials?.instagram || "",
        linkedin: member.socials?.linkedin || "",
        facebook: member.socials?.facebook || "",
      },
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    // revoke objectURL to free memory if used
    if (form.imgPreview && form.imageFile) URL.revokeObjectURL(form.imgPreview);
    setForm({ ...emptyForm });
    setEditing(false);
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // preview using objectURL (more efficient than base64)
    const preview = URL.createObjectURL(file);
    // revoke old preview if one existed
    if (form.imgPreview && form.imageFile) URL.revokeObjectURL(form.imgPreview);
    setForm((f) => ({ ...f, imageFile: file, imgPreview: preview }));
  };

  const handleChangeSocial = (key, value) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [key]: value } }));

  const createMember = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("description", form.desc || "");
      fd.append("socialLinks", JSON.stringify(form.socials || {}));
      if (form.imageFile) fd.append("image", form.imageFile);

      const res = await axios.post(`${API}/api/user/create-member`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = res.data.member || res.data;
      console.log(created);
      // update local state and parent if provided
      setTeam((t) => [created, ...t]);
      if (typeof setParentTeam === "function")
        setParentTeam([created, ...team]);

      resetForm();
    } catch (err) {
      console.error("Create failed", err);
      alert("Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  const updateMember = async () => {
    if (!form.id) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("description", form.desc || "");
      fd.append("socialLinks", JSON.stringify(form.socials || {}));
      if (form.imageFile) fd.append("image", form.imageFile);

      const res = await axios.put(
        `${API}/api/user/update-user/${form.id}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updated = res.data.member || res.data;
      setTeam((t) => t.map((m) => (m.id === updated.id ? updated : m)));
      if (typeof setParentTeam === "function")
        setParentTeam(team.map((m) => (m.id === updated.id ? updated : m)));

      resetForm();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed. See console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeMember = async (id) => {
    if (!confirm("Delete this team member? This action cannot be undone."))
      return;
    try {
      await axios.delete(`${API}/api/user/delete-user/${id}`);
      setTeam((t) => t.filter((m) => m.id !== id));
      if (typeof setParentTeam === "function")
        setParentTeam(team.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed. See console for details.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Team</h2>
        <div>
          <button
            onClick={() => {
              resetForm();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-3 py-2 cursor-pointer rounded bg-yellow-500 text-black font-semibold"
          >
            Clear form
          </button>
        </div>
      </div>

      {/* FORM */}
      <form className="mb-6 bg-zinc-950 p-4 rounded">
        <label className="text-sm text-gray-300">Name</label>
        <input
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <label className="text-sm text-gray-300">Role</label>
        <input
          value={form.role}
          required
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <label className="text-sm text-gray-300">Bio / Short Description</label>
        <textarea
          required
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          rows={3}
          className="w-full bg-black border border-yellow-600/50 px-3 py-2 rounded mt-1 mb-3 text-white"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-300">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              required
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
          {editing ? (
            <>
              <button
                onClick={updateMember}
                disabled={submitting}
                className="px-4 py-2 cursor-pointer rounded bg-yellow-500 text-black font-semibold disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex flex-row gap-2 items-center ">
                    Add member
                    <Loader2Icon className="animate-spin" />
                  </span>
                ) : (
                  "Update"
                )}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded bg-white/5 cursor-pointer"
                disabled={submitting}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={createMember}
              disabled={submitting}
              className="px-4 py-2 rounded cursor-pointer bg-yellow-500 text-black font-semibold disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex flex-row gap-2 items-center">
                  Add member
                  <Loader2Icon className="animate-spin" />
                </span>
              ) : (
                "Add member"
              )}
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      {loading ? (
        <div>Loading team...</div>
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className=" flex flex-row items-center gap-2">
            <User size={18} />
            All Users
          </h2>
          {team.map((m) => (
            <div
              key={m.id}
              className="bg-zinc-950 p-3 rounded border border-yellow-700/10"
            >
              <div className="flex flex-row items-center gap-3">
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
                <div className="flex-1">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-yellow-400">{m.role}</p>
                  <p className="text-xs text-gray-300 mt-1">{m.description}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="px-2 py-1 rounded bg-white/5 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="px-2 py-1 rounded bg-red-600 text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Socials */}
              <div className="mt-3 flex gap-3">
                {m.socials?.instagram && (
                  <a
                    href={m.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-300"
                  >
                    Insta
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

/* -----------------------------
  Notes & How to wire to backend
------------------------------*/

/*
  Replace the localStorage helpers (loadFromLS/saveToLS) with API calls.
  Example with axios (pseudo):

  // load
  const fetchBlogs = async () => {
    const res = await axios.get('/api/admin/blogs'); setBlogs(res.data);
  }

  // create
  const createBlog = async (blog) => {
    const res = await axios.post('/api/admin/blogs', blog); setBlogs([res.data, ...blogs]);
  }

  For images, it's recommended to upload them to Cloudinary/S3 and store only the URL in your records.
  In admin UI, replace fileToBase64 usage with upload flow:
    1. select file
    2. upload to storage service via signed URL or direct API
    3. save returned URL into the resource

  Security: protect this admin route behind authentication (Clerk/Auth0/Firebase). Do not expose admin API to public.
*/

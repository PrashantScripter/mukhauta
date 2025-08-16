import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./button";
import toast, { Toaster } from "react-hot-toast";

const API = import.meta.env.VITE_SERVER_URL;


const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [file, setFile] = useState(null); // New state for the file
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(); // Use FormData for multipart upload
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("subject", form.subject);
    formData.append("message", form.message);
    if (file) {
      formData.append("document", file); // Append the file if selected
    }

    try {
      const response = await axios.post(
        `${API}/api/user/contact`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );
      console.log("Message sent successfully!");
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
      setFile(null); // Reset file input
    } catch (error) {
      console.log("Failed to send message. Please try again.", error);
      toast.error("Failed to send message. Please try again later!.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-black py-16 px-6 md:px-20" id="contact">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto">
        <h2 className="flex flex-row gap-4 justify-center items-center text-4xl lg:text-6xl font-bold text-white text-center mb-4">
          <span className="text-yellow-500">Contact</span>Us
        </h2>
        <p className="text-white text-lg text-center mb-10">
          Have questions, suggestions, or want to collaborate? We'd love to hear
          from you!
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-red-800 to-black p-8 rounded-xl shadow-xl border border-yellow-500/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={handleChange}
              className="bg-black border border-yellow-500/50 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={handleChange}
              className="bg-black border border-yellow-500/50 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
          </div>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="bg-black border border-yellow-500/50 text-white px-4 py-3 rounded-md w-full mb-6 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            required
            rows="5"
            value={form.message}
            onChange={handleChange}
            className="bg-black border border-yellow-500/50 text-white px-4 py-3 rounded-md w-full mb-6 resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />

          {/* New file input */}
          <input
            type="file"
            name="document"
            accept=".pdf,.doc,.docx" // Restrict to PDF and DOC files (optional)
            onChange={handleFileChange}
            className="bg-black border cursor-pointer border-yellow-600/50 text-white px-4 py-3 rounded-md w-full mb-6 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          />

          {sending ? (
            <Button
              disabled
              type="submit"
              className="flex ml-auto bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-black font-semibold px-6 py-3 rounded-md transition w-full md:w-auto"
            >
              Send Message
              <Loader2Icon className="animate-spin" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex ml-auto bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-black font-semibold px-6 py-3 rounded-md transition w-full md:w-auto"
            >
              Send Message
            </Button>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;

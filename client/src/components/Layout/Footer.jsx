// components/Footer.jsx

import React from "react";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Logo & About */}
        <div>
          <h2 className="flex flex-row items-center gap-2 text-2xl text-yellow-400 mb-4">
            <span>🎭</span>
            Mukhauta
          </h2>
          <p className="text-sm text-gray-300">
            The official drama society of J.B KNOWLEDGE. We bring stories to
            life through passion, performance, and purpose.
          </p>
        </div>

        {/* Middle: Navigation */}
        <div>
          <h3 className="text-xl font-semibold text-yellow-300 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="#about" className="hover:text-yellow-400 transition">
                About Us
              </a>
            </li>
            <li>
              <Link
                to={"/notices"}
                className="hover:text-yellow-400 transition"
              >
                Notices
              </Link>
            </li>
            <li>
              <Link
                to={"/gallery"}
                className="hover:text-yellow-400 transition"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link to={"/team"} className="hover:text-yellow-400 transition">
                Our Team
              </Link>
            </li>
            <li>
              <a href="#contact" className="hover:text-yellow-400 transition">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Right: Contact & Social */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-yellow-300 mb-4">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-yellow-400" />
              mukhautadramaticsociety@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-yellow-400" />
              +91-7065779744
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-yellow-400" />
              +91-8800935448
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-10 h-10 text-yellow-400" />
              JB Knowledge Park, Manjhawali, Faridabad NCR -121 102 Nearest
              Metro Station: Badarpur Delhi
            </li>
          </ul>

          <div className="flex gap-4 mt-4">
            <a
              href="https://www.instagram.com/mukhauta_dramatic_society_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5 text-white hover:text-yellow-400 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-white/80 text-sm mt-12 border-t border-yellow-500/20 pt-6">
        © {new Date().getFullYear()} Mukhauta. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

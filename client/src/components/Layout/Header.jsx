import React, { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "../ui/button";
import {
  Bell,
  Contact,
  Drama,
  Eye,
  Globe,
  Images,
  LogIn,
  Menu,
  Rss,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const syncMe = async () => {
      const token = await getToken();
      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/sync/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
    };

    if (isSignedIn) {
      syncMe();
    }
  }, [isSignedIn, getToken]);

  return (
    <header className="flex flex-row cursor-pointer z-50 justify-between items-center p-4 lg:px-10 fixed top-0 w-dvw backdrop-blur-xl">
      <div className="flex flex-row gap-2 items-center">
        {/* <Drama className="size-10 text-white" /> */}
        <Link to={"/"} className="flex flex-row gap-2 items-center ">
          {/* <span className="text-4xl">🎭</span> */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="./Mukhota-logo.png"
              alt="logo"
              className="w-full h-full object-fit"
            />
          </div>
          <span className="text-yellow-500 text-xl logo-style">Mukhauta</span>
        </Link>
      </div>

      <div className="hidden lg:flex">
        <div className="flex flex-row gap-6">
          <Link to={"/gallery"} className="relative text-white group">
            Gallery
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>

          <Link to={"/blog"} className="relative text-white group">
            Blogs
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>

          <Link to={"/notices"} className="relative text-white group">
            Notices
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>

          <Link to={"/team"} className="relative text-white group">
            Team
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>

          <a href="#about" className="relative text-white group">
            About
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
          </a>

          <a href="#contact" className="relative text-white group">
            Contact
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
          </a>

          <Link to={"/admin"} className="relative text-white group">
            Admin
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
        </div>
      </div>
      <div>
        <SignedOut>
          <SignInButton>
            <Button className="cursor-pointer bg-yellow-500 border-2 border-yellow-500 text-black hover:bg-transparent hover:text-white">
              Join Us
              <LogIn />
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-row gap-4 items-center">
            <UserButton />
            <Menubar className="flex lg:hidden bg-transparent">
              <MenubarMenu>
                <MenubarTrigger>
                  <Menu className="text-white cursor-pointer" />
                </MenubarTrigger>
                <MenubarContent className="bg-zinc-950 border border-yellow-500">
                  <MenubarItem>
                    <Images />
                    <Link to={"/gallery"} className="relative text-white group">
                      Gallery
                      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Rss />
                    <Link to={"/blog"} className="relative text-white group">
                      Blogs
                      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Bell />
                    <Link to={"/notices"} className="relative text-white group">
                      Notices
                      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </Link>
                  </MenubarItem>
                  <MenubarItem>
                    <UsersRound />
                    <Link to={"/team"} className="relative text-white group">
                      Team
                      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </Link>{" "}
                  </MenubarItem>
                  <MenubarItem>
                    <Globe />
                    <a href="#about" className="relative text-white group">
                      About
                      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </a>
                  </MenubarItem>
                  <MenubarItem>
                    <Contact />
                    <a href="#contact" className="relative text-white group">
                      Contact
                      <span className="pointer-events-none absolute left-1/2 -bottom-1 h-[2px] w-full -translate-x-1/2 origin-center scale-x-0 bg-yellow-500 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </a>{" "}
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;

import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
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
  Images,
  LogIn,
  Menu,
  Rss,
} from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex flex-row cursor-pointer z-50 justify-between items-center p-4 lg:px-10 fixed top-0 w-dvw backdrop-blur-xl">
      <div className="flex flex-row gap-2 items-center">
        {/* <Drama className="size-10 text-white" /> */}
        <Link to={"/"} className="flex flex-row gap-4 items-center">
          <span className="text-4xl">🎭</span>
          <span className="font-bold text-2xl text-yellow-400 hidden sm:flex">
            Mukhauta
          </span>
        </Link>
      </div>

      <div className="hidden lg:flex">
        <ul className="flex flex-row gap-6">
          <li className="text-white font-medium">
            <Link to={"/gallery"}>Gallery</Link>
          </li>
          <li className="text-white font-medium">
            <Link to={"/blog"}>Blogs</Link>
          </li>
          <li className="text-white font-medium">
            <Link to={"/notices"}>Notices</Link>
          </li>
          <li className="text-white font-medium">
            <Link to={"/team"}>Team</Link>
          </li>
          <li className="text-white font-medium">
            <a href="#about">About</a>
          </li>
          <li className="text-white font-medium">
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>
      <div>
        <SignedOut>
          <SignInButton>
            <Button className="cursor-pointer bg-blue-900 hover:bg-blue-950">
              Sign In
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
                  <Menu className="text-white" />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <Images />
                    <span className=" font-medium">Gallery</span>
                  </MenubarItem>
                  <MenubarItem>
                    <Rss />
                    <span className="font-medium">Blogs</span>
                  </MenubarItem>
                  <MenubarItem>
                    <Bell />
                    <span className="font-medium">Notices</span>
                  </MenubarItem>
                  <MenubarItem>
                    <Contact />
                    <span className="font-medium">Contact us</span>
                  </MenubarItem>
                  <MenubarItem>
                    <Eye />
                    <span className="font-medium">About us</span>
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

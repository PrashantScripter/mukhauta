import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

const Header = () => {
  return (
    <header className="flex flex-row justify-between items-center p-4 bg-purple-50">
      <div>
        <h1>Mukhauta</h1>
      </div>
      <div>
        <SignedOut>
          <SignInButton>
            <Button className="cursor-pointer">
              Sign In
              <LogIn />
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;

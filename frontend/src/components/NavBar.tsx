"use client";

import Menu from "./Menu";
import Link from "next/link";
import CartIcon from "./CartIcon";
import Image from "next/image";
import Profile from "./Profile";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const NavBar = () => {
  const [displayProfile, setDisplayProfile] = useState(false);
  const { user } = useAuth();

  return (
    <div className="h-12 text-red-500 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/">Contact</Link>
      </div>
      {/* LOGO */}
      <div className="text-xl md:font-bold md:text-center flex-1">
        <Link href="/">My Restaurant</Link>
      </div>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        <Menu />
      </div>
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <div className="md:absolute top-3 right-2 lg:static flex items-center gap-2 cursor-pointer bg-orange-300 px-1 rounded-md">
          <Image src="/phone.png" alt="" width={20} height={20} />
          <span>0942 827 631</span>
        </div>
        <CartIcon />
        {!user && <Link href="/login">Login</Link>}
        {user && (
          <div className="relative">
            <div
              onClick={() => setDisplayProfile(!displayProfile)}
              className="w-10 h-10 rounded-full border-2 border-red-500 overflow-hidden flex items-center justify-center cursor-pointer"
            >
              <Image
                src={user.image ?? "/avatar.png"}
                alt="Profile"
                width={20}
                height={20}
                className="w-full h-full object-cover"
              />
            </div>
            <Profile
              open={displayProfile}
              onClose={() => setDisplayProfile(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;

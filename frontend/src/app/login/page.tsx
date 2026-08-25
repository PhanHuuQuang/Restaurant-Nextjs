"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const LoginPage = () => {
  const [view, setView] = useState<"options" | "login" | "register">("options");

  return (
    <div className="p-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center">
      {/* BOX */}
      <div className="h-full shadow-2xl rounded-md flex flex-col md:flex-row md:h-[90%] md:w-full lg:w-[60%] 2xl:w-1/2">
        {/* IMAGE CONTAINER */}
        <div className="relative h-1/3 w-full md:h-full md:w-1/2">
          <Image src="/loginBg.png" alt="" fill className="object-cover" />
        </div>
        {/* FORM CONTAINER */}
        <div className="p-10 flex flex-col gap-6 md:gap-3 md:p-6 md:w-1/2">
          {view === "options" && (
            <>
              <h1 className="font-bold text-xl xl:text-2xl">Welcome</h1>
              <p>Log into your account or create a new one</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setView("login")}
                  className="flex gap-4 p-4 ring-1 ring-orange-100 rounded-md"
                >
                  <Image
                    src="/lock.png"
                    alt=""
                    width={25}
                    height={25}
                    className="object-contain"
                  />
                  <span>Sign in with Account</span>
                </button>
                <button className="flex gap-4 p-4 ring-1 ring-orange-100 rounded-md">
                  <Image
                    src="/google.png"
                    alt=""
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span>Sign in with Google</span>
                </button>
                <button className="flex gap-4 p-4 ring-1 ring-blue-100 rounded-md">
                  <Image
                    src="/facebook.png"
                    alt=""
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span>Sign in with Facebook</span>
                </button>
              </div>
            </>
          )}

          {view === "login" && (
            <>
              <h1 className="font-bold text-xl xl:text-2xl">Welcome Back</h1>
              <p>Log into your account</p>
              <LoginForm
                onSwitchToRegister={() => setView("register")}
                onBack={() => setView("options")}
              />
            </>
          )}

          {view === "register" && (
            <RegisterForm
              onSwitchToLogin={() => setView("login")}
              onBack={() => setView("options")}
            />
          )}

          {view === "options" && <p className="text-sm">
            Have a problem?{" "}
            <Link className="underline" href="/">
              Contact us
            </Link>
          </p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";

import { useState } from "react";
import Image from "next/image";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Link from "next/link";
import { API_BASE_URL } from "@/api/client";

const Form = () => {
  const [view, setView] = useState<"options" | "login" | "register">("options");

  const handleGoogleSignin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleFacebookSignin = () => {
    console.log("Not implement yet");
  };

  return (
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
            <button
              onClick={handleGoogleSignin}
              className="flex gap-4 p-4 ring-1 ring-orange-100 rounded-md"
            >
              <Image
                src="/google.png"
                alt=""
                width={20}
                height={20}
                className="object-contain"
              />
              <span>Sign in with Google</span>
            </button>
            <button
              onClick={handleFacebookSignin}
              className="flex gap-4 p-4 ring-1 ring-blue-100 rounded-md"
            >
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

      {view === "options" && (
        <p className="text-sm">
          Have a problem?{" "}
          <Link className="underline" href="/">
            Contact us
          </Link>
        </p>
      )}
    </div>
  );
};

export default Form;

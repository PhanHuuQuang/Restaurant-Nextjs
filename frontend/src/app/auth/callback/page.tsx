"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function AuthCallbackContent() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    login()
      .then(() => router.replace("/"))
      .catch(() => router.replace("/login"));
  }, [login, router]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}

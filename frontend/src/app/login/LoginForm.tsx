"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, type LoginInput } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

type Props = {
  onSwitchToRegister: () => void;
  onBack: () => void;
};

const LoginForm = ({ onSwitchToRegister, onBack }: Props) => {
  const [inputs, setInputs] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiLogin(inputs);
      await login(res.accessToken);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={inputs.email}
        onChange={handleChange}
        required
        className="p-3 ring-1 ring-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-400"
      />
      <input
        type="password"
        name="password"
        placeholder="Password (min 8 characters)"
        value={inputs.password}
        onChange={handleChange}
        required
        minLength={8}
        className="p-3 ring-1 ring-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-400"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-red-500 text-white p-3 rounded-md disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-sm text-center">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="underline text-red-500"
        >
          Register
        </button>
      </p>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-center text-gray-500 underline"
      >
        Back to options
      </button>
    </form>
  );
};

export default LoginForm;

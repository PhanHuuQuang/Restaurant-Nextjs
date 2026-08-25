"use client";

import { useState } from "react";
import { register, type RegisterInput } from "@/api/auth";

type Props = {
  onSwitchToLogin: () => void;
  onBack: () => void;
};

const RegisterForm = ({ onSwitchToLogin, onBack }: Props) => {
  const [inputs, setInputs] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await register(inputs);
      // TODO: store token (e.g. localStorage / context)
      console.log("Registered:", res.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-2">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={inputs.name}
        onChange={handleChange}
        required
        className="p-3 ring-1 ring-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-400"
      />
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
      <input
        type="tel"
        name="phone"
        placeholder="Phone (optional)"
        value={inputs.phone}
        onChange={handleChange}
        className="p-3 ring-1 ring-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-400"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-red-500 text-white p-3 rounded-md disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="text-sm text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="underline text-red-500"
        >
          Login
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

export default RegisterForm;

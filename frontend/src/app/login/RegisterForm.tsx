"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register as apiRegister, type RegisterInput } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

const PHONE_PATTERN =
  "^(03[2-9]|05[6|8|9]|07[0|6-9]|08[1-9]|09[0-4|6-9])[0-9]{7}$";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  onSwitchToLogin: () => void;
  onBack: () => void;
};

type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

const inputClass =
  "p-3 ring-1 ring-gray-300 rounded-md outline-none focus:ring-2 focus:ring-red-400";

const RegisterForm = ({ onBack }: Props) => {
  const [inputs, setInputs] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!inputs.name.trim()) {
      errors.name = "Name is required";
    }
    if (!inputs.email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(inputs.email)) {
      errors.email = "Email is invalid";
    }
    if (!inputs.password) {
      errors.password = "Password is required";
    } else if (inputs.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (inputs.phone && !new RegExp(PHONE_PATTERN).test(inputs.phone)) {
      errors.phone = "Must be a valid phone number";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await apiRegister({
        ...inputs,
        phone: inputs.phone || undefined,
      });
      await login();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 md:gap-2">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={inputs.name}
        onChange={handleChange}
        className={inputClass}
      />
      {fieldErrors.name && (
        <p className="text-red-500 text-sm -mt-2">{fieldErrors.name}</p>
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={inputs.email}
        onChange={handleChange}
        className={inputClass}
      />
      {fieldErrors.email && (
        <p className="text-red-500 text-sm -mt-2">{fieldErrors.email}</p>
      )}
      <input
        type="password"
        name="password"
        placeholder="Password (min 8 characters)"
        value={inputs.password}
        onChange={handleChange}
        className={inputClass}
      />
      {fieldErrors.password && (
        <p className="text-red-500 text-sm -mt-2">{fieldErrors.password}</p>
      )}
      <input
        type="tel"
        name="phone"
        placeholder="Phone (optional)"
        value={inputs.phone}
        onChange={handleChange}
        className={inputClass}
      />
      {fieldErrors.phone && (
        <p className="text-red-500 text-sm -mt-2">{fieldErrors.phone}</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-red-500 text-white p-3 rounded-md disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-center text-gray-500 underline"
      >
        Back to logins
      </button>
    </form>
  );
};

export default RegisterForm;
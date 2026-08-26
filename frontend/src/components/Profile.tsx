"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, uploadAvatar } from "@/api/auth";
import EditableField from "./EditableField";

type Props = {
  open: boolean;
  onClose: () => void;
};

const Profile = ({ open, onClose }: Props) => {
  const { user, token, setUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!open || !user) return null;

  console.log(user);

  const handleSave = async (field: string, value: string) => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const payload = { [field]: value };
      const updated = await updateProfile(token, payload);
      setUser(updated);
      setEditingField(null);
    } catch (e: any) {
      console.warn(e.message);
      setError(`Failed to update ${field} field`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingAvatar(true);
    setError("");
    try {
      const updated = await uploadAvatar(token, file);
      setUser(updated);
    } catch (e: any) {
      console.warn(e.message);
      setError("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const enterProfileView = () => {
    setError("");
    setEditingField(null);
    setEditing(true);
  };

  const exitProfileView = () => {
    setEditing(false);
    setEditingField(null);
    setError("");
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
        {editing ? (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Profile
            </h3>
            {error && (
              <p className="text-xs text-red-500 mb-2 normal-case">{error}</p>
            )}
            <div className="space-y-3">
              <EditableField
                label="Name"
                value={user.name}
                isActive={editingField === "name"}
                onEdit={() => setEditingField("name")}
                onCancel={() => setEditingField(null)}
                onSave={(v) => handleSave("name", v)}
                loading={loading}
              />
              <EditableField
                label="Phone"
                value={user.phone ?? ""}
                isActive={editingField === "phone"}
                onEdit={() => setEditingField("phone")}
                onCancel={() => setEditingField(null)}
                onSave={(v) => handleSave("phone", v)}
                loading={loading}
              />
              <button
                onClick={exitProfileView}
                className="w-full border border-gray-300 text-sm py-1 rounded hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
              <div className="relative w-10 h-10 rounded-full border-2 border-red-500 overflow-hidden flex-shrink-0">
                <Image
                  src={user.image || "/avatar.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.name ?? "USER"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="py-1">
              <button
                onClick={enterProfileView}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <Link
                href="/orders"
                onClick={onClose}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 normal-case"
              >
                Orders
              </Link>
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;

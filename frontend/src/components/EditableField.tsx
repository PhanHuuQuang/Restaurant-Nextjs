"use client";

import { useState } from "react";

type Props = {
  label: string;
  value: string;
  isActive: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (value: string) => void;
  loading?: boolean;
  emptyPlaceholder?: string;
};

const EditableField = ({
  label,
  value,
  isActive,
  onEdit,
  onCancel,
  onSave,
  loading = false,
  emptyPlaceholder = "\u2014",
}: Props) => {
  const [draft, setDraft] = useState(value);

  const handleEdit = () => {
    setDraft(value);
    onEdit();
  };

  const handleSave = () => {
    onSave(draft);
  };

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {isActive ? (
        <div className="flex gap-1">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-[50%] flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-red-500"
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "..." : "Save"}
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 border border-gray-300 text-xs rounded hover:bg-gray-50"
          >
            X
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-800">
            {value || emptyPlaceholder}
          </span>
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;

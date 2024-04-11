"use client";

import { signIn } from "next-auth/react";

export default function LogoutButton() {
  return (
    <div>
      <button
        type="button"
        onClick={() => signIn("line")}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}

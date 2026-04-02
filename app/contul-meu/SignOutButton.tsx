"use client";

import { signOut } from "@/utils/supabase/auth";

export default function SignOutButton() {
  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full sm:w-auto border-2 border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-500 font-bold text-sm px-6 py-3 rounded-xl transition-all"
    >
      Deconectare
    </button>
  );
}

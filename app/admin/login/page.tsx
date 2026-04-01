"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-60 text-white font-black text-base py-3.5 rounded-xl transition-colors"
    >
      {pending ? "Se verifică..." : "Intră în admin"}
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useFormState(loginAction, { error: "" });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🧡</span>
          <h1 className="text-2xl font-black text-[#1a1a2e] mt-2">KidsApp Admin</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Sibiu</p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Parolă admin
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-700 outline-none focus:border-[#ff5a2e] focus:ring-2 focus:ring-[#ff5a2e]/20 transition-all"
            />
          </div>

          {state.error && (
            <p className="text-sm font-semibold text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">
              ❌ {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          <a href="/" className="hover:text-[#ff5a2e]">← Înapoi la site</a>
        </p>
      </div>
    </div>
  );
}

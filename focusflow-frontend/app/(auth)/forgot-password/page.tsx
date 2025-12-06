"use client";
import { useState } from "react";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import { COLORS, SIZES } from "@/app/lib/styles";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email");
    } else setMessage("If this email exists, we’ll send you a reset link.");
  };

  const isDisabled = !email;
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-6 mt-8 mb-4">
        <AuthInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          placeholder="Enter your email"
        />

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-3 ${
            SIZES.radiusMedium
          } text-white text-base font-semibold tracking-wide ${
            isDisabled
              ? "bg-indigo-400/30"
              : "bg-indigo-950 hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          }`}
        >
          Send reset link
        </button>
      </form>
      <p className={`text-xs ${COLORS.textMuted} text-center mt-4`}>
        Back to{" "}
        <a href="/login" className="text-indigo-400 hover:underline">
          login
        </a>
      </p>
      <p className="text-sm text-gray-300 text-center mt-2">{message}</p>
    </AuthCard>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Invalid Email or Password");
      return;
    }
    const data = await res.json();

    const token = data.accessToken;
    localStorage.setItem("ff_token", token);

    router.push("/dashboard");
  };

  const isDisabled = !email || !password;
  return (
    <AuthCard
      title="Create Account"
      subtitle="Sign up to start using FocusFlow"
    >
      <form onSubmit={handleSubmit} className="space-y-6 mt-8 mb-4">
        <AuthInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          placeholder="Enter your email"
        />
        <AuthInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="Enter your password"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-3 rounded-xl text-white text-base font-semibold tracking-wide ${
            isDisabled
              ? "bg-indigo-400/30"
              : "bg-indigo-950 hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          }`}
        >
          Signup
        </button>
      </form>
      <p className="text-sm text-gray-400 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-indigo-400 hover:underline">
          Log in
        </a>
      </p>
      {error && (
        <p className="text-sm text-red-400 text-center mt-4">{error}</p>
      )}
    </AuthCard>
  );
}

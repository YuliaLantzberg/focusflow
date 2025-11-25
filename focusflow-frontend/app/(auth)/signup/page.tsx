"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthCard from "../_components/AuthCard";

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
  return (
    <AuthCard
      title="Create Account"
      subtitle="Sign up to start using FocusFlow"
    >
      <form onSubmit={handleSubmit}>
        <input
          className="border border-black p-2 block mb-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-black p-2 block mb-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="border border-black px-4 py-2 cursor-pointer"
        >
          Signup
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </AuthCard>
  );
}

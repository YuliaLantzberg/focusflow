"use client";
import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false; // on the server / during pre-render
    }
    const token = localStorage.getItem("ff_token");
    return !!token;
  });

  if (!isLoggedIn) {
    return (
      <>
        <h1>Dashboard</h1>
        <p>You are not logged in.</p>
        <Link href="/login">Go to login</Link>
      </>
    );
  }

  return (
    <>
      <h1>Dashboard Page</h1>
      <p>You are logged in</p>
    </>
  );
}

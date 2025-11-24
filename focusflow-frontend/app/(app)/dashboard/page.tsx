"use client";
import { useState } from "react";
import Link from "next/link";
import PageContainer from "../_components/page-container";
import PageSection from "../_components/page-section";

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
      <PageContainer>
        <PageSection>
          <h1>Dashboard</h1>
          <p>You are not logged in.</p>
          <Link href="/login">Go to login</Link>
        </PageSection>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageSection>
        <h1>Dashboard Page</h1>
        <p>You are logged in</p>
      </PageSection>
    </PageContainer>
  );
}

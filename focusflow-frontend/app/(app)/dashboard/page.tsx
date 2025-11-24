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
        <h2 className="text-lg font-semibold text-slate-100">Today's Focus</h2>
        <p className="text-sm text-slate-300">Coming soon...</p>
      </PageSection>

      <PageSection>
        <h2 className="text-lg font-semibold text-slate-100">Quick Stats</h2>
        <p className="text-sm text-slate-300">Stats will appear here.</p>
      </PageSection>

      <PageSection>
        <h2 className="text-lg font-semibold text-slate-100">
          Projects Overview
        </h2>
        <p className="text-sm text-slate-300">Project info coming soon.</p>
      </PageSection>

      <PageSection>
        <h2 className="text-lg font-semibold text-slate-100">Tasks Overview</h2>
        <p className="text-sm text-slate-300">Task info coming soon.</p>
      </PageSection>
    </PageContainer>
  );
}

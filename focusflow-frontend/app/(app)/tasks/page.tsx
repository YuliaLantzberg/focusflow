"use client";

import { STYLES } from "@/app/lib/styles";
import PageContainer from "../_components/page-container";
import { PageTitle } from "../_components/page-title";
import Link from "next/link";

export default function TasksPage() {
  return (
    <PageContainer>
      <div className={`${STYLES.flexCenter} flex-col`}>
        <PageTitle>Tasks</PageTitle>
        <p className="mt-10">Tasks are always part of a project</p>
        <Link className="underline" href="/projects">
          Choose a project to view and manage its tasks.
        </Link>
      </div>
    </PageContainer>
  );
}

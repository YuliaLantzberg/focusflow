"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import PageContainer from "../../_components/page-container";
import { apiFetch } from "@/app/lib/apiClient";
import { Project } from "@/app/types/project";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await apiFetch(
          `http://localhost:3000/projects/${projectId}`
        );
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadProject();
  }, [projectId]);
  if (!project)
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  return (
    <PageContainer>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
    </PageContainer>
  );
}

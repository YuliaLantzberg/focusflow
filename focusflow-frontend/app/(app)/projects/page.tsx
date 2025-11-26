"use client";
import { useState, useEffect } from "react";
import PageContainer from "../_components/page-container";
import { apiFetch } from "@/app/lib/apiClient";
import PageSection from "../_components/page-section";
import { Project } from "@/app/types/project";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await apiFetch("http://localhost:3000/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadProjects();
  }, []);

  return (
    <PageContainer>
      <h1>Projects</h1>
      <Link href="/projects/new">
        <button>Create New Project</button>
      </Link>
      <p>{projects.length}</p>
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <PageSection>
            <h2>{project.name}</h2>
            <p>Status: {project.status}</p>
            {project.description && <p>{project.description}</p>}
            {project.clientCompany && <p>{project.clientCompany}</p>}
            {project.dueDate && <p>Due Date: {project.dueDate}</p>}
          </PageSection>
        </Link>
      ))}
    </PageContainer>
  );
}

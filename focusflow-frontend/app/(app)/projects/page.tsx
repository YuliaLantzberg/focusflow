"use client";
import { useState, useEffect } from "react";
import PageContainer from "../_components/page-container";
import { apiFetch } from "@/app/lib/apiClient";
import PageSection from "../_components/page-section";
import { Project } from "@/app/types/project";
import { getProjectStatusColor } from "@/app/lib/statusColor";
import Link from "next/link";
import Badge from "../_components/badge";
import { ListItem } from "../_components/list-item";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await apiFetch("http://localhost:3000/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProjects();
  }, []);
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-100">Projects</h1>

        <Link href="/projects/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-sky-400/60 px-4 py-3 text-sm font-medium cursor-pointer text-white hover:bg-sky-300/60 transition-colors">
            Create New Project
          </button>
        </Link>
      </div>
      <div className="mt-4 max-w-3xl mx-auto space-y-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block"
          >
            <ListItem
              right={
                <Badge
                  label={project.status}
                  colorClass={getProjectStatusColor(project.status)}
                  className="w-24"
                />
              }
            >
              <div className="flex flex-col items-start gap-2">
                <h2 className="text-lg font-medium text-gray-100">
                  {project.name}
                </h2>
                {project.description && (
                  <p className="text-gray-300">{project.description}</p>
                )}
                {(project.clientCompany || project.dueDate) && (
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    {project.clientCompany && <p>{project.clientCompany}</p>}
                    {project.dueDate && <p>Due Date: {project.dueDate}</p>}
                  </div>
                )}
              </div>
            </ListItem>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}

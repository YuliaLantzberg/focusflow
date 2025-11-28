"use client";
// Libraries
import { useState, useEffect } from "react";
import Link from "next/link";

// Custom Libraries
import { apiFetch } from "@/app/lib/apiClient";
import { Project } from "@/app/types/project";
import { getProjectStatusColor } from "@/app/lib/statusColor";
import PageContainer from "../_components/page-container";

// Components
import Badge from "../_components/badge";
import { ListItem } from "../_components/list-item";
import { PageTitle } from "../_components/page-title";
import { CreateNewButton } from "../_components/buttons/create-new-button";

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
        <PageTitle>Projects</PageTitle>

        <CreateNewButton href="/projects/new" label="Create New Project" />
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

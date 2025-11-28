"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import PageContainer from "../../_components/page-container";
import { apiFetch } from "@/app/lib/apiClient";
import { Project } from "@/app/types/project";
import { getProjectStatusColor } from "@/app/lib/statusColor";

import { PageTitle } from "../../_components/page-title";
import Badge from "../../_components/badge";

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
      <div className="flex items-center justify-between mb-6">
        <PageTitle>{project.name}</PageTitle>

        <Badge
          label={project.status}
          colorClass={getProjectStatusColor(project.status)}
          className="w-24"
        />
      </div>
      <div className="max-w-3xl space-y-4">
        <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-3 md:px-6 md:py-4 space-y-3">
          {project.description && (
            <p className="text-gray-300">{project.description}</p>
          )}

          {(project.clientCompany || project.dueDate) && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {project.clientCompany && <p>Client: {project.clientCompany}</p>}
              {project.dueDate && <p>Due date: {project.dueDate}</p>}
            </div>
          )}
        </div>
        {/* Tasks section */}
        <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-3 md:px-6 md:py-4 space-y-2">
          <h2 className="text-lg font-medium text-gray-100">Tasks</h2>
          <p className="text-sm text-gray-400">Tasks UI coming soon.</p>
        </div>

        {/* Notes section */}
        <div className="rounded-lg border border-white/5 bg-white/5 px-4 py-3 md:px-6 md:py-4 space-y-2">
          <h2 className="text-lg font-medium text-gray-100">Notes</h2>
          <p className="text-sm text-gray-400">Notes UI coming soon.</p>
        </div>
      </div>
    </PageContainer>
  );
}

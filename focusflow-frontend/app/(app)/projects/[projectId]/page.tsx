"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import PageContainer from "../../_components/page-container";
import { loadData } from "@/app/lib/apiClient";
import { getProjectStatusColor } from "@/app/lib/statusColor";

import { Project } from "@/app/types/project";
import { Task } from "@/app/types/task";

import { PageTitle } from "../../_components/page-title";
import Badge from "../../_components/badge";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadData<Project>(`http://localhost:3000/projects/${projectId}`)
      .then(setProject)
      .catch(console.error);

    loadData<Task[]>(`http://localhost:3000/projects/${projectId}/tasks`)
      .then(setTasks)
      .catch(console.error);
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
          <h3>Total tasks: {tasks.length}</h3>
          {tasks.map((task) => (
            <div key={task.id}>
              <p>{task.title}</p>
            </div>
          ))}
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

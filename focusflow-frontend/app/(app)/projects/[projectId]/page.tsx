"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import PageContainer from "../../_components/page-container";
import { loadData, moveTask } from "@/app/lib/apiClient";
import { getProjectStatusColor } from "@/app/lib/statusColor";

import { Project } from "@/app/types/project";
import { Task, TaskStatus } from "@/app/types/task";

import { PageTitle } from "../../_components/page-title";
import Badge from "../../_components/badge";
import PageSection from "../../_components/page-section";
import TaskCard from "../../_components/task-card";
import { CardTitle } from "../../_components/card-title";

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

  const handleMove = async (taskId: string, status: TaskStatus) => {
    console.log(status);
    try {
      const updated = await moveTask(taskId, status);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );
    } catch (err) {
      console.error("Failed to move task", err);
    }
  };

  if (!project)
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const blockedTasks = tasks.filter((t) => t.status === "BLOCKED");
  const completedTasks = tasks.filter((t) => t.status === "DONE");

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
      <div className="space-y-4">
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
          <div className="grid gap-4 lg:grid-cols-4">
            <PageSection>
              <CardTitle color="text-cyan-500/50">TODO</CardTitle>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(status) => handleMove(task.id, status)}
                  />
                ))}
              </div>
            </PageSection>

            <PageSection>
              <CardTitle color="text-yellow-500/50">In Progress</CardTitle>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(status) => handleMove(task.id, status)}
                  />
                ))}
              </div>
            </PageSection>

            <PageSection>
              <CardTitle color="text-zinc-500/50">Blocked</CardTitle>
              <div className="space-y-3">
                {blockedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(status) => handleMove(task.id, status)}
                  />
                ))}
              </div>
            </PageSection>

            <PageSection>
              <CardTitle color="text-emerald-500/50">Completed</CardTitle>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(status) => handleMove(task.id, status)}
                  />
                ))}
              </div>
            </PageSection>
          </div>
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

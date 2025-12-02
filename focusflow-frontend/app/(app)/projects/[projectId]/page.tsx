"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import PageContainer from "../../_components/page-container";
import { loadData } from "@/app/lib/apiClient";
import { getProjectStatusColor } from "@/app/lib/statusColor";
import { createTask, moveTask } from "@/app/lib/tasks";

import { Project } from "@/app/types/project";
import { Task, TaskStatus } from "@/app/types/task";

import { PageTitle } from "../../_components/page-title";
import Badge from "../../_components/badge";
import FormCard from "../../_components/forms/form-card";
import { FormField } from "../../_components/forms/form-field";
import SubmitButton from "../../_components/buttons/submit-button";
import KanbanColumn from "../_components/kanban-column";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  useEffect(() => {
    loadData<Project>(`http://localhost:3000/projects/${projectId}`)
      .then(setProject)
      .catch(console.error);

    loadData<Task[]>(`http://localhost:3000/projects/${projectId}/tasks`)
      .then(setTasks)
      .catch(console.error);
  }, [projectId]);

  const handleMove = async (taskId: string, status: TaskStatus) => {
    setMovingTaskId(taskId);
    try {
      const updated = await moveTask(taskId, status);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );
    } catch (err) {
      console.error("Failed to move task", err);
    } finally {
      setMovingTaskId(null);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError(null);
    if (!newTitle.trim()) {
      setTitleError("Task title is required");
      return;
    }
    setIsCreating(true);
    try {
      const newTask = await createTask(projectId, {
        title: newTitle,
        description: newDescription,
      });
      if (newTask) {
        setTasks((prev) => [...prev, newTask]);
        setNewTitle("");
        setNewDescription("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsCreating(false);
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-100">Tasks</h2>
            <button
              type="button"
              onClick={() => setShowCreateTaskForm((prev) => !prev)}
              className="text-xs px-3 py-2 rounded-lg bg-sky-600/50 text-white hover:bg-sky-500/50 transition"
            >
              {showCreateTaskForm ? "Hide form" : "New Task"}
            </button>
          </div>
          {showCreateTaskForm && (
            <FormCard handleSubmit={handleCreateTask}>
              <FormField label="Title">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (titleError) setTitleError(null);
                  }}
                  placeholder="Name the new task here"
                  className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
                />
                {titleError && (
                  <p className="mt-1 text-xs text-red-400">{titleError}</p>
                )}
              </FormField>
              <FormField label="Description">
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Decribe the new task"
                  className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
                />
              </FormField>
              <SubmitButton disabled={isCreating}>Create New Task</SubmitButton>
            </FormCard>
          )}
          <div className="grid gap-4 lg:grid-cols-4">
            <KanbanColumn
              title="TODO"
              titleColor="text-cyan-500/50"
              tasks={todoTasks}
              onMove={handleMove}
              movingTaskId={movingTaskId}
            />
            <KanbanColumn
              title="In Progress"
              titleColor="text-yellow-500/50"
              tasks={inProgressTasks}
              onMove={handleMove}
              movingTaskId={movingTaskId}
            />
            <KanbanColumn
              title="Blocked"
              titleColor="text-zinc-500/50"
              tasks={blockedTasks}
              onMove={handleMove}
              movingTaskId={movingTaskId}
            />
            <KanbanColumn
              title="Completed"
              titleColor="text-emerald-500/50"
              tasks={completedTasks}
              onMove={handleMove}
              movingTaskId={movingTaskId}
            />
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

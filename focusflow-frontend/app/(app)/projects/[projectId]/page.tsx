"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import PageContainer from "../../_components/page-container";
import { loadData } from "@/app/lib/apiClient";
import { getProjectStatusColor } from "@/app/lib/statusColor";
import { createTask, moveTask } from "@/app/lib/tasks";

import { Project } from "@/app/types/project";
import { PROJECT_TASK_COLUMNS, Task, TaskStatus } from "@/app/types/task";

import { PageTitle } from "../../_components/page-title";
import Badge from "../../_components/badge";
import FormCard from "../../_components/forms/form-card";
import { FormField } from "../../_components/forms/form-field";
import SubmitButton from "../../_components/buttons/submit-button";
import KanbanColumn from "../_components/kanban-column";
import { TaskDetails } from "../../tasks/_components/task-details-panel";
import { CardShell } from "../../_components/card/cardShell";
import { CreateNewButton } from "../../_components/buttons/create-new-button";
import { CardTitle } from "../../_components/card/card-title";

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const handleSelectTask = (task: Task | null) => {
    setSelectedTask(task);
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

  const handleTaskUpdate = (updated: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task))
    );
    setSelectedTask(updated);
  };

  const handleTaskDelete = (deletedId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== deletedId));
  };

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
      <div className="space-y-4">
        <CardShell className="px-4 py-3 md:px-6 md:py-4 space-y-3">
          {project.description && (
            <p className="text-gray-300">{project.description}</p>
          )}

          {(project.clientCompany || project.dueDate) && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {project.clientCompany && <p>Client: {project.clientCompany}</p>}
              {project.dueDate && <p>Due date: {project.dueDate}</p>}
            </div>
          )}
        </CardShell>
        {/* Tasks section */}
        <CardShell className="px-4 py-3 md:px-6 md:py-4 space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle color="text-white">Tasks</CardTitle>
            <CreateNewButton
              onClick={() => setShowCreateTaskForm((prev) => !prev)}
            >
              {showCreateTaskForm ? "Hide form" : "New Task"}
            </CreateNewButton>
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
            {PROJECT_TASK_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.status}
                title={column.title}
                titleColor={column.titleColor}
                status={column.status}
                tasks={tasks.filter((t) => t.status === column.status)}
                onMove={handleMove}
                movingTaskId={movingTaskId}
                onSelect={handleSelectTask}
              />
            ))}
          </div>
        </CardShell>

        {/* Notes section */}
        <CardShell className="px-4 py-3 md:px-6 md:py-4 space-y-2">
          <h2 className="text-lg font-medium text-gray-100">Notes</h2>
          <p className="text-sm text-gray-400">Notes UI coming soon.</p>
        </CardShell>
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </PageContainer>
  );
}

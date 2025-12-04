import { apiFetch } from "./apiClient";
import { Task, TaskStatus, CreateTaskPayload } from "../types/task";

export async function moveTask(
  taskId: string,
  status: TaskStatus
): Promise<Task> {
  const res = await apiFetch(`http://localhost:3000/tasks/${taskId}/move`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(`Failed move task ${taskId}: ${res.status}`);
  }
  return res.json();
}

export async function createTask(
  projectId: string,
  payload: CreateTaskPayload
): Promise<Task> {
  const res = await apiFetch(
    `http://localhost:3000/projects/${projectId}/tasks`,
    {
      method: "POST",
      body: JSON.stringify({ projectId, ...payload }),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to create task: ${res.status}`);
  }
  return res.json();
}

export async function updateTask(
  taskId: string,
  payload: Partial<Task>
): Promise<Task> {
  const res = await apiFetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to update task ${taskId}: ${res.status}`);
  }

  return res.json();
}

export async function deleteTask(taskId: string): Promise<Task> {
  const res = await apiFetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to update task ${taskId}: ${res.status}`);
  }

  return res.json();
}

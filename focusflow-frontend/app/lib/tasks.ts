import { apiFetch } from "./apiClient";
import {
  Task,
  TaskStatus,
  CreateTaskPayload,
  OnHoldRequiredError,
} from "../types/task";

export async function moveTask(
  taskId: string,
  status: TaskStatus,
  order: number
): Promise<Task> {
  const res = await apiFetch(`http://localhost:3000/tasks/${taskId}/move`, {
    method: "PATCH",
    body: JSON.stringify({ status, order }),
  });
  if (!res.ok) {
    const errorBody = await res.json();
    if (res.status === 409) {
      throw {
        type: "ON_HOLD_REQUIRED",
        payload: errorBody,
      };
    } else throw new Error(`Failed move task ${taskId}: ${res.status}`);
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

export function isOnHoldRequiredError(
  err: unknown
): err is OnHoldRequiredError {
  return (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    (err as { type?: unknown }).type === "ON_HOLD_REQUIRED"
  );
}

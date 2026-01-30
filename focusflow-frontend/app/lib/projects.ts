import { CreateProjectPayload, Project } from "../types/project";
import { apiFetch } from "./apiClient";

export async function createProject(
  projectId: string,
  payload: CreateProjectPayload,
): Promise<Project> {
  const res = await apiFetch(`http://localhost:3000/projects/${projectId}`, {
    method: "POST",
    body: JSON.stringify({ ...payload }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create project: ${res.status}`);
  }
  return res.json();
}

export async function updateProject(
  projectId: string,
  payload: Partial<Project>,
): Promise<Project> {
  const res = await apiFetch(`http://localhost:3000/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("PATCH /projects failed:", res.status, text);
    throw new Error(`Failed to update task ${projectId}: ${res.status}`);
  }

  return res.json();
}

export async function updateProjectStatus(projectId: string): Promise<Project> {
  const res = await apiFetch(
    `http://localhost:3000/projects/${projectId}/status-update`,
    {
      method: "PATCH",
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to update task ${projectId}: ${res.status}`);
  }

  return res.json();
}

export async function deleteTask(projectId: string): Promise<Project> {
  const res = await apiFetch(`http://localhost:3000/projects/${projectId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to update task ${projectId}: ${res.status}`);
  }

  return res.json();
}

export async function getProjStatusNoOnHold(
  projectId: string,
): Promise<string> {
  const res = await apiFetch(
    `http://localhost:3000/projects/${projectId}/tasks/proj-status-no-onhold`,
    {
      method: "GET",
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to update task ${projectId}: ${res.status}`);
  }
  return res.json();
}

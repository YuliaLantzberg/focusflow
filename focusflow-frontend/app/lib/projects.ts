import { CreateProjectPayload, Project } from "../types/project";
import { apiFetch } from "./apiClient";

export async function createProject(
  projectId: string,
  payload: CreateProjectPayload
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
  payload: Partial<Project>
): Promise<Project> {
  const res = await apiFetch(`http://localhost:3000/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

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

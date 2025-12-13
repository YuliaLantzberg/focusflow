export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "DONE",
];

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  description?: string;
  dueDate?: string;
  priority?: number;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateTaskPayload = {
  title: string;
  description?: string;
  dueDate?: string;
};

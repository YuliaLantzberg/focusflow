export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "DONE",
];
interface TaskStatusInterface {
  TODO: TaskStatus;
  IN_PROGRESS: TaskStatus;
  BLOCKED: TaskStatus;
  DONE: TaskStatus;
}
export const TASK_STATUSES_ENUM: TaskStatusInterface = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  BLOCKED: "BLOCKED",
  DONE: "DONE",
};

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  description?: string;
  dueDate?: string;
  priority?: number;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateTaskPayload = {
  title: string;
  description?: string;
  dueDate?: string;
  order: number;
  status: TaskStatus;
};

export type TaskMutationIntent =
  | { type: "move"; toStatus: TaskStatus }
  | { type: "create" }
  | { type: "edit" }
  | { type: "delete" };

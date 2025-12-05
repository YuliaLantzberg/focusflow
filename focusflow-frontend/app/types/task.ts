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

type ColumnConfig = {
  status: TaskStatus;
  title: string;
  titleColor: string;
};

export const PROJECT_TASK_COLUMNS: ColumnConfig[] = [
  {
    status: "TODO",
    title: "TODO",
    titleColor: "text-cyan-500/50",
  },
  {
    status: "IN_PROGRESS",
    title: "In Progress",
    titleColor: "text-yellow-500/50",
  },
  {
    status: "BLOCKED",
    title: "Blocked",
    titleColor: "text-zinc-500/50",
  },
  {
    status: "DONE",
    title: "Completed",
    titleColor: "text-emerald-500/50",
  },
];

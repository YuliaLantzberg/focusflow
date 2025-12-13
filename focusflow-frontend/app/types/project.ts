import { COLORS } from "../lib/styles";
import { TaskStatus } from "./task";

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  clientCompany?: string | null;
  dueDate?: string | null;
}

type ColumnConfig = {
  status: TaskStatus;
  title: string;
  titleColor: string;
};

export const PROJECT_TASK_COLUMNS: ColumnConfig[] = [
  {
    status: "TODO",
    title: "TODO",
    titleColor: `${COLORS.statusText.todo}`,
  },
  {
    status: "IN_PROGRESS",
    title: "In Progress",
    titleColor: `${COLORS.statusText.inProgress}`,
  },
  {
    status: "BLOCKED",
    title: "Blocked",
    titleColor: `${COLORS.statusText.blocked}`,
  },
  {
    status: "DONE",
    title: "Completed",
    titleColor: `${COLORS.statusText.done}`,
  },
];

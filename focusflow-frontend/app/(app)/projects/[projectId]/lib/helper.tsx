import { loadData } from "@/app/lib/apiClient";
import { calcDaysDifference } from "@/app/lib/helper";
import { DUEDATE_STATUSES, DueDateStatus, Project } from "@/app/types/project";

export const refreshProject = async (
  projectId: string,
  setProject: (updatedProject: Project) => void
) => {
  try {
    const updated = await loadData<Project>(
      `http://localhost:3000/projects/${projectId}`
    );
    setProject(updated);
  } catch (e) {
    console.error("Failed to refresh project", e);
  }
};

export const calcProgress = (done: number, total: number): number => {
  if (total === 0) return 0;
  return (done / total) * 100;
};

export const calcDueDateConstraint = (
  dueDate: Date | null
): { status: DueDateStatus; daysNum: number | null } => {
  let status = DUEDATE_STATUSES.NONE;
  let daysNum = null;
  if (!dueDate) return { status, daysNum };

  const daysDifference: number = calcDaysDifference(dueDate);
  daysNum = daysDifference;
  if (daysDifference < 0) status = DUEDATE_STATUSES.OVERDUE;
  else {
    if (daysDifference >= 0 && daysDifference <= 2)
      status = DUEDATE_STATUSES.URGENT;
    if (daysDifference >= 3 && daysDifference <= 7)
      status = DUEDATE_STATUSES.SOON;
    if (daysDifference >= 8) status = DUEDATE_STATUSES.LATER;
  }
  return { status, daysNum };
};

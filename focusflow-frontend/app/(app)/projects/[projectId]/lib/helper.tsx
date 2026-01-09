import { loadData } from "@/app/lib/apiClient";
import { Project } from "@/app/types/project";

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

import { Task, TaskStatus } from "@/app/types/task";

export type DestType = "ZONE" | "TASK";

export const getStatusFromOverId = (overId: string): TaskStatus | null => {
  if (overId.startsWith("column-")) {
    return overId.replace("column-", "") as TaskStatus;
  }
  if (overId.endsWith("-dropzone")) {
    return overId.replace("-dropzone", "") as TaskStatus;
  }
  return null;
};

export function isColumnId(id: string): boolean {
  if (id.startsWith("column-")) return true;
  return false;
}

export function isDropzoneId(id: string): boolean {
  if (id.endsWith("-dropzone")) return true;
  return false;
}

export function isTaskId(id: string): boolean {
  const isStatus = getStatusFromOverId(id);
  if (!isStatus) return true;
  return false;
}

export function resolveDestination(
  overId: string,
  tasks: Task[]
): { destStatus: TaskStatus; destType: DestType } {
  const status = getStatusFromOverId(overId);
  if (status) {
    return { destStatus: status, destType: "ZONE" };
  } else {
    const task = tasks.find((task) => task.id === overId);
    if (task) return { destStatus: task.status, destType: "TASK" };
  }
  return { destStatus: "TODO", destType: "ZONE" };
}

// Returns tasks list within a destination column without the active task
export function getVirtualDestList(
  tasks: Task[],
  destStatus: TaskStatus,
  activeId: string
): Task[] {
  return tasks
    .filter((task) => task.status === destStatus && task.id !== activeId)
    .sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id)
    );
}

export function getDestIndex(
  destType: DestType,
  overId: string,
  destList: Task[]
): number {
  let destIndex = 0;
  // Case A — Dropping on a zone: append in the end
  if (destType === "ZONE") {
    destIndex = destList.length;
  }
  // Case B — Dropping on a task: if no such id in the list - append in the end; else insert before hovered task
  if (destType === "TASK") {
    const idx = destList.findIndex((task) => task.id === overId);
    if (idx === -1) destIndex = destList.length;
    else destIndex = idx;
  }
  return destIndex;
}

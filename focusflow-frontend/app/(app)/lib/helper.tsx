import { ProjectStatus, PROJECT_STATUSES } from "@/app/types/project";
import {
  TASK_STATUSES_ENUM,
  TaskMutationIntent,
  TaskStatus,
} from "@/app/types/task";
export function onHoldGate({
  projectStatus,
  intent,
}: {
  projectStatus: ProjectStatus;
  intent: TaskMutationIntent;
}): boolean {
  return (
    projectStatus === PROJECT_STATUSES.ON_HOLD &&
    !(intent.type === "move" && intent.toStatus === TASK_STATUSES_ENUM.BLOCKED)
  );
}

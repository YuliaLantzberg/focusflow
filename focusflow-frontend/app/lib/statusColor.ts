import { Ban, CheckCircle2, Circle, Loader, LucideIcon } from "lucide-react";
import { DueDateStatus } from "../types/project";

export function getProjectStatusColor(status: string): string {
  const statusColor: Record<string, string> = {
    PLANNING: "bg-slate-500/50",
    ACTIVE: "bg-sky-500/30",
    COMPLETED: "bg-emerald-600/50",
    ON_HOLD: "bg-amber-500/50",
    ARCHIVED: "bg-zinc-700/60",
  };
  if (!statusColor[status]) return "bg-gray-400";
  return statusColor[status];
}

export function getTaskStatusColor(status: string): string {
  const statusColor: Record<string, string> = {
    TODO: "bg-cyan-500/50",
    IN_PROGRESS: "bg-yellow-500/50",
    BLOCKED: "bg-zinc-500/50",
    DONE: "bg-emerald-500/50",
  };
  if (!statusColor[status]) return "bg-gray-400";
  return statusColor[status];
}

export function getTaskStatusIcon(status: string): LucideIcon {
  const statusIcon: Record<string, LucideIcon> = {
    TODO: Circle,
    IN_PROGRESS: Loader,
    BLOCKED: Ban,
    DONE: CheckCircle2,
  };
  return statusIcon[status];
}

export function getDuedateStatusColor(status: DueDateStatus): string {
  console.log(status);
  const statusColor: Record<string, string> = {
    OVERDUE: "text-red-500/50",
    URGENT: "text-red-500/50",
    SOON: "text-amber-500/50",
    LATER: "text-emerald-500/50",
  };
  if (!statusColor[status]) return "text-gray-400";
  return statusColor[status];
}

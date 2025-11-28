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

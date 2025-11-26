export function getProjectStatusColor(status: string): string {
  const statusColor: Record<string, string> = {
    PLANNING: "bg-gray-400",
    ACTIVE: "bg-blue-500",
    COMPLETED: "bg-green-500",
    ON_HOLD: "bg-yellow-500",
    ARCHIVED: "bg-gray-600",
  };
  if (!statusColor[status]) return "bg-gray-400";
  return statusColor[status];
}

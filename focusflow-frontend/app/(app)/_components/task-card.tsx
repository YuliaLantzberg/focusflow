import { Task, TaskStatus } from "@/app/types/task";

type TaskCardProps = {
  task: Task;
  className?: string;
  onMove?: (status: TaskStatus) => void | Promise<void>;
};
type TaskDropdownMenuProps = {
  status: TaskStatus;
  onMove?: (status: TaskStatus) => void | Promise<void>;
};

type TaskStatusOptionsProps = {
  currentStatus: TaskStatus;
};

function TaskStatusOptions({ currentStatus }: TaskStatusOptionsProps) {
  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];
  const filteredStatuses = statuses.filter(
    (status: string) => status !== currentStatus
  );
  return (
    <>
      {filteredStatuses.map((status: string) => (
        <option key={status} value={status} className="lowercase">
          {status}
        </option>
      ))}
    </>
  );
}

function TaskDropdownMenu({ status, onMove }: TaskDropdownMenuProps) {
  return (
    <select
      className="text-xs bg-transparent text-indigo-300"
      defaultValue=""
      onChange={(e) => {
        const value = e.target.value as TaskStatus;
        console.log("Dropdown change:", { value, statusBefore: status });
        if (onMove) onMove(value);
      }}
    >
      <option value="" disabled>
        Move to →
      </option>
      <TaskStatusOptions currentStatus={status} />
    </select>
  );
}

export default function TaskCard({ task, className, onMove }: TaskCardProps) {
  return (
    <div
      className={`${className} flex flex-col gap-2 px-4 py-3 md:px-6 md:py-4 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition`}
    >
      <p className="font-medium">{task.title}</p>
      {task.description && (
        <p className="text-xs text-gray-400">{task.description}</p>
      )}
      <TaskDropdownMenu status={task.status} onMove={onMove} />
    </div>
  );
}

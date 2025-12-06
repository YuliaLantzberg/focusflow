import { Task, TASK_STATUSES, TaskStatus } from "@/app/types/task";
import { CardShell } from "../../_components/card/cardShell";
import { COLORS, SIZES } from "@/app/lib/styles";

type TaskCardProps = {
  task: Task;
  className?: string;
  isMoving?: boolean;
  onMove?: (status: TaskStatus) => void | Promise<void>;
  onSelect?: (task: Task) => void;
};
type TaskDropdownMenuProps = {
  status: TaskStatus;
  onMove?: (status: TaskStatus) => void | Promise<void>;
  isMoving?: boolean;
};

type TaskStatusOptionsProps = {
  currentStatus: TaskStatus;
};

function TaskStatusOptions({ currentStatus }: TaskStatusOptionsProps) {
  const filteredStatuses = TASK_STATUSES.filter(
    (status) => status !== currentStatus
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

function TaskDropdownMenu({ status, onMove, isMoving }: TaskDropdownMenuProps) {
  return (
    <select
      className={`text-xs bg-transparent ${COLORS.BtnTextColor.primary} cursor-default`}
      defaultValue=""
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        const value = e.target.value as TaskStatus;
        if (onMove) onMove(value);
      }}
      disabled={isMoving}
    >
      <option value="" disabled>
        Move to →
      </option>
      <TaskStatusOptions currentStatus={status} />
    </select>
  );
}

export default function TaskCard({
  task,
  className,
  onMove,
  isMoving,
  onSelect,
}: TaskCardProps) {
  return (
    <CardShell
      className={`${className} flex flex-col gap-2 ${SIZES.cardPadding}`}
    >
      <div className="cursor-pointer" onClick={() => onSelect?.(task)}>
        <p className="font-medium">{task.title}</p>
        {task.description && (
          <p className={`text-xs ${COLORS.textSecondary}`}>
            {task.description}
          </p>
        )}
      </div>

      <TaskDropdownMenu
        status={task.status}
        onMove={onMove}
        isMoving={isMoving}
      />
    </CardShell>
  );
}

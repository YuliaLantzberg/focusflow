import { Task, TaskStatus } from "@/app/types/task";
import PageSection from "../../_components/page-section";
import { CardTitle } from "../../_components/card/card-title";
import TaskCard from "../../tasks/_components/task-card";

type KanbanColumnProps = {
  title: string;
  titleColor: string;
  status: TaskStatus;
  tasks: Task[];
  movingTaskId: string | null;
  onMove: (taskId: string, status: TaskStatus) => void | Promise<void>;
  onSelect?: (task: Task) => void;
  onUpdate?: (updated: Task) => void;
};

export default function KanbanColumn({
  title,
  titleColor,
  tasks,
  movingTaskId,
  onMove,
  onSelect,
}: KanbanColumnProps) {
  return (
    <PageSection>
      <div>
        <CardTitle color={titleColor}>{title}</CardTitle>
        <div className={`space-y-3 `}>
          {tasks.length === 0 && (
            <p className="text-xs text-gray-500 italic">No {title} tasks</p>
          )}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={(status) => onMove(task.id, status)}
              isMoving={movingTaskId === task.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </PageSection>
  );
}

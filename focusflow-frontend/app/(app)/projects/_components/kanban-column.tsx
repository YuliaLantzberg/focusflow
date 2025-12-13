import { Task, TaskStatus } from "@/app/types/task";
import PageSection from "../../_components/page-section";
import { CardTitle } from "../../_components/card/card-title";
import TaskCard from "../../tasks/_components/task-card";
import { COLORS } from "@/app/lib/styles";
import { DraggableItem } from "./draggable-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ColumnDropZone from "./column-drop-zone";
import { useDroppable } from "@dnd-kit/core";

type KanbanColumnProps = {
  title: string;
  titleColor: string;
  taskStatus: TaskStatus;
  tasks: Task[];
  movingTaskId: string | null;
  onMove: (taskId: string, status: TaskStatus) => void | Promise<void>;
  onSelect?: (task: Task) => void;
  onUpdate?: (updated: Task) => void;
  activeId?: string | null;
};

export default function KanbanColumn({
  title,
  titleColor,
  taskStatus,
  tasks,
  movingTaskId,
  activeId,
  onMove,
  onSelect,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${taskStatus}`,
  });

  return (
    <PageSection>
      <div
        ref={setNodeRef}
        className={`min-h-[500px] flex flex-col ${
          isOver ? "ring-2 ring-blue-400" : ""
        }`}
      >
        <CardTitle color={titleColor}>{title}</CardTitle>
        <div className="mt-3 flex flex-col flex-1">
          {tasks.length === 0 && (
            <p className={`text-xs ${COLORS.textMuted} italic`}>
              No {title} tasks
            </p>
          )}
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <DraggableItem
                key={task.id}
                id={task.id}
                activeId={activeId ?? null}
              >
                <TaskCard
                  key={task.id}
                  task={task}
                  onMove={(status) => onMove(task.id, status)}
                  isMoving={movingTaskId === task.id}
                  onSelect={onSelect}
                />
              </DraggableItem>
            ))}
            <ColumnDropZone columnId={taskStatus} />
          </SortableContext>
        </div>
      </div>
    </PageSection>
  );
}

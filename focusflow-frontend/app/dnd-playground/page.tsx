"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Task = { id: string; label: string };
type ColumnId = "todo" | "in-progress" | "done";

const initialColumns: Record<ColumnId, Task[]> = {
  todo: [
    { id: "task-a", label: "Task A" },
    { id: "task-b", label: "Task B" },
    { id: "task-c", label: "Task C" },
  ],
  "in-progress": [{ id: "task-d", label: "Task D" }],
  done: [{ id: "task-e", label: "Task E" }],
};

export function DraggableItem({
  id,
  activeId,
  label,
}: {
  id: string;
  activeId: string | null;
  label: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const customTransition = "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)";
  const isActive = activeId === id;

  const style: React.CSSProperties = {
    transform: isActive
      ? "scale(1.03)" // lift effect
      : customTransition
      ? CSS.Transform.toString(transform)
      : undefined,
    transition,
    opacity: isActive ? 0.6 : 1,
    zIndex: isActive ? 50 : undefined,
    boxShadow: isActive ? "0px 4px 12px rgba(0,0,0,0.15)" : undefined,
  };
  return (
    <div
      style={style}
      className="mb-2 rounded border border-gray-300 bg-white text-black px-4 py-2 shadow-sm cursor-grab"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {label}
    </div>
  );
}

function ColumnDropZone({ columnId }: { columnId: ColumnId }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${columnId}-dropzone`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-1 flex-1 rounded border border-dashed ${
        isOver ? "border-blue-400 bg-blue-400/10" : "border-transparent"
      }`}
    />
  );
}

export function DndPlayground() {
  const [columns, setColumns] = useState(initialColumns);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // pixels to move before drag starts
      },
    })
  );

  const { setNodeRef: setTodoRef, isOver: isOverTodo } = useDroppable({
    id: "todo",
  });

  const { setNodeRef: setInProgressRef, isOver: isOverInProgress } =
    useDroppable({
      id: "in-progress",
    });

  const { setNodeRef: setDoneRef, isOver: isOverDone } = useDroppable({
    id: "done",
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event: DragStartEvent) {
    console.log("Dragging:", event.active.id);
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setColumns((prev) => {
      if (!over) {
        setActiveId(null);
        return prev;
      }

      const overId = String(over.id);

      // 1) Find source column
      const sourceColumnId = (Object.keys(prev) as ColumnId[]).find(
        (columnId) => prev[columnId].some((task) => task.id === active.id)
      );
      if (!sourceColumnId) {
        setActiveId(null);
        return prev;
      }

      const sourceItems = [...prev[sourceColumnId]];
      const activeIndex = sourceItems.findIndex(
        (task) => task.id === active.id
      );
      if (activeIndex === -1) {
        setActiveId(null);
        return prev;
      }

      // 2) CASE 1: Dropped on a column dropzone (e.g. "todo-dropzone")
      if (overId.endsWith("-dropzone")) {
        const targetColumnId = overId.replace("-dropzone", "") as ColumnId;

        // If same column -> move to bottom, optional
        if (targetColumnId === sourceColumnId) {
          const [movedTask] = sourceItems.splice(activeIndex, 1);
          const targetItems = [...prev[targetColumnId], movedTask];

          setActiveId(null);
          return {
            ...prev,
            [sourceColumnId]: targetItems,
          };
        }

        // Different column -> remove from source, append to target
        const [movedTask] = sourceItems.splice(activeIndex, 1);
        const targetItems = [...prev[targetColumnId], movedTask];

        setActiveId(null);
        return {
          ...prev,
          [sourceColumnId]: sourceItems,
          [targetColumnId]: targetItems,
        };
      }

      // 3) CASE 2/3: Dropped over a specific task id
      const targetColumnId = (Object.keys(prev) as ColumnId[]).find(
        (columnId) => prev[columnId].some((task) => task.id === overId)
      );
      if (!targetColumnId) {
        setActiveId(null);
        return prev;
      }

      // Same-column reorder
      if (sourceColumnId === targetColumnId) {
        if (active.id === overId) {
          setActiveId(null);
          return prev;
        }

        const items = prev[sourceColumnId];
        const oldIndex = items.findIndex((task) => task.id === active.id);
        const newIndex = items.findIndex((task) => task.id === overId);

        if (oldIndex === -1 || newIndex === -1) {
          setActiveId(null);
          return prev;
        }

        setActiveId(null);
        return {
          ...prev,
          [sourceColumnId]: arrayMove(items, oldIndex, newIndex),
        };
      }

      // Different columns, dropped on a task -> move + insert before that task
      const [movedTask] = sourceItems.splice(activeIndex, 1);
      const targetItems = [...prev[targetColumnId]];
      const overIndex = targetItems.findIndex((task) => task.id === overId);

      if (overIndex === -1) {
        targetItems.push(movedTask);
      } else {
        targetItems.splice(overIndex, 0, movedTask);
      }

      setActiveId(null);
      return {
        ...prev,
        [sourceColumnId]: sourceItems,
        [targetColumnId]: targetItems,
      };
    });
  }

  const getActiveTask = () => {
    if (!activeId) return null;

    const columnIds: ColumnId[] = ["todo", "in-progress", "done"];

    for (const col of columnIds) {
      const task = columns[col].find((t) => t.id === activeId);
      if (task) return task;
    }

    return null;
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      // collisionDetection={collisionDetection}
    >
      <div className="flex gap-4">
        {/* Column: To Do */}
        <div
          ref={setTodoRef}
          className={`w-64 rounded bg-slate-900/40 p-3 flex flex-col ${
            isOverTodo ? "ring-2 ring-blue-400" : ""
          }`}
        >
          <h2 className="mb-2 text-sm font-semibold text-slate-100">To Do</h2>
          <SortableContext
            items={columns["todo"].map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {columns["todo"].map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                label={item.label}
                activeId={activeId}
              />
            ))}
          </SortableContext>
          <ColumnDropZone columnId="todo" />
        </div>

        {/* Column: In Progress */}
        <div
          ref={setInProgressRef}
          className={`w-64 rounded bg-slate-900/40 p-3 flex flex-col ${
            isOverInProgress ? "ring-2 ring-blue-400" : ""
          }`}
        >
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            In Progress
          </h2>
          <SortableContext
            items={columns["in-progress"].map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {columns["in-progress"].map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                label={item.label}
                activeId={activeId}
              />
            ))}
          </SortableContext>
          <ColumnDropZone columnId="in-progress" />
        </div>
        {/* Column: Done */}
        <div
          ref={setDoneRef}
          className={`w-64 rounded bg-slate-900/40 p-3 flex flex-col ${
            isOverDone ? "ring-2 ring-blue-400" : ""
          }`}
        >
          <h2 className="mb-2 text-sm font-semibold text-slate-100">Done</h2>
          <SortableContext
            items={columns["done"].map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {columns["done"].map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                label={item.label}
                activeId={activeId}
              />
            ))}
          </SortableContext>
          <ColumnDropZone columnId="done" />
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div
            className="mb-2 rounded border border-gray-300 bg-white text-black px-4 py-2 shadow-lg cursor-grabbing opacity-90"
            style={{ transform: "scale(1.03)" }}
          >
            {getActiveTask()?.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function Page() {
  return <DndPlayground />;
}

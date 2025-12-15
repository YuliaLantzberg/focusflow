"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  DragOverEvent,
  MeasuringStrategy,
  pointerWithin,
  DragOverlay,
} from "@dnd-kit/core";

import PageContainer from "../../_components/page-container";
import { loadData } from "@/app/lib/apiClient";
import { getProjectStatusColor } from "@/app/lib/statusColor";
import { createTask, moveTask } from "@/app/lib/tasks";

import { Project } from "@/app/types/project";
import { Task, TaskStatus, TASK_STATUSES } from "@/app/types/task";
import { PROJECT_TASK_COLUMNS } from "@/app/types/project";

import { PageTitle } from "../../_components/page-title";
import Badge from "../../_components/badge";
import FormCard from "../../_components/forms/form-card";
import { FormField } from "../../_components/forms/form-field";
import SubmitButton from "../../_components/buttons/submit-button";
import KanbanColumn from "../_components/kanban-column";
import { TaskDetails } from "../../tasks/_components/task-details-panel";
import { CardShell } from "../../_components/card/cardShell";
import { CreateNewButton } from "../../_components/buttons/create-new-button";
import { CardTitle } from "../../_components/card/card-title";
import { COLORS, SIZES, STYLES } from "@/app/lib/styles";
import TaskCard from "../../tasks/_components/task-card";
import {
  getDestIndex,
  getStatusFromOverId,
  getVirtualDestList,
  resolveDestination,
} from "./lib/dndHelper";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const measuring = { droppable: { strategy: MeasuringStrategy.Always } };
  const [lastOverId, setLastOverId] = useState<string | null>(null);
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  useEffect(() => {
    loadData<Project>(`http://localhost:3000/projects/${projectId}`)
      .then(setProject)
      .catch(console.error);

    loadData<Task[]>(`http://localhost:3000/projects/${projectId}/tasks`)
      .then(setTasks)
      .catch(console.error);
  }, [projectId]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // pixels to move before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // If hovering a dropzone, treat it as "append to that column"
    const statusFromZone = getStatusFromOverId(overId);
    if (!statusFromZone) return; // keep it simple for this chunk

    // If already in that column, do nothing
    if (activeTask.status === statusFromZone) return;

    // Live preview: move task into that column at the end
    setTasks((prev) => {
      const moving = prev.find((t) => t.id === activeId);
      if (!moving) return prev;

      const updated = { ...moving, status: statusFromZone };

      const without = prev.filter((t) => t.id !== activeId);
      return [...without, updated];
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    const activeId = String(active.id);
    const overId = over?.id ? String(over.id) : lastOverId;
    setLastOverId(null);
    if (!overId) return;
    if (activeId === overId) return;
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;
    const { destStatus, destType } = resolveDestination(overId, tasks);

    const destList = getVirtualDestList(tasks, destStatus, activeId);

    const destIndex = getDestIndex(destType, overId, destList);

    console.log({
      activeId,
      overId,
      destStatus,
      destType,
      destIndex,
      destList: destList.map((t) => [t.id, t.order]),
    });

    return;
    // const sourceStatus = activeTask.status;
    // // 1) Determine destination status
    // const statusFromZone = getStatusFromOverId(overId);
    // let destStatus: TaskStatus | null = statusFromZone;
    // let destColumn: Task[];
    // if (!destStatus) {
    //   // overId is a task id → destination status comes from that task
    //   const overTask = tasks.find((t) => t.id === overId);
    //   if (!overTask) return;
    //   destStatus = overTask.status;
    // }
    // // 2) Same-column reorder
    // console.log({ activeId, overId, statusFromZone, sourceStatus, destStatus });
    // if (destStatus === sourceStatus) {
    //   // Only reorder within tasks that share this status
    //   const columnTasks = tasks
    //     .filter((t) => t.status === sourceStatus)
    //     ?.sort(
    //       (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id)
    //     );
    //   const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
    //   // If dropped on a dropzone/column background, we place it at end
    //   const newIndex = statusFromZone
    //     ? columnTasks.length - 1
    //     : columnTasks.findIndex((t) => t.id === overId);
    //   if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
    //   // Reorder ids in that column
    //   const reordered = arrayMove(columnTasks, oldIndex, newIndex);
    //   // Merge back into the full tasks array without mixing columns
    //   setTasks((prev) => {
    //     const others = prev.filter((t) => t.status !== sourceStatus);
    //     return [...others, ...reordered];
    //   });
    //   return;
    // }
    // // 3) Cross-column move (status changes)
    // setTasks((prev) => {
    //   // Remove active from its column, insert into destination column
    //   const source = prev.filter(
    //     (t) => t.status === sourceStatus && t.id !== activeId
    //   );
    //   const dest = prev.filter((t) => t.status === destStatus);
    //   const moving = prev.find((t) => t.id === activeId)!;
    //   const updatedMoving = { ...moving, status: destStatus! };
    //   // Decide insert index:
    //   // - dropped on task → insert before that task
    //   // - dropped on dropzone/column → append to end
    //   const insertIndex = statusFromZone
    //     ? dest.length
    //     : dest.findIndex((t) => t.id === overId);
    //   const newDest =
    //     insertIndex === -1
    //       ? [...dest, updatedMoving]
    //       : [
    //           ...dest.slice(0, insertIndex),
    //           updatedMoving,
    //           ...dest.slice(insertIndex),
    //         ];
    //   const others = prev.filter(
    //     (t) => t.status !== sourceStatus && t.status !== destStatus
    //   );
    //   return [...others, ...source, ...newDest];
    // });
    // // Persist to backend (your existing function)
    // destColumn = tasks
    //   .filter((t) => t.status === destStatus)
    //   .sort(
    //     (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id)
    //   );
    // if (destStatus === sourceStatus) {
    //   // Remove active from its column, insert into destination column
    //   destColumn = destColumn.filter(
    //     (t) => t.status === sourceStatus && t.id !== activeId
    //   );
    // }
    // let destIndex: number | null;
    // try {
    //   console.log("persisting...");
    //   destIndex = statusFromZone
    //     ? destColumn.length
    //     : destColumn.findIndex((t) => t.id === overId);
    //   const prevTask = destColumn[destIndex - 1];
    //   const nextTask = destColumn[destIndex];
    //   let newOrder: number | null;
    //   if (prevTask && nextTask)
    //     newOrder = (prevTask.order + nextTask.order) / 2;
    //   else if (prevTask && !nextTask) newOrder = prevTask.order + 1000;
    //   else if (!prevTask && nextTask) newOrder = nextTask.order - 1000;
    //   else newOrder = 1000;
    //   await handleMove(activeId, destStatus, newOrder);
    // } catch (err) {
    //   console.error("Failed to persist move", err);
    //   // optional: refetch tasks from server here to be safe
    // }
  };

  const handleMove = async (
    taskId: string,
    status: TaskStatus,
    order: number
  ) => {
    setMovingTaskId(taskId);
    try {
      const updated = await moveTask(taskId, status, order);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );
    } catch (err) {
      console.error("Failed to move task", err);
    } finally {
      setMovingTaskId(null);
    }
  };

  const handleSelectTask = (task: Task | null) => {
    setSelectedTask(task);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const TODOTasks = tasks
      .filter((task) => task.status === TASK_STATUSES[0])
      .sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id)
      );
    const maxOrderInTODOColumn = TODOTasks[TODOTasks.length - 1].order;
    setTitleError(null);
    if (!newTitle.trim()) {
      setTitleError("Task title is required");
      return;
    }
    setIsCreating(true);
    try {
      const newTask = await createTask(projectId, {
        title: newTitle,
        description: newDescription,
        order: maxOrderInTODOColumn + 1000,
        status: TASK_STATUSES[0], //New Task is always in TODO column
      });
      if (newTask) {
        setTasks((prev) => [...prev, newTask]);
        setNewTitle("");
        setNewDescription("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTaskUpdate = (updated: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task))
    );
    setSelectedTask(updated);
  };

  const handleTaskDelete = (deletedId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== deletedId));
  };

  if (!project)
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );

  return (
    <PageContainer>
      <div className={`${STYLES.flexCenter} mb-6`}>
        <PageTitle>{project.name}</PageTitle>

        <Badge
          label={project.status}
          colorClass={getProjectStatusColor(project.status)}
          className="w-24"
        />
      </div>
      <div className="space-y-4">
        <CardShell className={`${SIZES.cardPadding} space-y-3`}>
          {project.description && (
            <p className="text-gray-300">{project.description}</p>
          )}

          {(project.clientCompany || project.dueDate) && (
            <div
              className={`flex flex-wrap items-center gap-4 text-sm ${COLORS.textSecondary}`}
            >
              {project.clientCompany && <p>Client: {project.clientCompany}</p>}
              {project.dueDate && <p>Due date: {project.dueDate}</p>}
            </div>
          )}
        </CardShell>
        {/* Tasks section */}
        <CardShell className={`${SIZES.cardPadding} space-y-2`}>
          <div className={STYLES.flexCenter}>
            <CardTitle color="text-white">Tasks</CardTitle>
            <CreateNewButton
              onClick={() => setShowCreateTaskForm((prev) => !prev)}
            >
              {showCreateTaskForm ? "Hide form" : "New Task"}
            </CreateNewButton>
          </div>
          {showCreateTaskForm && (
            <FormCard handleSubmit={handleCreateTask}>
              <FormField label="Title">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (titleError) setTitleError(null);
                  }}
                  placeholder="Name the new task here"
                  className={STYLES.form.field}
                />
                {titleError && (
                  <p className="mt-1 text-xs text-red-400">{titleError}</p>
                )}
              </FormField>
              <FormField label="Description">
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Decribe the new task"
                  className={STYLES.form.field}
                />
              </FormField>
              <SubmitButton disabled={isCreating}>Create New Task</SubmitButton>
            </FormCard>
          )}
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={pointerWithin}
            measuring={measuring}
            onDragOver={handleDragOver}
          >
            <div className="grid gap-4 lg:grid-cols-4">
              {PROJECT_TASK_COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.status}
                  title={column.title}
                  titleColor={column.titleColor}
                  taskStatus={column.status}
                  tasks={tasks
                    .filter((t) => t.status === column.status)
                    .sort(
                      (a, b) =>
                        (a.order ?? 0) - (b.order ?? 0) ||
                        a.id.localeCompare(b.id)
                    )}
                  onMove={handleMove}
                  movingTaskId={movingTaskId}
                  onSelect={handleSelectTask}
                  activeId={activeId}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="opacity-90">
                  <TaskCard
                    task={activeTask}
                    onMove={() => {}}
                    isMoving={false}
                    onSelect={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardShell>

        {/* Notes section */}
        <CardShell className={`${SIZES.cardPadding} space-y-2`}>
          <h2 className={`text-lg font-medium ${COLORS.textPrimary}`}>Notes</h2>
          <p className={`text-sm ${COLORS.textSecondary}`}>
            Notes UI coming soon.
          </p>
        </CardShell>
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </PageContainer>
  );
}

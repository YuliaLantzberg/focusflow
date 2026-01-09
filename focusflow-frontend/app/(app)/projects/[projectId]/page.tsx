"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  DragOverEvent,
  MeasuringStrategy,
  pointerWithin,
  DragOverlay,
} from "@dnd-kit/core";

import PageContainer from "../../_components/page-container";
import { loadData } from "@/app/lib/apiClient";
import { getProjectStatusColor } from "@/app/lib/statusColor";
import { createTask, isOnHoldRequiredError, moveTask } from "@/app/lib/tasks";

import { Project, PROJECT_STATUSES } from "@/app/types/project";
import {
  Task,
  TaskStatus,
  TASK_STATUSES,
  TaskMutationIntent,
  TASK_STATUSES_ENUM,
} from "@/app/types/task";
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
  getNewOrder,
  getStatusFromOverId,
  getVirtualDestList,
  resolveDestination,
} from "./lib/dndHelper";
import { isOnHoldProj } from "../../lib/helper";
import { ProjectStatus } from "../../../types/project";
import { OnHoldModal } from "../../_components/modals/onHoldModal";
import Link from "next/link";
import { formatDate } from "../../../lib/helper";
import { refreshProject } from "./lib/helper";

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
  const [showOnHoldModal, setShowOnHoldModal] = useState<boolean>(false);
  const measuring = { droppable: { strategy: MeasuringStrategy.Always } };
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;
  const lastOverIdRef = useRef<string | null>(null);
  const preDragTasksRef = useRef<Task[] | null>(null);
  const [pendingMove, setPendingMove] = useState<null | {
    taskId: string;
    status: TaskStatus;
    order: number;
  }>(null);
  // totalTasks, doneTasks, progressPercent
  const [totalTasks, setTotalTasks] = useState<number>(tasks.length);
  const [doneTasks, setDoneTasks] = useState<number>(0);

  const statusMsg =
    project?.status === PROJECT_STATUSES.ON_HOLD
      ? "Project is on hold - task changes require confirmation."
      : project?.status === PROJECT_STATUSES.ARCHIVED
      ? "Project archived - tasks are read-only."
      : null;

  useEffect(() => {
    loadData<Project>(`http://localhost:3000/projects/${projectId}`)
      .then(setProject)
      .catch(console.error);

    loadData<Task[]>(`http://localhost:3000/projects/${projectId}/tasks`)
      .then(setTasks)
      .catch(console.error);

    loadData<number>(
      `http://localhost:3000/projects/${projectId}/tasks/count`,
      {
        method: "GET",
        body: JSON.stringify({
          status: TASK_STATUSES_ENUM.DONE,
        }),
      }
    )
      .then(setDoneTasks)
      .catch(console.error);
  }, [projectId]);

  useEffect(() => {});

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // pixels to move before drag starts
      },
    })
  );

  const onConfirmMove = async () => {
    if (pendingMove) {
      await handleMove(
        pendingMove.taskId,
        pendingMove.status,
        pendingMove.order,
        { resumeIfOnHold: true }
      );
    }
    setShowOnHoldModal(false);
  };

  const onCancelMove = () => {
    setPendingMove(null);
    setShowOnHoldModal(false);
    setTasks(preDragTasksRef.current ?? tasks);
    console.log("cancel");
  };
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    preDragTasksRef.current = [...tasks];
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (overId) lastOverIdRef.current = String(overId);

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
    console.log("DRAG_END fired", {
      active: String(event.active.id),
      over: event.over ? String(event.over.id) : null,
    });
    const { active, over } = event;

    setActiveId(null);
    const activeId = String(active.id);
    const last = lastOverIdRef.current;
    let overId = over?.id ? String(over.id) : last;
    lastOverIdRef.current = null; // reset for next drag

    if (!overId) {
      console.log("DRAG_END exit: no overId");
      return;
    }

    // if dnd reports overId as the dragged item itself, rescue using last different target
    if (overId === activeId && last && last !== activeId) {
      overId = last;
    }

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) {
      console.log("DRAG_END exit: no active task");
      return;
    }
    const { destStatus, destType } = resolveDestination(overId, tasks);
    const destList = getVirtualDestList(tasks, destStatus, activeId);
    const destIndex = getDestIndex(destType, overId, destList);
    const newOrder = getNewOrder(destList, destIndex);
    const intent: TaskMutationIntent = {
      type: "move",
      toStatus: destStatus,
    };

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== activeId) return task;
        else return { ...task, status: destStatus, order: newOrder };
      })
    );

    const shouldGate = isOnHoldProj({
      projectStatus: project?.status as ProjectStatus,
      intent,
    });
    if (shouldGate) {
      // 1. remember what the user tried to do
      setPendingMove({
        taskId: activeId,
        status: destStatus,
        order: newOrder,
      });

      // 2. show modal
      setShowOnHoldModal(true);
      return;
    } else {
      console.log("OVER_ID", overId);
      console.log("DEST_TYPE", destType);
      console.log("DEST_INDEX", destIndex, "DESTLIST_LENG", destList.length);

      await handleMove(activeId, destStatus, newOrder);
      // reset for next drag
      lastOverIdRef.current = null;

      console.log("DRAG_END", {
        activeId,
        overId,
        last,
        rawOver: over?.id ? String(over.id) : null,
      });
      return;
    }
  };

  const handleMove = async (
    taskId: string,
    status: TaskStatus,
    order: number,
    opts?: { resumeIfOnHold: boolean }
  ) => {
    setMovingTaskId(taskId);
    try {
      const updated = await moveTask(taskId, status, order, opts);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );
      refreshProject(projectId, setProject);
    } catch (err) {
      if (isOnHoldRequiredError(err)) {
        setPendingMove({ taskId, status, order });
        setShowOnHoldModal(true);
        return;
      }
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
    const maxOrder = TODOTasks.length ? TODOTasks.at(-1)?.order ?? 0 : 0;
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
        order: maxOrder + 1000,
        status: TASK_STATUSES[0], //New Task is always in TODO column
      });
      if (newTask) {
        setTasks((prev) => [...prev, newTask]);
        setNewTitle("");
        setNewDescription("");
      }
      refreshProject(projectId, setProject);
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
    refreshProject(projectId, setProject);
  };

  const handleTaskDelete = (deletedId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== deletedId));
    refreshProject(projectId, setProject);
  };

  if (!project)
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );

  return (
    <PageContainer>
      {showOnHoldModal && (
        <OnHoldModal
          onClose={onCancelMove}
          onCancel={onCancelMove}
          onConfirm={onConfirmMove}
        />
      )}

      <div className={`${STYLES.flexCenter} gap-15 mb-6 mx-6`}>
        <Link href={"/projects"}>← Projects</Link>
        <PageTitle>{project.name}</PageTitle>

        <Badge
          label={project.status}
          colorClass={getProjectStatusColor(project.status)}
          className="w-24"
        />
      </div>
      {statusMsg && (
        <div className={`${STYLES.flexCenterCenter} mb-6`}>
          <p className={`${COLORS.textSecondary}`}>{statusMsg}</p>
        </div>
      )}
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
              {project.dueDate && (
                <p>Due date: {formatDate(project.dueDate)}</p>
              )}
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
              {showCreateTaskForm ? "Close" : "Add Task"}
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
        <CardShell className={`${SIZES.cardPadding} space-y-2 opacity-90`}>
          <div className={STYLES.flexCenter}>
            <CardTitle color="text-white">Notes</CardTitle>
          </div>
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

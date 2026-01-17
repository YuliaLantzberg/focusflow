import { useState } from "react";
import { Task } from "@/app/types/task";
import { getTaskStatusColor } from "@/app/lib/statusColor";
import { formatDate } from "@/app/lib/helper";
import Badge from "../../_components/badge";
import { PageTitle } from "../../_components/page-title";
import { deleteTask, updateTask } from "@/app/lib/tasks";
import FormCard from "../../_components/forms/form-card";
import { FormField } from "../../_components/forms/form-field";
import SubmitButton from "../../_components/buttons/submit-button";
import ModalShell from "../../_components/modal-shell";
import TextBtn from "../../_components/buttons/text-btn";
import { COLORS, STYLES } from "@/app/lib/styles";

type TaskDetailsProps = {
  task: Task;
  onClose: () => void;
  onUpdate?: (updated: Task) => void;
  onDelete?: (deletedId: string) => void;
};

export function TaskDetails({
  task,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description ?? ""
  );
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: editTitle,
        description: editDescription || undefined,
        dueDate: editDueDate || undefined,
      };
      const updated = await updateTask(task.id, payload);
      onUpdate?.(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task", err);
      // later we can add error UI
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (deletedId: string) => {
    setIsSaving(true);
    try {
      await deleteTask(deletedId);
      onDelete?.(deletedId);
    } catch (err) {
      console.error("Failed to delete task", err);
      // later we can add error UI
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  if (isEditing) {
    return (
      <ModalShell onClose={onClose}>
        <FormCard handleSubmit={handleSave}>
          <FormField label="Task name">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder={task.title}
              className={`${STYLES.form.field}`}
            />
          </FormField>
          <FormField label="Description">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder={task.description}
              className={`${STYLES.form.field} min-h-32 resize-none`}
            />
          </FormField>
          <FormField label="Due Date">
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className={`${STYLES.form.field}`}
            />
          </FormField>
          <SubmitButton disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </SubmitButton>
        </FormCard>
      </ModalShell>
    );
  }
  return (
    <ModalShell onClose={onClose}>
      <div className="flex-1 p-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="py-3">
            <PageTitle>{task.title}</PageTitle>
            <p className={`text-xs mt-1 ${COLORS.textSecondary}`}>
              Task details
            </p>
          </div>

          <Badge
            label={task.status}
            colorClass={getTaskStatusColor(task.status)}
            className="w-28"
          />
        </div>

        <div className="space-y-3 mt-14">
          {task.description && (
            <p className="text-sm text-gray-200 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer (due date) */}
      <div
        className={`${STYLES.flexCenter} px-12 pb-6 pt-4 border-t ${COLORS.borderStrong}`}
      >
        {task.dueDate && (
          <p className={`text-xs ${COLORS.textSecondary}`}>
            Due date:
            <span className="font-medium text-gray-200 ml-2">
              {formatDate(task.dueDate)}
            </span>
          </p>
        )}
        <TextBtn
          onClick={setIsEditing}
          data={true}
          color={COLORS.BtnTextColor.primary}
          label="Edit task"
        />
        <TextBtn
          onClick={handleDelete}
          data={task.id}
          color={COLORS.BtnTextColor.danger}
          label="Delete task"
        />
      </div>
    </ModalShell>
  );
}

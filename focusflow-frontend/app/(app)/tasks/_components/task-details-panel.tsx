import { useState } from "react";
import { Task } from "@/app/types/task";
import { getTaskStatusColor } from "@/app/lib/statusColor";
import { formatDate } from "@/app/lib/helper";
import Badge from "../../_components/badge";
import { PageTitle } from "../../_components/page-title";
import { updateTask } from "@/app/lib/tasks";
import FormCard from "../../_components/forms/form-card";
import { FormField } from "../../_components/forms/form-field";
import SubmitButton from "../../_components/buttons/submit-button";

type TaskDetailsPanel = {
  task: Task;
  onClose: () => void;
  onUpdate?: (updated: Task) => void;
};

export function TaskDetails({ task, onClose, onUpdate }: TaskDetailsPanel) {
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

  if (isEditing) {
    return (
      <>
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
        <div
          id="modal-content"
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl flex flex-col min-h-[60vh]">
            {/* Close button */}
            <button
              id="close-modal"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-4xl leading-none"
              onClick={onClose}
            >
              &times;
            </button>
            <FormCard handleSubmit={handleSave}>
              <FormField label="Task name">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={task.title}
                  className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder={task.description}
                  className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700 min-h-32 resize-none"
                />
              </FormField>
              <SubmitButton disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </SubmitButton>
            </FormCard>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div
        id="modal-overlay"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />
      <div
        id="modal-content"
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl flex flex-col min-h-[60vh]">
          {/* Close button */}
          <button
            id="close-modal"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-4xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>

          {/* Body (header + description) */}
          <div className="flex-1 p-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="py-3">
                <PageTitle>{task.title}</PageTitle>
                <p className="text-xs text-gray-400 mt-1">Task details</p>
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
          <div className="flex justify-between items-center px-12 pb-6 pt-4 border-t border-white/10">
            {task.dueDate && (
              <p className="text-xs text-gray-400">
                Due date:
                <span className="font-medium text-gray-200 ml-2">
                  {formatDate(task.dueDate)}
                </span>
              </p>
            )}
            <button
              type="button"
              className="text-sm text-indigo-300 hover:underline cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Edit task
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

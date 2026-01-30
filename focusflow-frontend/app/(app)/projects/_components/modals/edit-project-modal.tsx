import Badge from "@/app/(app)/_components/badge";
import SubmitButton from "@/app/(app)/_components/buttons/submit-button";
import FormCard from "@/app/(app)/_components/forms/form-card";
import { FormField } from "@/app/(app)/_components/forms/form-field";
import ModalShell from "@/app/(app)/_components/modal-shell";
import { formatDate } from "@/app/lib/helper";
import { getProjStatusNoOnHold, updateProject } from "@/app/lib/projects";
import { getProjectStatusColor } from "@/app/lib/statusColor";
import { STYLES } from "@/app/lib/styles";
import { Project, PROJECT_STATUSES } from "@/app/types/project";
import { useState } from "react";

type EditProjectProps = {
  project: Project;
  onClose: () => void;
};

export function EditProjectModal({ onClose, project }: EditProjectProps) {
  const [editTitle, setEditTitle] = useState(project.name);
  const [editDescription, setEditDescription] = useState(project.description);
  const [isOnHold, setIsOnHold] = useState(
    project.status === PROJECT_STATUSES.ON_HOLD,
  );
  const [editBudget, setEditBudget] = useState(
    project.budget != null ? String(project.budget) : "",
  );
  const [editDueDate, setEditDueDate] = useState(project.dueDate);
  const [isSaving, setIsSaving] = useState(false);
  const [projStatus, setProjStatus] = useState(project.status);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const budgetNumber = editBudget?.trim();
    // optionally guard:
    if (budgetNumber !== null && Number.isNaN(budgetNumber)) {
      setIsSaving(false);
      return; // later: show inline error
    }
    // patchProject({ budget: budgetNumber, ... })
    try {
      const payload = {
        name: editTitle.trim(),
        description: editDescription || undefined,
        budget: budgetNumber || undefined,
        status: projStatus,
        dueDate: editDueDate || undefined,
      };
      await updateProject(project.id, payload);
      onClose();
    } catch (err) {
      console.error("Failed to update task", err);
      // later we can add error UI
    } finally {
      setIsSaving(false);
    }
  };

  const handleProjStatus = async (isOnHoldChecked: boolean) => {
    if (isOnHoldChecked) {
      setIsOnHold(true);
      setProjStatus(PROJECT_STATUSES.ON_HOLD);
    } else {
      // if project status initially was On Hold calculate the proj status from tasks. Otherwise assign initial status of the project
      if (project.status === PROJECT_STATUSES.ON_HOLD) {
        const updatedStatus = await getProjStatusNoOnHold(project.id);
        console.log(updatedStatus);
        setProjStatus(updatedStatus);
      } else {
        setProjStatus(project.status);
      }
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="mt-20 m-10">
        <FormCard handleSubmit={handleSave}>
          <FormField label="Project name">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder={project.name}
              className={`${STYLES.form.field}`}
            />
          </FormField>
          <div>
            {/* TODO: Handle the case of completed project. Disable editting for archived projects */}
            <p className={`${STYLES.flexCenter}`}>
              Current status:{" "}
              <Badge
                label={`${projStatus}`}
                colorClass={`${getProjectStatusColor(projStatus)}`}
              />
            </p>
            <div className={`${STYLES.flexCenter} gap-4 mt-5`}>
              <div>
                <p className="text-sm text-slate-200">
                  Pause project (On Hold)
                </p>
                <p className="text-xs text-slate-400">
                  Tasks can’t be modified until resumed.
                </p>
              </div>
              <div className="relative inline-block w-11 h-5">
                <input
                  id="switch-component"
                  type="checkbox"
                  checked={isOnHold}
                  onChange={(e) => handleProjStatus(e.target.checked)}
                  className={`peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:${getProjectStatusColor(PROJECT_STATUSES.ON_HOLD)} cursor-pointer transition-colors duration-300`}
                />
                <label
                  htmlFor="switch-component"
                  className={`absolute top-0 left-0 w-5 h-5 bg-slate-500 rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:${getProjectStatusColor(PROJECT_STATUSES.ON_HOLD)} cursor-pointer`}
                ></label>
              </div>
            </div>
          </div>
          <FormField label="Description">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder={project.description}
              className={`${STYLES.form.field} min-h-32 resize-none`}
            />
          </FormField>
          <FormField label="Budget">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={editBudget}
                onChange={(e) => {
                  // allow digits + dot + empty
                  const v = e.target.value.replace(/[^\d.]/g, "");
                  setEditBudget(v);
                }}
                className={`${STYLES.form.field}`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                $
              </span>
            </div>
          </FormField>
          <FormField label="Due Date">
            <input
              type="date"
              value={
                editDueDate
                  ? formatDate(editDueDate)
                  : formatDate(new Date().toString())
              }
              onChange={(e) => setEditDueDate(e.target.value)}
              className={`${STYLES.form.field}`}
            />
          </FormField>
          <SubmitButton disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </SubmitButton>
        </FormCard>
      </div>
    </ModalShell>
  );
}

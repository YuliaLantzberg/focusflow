import { Task } from "@/app/types/task";
import Badge from "../../_components/badge";
import { PageTitle } from "../../_components/page-title";
import { getTaskStatusColor } from "@/app/lib/statusColor";
import { formatDate } from "@/app/lib/helper";

type TaskDetailsPanel = {
  task: Task;
  onClose: () => void;
};

export function TaskDetails({ task, onClose }: TaskDetailsPanel) {
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
          {task.dueDate && (
            <div className="px-12 pb-6 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400">
                Due date:
                <span className="font-medium text-gray-200 ml-2">
                  {formatDate(task.dueDate)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

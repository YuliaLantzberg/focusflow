"use client";

import { apiFetch } from "@/app/lib/apiClient";
import { Task } from "@/app/types/task";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TaskResolverPage({
  params,
}: {
  params: { taskId: string };
}) {
  const { taskId } = params;
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await apiFetch(`http://localhost:3000/tasks/${taskId}`);
        const task: Task = await res.json();
        if (cancelled) return;

        const projectId = task.projectId;
        if (!projectId || !task) router.replace("/projects");
        else router.replace(`/projects/${projectId}`);
      } catch {
        if (!cancelled) router.replace("/projects");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [taskId, router]);

  return null;
}

import { useDroppable } from "@dnd-kit/core";
import { TaskStatus } from "@/app/types/task";

export default function ColumnDropZone({ columnId }: { columnId: TaskStatus }) {
  const { setNodeRef } = useDroppable({
    id: `${columnId}-dropzone`,
  });

  return <div ref={setNodeRef} className={`mt-1 flex-1 rounded  h-40`} />;
}

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

export function DraggableItem({
  id,
  activeId,
  children,
}: {
  id: string;
  activeId: string | null;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const isActive = activeId === id;
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isActive ? 0 : 1, // since DragOverlay exists
    zIndex: isActive ? 50 : undefined,
  };
  return (
    <div
      style={style}
      className={`cursor-grab transition-transform ${
        isActive ? "scale-[1.03]" : ""
      }`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

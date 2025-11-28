"use client";
import { ReactNode } from "react";

type ListItemProps = {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function ListItem({ children, right, className }: ListItemProps) {
  return (
    <div
      className={`${className} flex justify-between items-center px-4 py-3 md:px-6 md:py-4 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition`}
    >
      <div className="flex-1 space-y-2">{children}</div>
      {right && (
        <div className="flex items-center justify-between gap-4">{right}</div>
      )}
    </div>
  );
}

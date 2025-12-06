import { COLORS } from "@/app/lib/styles";
import React from "react";

type CardShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardShell({ children, className }: CardShellProps) {
  return (
    <div
      className={`
        rounded-lg border ${COLORS.border} ${COLORS.surface}
        ${COLORS.surfaceHover} transition
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  );
}

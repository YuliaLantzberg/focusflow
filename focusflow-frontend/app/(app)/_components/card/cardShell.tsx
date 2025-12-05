import React from "react";

type CardShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardShell({ children, className }: CardShellProps) {
  return (
    <div
      className={`
        rounded-lg border border-white/5 bg-white/5 
        hover:bg-white/10 transition
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  );
}

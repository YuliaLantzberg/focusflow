"use client";
import { COLORS, SIZES, STYLES } from "@/app/lib/styles";
import { ReactNode } from "react";

type ListItemProps = {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function ListItem({ children, right, className }: ListItemProps) {
  return (
    <div
      className={`${className} ${STYLES.flexCenter} ${SIZES.cardPadding} rounded-lg border ${COLORS.border} ${COLORS.surface} ${COLORS.surfaceHover} transition`}
    >
      <div className="flex-1 space-y-2">{children}</div>
      {right && <div className={`${STYLES.flexCenter} gap-4`}>{right}</div>}
    </div>
  );
}

"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type CardTitleProps = {
  color: string;
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
};

export function CardTitle({
  color,
  className,
  children,
  icon: Icon,
}: CardTitleProps) {
  return (
    <div className="flex flex-center gap-3">
      {Icon && <Icon className={`${color}`} />}
      <h3 className={`mb-6 font-semibold uppercase ${color} ${className}`}>
        {children}
      </h3>
    </div>
  );
}

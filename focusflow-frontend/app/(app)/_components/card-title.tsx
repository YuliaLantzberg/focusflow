"use client";

import { ReactNode } from "react";

type CardTitleProps = {
  color: string;
  children: ReactNode;
  className?: string;
};

export function CardTitle({ color, className, children }: CardTitleProps) {
  return (
    <h3 className={`mb-6 font-semibold uppercase ${color} ${className}`}>
      {children}
    </h3>
  );
}

"use client";

import { ReactNode } from "react";

type PageTitleProps = {
  children: ReactNode;
};

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="text-2xl font-semibold text-gray-100 tracking-tight">
      {children}
    </h1>
  );
}

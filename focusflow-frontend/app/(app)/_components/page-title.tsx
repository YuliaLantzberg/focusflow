"use client";

import { COLORS } from "@/app/lib/styles";
import { ReactNode } from "react";

type PageTitleProps = {
  children: ReactNode;
};

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1
      className={`text-2xl font-ibm-plex-sans font-semibold ${COLORS.textPrimary} tracking-tight`}
    >
      {children}
    </h1>
  );
}

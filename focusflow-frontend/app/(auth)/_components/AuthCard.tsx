"use client";

import { COLORS } from "@/app/lib/styles";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md w-full p-8 shadow-lg bg-slate-900 rounded-lg">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle && (
          <p className={`text-sm ${COLORS.textSecondary}`}>{subtitle}</p>
        )}
      </div>

      {children}
    </div>
  );
}

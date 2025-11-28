"use client";

import { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block mb-1 text-sm font-medium text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}

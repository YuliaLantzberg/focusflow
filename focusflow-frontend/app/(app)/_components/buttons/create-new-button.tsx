"use client";

import Link from "next/link";
import { ReactNode } from "react";

type CreateNewButtonProps = {
  href?: string;
  onClick?: () => void;
  label?: string;
  children?: ReactNode;
};

export function CreateNewButton({
  href,
  label,
  onClick,
  children,
}: CreateNewButtonProps) {
  const className =
    "inline-flex items-center gap-2 rounded-lg bg-sky-400/60 px-4 py-3 text-sm font-medium cursor-pointer text-white hover:bg-sky-300/60 transition-colors";
  if (href)
    return (
      <Link href={href}>
        {
          <button type="button" className={className}>
            {label}
          </button>
        }
      </Link>
    );
  else
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
}

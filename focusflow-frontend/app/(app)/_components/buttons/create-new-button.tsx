"use client";

import Link from "next/link";

type CreateNewButtonProps = {
  href: string;
  label: string;
};

export function CreateNewButton({ href, label }: CreateNewButtonProps) {
  return (
    <Link href={href}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-sky-400/60 px-4 py-3 text-sm font-medium cursor-pointer text-white hover:bg-sky-300/60 transition-colors"
      >
        {label}
      </button>
    </Link>
  );
}

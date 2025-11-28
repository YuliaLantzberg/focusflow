"use client";

type BadgeProps = {
  label: string;
  colorClass?: string;
  className?: string;
};

export default function Badge({ label, colorClass, className }: BadgeProps) {
  return (
    <span
      className={`${colorClass ?? ""} ${
        className ?? ""
      } inline-flex items-center justify-center px-3 py-3 text-xs md:text-sm text-white rounded-se-lg`}
    >
      {label}
    </span>
  );
}

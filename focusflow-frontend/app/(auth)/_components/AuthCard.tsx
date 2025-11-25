"use client";

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
    <div className="max-w-md w-full p-8 shadow-xl bg-slate-900 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-white">{title}</h1>
      <p className="text-sm text-gray-400">{subtitle ? subtitle : ""}</p>
      {children}
    </div>
  );
}

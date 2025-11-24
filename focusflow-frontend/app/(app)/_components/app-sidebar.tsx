"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 p-4">
      <div className="mb-8">FocusFlow</div>
      <nav className="flex flex-col gap-2">
        <Link
          className={`block px-3 py-2 rounded-md transition   ${
            pathname === "/dashboard"
              ? "bg-slate-800 font-medium"
              : "hover:bg-slate-800"
          }`}
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className={`block px-3 py-2 rounded-md transition ${
            pathname === "/projects"
              ? "bg-slate-800 font-medium"
              : "hover:bg-slate-800"
          }`}
          href="/projects"
        >
          Projects
        </Link>
        <Link
          className={`block px-3 py-2 rounded-md transition ${
            pathname === "/tasks"
              ? "bg-slate-800 font-medium"
              : "hover:bg-slate-800"
          }`}
          href="/tasks"
        >
          Tasks
        </Link>
      </nav>
    </aside>
  );
}

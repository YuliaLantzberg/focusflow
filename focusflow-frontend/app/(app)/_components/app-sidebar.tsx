"use client";

import NavLink from "./links/nav-link";

export default function AppSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 p-4">
      <div className="mb-8">FocusFlow</div>
      <nav className="flex flex-col gap-2">
        <NavLink href="/dashboard" label="Dashboard" />
        <NavLink href="/projects" label="Projects" />
        <NavLink href="/tasks" label="Tasks" />
      </nav>
    </aside>
  );
}

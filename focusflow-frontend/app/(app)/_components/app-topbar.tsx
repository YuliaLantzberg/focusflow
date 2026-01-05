"use client";
import { usePathname } from "next/navigation";
export default function AppTopbar() {
  const pathname = usePathname();
  // TODO: switch to prefix-based titles when project subroutes are finalized
  const titleMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/analytics": "Analytics",
    "/settings": "Settings",
    "/profile": "Profile",
  };
  const pageTitle = pathname.startsWith("/projects")
    ? "Projects"
    : titleMap[pathname] ?? "FocusFlow";
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  return (
    <header className="h-14 border-b border-slate-800 px-6 flex items-center">
      <div className="flex w-full items-center justify-between">
        <div className="text-sm font-medium text-slate-300">{pageTitle}</div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span>{formattedDate}</span>
          <button className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]">
              Y
            </span>
            <span>Yulia</span>
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";
import { logout } from "@/app/lib/apiClient";
import { formatDate } from "@/app/lib/helper";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
export default function AppTopbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // TODO: switch to prefix-based titles when project subroutes are finalized
  const titleMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/clients": "Clients",
    "/analytics": "Analytics",
    "/settings": "Settings",
    "/profile": "Profile",
  };
  const pageTitle = pathname.startsWith("/projects")
    ? "Projects"
    : (titleMap[pathname] ?? "FocusFlow");
  const today = new Date();
  const formattedDate = formatDate(today.toDateString());

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="h-14 border-b border-slate-800 px-6 flex items-center">
      <div className="flex w-full items-center justify-between">
        <div className="text-sm font-medium text-slate-300">{pageTitle}</div>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <span>{formattedDate}</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 cursor-pointer"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]">
                Y
              </span>
              <span>Yulia</span>
            </button>

            {isOpen && (
              <div
                className={`absolute right-6 mt-2 w-40 rounded-md border border-slate-700 bg-slate-900 shadow-lg`}
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-4 text-center text-sm hover:bg-slate-800 cursor-pointer"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

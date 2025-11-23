import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-900 text-slate-100 p-4">
        <div className="mb-8">FocusFlow</div>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/tasks">Tasks</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}

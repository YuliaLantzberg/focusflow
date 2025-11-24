export default function PageSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-800 p-4 bg-slate-900/40">
      {children}
    </div>
  );
}

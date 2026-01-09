export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-6 m-8">{children}</div>;
}

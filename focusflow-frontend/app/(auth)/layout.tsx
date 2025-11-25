export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="p-6 min-h-screen flex items-center justify-center">
      {children}
    </main>
  );
}

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md transition ${
        isActive ? "bg-slate-800 font-medium" : "hover:bg-slate-800"
      }`}
    >
      {label}
    </Link>
  );
}

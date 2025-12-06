import Link from "next/link";

type SignupLoginBtnProps = {
  href: string;
  label: string;
};

export default function SignupLoginBtn({ href, label }: SignupLoginBtnProps) {
  return (
    <Link
      href={href}
      className="w-full py-3 rounded-xl text-white text-base font-semibold tracking-wide bg-indigo-950 hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      {label}
    </Link>
  );
}

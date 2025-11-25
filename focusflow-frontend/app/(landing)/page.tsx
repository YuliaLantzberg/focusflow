import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="max-w-xl w-full text-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold text-white">FocusFlow</h1>
      <p className="text-gray-400 text-base md:text-lg">
        A calm productivity dashboard for freelancers and solopreneurs.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <Link
          href="/login"
          className="w-full py-3 rounded-xl text-white text-base font-semibold tracking-wide bg-indigo-950 hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="w-full py-3 rounded-xl text-white text-base font-semibold tracking-wide bg-indigo-950 hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}

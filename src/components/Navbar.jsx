import { useNavigation } from "../useNavigation.js";

export default function Navbar() {
  const { navigate } = useNavigation();
  return (
    <header className="h-14 border-b px-6 flex items-center justify-between">
      {/* Left side: date/time */}
      <p className="text-gray-600">Tuesday, November 11, 2025 – 10:32</p>

      {/* Right side: greeting + avatar */}
      <div className="flex items-center gap-3">
        <p className="font-medium">Hi, Yulia 👋</p>
        <button
          onClick={() => navigate("profile")}
          className="w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold hover:bg-blue-500"
        >
          Y
        </button>
      </div>
    </header>
  );
}

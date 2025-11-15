import { useNavigation } from "../contexts/navigation_context/useNavigation.js";

export default function Navbar() {
  const { navigate } = useNavigation();
  return (
    <header className="h-14 border-b px-6 py-8 flex items-center justify-between">
      {/* Left side: date/time */}
      <div className="flex items-center">
        <p className="text-sm text-gray-600">
          Tuesday, November 11, 2025 – 10:32
        </p>
      </div>

      {/* Right side: greeting + avatar */}
      <div className="flex items-center gap-3 cursor-pointer pr-2 ">
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <p>Yulia</p>
        </div>

        <button
          onClick={() => navigate("profile")}
          className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold hover:bg-blue-500 cursor-pointer"
        >
          Y
        </button>
      </div>
    </header>
  );
}

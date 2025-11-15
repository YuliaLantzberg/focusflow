import { useNavigation } from "../contexts/navigation_context/useNavigation.js";

export default function Sidebar() {
  const pages = ["Dashboard", "Projects", "Tasks", "Profile"];
  const { activePage, navigate } = useNavigation();
  return (
    <aside className="p-4 border-r w-52 h-screen">
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="h-8 w-8 bg-blue-400 rounded-md"></div>
        <span className="text-xl italic tracking-tight font-jakarta">
          FocusFlow
        </span>
      </div>

      <nav className="flex flex-col gap-2 mt-13 px-6">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => navigate(page.toLowerCase())}
            className={`flex items-center gap-3 px-3 py-2 pl-2 rounded-md w-full text-sm text-gray-500 cursor-pointer ${
              activePage === page.toLowerCase()
                ? "border-l-3 border-blue-300 bg-blue-50 font-medium text-gray-600"
                : "hover:bg-gray-400/20 hover:text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </aside>
  );
}

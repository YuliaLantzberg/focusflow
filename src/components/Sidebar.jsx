import { useNavigation } from "../useNavigation.js";

export default function Sidebar() {
  const pages = ["Dashboard", "Projects", "Tasks", "Profile"];
  const { activePage, navigate } = useNavigation();
  return (
    <aside className="p-4 border-r w-52 h-screen">
      <h1 className="text-xl font-bold mb-6">FocusFlow</h1>
      <nav className="flex flex-col gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => navigate(page.toLowerCase())}
            className={`text-left px-3 py-2 rounded ${
              activePage === page.toLowerCase()
                ? "bg-blue-100 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </aside>
  );
}

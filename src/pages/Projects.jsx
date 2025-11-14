import BtnAdd from "../components/Buttons/BtnAdd.jsx";
import BtnFilter from "../components/Buttons/BtnFilter.jsx";
import BtnLink from "../components/Buttons/BtnLink.jsx";
import Card from "../components/Card.jsx";

export default function Projects() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* LEFT: project details */}
      <div className="w-full md:w-72 space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Client Website</h2>
            <BtnLink>Edit</BtnLink>
          </div>
          <p className="text-sm text-gray-500">Landing + blog for ACME</p>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Due:</span>
            <span className="font-medium">2025-11-20</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status:</span>
            <span className="text-emerald-600 font-medium">On track</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">Show on dashboard</span>
            <button className="text-xs bg-slate-100 px-2 py-1 rounded">
              On
            </button>
          </div>
          <BtnLink className="mt-3" isDanger>
            Delete project
          </BtnLink>
        </Card>

        <BtnAdd size="full">+ New Project</BtnAdd>
      </div>

      {/* RIGHT: tasks area */}
      <div className="flex-1 space-y-4">
        <Card>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Add new task..."
            />
            <BtnAdd variant="success">Add</BtnAdd>
          </div>
          <div className="mt-3 flex gap-2 text-sm">
            <BtnFilter isActive>All</BtnFilter>
            <BtnFilter>Active</BtnFilter>
            <BtnFilter>Done</BtnFilter>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Tasks</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <div>
                <p>Write landing page copy</p>
                <p className="text-xs text-gray-500">due 2025-11-12 • High</p>
              </div>
              <div className="flex gap-2">
                <BtnLink>View</BtnLink>
                <BtnLink isDanger>Delete</BtnLink>
              </div>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p>Upload assets</p>
                <p className="text-xs text-gray-500">due 2025-11-13 • Medium</p>
              </div>
              <div className="flex gap-2">
                <BtnLink>View</BtnLink>
                <BtnLink isDanger>Delete</BtnLink>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

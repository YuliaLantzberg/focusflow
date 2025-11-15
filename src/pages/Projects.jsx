import BtnAdd from "../components/Buttons/BtnAdd.jsx";
import BtnFilter from "../components/Buttons/BtnFilter.jsx";
import BtnLink from "../components/Buttons/BtnLink.jsx";
import Card from "../components/Cards/Card.jsx";
import PageTitle from "../components/PageTitle.jsx";

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageTitle>Client Website</PageTitle>
      {/* <h1 className="pl-3 text-2xl font-semibold mb-10">Projects</h1> */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT: project details */}
        <div className="w-full md:w-72 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-6">
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
            <BtnLink className="mt-6" isDanger>
              Delete project
            </BtnLink>
          </Card>
          <Card>
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Client Information</h2>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Client:</span>
              <span className="font-medium">ACME Corp.</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Contact:</span>
              <span className="font-medium">John Smith</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phone:</span>
              <span className="font-medium">+1 555-123-4567</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium">john@example.com</span>
            </div>
          </Card>
          <Card>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Project Stats</h2>
              </li>
              <li className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Total Tasks:</span>
                <span className="font-medium">5</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-500">Comleted:</span>
                <span className="text-emerald-600 font-medium">3</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-500">Overdue:</span>
                <span className="text-red-500 font-medium">1</span>
              </li>
            </ul>
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
          </Card>

          <Card className="h-90">
            <h3 className="font-semibold mb-6">Tasks</h3>
            <div className="mt-3 mb-6 flex gap-2 text-sm bg-blue-50 rounded-md">
              <BtnFilter isActive>All</BtnFilter>
              <BtnFilter>Active</BtnFilter>
              <BtnFilter>Done</BtnFilter>
            </div>
            <ul className="space-y-2 max-h-50 overflow-y-auto">
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
                  <p className="text-xs text-gray-500">
                    due 2025-11-13 • Medium
                  </p>
                </div>
                <div className="flex gap-2">
                  <BtnLink>View</BtnLink>
                  <BtnLink isDanger>Delete</BtnLink>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p>Upload assets</p>
                  <p className="text-xs text-gray-500">
                    due 2025-11-13 • Medium
                  </p>
                </div>
                <div className="flex gap-2">
                  <BtnLink>View</BtnLink>
                  <BtnLink isDanger>Delete</BtnLink>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p>Upload assets</p>
                  <p className="text-xs text-gray-500">
                    due 2025-11-13 • Medium
                  </p>
                </div>
                <div className="flex gap-2">
                  <BtnLink>View</BtnLink>
                  <BtnLink isDanger>Delete</BtnLink>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p>Upload assets</p>
                  <p className="text-xs text-gray-500">
                    due 2025-11-13 • Medium
                  </p>
                </div>
                <div className="flex gap-2">
                  <BtnLink>View</BtnLink>
                  <BtnLink isDanger>Delete</BtnLink>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p>Upload assets</p>
                  <p className="text-xs text-gray-500">
                    due 2025-11-13 • Medium
                  </p>
                </div>
                <div className="flex gap-2">
                  <BtnLink>View</BtnLink>
                  <BtnLink isDanger>Delete</BtnLink>
                </div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p>Upload assets</p>
                  <p className="text-xs text-gray-500">
                    due 2025-11-13 • Medium
                  </p>
                </div>
                <div className="flex gap-2">
                  <BtnLink>View</BtnLink>
                  <BtnLink isDanger>Delete</BtnLink>
                </div>
              </li>
            </ul>
          </Card>
          <Card>
            <h2 className="font-semibold mb-6">Project Notes</h2>
            <textarea
              className="w-full text-sm p-2 border rounded-md resize-none text-gray-600"
              rows={4}
              placeholder="Add project notes..."
            ></textarea>
          </Card>
        </div>
      </div>
    </div>
  );
}

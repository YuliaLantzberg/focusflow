export default function Projects() {
  return (
    <div className="w-full md:w-72 bg-white rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Client Website</h2>
        <button className="text-sm text-blue-500">Edit</button>
      </div>
      <p className="text-sm text-gray-500">Landing + blog for client</p>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Due:</span>
        <span className="font-medium">2025-11-20</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Status:</span>
        <span className="text-emerald-600 font-medium">On track</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Show on dashboard</span>
        {/* later: real toggle */}
        <button className="text-xs bg-slate-100 px-2 py-1 rounded">On</button>
      </div>
      <button className="text-sm text-red-500">Delete project</button>
    </div>
  );
}

{
  /* <div className="flex gap-6">
  {/* LEFT: project details */
}
//   <div className="w-full md:w-72">
{
  /* project details card here */
}
//   </div>

{
  /* RIGHT: tasks */
}
//   <div className="flex-1 space-y-4">
{
  /* add task bar */
}
{
  /* filters */
}
{
  /* task list */
}
//   </div>
// </div>

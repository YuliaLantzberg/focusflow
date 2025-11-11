export default function Dashboard() {
  const projects = [
    {
      id: 1,
      name: "Client Website",
      due: "2025-11-20",
      progress: 70,
      status: "on-track",
    },
    {
      id: 2,
      name: "AI Service Launch",
      due: "2025-11-25",
      progress: 30,
      status: "at-risk",
    },
    {
      id: 3,
      name: "Content Sprint",
      due: "2025-11-15",
      progress: 90,
      status: "due-soon",
    },
  ];

  const todayTasks = [
    { id: 1, title: "Write landing page copy", project: "Client Website" },
    { id: 2, title: "Prepare AI demo", project: "AI Service Launch" },
  ];

  const overdueTasks = [
    {
      id: 1,
      title: "Send invoice",
      project: "Client Website",
      due: "2025-11-08",
    },
  ];
  return (
    <>
      <div className="space-y-6">
        <section>
          <div className="flex gap-8">
            <h3>Good morning, Yulia</h3>
            <h3>Monday, November 10, 2025</h3>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">Projects</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <div className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* Top row: project name + status icon */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {project.name}
                    </h4>
                    <span
                      className={
                        project.status === "on-track"
                          ? "text-emerald-600"
                          : project.status === "due-soon"
                          ? "text-amber-500"
                          : "text-red-500"
                      }
                    >
                      {project.status === "on-track"
                        ? "✅"
                        : project.status === "due-soon"
                        ? "⚠️"
                        : "⛔"}
                    </span>
                  </div>

                  {/* Details */}
                  <p
                    className={
                      project.status === "on-track"
                        ? "text-sm text-emerald-600"
                        : project.status === "due-soon"
                        ? "text-sm text-amber-500"
                        : "text-sm text-red-500"
                    }
                  >
                    Due: {project.due}
                  </p>

                  <p className="text-xs text-gray-500 mb-2">
                    3/8 tasks completed
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Today</h3>
            {/* today list */}
            <ul>
              {todayTasks.map((task) => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Overdue</h3>
            {/* overdue list */}
            <ul>
              {overdueTasks.map((overdue) => (
                <li key={overdue.id}>{overdue.title}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

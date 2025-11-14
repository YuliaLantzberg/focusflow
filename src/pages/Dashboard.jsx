import Card from "../components/Card";

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
      due: "2025-11-15",
      progress: 40,
      status: "due-soon",
    },
    {
      id: 3,
      name: "Content Sprint",
      due: "2025-11-08",
      progress: 15,
      status: "overdue",
    },
  ];
  const todayTasks = [
    {
      id: 1,
      title: "Write landing copy",
      project: "Client Website",
      priority: "high",
    },
    {
      id: 2,
      title: "Prep AI demo",
      project: "AI Service Launch",
      priority: "med",
    },
  ];
  const overdueTasks = [
    {
      id: 1,
      title: "Send invoice",
      project: "Client Website",
      due: "2025-11-08",
    },
  ];

  const statusColor = (s) =>
    s === "on-track"
      ? "text-emerald-600"
      : s === "due-soon"
      ? "text-amber-500"
      : "text-red-500";
  const statusIcon = (s) =>
    s === "on-track" ? "✅" : s === "due-soon" ? "⚠️" : "⛔";
  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold pl-3 mb-14">Dashboard</h1>
        {/* Projects overview */}
        <section>
          <h2 className="pl-3 text-lg font-semibold text-gray-700 mb-4">
            Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
            {projects.map((p) => (
              <Card key={p.id}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">{p.name}</h4>
                  <span className={`${statusColor(p.status)}`}>
                    {statusIcon(p.status)}
                  </span>
                </div>
                <p className={`${statusColor(p.status)} text-sm`}>
                  Due: {p.due}
                </p>
                <p className="text-xs text-gray-500">3/8 tasks completed</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full mt-4"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>
        {/* Today + Overdue */}
        <section className="mt-10">
          <h2 className="pl-3 text-lg font-semibold text-gray-700 mb-4">
            Tasks Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto px-6">
            <Card>
              <h3 className="text-md font-semibold mb-2">Today</h3>
              <ul className="space-y-2">
                {todayTasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800">{t.title}</p>
                      <p className="text-xs text-gray-500">{t.project}</p>
                    </div>
                    <span
                      className={
                        t.priority === "high"
                          ? "text-red-500"
                          : t.priority === "med"
                          ? "text-amber-500"
                          : "text-gray-400"
                      }
                    >
                      ●
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-md font-semibold mb-2">Overdue / Upcoming</h3>
              <ul className="space-y-2">
                {overdueTasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-800">{t.title}</p>
                      <p className="text-xs text-red-500">
                        {t.project} • due {t.due}
                      </p>
                    </div>
                    <span className="text-red-500">⛔</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>
        {/* Tip */}
        <div className="mt-14 bg-blue-50 py-3 rounded-md">
          <p className="text-sm text-gray-500 pl-3 italic">
            <span className="pr-1">💡</span>
            Start with the task that unblocks others. Small wins compound.
          </p>
        </div>
      </div>
    </>
  );
}

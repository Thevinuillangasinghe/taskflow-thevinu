import Link from "next/link";

const upcomingTasks = [
  {
    id: 1,
    title: "Finish UI redesign",
    dueDate: "Tomorrow",
    priority: "High",
  },
  {
    id: 2,
    title: "Database optimization",
    dueDate: "May 28",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Prepare sprint review",
    dueDate: "May 30",
    priority: "Low",
  },
];

const overdueTasks = [
  {
    id: 4,
    title: "Fix authentication bug",
    dueDate: "2 days overdue",
  },
];

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Calendar
            </h1>

            <p className="mt-2 text-gray-400">
              Upcoming deadlines and productivity schedule.
            </p>
          </div>

          <Link
            href="/board"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Back to Board
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">
              Upcoming Tasks
            </p>

            <h2 className="mt-3 text-4xl font-bold text-blue-400">
              {upcomingTasks.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">
              Overdue Tasks
            </p>

            <h2 className="mt-3 text-4xl font-bold text-red-400">
              {overdueTasks.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">
              Productivity Score
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-400">
              84%
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-semibold">
              Upcoming Deadlines
            </h2>

            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {task.title}
                    </h3>

                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                      {task.priority}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    Due: {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="mb-6 text-2xl font-semibold text-red-300">
              Overdue Tasks
            </h2>

            <div className="space-y-4">
              {overdueTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-red-500/20 bg-black/20 p-4"
                >
                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="mt-2 text-sm text-red-300">
                    {task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-3 text-2xl font-semibold">
            Future Upgrade
          </h2>

          <p className="text-gray-400">
            This page can later integrate with real task deadlines,
            drag-and-drop scheduling, and calendar visualization.
          </p>
        </div>
      </div>
    </main>
  );
}
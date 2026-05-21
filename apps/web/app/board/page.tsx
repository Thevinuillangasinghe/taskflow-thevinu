const columns = [
  {
    title: "Todo",
    tasks: ["Create login page", "Design database schema"],
  },
  {
    title: "In Progress",
    tasks: ["Build API contract"],
  },
  {
    title: "Done",
    tasks: ["Create wireframes", "Create ERD"],
  },
];

export default function BoardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">TaskFlow Board</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <section
            key={column.title}
            className="rounded-xl bg-white p-4 shadow"
          >
            <h2 className="mb-4 text-xl font-semibold">
              {column.title}
            </h2>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task}
                  className="rounded-lg border bg-gray-50 p-3"
                >
                  {task}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
          Full-stack task management app
        </div>

        <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Organise team tasks with TaskFlow
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-gray-300">
          A modern Kanban task management app with authentication,
          drag-and-drop tasks, activity logs, and PostgreSQL persistence.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white"
          >
            Login
          </Link>

          <Link
            href="/board"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white"
          >
            Open Board
          </Link>
        </div>

        <div className="mt-16 grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="mb-2 text-xl font-semibold">Kanban Board</h2>
            <p className="text-gray-400">
              Manage tasks across Todo, In Progress, and Done columns.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="mb-2 text-xl font-semibold">Secure Auth</h2>
            <p className="text-gray-400">
              Signup, login, JWT authentication, and protected task routes.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="mb-2 text-xl font-semibold">Activity Logs</h2>
            <p className="text-gray-400">
              Track task changes with a simple chronological activity history.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}